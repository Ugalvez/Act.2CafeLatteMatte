const fs = require('fs');
const path = require('path');
const raizDir = require('../utils/path');

const p = path.join(raizDir, 'data', 'carrito.json');



const Producto = require('../models/producto');
const Carrito = require('../models/carrito')



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


  exports.getDisplayProductos = (req, res, next) => {
    let productos = [];

    Producto.fetchAll(productosObt =>{
        console.log (productosObt);
        productos = productosObt;

    res.render('productos',{
      prods: productos,
      titulo: "Productos",
      path: "/productos"
    })

})



 }

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



exports.postCarrito = (req, res) => {
  const idProducto = req.body.idProducto;
  Producto.findById(idProducto, producto => {
      Carrito.agregarProducto(idProducto, producto.precio, producto.nombre);
      res.redirect('/carrito');
  })
};
 

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

exports.getCarrito = (req, res, next) => {
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
};


/*exports.postModificarCantidad = (req, res) => {
  const idProducto = req.body.idProducto;
  const nuevaCantidad = req.body.cantidad;

  Producto.findById(idProducto, producto => {
      Carrito.modificarCantidad(idProducto, nuevaCantidad, producto.precio);
      res.redirect('/carrito');
  });
};*/

exports.postModificarCantidad = (req, res) => {
  const idProducto = req.body.idProducto;
  const nuevaCantidad = parseInt(req.body.cantidad);
  
  Producto.findById(idProducto, producto => {
      Carrito.modificarCantidad(idProducto, nuevaCantidad, producto.precio);
      res.redirect('/carrito');
  });
};


exports.postEliminarProducto = (req, res) => {
  const idProducto = req.body.idProducto;
  Producto.findById(idProducto, producto => {
      if (producto) {
          Carrito.eliminarProducto(idProducto, producto.precio);
          res.redirect('/carrito');
      } else {
          res.redirect('/productos');
      }
  });
};
