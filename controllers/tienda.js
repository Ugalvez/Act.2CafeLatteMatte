

const Producto = require('../models/producto');




exports.getProductos = (req, res, next) => {
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

    
 
  }


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

 exports.getCarrito = (req, res, next) => {

    res.render('carrito',{
      titulo: "Carrito",
      path: "/carrito"
    })

}

 