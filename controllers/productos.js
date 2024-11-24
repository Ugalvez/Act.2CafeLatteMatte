


const Producto = require('../models/producto');


exports.getCrearProducto = (req,res,next)=>{

    res.render('crear-producto',{titulo: 'Crear Producto', path: '/admin/crear-producto'})
 };







 

 exports.postCrearProducto = (req, res, next) => {
    console.log("Cuerpo de la solicitud:", req.body); // Verifica todo el cuerpo de la solicitud
    console.log("Valor de favorito:", req.body.favorito); // Verifica el valor de favorito

    // Asegúrate de que 'favorito' tenga el valor correcto
    const favorito = req.body.favorito === 'on'; // Si el checkbox está marcado, 'favorito' será 'on', de lo contrario será 'false'

    // Crear el producto con los datos enviados
    const producto = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        precioPromo: req.body.precioPromo,
        stock: req.body.stock,
        descripcion: req.body.descripcion,
        urlImagen: req.body.urlImagen,
        categoria: req.body.categoria,
        idUsuario: req.user ? req.user._id : null, // Si manejas autenticación de usuario
        favorito: true
    });

    // Guardar el producto en la base de datos
    producto.save()
        .then(result => {
            res.redirect("/"); // Redirige después de guardar
        })
        .catch(err => {
            console.log(err); // Verifica si hay algún error en la consola
            res.redirect("/admin/crear-producto"); // Redirige en caso de error
        });
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


