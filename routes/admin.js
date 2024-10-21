
const path = require('path');
const express = require('express');

const raizDir = require('../utils/path');

const router = express.Router();


const productos=[];

router.get('/crear-producto', (req,res,next)=>{
   //res.sendFile(path.join(raizDir,'views','crear-producto.html'));
   res.render('crear-producto',{titulo: 'Crear Producto', path: '/admin/crear-producto'})
});


router.post('/crear-producto',(req, res, next) => {
   console.log("Cuerpo de la solicitud:",req.body)
    productos.push({nombre: req.body.nombreproducto})
   // console.log(req.body);
    res.redirect("/")
    });

/*
    module.exports = {
      router: router,
      productos: productos
   };
    

    */
   // module.exports = router;

   exports.routes = router;
   exports.productos = productos;