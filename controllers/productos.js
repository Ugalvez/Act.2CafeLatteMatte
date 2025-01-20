const Producto = require('../models/producto');  // Importa el modelo Producto


// Renderiz la vista de creación de un nuevo producto
exports.getCrearProducto = (req, res, next) => {
    res.render('crear-producto', { 
        titulo: 'Crear Producto',
        path: '/admin/crear-producto'
    });
};

// Método POST para manejar el envío del formulario y crear un nuevo producto
exports.postCrearProducto = (req, res, next) => {

    // Crea un nuevo producto con la data del formulario
    const producto = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        precioPromo: req.body.precioPromo,
        stock: req.body.stock,
        descripcion: req.body.descripcion,
        urlImagen: req.body.urlImagen,
        categoria: req.body.categoria,
        idUsuario: req.user._id,
        favorito: favorito
    });

    // Guarda el nuevo producto en la base de datos
    producto.save()
        .then(result => {
            res.redirect("/");  // Redirige a la página principal después de guardar
        })
        .catch(err => {
                console.log(err); // Muestra un error en la consola si algo sale mal
                const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
              });
            //res.redirect("/admin/crear-producto");  // Redirige de nuevo a la página de creación del producto
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


