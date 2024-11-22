const fs = require('fs');
const path = require('path');
const raizDir = require('../utils/path');

const p = path.join(raizDir, 'data', 'carrito.json');



const Producto = require('../models/producto');
//const Carrito = require('../models/carrito')
const Usuario = require('../models/users');
const mongoose = require('mongoose');






/*
exports.getIndex = (req, res) => {
  Producto.find()
      .then(productos => {
          res.render('index', {
              prods: productos,
              titulo: "Pagina principal de la Tienda",
              path: "/"
          });

      })
      .catch(err => console.log(err));
}
*/

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
      .catch(err => console.log(err));
};












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
        hasNextPage: itemsPerPage * page < totalProductos,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProductos / itemsPerPage),
        totalProductos: totalProductos
      });
    })
    .catch(err => console.log(err));
};




















    exports.getProducto = (req, res) => {
      const idProducto = req.params.idProducto;
      Producto.findById(idProducto)
          .then(producto => {
              if (!producto) {
                  res.redirect('/');
              }
              res.render('tienda/detalle-producto', {
                  producto: producto,
                  titulo: producto.nombre,
                  path: '/productos'
              });
          })
          .catch(err => console.log(err));
  }


























  




exports.getCarrito = (req, res, next) => {
  
  /*if (!req.usuario) {
    return res.redirect('/login'); // Redirige a login si no está autenticado
  }*/

  req.usuario
    .populate('carrito.items.idProducto')
    .then(usuario => {
      //console.log(usuario.carrito.items);
      const productos = usuario.carrito.items.map(item =>{
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
        })
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
          //console.log(result);
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








exports.postPedido =(req,res, next)=>{
// Obtenemos el usuario que está realizando el pedido
const usuario = req.usuario;

// Verificamos si hay productos en el carrito
if (!usuario.carrito.items.length) {
    return res.redirect('/carrito'); // Redirigir si el carrito está vacío
}

// Accedemos a los productos del carrito
const productosDelCarrito = usuario.carrito.items;

// Creamos un objeto para almacenar el nuevo pedido
const nuevoPedido = {
    productos: [],
    fecha: new Date() // Puedes agregar más campos como fecha, estado, etc.
};

// Iteramos sobre los productos del carrito
productosDelCarrito.forEach(itemCarrito => {
    const producto = itemCarrito.idProducto; // Referencia al producto

    // Verificamos si ya existe en el pedido
    const productoExistente = nuevoPedido.productos.find(
        pedidoItem => pedidoItem.idProducto.toString() === producto.toString()
    );

    if (productoExistente) {
        // Si ya existe, sumamos las cantidades
        productoExistente.cantidad += itemCarrito.cantidad;
    } else {
        // Si no existe, lo agregamos al nuevo pedido
        nuevoPedido.productos.push({
            idProducto: producto,
            cantidad: itemCarrito.cantidad
        });
    }
});

// Ahora que tenemos el nuevo pedido, lo guardamos en el usuario
if (!usuario.pedidos) {
    usuario.pedidos = []; // Aseguramos que el usuario tenga un array de pedidos
}

usuario.pedidos.push(nuevoPedido); // Agregamos el nuevo pedido a los pedidos del usuario

// Limpiamos el carrito
usuario.limpiarCarrito()
    .then(() => {
        return usuario.save(); // Guardamos el usuario con el nuevo pedido
    })
    .then(() => {
        res.redirect('/pedido'); // Redirigimos a la página de pedidos
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error al confirmar el pedido');
    });
};








//corrigiendo el controlador getPedidos
exports.getPedido = (req, res, next) => {
  const usuario = req.usuario; // Obtiene el usuario actual

  if (!usuario.pedidos || usuario.pedidos.length === 0) {
      return res.render('tienda/pedido', {
          path: '/pedido',
          titulo: 'Mis Pedidos',
          pedidos: [], // Cambiamos 'productos' por 'pedidos' para adaptarnos a la nueva estructura
          precioTotal: 0
      });
  }

  // Estructuramos cada pedido con productos individuales
  const pedidosConProductos = usuario.pedidos.map(pedido => {
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

  // Encontramos los detalles de los productos
  Producto.find({ _id: { $in: productoIds } })
    .then(productos => {
      const productosPorId = {};
      productos.forEach(producto => {
          productosPorId[producto._id] = producto;
      });

      // Preparamos la lista final de pedidos con sus productos
      const pedidosMostrar = pedidosConProductos.map(pedido => {
          const productosMostrar = pedido.productos.map(item => {
              const producto = productosPorId[item.idProducto.toString()];
              return {
                  nombre: producto.nombre,
                  precio: producto.precio,
                  cantidad: item.cantidad
              };
          });
          const totalPedido = productosMostrar.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
          return {
              productos: productosMostrar,
              totalPedido: totalPedido,
              fecha: pedido.fecha
          };
      });

      res.render('tienda/pedido', {
          path: '/pedido',
          titulo: 'Mis Pedidos',
          pedidos: pedidosMostrar 
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error al obtener productos del pedido');
    });

}





exports.postModificarCantidad = (req, res, next) => {
  const { idProducto, nuevaCantidad } = req.body; 
 
  const cantidad = parseInt(nuevaCantidad, 10);
  if (isNaN(cantidad) || cantidad < 0) {
    return res.status(400).send('Cantidad no válida'); 
  }

  req.usuario
    .populate('carrito.items.idProducto')
    .then(usuario => {
      const itemIndex = usuario.carrito.items.findIndex(item => {
        return item.idProducto._id.toString() === idProducto; // Compara el ID del producto
      });

      if (itemIndex >= 0) {
        // Si el producto existe en el carrito
        if (cantidad === 0) {
          // Si la nueva cantidad es 0, eliminarlo del carrito
          usuario.carrito.items.splice(itemIndex, 1); 
        } else {
          // Actualiza la cantidad del producto
          usuario.carrito.items[itemIndex].cantidad = cantidad; // Asegúrate de que cantidad se establece correctamente
        }

        return usuario.save(); // Guarda los cambios en el usuario
      } else {
        
        console.log('Producto no encontrado en el carrito');
        return Promise.reject(new Error('Producto no encontrado en el carrito'));
      }
    })
    .then(() => {
      res.redirect('/carrito'); // Redirige al carrito después de modificar la cantidad
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error al modificar la cantidad');
    });
};





// Elementos del footer

exports.getSobreNosotros = (req, res) => {
  res.render('Footer/SobreNosotros', {
    titulo: 'Sobre Nosotros',
    path: '/sobre-nosotros'
  });
};

exports.getContacto = (req, res) => {
  res.render('Footer/Contacto', {
    titulo: 'Contacto',
    path: '/contacto'
  });
};

exports.getLibroReclamaciones = (req, res) => {
  res.render('Footer/LibroDeReclamaciones', {
    titulo: 'Libro de Reclamaciones',
    path: '/libro-de-reclamaciones'
  });
};

exports.getNuestrosLocales = (req, res) => {
  res.render('Footer/NuestrosLocales', {
    titulo: 'Nuestros Locales',
    path: '/nuestros-locales'
  });
};

exports.getPoliticasDelivery = (req, res) => {
  res.render('Footer/PolíticasDeDelivery', {
    titulo: 'Politicas de Delivery',
    path: '/politicas-de-delivery'
  });
};

exports.getPoliticasPrivacidad = (req, res) => {
  res.render('Footer/PoliticasDePrivacidad', {
    titulo: 'Politicas de Privacidad',
    path: '/politicas-de-privacidad'
  });
};

exports.getPreguntasFrecuentes = (req, res) => {
  res.render('Footer/PreguntasFrecuentes', {
    titulo: 'Preguntas Frecuentes',
    path: '/preguntas-frecuentes'
  });
};

exports.getTerminosyCondiciones = (req, res) => {
  res.render('Footer/TerminosyCondiciones', {
    titulo: 'Terminos y Condiciones',
    path: '/terminos-y-condiciones'
  });
};












