
const path = require('path');
const express = require('express');


const raizDir = require('../utils/path');


const adminData = require('./admin');

const router = express.Router();



router.get('/', (req, res, next) => {
   console.log("bola",adminData.productos);

   //res.sendFile(path.join(raizDir,'views','tienda.html'));
    const productos = adminData.productos;
   res.render('tienda',{
    prods: productos,
    titulo: "La Tienda",
    path: "/"


   })

 });

 module.exports = router;