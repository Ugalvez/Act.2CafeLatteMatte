const express = require('express');

// Importa el controlador de la tienda y el middleware de autenticación
const tiendaController = require('../controllers/tienda')
const isAuth = require('../middleware/is-auth')

// Crea un enrutador con Express
const router = express.Router();

// Ruta principal para mostrar la página de inicio
router.get('/', tiendaController.getIndex);

// Ruta para mostrar todos los productos
router.get('/productos', tiendaController.getProductos);

// Ruta para crear un nuevo pedido, asegurando que el usuario esté autenticado
router.post('/pedido', isAuth, tiendaController.postPedido);

// Ruta para mostrar el pedido actual del usuario
router.get('/pedido', isAuth, tiendaController.getPedido);

// Ruta para mostrar el carrito de compras, requiere autenticación
router.get('/carrito', isAuth, tiendaController.getCarrito);

// Ruta para añadir productos al carrito
router.post('/carrito', isAuth, tiendaController.postCarrito);

// Ruta para ver detalles de un producto específico
router.get('/productos/:idProducto', tiendaController.getProducto);

// Ruta para modificar la cantidad de un producto en el carrito
router.post('/carrito/modificar-cantidad', isAuth, tiendaController.postModificarCantidad);

// Ruta para eliminar un producto del carrito
router.post('/carrito/eliminar-producto', isAuth, tiendaController.postEliminarProductoCarrito);

// Rutas del footer para mostrar páginas informativas
router.get('/sobre-nosotros', tiendaController.getSobreNosotros);
router.get('/contacto', tiendaController.getContacto);
router.get('/libro-de-reclamaciones', tiendaController.getLibroReclamaciones);
router.get('/nuestros-locales', tiendaController.getNuestrosLocales);
router.get('/politicas-de-delivery', tiendaController.getPoliticasDelivery);
router.get('/politicas-de-privacidad', tiendaController.getPoliticasPrivacidad);
router.get('/preguntas-frecuentes', tiendaController.getPreguntasFrecuentes);
router.get('/terminos-y-condiciones', tiendaController.getTerminosyCondiciones);

// Exporta las rutas para que estén disponibles en otras partes del proyecto
module.exports = router;