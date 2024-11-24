const Producto = require('../models/producto');

// Mostrar todos los productos en la vista
exports.getDisplayProductos = (req, res, next) => {
    Producto.find()  // Trae todos los productos de la base de datos
        .then(productos => {
            // Renderiza la vista 'adminHome' con la lista de productos
            res.render('adminHome', {
                prods: productos,
                titulo: "Admin Home",
                path: "/admin/adminHome",
                csrfToken: req.csrfToken()
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
          });  // control de errores
};


// Renderiza la página para crear un nuevo producto
exports.getCrearProducto = (req, res) => {
    res.render('admin/crear-producto', {
        titulo: 'Crear Producto',
        path: '/admin/crear-producto',
        modoEdicion: false  // Indicador de que no es un producto en edición
    });
};



// Maneja la creación de un nuevo producto
exports.postCrearProducto = (req, res) => {
    // Extrae la información del cuerpo de la solicitud (del formulario)
    const { nombre, urlImagen, precio, precioPromo, descripcion, disponibilidad, stock, categoria } = req.body;
    // Crea un nuevo objeto Producto con los datos proporcionados
    const producto = new Producto({
        nombre, precio, descripcion, urlImagen,
        idUsuario: req.usuario._id,
        disponibilidad, stock, precioPromo, categoria
    });

    producto.save()  // Guarda el producto en la base de datos
        .then(result => {
            // Redirige al administrador a la página principal de administración
            res.redirect('/admin/adminHome');
        })
        .catch(err => console.log(err));  // Muestra errores
};

// Renderiza la vista de edición de un producto
exports.getEditarProducto = (req, res) => {
    const modoEdicion = req.query.editar;  // Revisa si se está editando un producto
    const idProducto = req.params.idProducto;  // Obtiene el ID del producto a editar

    // Busca el producto en la base de datos por su ID
    Producto.findById(idProducto)
        .then(producto => {
            if (!producto) {
                return res.redirect('admin/adminHome');  // Si no existe, redirige y ya no hace caso
            }
            // Si el producto existe, renderiza la página de edición
            res.render('admin/crear-producto', {
                titulo: 'Editar Producto',
                path: '/admin/editar-producto',
                producto: producto,  // Pasa el producto para editar
                modoEdicion: true  // Indica que es un modo de edición
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
          });  // control de errores
};

// Actualiza los datos de un producto en la base de datos
exports.postEditarProducto = (req, res, next) => {
    const { idProducto, nombre, precio, precioPromo, urlImagen, descripcion, disponibilidad, stock, categoria } = req.body;

    // Busca el producto por su ID y lo actualiza con los nuevos valores
    Producto.findById(idProducto)
        .then(producto => {
            producto.nombre = nombre;
            producto.precio = precio;
            producto.precioPromo = precioPromo;
            producto.descripcion = descripcion;
            producto.urlImagen = urlImagen;
            producto.disponibilidad = disponibilidad;
            producto.stock = stock;
            producto.categoria = categoria;

            return producto.save();  // Guarda cambios
        })
        .then(result => {
            // Una vez actualizado, redirige a la página de administración
            res.redirect('adminHome');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
          });  // control de errores
};

// Elimina un producto de la base de datos
exports.postEliminarProducto = (req, res, next) => {
    const idProducto = req.body.idProducto;  // Obtiene el ID del producto a eliminar

    Producto.findByIdAndDelete(idProducto)  // Busca y elimina el producto
        .then(result => {
            // Redirige al admin a la página principal de administración
            res.redirect('adminHome');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
          });  // control de errores
};

// Muestra la vista para crear un nuevo usuario
exports.getCrearUsuario = (req, res, next) => {
    // Maneja los mensajes de error del registro
    let mensaje = req.flash('error');
    mensaje = mensaje.length > 0 ? mensaje[0] : null;

    // Renderiza la vista de registro con los posibles mensajes de error
    res.render('auth/registrarse', {
        titulo: "Crear Usuario",
        path: "/crear-usuario",
        autenticado: req.session.usuario,  // Indica si el usuario está autenticado
        mensajeError: mensaje,  // Mensaje de error si existe
        datosAnteriores: { nombre: '', fechaNacimiento: '', email: '', password: '' },
        erroresValidacion: []  // Si hay errores de validación en el formulario, los pasa
    });
};