
//const path = require('path');
const express = require('express');


//const raizDir = require('../utils/path');

const tiendaController = require('../controllers/tienda')

//const adminData = require('./admin');

const router = express.Router();
const isAuth = require('../middleware/is-auth')



router.get('/', tiendaController.getIndex);




 router.get('/productos', tiendaController.getProductos);


router.post('/pedido', isAuth, tiendaController.postPedido);
router.get('/pedido', isAuth, tiendaController.getPedido);

 router.get('/carrito', isAuth, tiendaController.getCarrito);
 router.post('/carrito', isAuth, tiendaController.postCarrito);


router.get('/productos/:idProducto',tiendaController.getProducto);

router.post('/carrito/modificar-cantidad', isAuth, tiendaController.postModificarCantidad);

router.post('/carrito/eliminar-producto', isAuth, tiendaController.postEliminarProductoCarrito);



// Routes del Footer
router.get('/sobre-nosotros', tiendaController.getSobreNosotros);
router.get('/contacto', tiendaController.getContacto);
router.get('/libro-de-reclamaciones', tiendaController.getLibroReclamaciones);
router.get('/nuestros-locales', tiendaController.getNuestrosLocales);
router.get('/politicas-de-delivery', tiendaController.getPoliticasDelivery);
router.get('/politicas-de-privacidad', tiendaController.getPoliticasPrivacidad);
router.get('/preguntas-frecuentes', tiendaController.getPreguntasFrecuentes);
router.get('/terminos-y-condiciones', tiendaController.getTerminosyCondiciones);









 module.exports = router;