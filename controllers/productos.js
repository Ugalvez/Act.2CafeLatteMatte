


const Producto = require('../models/producto');

exports.getCrearProducto = (req,res,next)=>{

    res.render('crear-producto',{titulo: 'Crear Producto', path: '/admin/crear-producto'})
 };



 exports.postCrearProducto = (req, res, next) => {
    console.log("Cuerpo de la solicitud:",req.body)

    const producto = new Producto(req.body.nombre)
    producto.save();


     res.redirect("/")
     };



exports.getProductos = (req, res, next) => {
    Producto.find()
    .then(productos => {
        res.render('tienda/lista-productos', {
            prods: productos,
            titulo: "Productos de la tienda",
            path: "/productos"
        });

    })
    .catch(err => console.log(err));

      
      
      productosObt =>{
        //console.log (productosObt);
        productos = productosObt;


        res.render('tienda',{
            prods: productos,
            titulo: "Latte&Matte",
            path: "/"
           })


    };

    
 
  }


