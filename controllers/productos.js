const Producto = require('../models/producto');

exports.getCrearProducto = (req,res,next)=>{

    res.render('crear-producto',{titulo: 'Crear Producto', path: '/admin/crear-producto'})
 };

 exports.postCrearProducto = (req, res, next) => {
    console.log("Cuerpo de la solicitud:",req.body)

    const producto = new Producto(req.body.nombre)
    producto.save();
/*
     productos.push({nombre: req.body.nombreproducto})
     console.log(req.body);
*/

     res.redirect("/")
     };



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