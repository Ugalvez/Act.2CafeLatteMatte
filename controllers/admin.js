const Producto = require('../models/producto');



exports.getDisplayProductos = (req, res, next) => {
    Producto.find()
        .then(productos => {
            res.render('adminHome', {
                 prods: productos,
                 titulo: "Admin Home",
                 path: "/admin/adminHome",
                 csrfToken: req.csrfToken()  // Asegúrate de pasar el csrfToken
            });
        })
        .catch(err => console.log(err));
};














exports.getCrearProducto = (req, res) => {
    res.render('admin/crear-producto', {
        titulo: 'Crear Producto',
        path: '/admin/crear-producto',
        modoEdicion: false
    })
};

exports.postCrearProducto = (req, res) => {
    const nombre = req.body.nombre;
    const urlImagen = req.body.urlImagen;
    const precio = req.body.precio;
    const precioPromo = req.body.precioPromo;
    const descripcion = req.body.descripcion;
    const disponibilidad = req.body.disponibilidad;
    const stock = req.body.stock
    const categoria = req.body.categoria
    const producto = new Producto({nombre: nombre, precio: precio, descripcion: descripcion, urlImagen: urlImagen, idUsuario: req.usuario._id, disponibilidad: disponibilidad, stock: stock, precioPromo: precioPromo, categoria: categoria});
    producto.save()
        .then(result => {
            //console.log(result);
            res.redirect('/admin/adminHome');
        })
        .catch(err => console.log(err));
};

exports.getEditarProducto = (req, res) => {
    const modoEdicion = req.query.editar;
    const idProducto = req.params.idProducto;
    Producto.findById(idProducto)
        .then(producto => {
            if (!producto) {
                return res.redirect('admin/adminHome');
            }
            res.render('admin/crear-producto', {
                titulo: 'Editar Producto',
                path: '/admin/editar-producto',
                producto: producto,
                modoEdicion: true,
            })
        })
        .catch(err => console.log(err));
} 


exports.postEditarProducto = (req, res, next) => {
    const idProducto = req.body.idProducto;
    const nombre = req.body.nombre;
    const precio = req.body.precio;
    const precioPromo = req.body.precioPromo;
    const urlImagen = req.body.urlImagen;
    const descripcion = req.body.descripcion;
    const disponibilidad = req.body.disponibilidad;
    const stock = req.body.stock;
    const categoria = req.body.categoria;
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
            return producto.save();
        })
        .then(result => {
            console.log('Producto actualizado satisfactoriamente');
            res.redirect('adminHome');
        })
        .catch(err => console.log(err));
}; 

exports.postEliminarProducto = (req, res, next) => {
    const idProducto = req.body.idProducto;
    Producto.findByIdAndDelete(idProducto)
        .then(result => {
            console.log('Producto eliminado satisfactoriamente');
            res.redirect('adminHome');
        })
        .catch(err => console.log(err));
}; 

exports.getCrearUsuario = (req, res, next) => {
    let mensaje = req.flash('error');
    if (mensaje.length > 0) {
      mensaje = mensaje[0];
    } else {
      mensaje = null;
    }
      res.render('auth/registrarse',{
        titulo: "Crear Usuario",
        path: "/crear-usuario",
        autenticado: req.session.usuario,
        mensajeError: mensaje,
        datosAnteriores: {
          nombre: '',
          fechaNacimiento: '',
          email: '',
          password: ''
        },
        erroresValidacion: []
      })
  }