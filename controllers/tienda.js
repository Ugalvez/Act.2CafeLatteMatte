const fs = require('fs');
const path = require('path');
const raizDir = require('../utils/path');
const p = path.join(raizDir, 'data', 'carrito.json');
const Producto = require('../models/producto');
const Usuario = require('../models/users');
const mongoose = require('mongoose');

// Función para obtener la página de inicio con los productos agrupados por categoría
exports.getIndex = (req, res) => {
  Producto.find()
      .then(productos => {
          // Agrupar los productos por categorías
          const categorias = {
              cafe: productos.filter(p => p.categoria === 'Café'),
              sandwich: productos.filter(p => p.categoria === 'Sandwich'),
              postre: productos.filter(p => p.categoria === 'Postre')
          };

          // Enviar los productos organizados por categorías a la vista
          res.render('index', {
              categorias: categorias,
              titulo: "Pagina principal de la Tienda",
              path: "/"
          });
      })
      .catch(err => console.log(err)); // Manejo de errores si la consulta falla
};

// Función para obtener los productos con paginación
exports.getProductos = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página actual (por defecto 1)
  const itemsPerPage = 6; // Número de productos por página
  let totalProductos;

  Producto.find()
    .countDocuments() // Cuenta el número total de productos
    .then(numProductos => {
      totalProductos = numProductos;
      return Producto.find()
        .skip((page - 1) * itemsPerPage) // Salta productos de páginas previas
        .limit(itemsPerPage); // Limita el número de productos a mostrar
    })
    .then(productos => {
      res.render('productos', {
        prods: productos,
        titulo: "Productos de la tienda",
        path: "/productos",
        currentPage: page,
        hasNextPage: itemsPerPage * page < totalProductos, // Verifica si hay una página siguiente
        hasPreviousPage: page > 1, // Verifica si hay una página anterior
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProductos / itemsPerPage), // Calcula la última página
        totalProductos: totalProductos
      });
    })
    .catch(err => console.log(err)); // Manejo de errores si la consulta falla
};

// Función para obtener los detalles de un producto específico
exports.getProducto = (req, res) => {
  const idProducto = req.params.idProducto; // ID del producto desde la URL
  Producto.findById(idProducto)
      .then(producto => {
          if (!producto) {
              res.redirect('/'); // Redirige si el producto no existe
          }
          res.render('tienda/detalle-producto', {
              producto: producto,
              titulo: producto.nombre,
              path: '/productos'
          });
      })
      .catch(err => console.log(err)); // Manejo de errores si la consulta falla
};

exports.getCarrito = (req, res, next) => {
  req.usuario
    .populate('carrito.items.idProducto')
    .then(usuario => {
      const productos = usuario.carrito.items.map(item => {
        if (!item.idProducto) {
          return null; 
        }
        return {
          ...item.idProducto.toObject(),
          cantidad: item.cantidad
        };
      }).filter(Boolean); // Filtra los elementos nulos
        
      res.render('tienda/carrito', {
        path: '/carrito',
        titulo: 'Mi Carrito',
        productos: productos,
        precioTotal: productos.reduce((total, producto) => {
          return total + producto.precio * producto.cantidad;
        }, 0)
      });
    })
    .catch(err => console.log(err));
};

exports.postCarrito = (req, res) => {
  const idProducto = req.body.idProducto;

  Producto.findById(idProducto)
      .then(producto => {
          return req.usuario.agregarAlCarrito(producto);
      })
      .then(result => {
          res.redirect('/carrito');
      })
      .catch(err => console.log(err));
}

exports.postEliminarProductoCarrito = (req, res, next) => {
  const idProducto = req.body.idProducto;
  req.usuario.deleteItemDelCarrito(idProducto)
      .then(result => {
          res.redirect('/carrito');
      })
      .catch(err => console.log(err));
};

exports.postPedido = (req, res, next) => {
  const usuario = req.usuario;

  if (!usuario.carrito.items.length) {
    return res.redirect('/carrito'); // Redirige si el carrito está vacío
  }

  const productosDelCarrito = usuario.carrito.items;
  const nuevoPedido = {
    productos: [],
    fecha: new Date() // Puedes agregar más campos como fecha, estado, etc.
  };

  productosDelCarrito.forEach(itemCarrito => {
    const producto = itemCarrito.idProducto;

    // Verificamos si ya existe en el pedido
    const productoExistente = nuevoPedido.productos.find(
      pedidoItem => pedidoItem.idProducto.toString() === producto.toString()
    );

    if (productoExistente) {
      productoExistente.cantidad += itemCarrito.cantidad; // Si ya existe, sumamos las cantidades
    } else {
      nuevoPedido.productos.push({
        idProducto: producto,
        cantidad: itemCarrito.cantidad
      });
    }
  });

  if (!usuario.pedidos) {
    usuario.pedidos = []; // Asegura que el usuario tenga un array de pedidos
  }

  usuario.pedidos.push(nuevoPedido); // Agregamos el nuevo pedido

  usuario.limpiarCarrito()
    .then(() => usuario.save()) // Guardamos el usuario con el nuevo pedido
    .then(() => res.redirect('/pedido')) // Redirigimos a la página de pedidos
    .catch(err => {
      console.error(err);
      res.status(500).send('Error al confirmar el pedido');
    });
};




