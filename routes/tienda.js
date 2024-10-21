
//const path = require('path');
const express = require('express');


//const raizDir = require('../utils/path');

const productosController = require('../controllers/tienda')

//const adminData = require('./admin');

const router = express.Router();



router.get('/', productosController.getProductos);




 router.get('/productos', productosController.getDisplayProductos)





 router.get('/carrito', (req, res, next) => {
  //const productos = adminData.productos; Aqui serian productos en carrito
  res.render('carrito',{
    titulo: "Carrito de Compras",
    path: "/carrito"
  })
 })

 /*
 router.get('/agregar-productos', (req, res, next) => {
  res.render('agregar-productos',{
    titulo: "Agregar Productos",
    path: "/agregar-productos"
  })
 })
*/





 module.exports = router;