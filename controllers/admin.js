



const Producto = require('../models/producto');

exports.getCrearProducto = (req,res,next)=>{

    res.render('crear-producto',{titulo: 'Crear Producto', path: '/admin/crear-producto'})
 };


 
 exports.postCrearProducto = (req, res, next) => {
    console.log("Cuerpo de la solicitud:",req.body)

    const producto = new Producto(req.body.nombre)
    producto.save();


    res.redirect('/admin/adminHome')
     };

     
exports.getDisplayProductos = (req, res, next) => {
        let productos = [];
    
        Producto.fetchAll(productosObt =>{
            console.log (productosObt);
            productos = productosObt;
    
        res.render('admin/adminHome',{
          prods: productos,
          titulo: "Admin Home",
          path: "/admin/adminHome"
        })
    
    })
    
     }