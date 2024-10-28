
//const path = require('path');
const express = require('express');


//const raizDir = require('../utils/path');

const tiendaController = require('../controllers/tienda')

//const adminData = require('./admin');

const router = express.Router();



router.get('/', tiendaController.getIndex);




 router.get('/productos', tiendaController.getProductos);


router.post('/pedido',tiendaController.postPedido);
router.get('/pedido',tiendaController.getPedido);

 router.get('/carrito',tiendaController.getCarrito);
 router.post('/carrito', tiendaController.postCarrito);


router.get('/productos/:idProducto',tiendaController.getProducto);

router.post('/carrito/modificar-cantidad', tiendaController.postModificarCantidad);

router.post('/carrito/eliminar-producto', tiendaController.postEliminarProductoCarrito);


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