
//const path = require('path');
const express = require('express');


//const raizDir = require('../utils/path');

const productosController = require('../controllers/tienda')

//const adminData = require('./admin');

const router = express.Router();



router.get('/', productosController.getProductos);




 router.get('/productos', productosController.getDisplayProductos)





 router.get('/carrito',productosController.getCarrito)

router.get('/productos/:idProducto',productosController.getProducto);


  /*

, (req, res, next) => {
  //const productos = adminData.productos; Aqui serian productos en carrito
  res.render('carrito',{
    titulo: "Carrito de Compras",
    path: "/carrito"
  })
 })


  */







 module.exports = router;