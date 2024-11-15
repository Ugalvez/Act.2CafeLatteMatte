



const Producto = require('../models/producto');

/*exports.getCrearProducto = (req,res,next)=>{

    res.render('crear-producto',{titulo: 'Crear Producto', path: '/admin/crear-producto'})
 };


 
 exports.postCrearProducto = (req, res, next) => {
    console.log("Cuerpo de la solicitud:",req.body)


    const nombre = req.body.nombre;
    const urlImagen = req.body.urlImagen;
    const descripcion = req.body.descripcionProducto;
    const precio = req.body.precio;
    const precioPromo = req.body.precioPromo;
    const disponibilidad = req.body.disponibilidad;
   // const categoria = req.body.select;

    const producto = new Producto(null, nombre, urlImagen, descripcion, precio, precioPromo, disponibilidad )
    producto.save();


    res.redirect('/admin/adminHome')
     };

     
exports.getDisplayProductos = (req, res, next) => {
        let productos = [];
    
        Producto.fetchAll(productosObt =>{
            console.log ("prueba",productosObt);
            productos = productosObt;
            
            res.render('adminHome', {
                prods: productos, 
                titulo:"Admin Home",
                path: "/admin/adminHome"
        })
    
    })
    
     }

     exports.getEditarProducto = (req, res) => {

        const modoEdicion = req.query.editar;
        const idProducto = req.params.idProducto;
        Producto.findById(idProducto, producto => {
            console.log(producto)
            if (!producto) {
                return res.redirect('/');
            }
            res.render('editar-producto', { 
                titulo: 'Editar Producto', 
                path: 'editar-producto',
                producto: producto,
                modoEdicion: true,
            })
        })
    }
    
    
    exports.postEditarProducto = (req, res, next) => {
        const idProducto = req.body.idProducto;
        const nombre = req.body.nombre;
        const precio = req.body.precio;
        const urlImagen = req.body.urlImagen;
        const descripcion = req.body.descripcion;
        const productoActualizado = new Producto(
          idProducto,
          nombre,
          urlImagen,
          descripcion,
          precio
        );
        productoActualizado.save();
        res.redirect('adminHome');
      };
    
      exports.postEliminarProducto = (req, res, next) => {
        const idProducto = req.body.idProducto;
        Producto.deleteById(idProducto);
        res.redirect('adminHome');
      };*/


//adaptacion a mongoose

exports.getDisplayProductos = (req, res, next) => {

    Producto.find()
        .then(productos => {
            res.render('adminHome', {
                 prods: productos,
                 titulo: "Admin Home",
                 path: "/admin/adminHome"
            });

    })
    .catch(err => console.log(err));

    }

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