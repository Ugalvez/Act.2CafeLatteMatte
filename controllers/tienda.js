const fs = require('fs');
const path = require('path');
const raizDir = require('../utils/path');

const p = path.join(raizDir, 'data', 'carrito.json');



const Producto = require('../models/producto');
const Carrito = require('../models/carrito')
const Usuario = require('../models/users');
const mongoose = require('mongoose');


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


exports.getProductos = (req, res) => {
  Producto.find()
      .then(productos => {
          res.render('productos', {
              prods: productos,
              titulo: "Productos de la tienda",
              path: "/productos"
          });

      })
      .catch(err => console.log(err));
};

/*exports.getProductos = (req, res, next) => {
    let productos = [];
    Producto.fetchAll(productosObt =>{
        console.log (productosObt);
        productos = productosObt;


        res.render('tienda',{
            prods: productos,
            titulo: "Latte&Matte",
            path: "/"
           })


    });

    
 
  }*/


  /*exports.getProducto = (req,res) =>{
    const idProducto= req.params.idProducto;
    console.log(idProducto);
    res.redirect('/');




  }*/


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

   /* exports.getProducto = (req, res) => {
      const idProducto = req.params.idProducto;
      Producto.findById(idProducto, (producto) => {
          res.render('tienda/detalle-producto', {
              producto: producto,
              titulo: producto.nombre, 
              path: '/productos'
          });
  
      })
  }*/




 /*exports.getCarrito = (req, res, next) => {

    res.render('carrito',{
      titulo: "Carrito",
      path: "/carrito"
    })

}*/

/*exports.getCarrito = (req, res, next) => {
  res.render('tienda/carrito', {
    path: '/carrito',
    titulo: 'Mi Carrito'
  });
};*/



/*exports.postCarrito = (req, res) => {
  const idProducto = req.body.idProducto;
  Producto.findById(idProducto, producto => {
      Carrito.agregarProducto(idProducto, producto.precio, producto.nombre);
      res.redirect('/carrito');
  })
};*/
 

exports.getCarrito = (req, res, next) => {
  req.usuario
    .populate('carrito.items.idProducto')
    .then(usuario => {
      console.log(usuario.carrito.items);
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
          console.log(result);
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


/*exports.postModificarCantidad = (req, res) => {
  const idProducto = req.body.idProducto;
  const nuevaCantidad = parseInt(req.body.cantidad);
  
  Producto.findById(idProducto, producto => {
      Carrito.modificarCantidad(idProducto, nuevaCantidad, producto.precio);
      res.redirect('/carrito');
  });
};*/

exports.postModificarCantidad = (req, res, next) => {
  const { idProducto, nuevaCantidad } = req.body; // Asegúrate de que estos valores sean enviados en el cuerpo de la solicitud

  // Comprueba que nuevaCantidad sea un número válido
  const cantidad = parseInt(nuevaCantidad, 10);
  if (isNaN(cantidad) || cantidad < 0) {
    return res.status(400).send('Cantidad no válida'); // Manejo de errores para cantidades no válidas
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
          usuario.carrito.items.splice(itemIndex, 1); // Elimina el producto
        } else {
          // Actualiza la cantidad del producto
          usuario.carrito.items[itemIndex].cantidad = cantidad; // Asegúrate de que cantidad se establece correctamente
        }

        return usuario.save(); // Guarda los cambios en el usuario
      } else {
        // Maneja el caso donde el producto no se encuentra en el carrito
        console.log('Producto no encontrado en el carrito');
        return Promise.reject(new Error('Producto no encontrado en el carrito'));
      }
    })
    .then(() => {
      res.redirect('/carrito'); // Redirige al carrito después de modificar la cantidad
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error al modificar la cantidad'); // Manejo de errores
    });
};













/*exports.postEliminarProducto = (req, res) => {
  const idProducto = req.body.idProducto;
  Producto.findById(idProducto, producto => {
      if (producto) {
          Carrito.eliminarProducto(idProducto, producto.precio);
          res.redirect('/carrito');
      } else {
          res.redirect('/productos');
      }
  });
};*/

/*exports.getCarrito = (req, res, next) => {
  

  fs.readFile(p, (err, fileContent) => {
      if (err) {
          return res.render('tienda/carrito', {
              path: '/carrito',
              titulo: 'Mi Carrito',
              productos: [] // Si hay un error o el archivo no existe, muestra un carrito vacío
          });
      }

      const carrito = JSON.parse(fileContent); // Lee el archivo carrito.json
      res.render('tienda/carrito', {
          path: '/carrito',
          titulo: 'Mi Carrito',
          productos: carrito.productos, // Pasa los productos a la vista
          precioTotal: carrito.precioTotal // Pasa el precio total a la vista
      });
  });
};*/

/*exports.getCarrito = (req, res, next) => {
  fs.readFile(p, (err, fileContent) => {
      let carrito = { productos: [], precioTotal: 0 };
      if (!err) {
          carrito = JSON.parse(fileContent);
      }
      res.render('tienda/carrito', {
          path: '/carrito',
          titulo: 'Mi Carrito',
          productos: carrito.productos,
          precioTotal: carrito.precioTotal // Asegúrate de pasar esto a la vista
      });
  });
};*/
