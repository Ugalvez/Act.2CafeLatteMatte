



const Producto = require('../models/producto');

exports.getCrearProducto = (req,res,next)=>{

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
            
            res.render('adminHome', { //Cambie render en vez de esto 'admin/adminHome'
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
      };