exports.getPedido = (req, res, next) => {
  const usuario = req.usuario; // Obtiene el usuario actual
  const page = parseInt(req.query.page) || 1; // Página actual (por defecto 1)
  const itemsPerPage = 5; // Número de pedidos por página
  let totalPedidos;

  if (!usuario.pedidos || usuario.pedidos.length === 0) {
    // Si el usuario no tiene pedidos, renderiza la vista con la lista vacía
    return res.render('tienda/pedido', {
      path: '/pedido',
      titulo: 'Mis Pedidos',
      pedidos: [], // Lista vacía si no tiene pedidos
      precioTotal: 0,
      currentPage: page,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: 1 // Si no hay pedidos, solo existe una página
    });
  }

  totalPedidos = usuario.pedidos.length; // Total de pedidos del usuario

  // Obtenemos solo los pedidos que corresponden a la página actual
  const pedidosPaginados = usuario.pedidos.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Estructuramos cada pedido con productos individuales
  const pedidosConProductos = pedidosPaginados.map(pedido => {
    return {
      ...pedido.toObject(),
      productos: pedido.productos.map(producto => ({
        idProducto: producto.idProducto,
        cantidad: producto.cantidad
      }))
    };
  });


  // Obtenemos los IDs de los productos de todos los pedidos
  const productoIds = pedidosConProductos.flatMap(pedido => pedido.productos.map(p => p.idProducto));


  Producto.find({ _id: { $in: productoIds } })
    .then(productos => {
      const productosPorId = {};
      productos.forEach(producto => {
        productosPorId[producto._id] = producto; // Asocia el ID del producto con su detalle
      });

      // Preparamos la lista final de pedidos con sus productos
      const pedidosMostrar = pedidosConProductos.map((pedido, index) => {
        const productosMostrar = pedido.productos.map(item => {
          const producto = productosPorId[item.idProducto.toString()];
          
          if (producto) {
            return {
              nombre: producto.nombre,
              precio: producto.precio,
              cantidad: item.cantidad
            };
          } else {
            // Si el producto no existe, mostramos "Producto no encontrado"
            return {
              nombre: "Producto no encontrado",
              precio: 0, // Precio 0 si el producto no se encuentra
              cantidad: item.cantidad
            };
          }
        });

        // Calculamos el total del pedido, excluyendo los productos "no encontrados"
        const totalPedido = productosMostrar.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);

        return {
          productos: productosMostrar,
          totalPedido: totalPedido,
          fecha: pedido.fecha
        };
      });

      // Renderizamos la vista con los pedidos paginados y su información
      res.render('tienda/pedido', {
        path: '/pedido',
        titulo: 'Mis Pedidos',
        pedidos: pedidosMostrar,
        currentPage: page,
        hasNextPage: itemsPerPage * page < totalPedidos,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalPedidos / itemsPerPage) // Calcula la última página
      });
    })
    .catch(err => {
      console.error(err); // Error al obtener productos del pedido
      res.status(500).send('Error al obtener productos del pedido'); // Manejo de errores
    });
};




exports.postModificarCantidad = (req, res, next) => {
  const { idProducto, nuevaCantidad } = req.body; // Extrae los datos del cuerpo de la solicitud

  const cantidad = parseInt(nuevaCantidad, 10); // Convierte la nueva cantidad a un número entero
  if (isNaN(cantidad) || cantidad < 0) {
    return res.status(400).send('Cantidad no válida'); // Valida la cantidad
  }

  req.usuario
    .populate('carrito.items.idProducto') // Poblamos el carrito con los detalles del producto
    .then(usuario => {
      // Buscamos el índice del producto en el carrito
      const itemIndex = usuario.carrito.items.findIndex(item => item.idProducto._id.toString() === idProducto);

      if (itemIndex >= 0) {
        // Si el producto existe, actualizamos la cantidad o lo eliminamos si la cantidad es 0
        if (cantidad === 0) {
          usuario.carrito.items.splice(itemIndex, 1); 
        } else {
          usuario.carrito.items[itemIndex].cantidad = cantidad;
        }

        return usuario.save(); // Guarda los cambios en el usuario
      } else {
        return Promise.reject(new Error('Producto no encontrado en el carrito')); // Si el producto no está, indica error
      }
    })
    .then(() => res.redirect('/carrito')) // Redirige al carrito después de modificar la cantidad
    .catch(err => res.status(500).send('Error al modificar la cantidad')); // Maneja errores
};

// Elementos del footer

exports.getSobreNosotros = (req, res) => {
  res.render('Footer/SobreNosotros', { 
    titulo: 'Sobre Nosotros', 
    path: '/sobre-nosotros' });
};

exports.getContacto = (req, res) => {
  res.render('Footer/Contacto', { 
    titulo: 'Contacto', 
    path: '/contacto' });
};

exports.getLibroReclamaciones = (req, res) => {
  res.render('Footer/LibroDeReclamaciones', { 
    titulo: 'Libro de Reclamaciones', 
    path: '/libro-de-reclamaciones' });
};

exports.getNuestrosLocales = (req, res) => {
  res.render('Footer/NuestrosLocales', { 
    titulo: 'Nuestros Locales', 
    path: '/nuestros-locales' });
};

exports.getPoliticasDelivery = (req, res) => {
  res.render('Footer/PolíticasDeDelivery', { 
    titulo: 'Politicas de Delivery', 
    path: '/politicas-de-delivery' });
};

exports.getPoliticasPrivacidad = (req, res) => {
  res.render('Footer/PoliticasDePrivacidad', { 
    titulo: 'Politicas de Privacidad', 
    path: '/politicas-de-privacidad' });
};

exports.getPreguntasFrecuentes = (req, res) => {
  res.render('Footer/PreguntasFrecuentes', { 
    titulo: 'Preguntas Frecuentes',
    path: '/preguntas-frecuentes' });
};

exports.getTerminosyCondiciones = (req, res) => {
  res.render('Footer/TerminosyCondiciones', { 
    titulo: 'Terminos y Condiciones',
    path: '/terminos-y-condiciones' });
};











