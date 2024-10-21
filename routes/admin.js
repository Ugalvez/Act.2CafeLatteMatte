
const path = require('path');
const express = require('express');

const raizDir = require('../utils/path');

const router = express.Router();


router.get('/crear-producto', (req,res,next)=>{
//    console.log('Estamos en el Middleware');
   // res.send('<form action="/admin/productos" method="POST"><input type="text" name="nombreproducto"><button type="submit">Crear</button></form>')
   //res.sendFile(path.join(__dirname,'..','views','crear-producto.html'));

   res.sendFile(path.join(raizDir,'..','views','crear-producto.html'));
});


router.post('/crear-producto',(req, res, next) => {
    console.log(req.body);
    res.redirect("/")
    });

    module.exports = router;