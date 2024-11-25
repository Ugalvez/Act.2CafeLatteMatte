const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const authController = require('../controllers/auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

// Ruta para mostrar el formulario de crear producto
router.get('/crear-producto',
   [
      // Validaciones para el nombre: debe ser texto, al menos 5 caracteres, sin espacios extra
      body('nombre', 'El nombre del producto debe ser una texto de no menos de 5 caracteres')
          .isString()
          .isLength({ min: 5 })
          .trim(),
      body('urlImagen').isURL(),
      // El precio debe ser un número decimal
      body('precio').isFloat(),
      // La descripción debe tener entre 10 y 400 caracteres
      body('descripcion')
          .isLength({ min: 10, max: 400 })
          .trim(),
      body('categoria', 'Por favor elija una categoría')
          .notEmpty(),
     /* body('precioPromo', 'Introduzca un precio promocional')
          .notEmpty(),*/
      body('stock', 'Introduzca una disponibilidad')
          .notEmpty(),
  ],
  isAdmin, // Solo admins pueden acceder
   adminController.getCrearProducto // Controlador que maneja la vista del formulario
);

// Ruta para procesar el formulario de creación de productos
router.post('/crear-producto', isAdmin, adminController.postCrearProducto);

// Ruta para mostrar el panel principal de administración
router.get('/adminHome', isAdmin, adminController.getDisplayProductos);

// Ruta para mostrar el formulario de edición de producto, utilizando el ID del producto
router.get('/editar-producto/:idProducto', isAdmin, adminController.getEditarProducto);

// Ruta para procesar la edición del producto
router.post('/editar-producto', 
   [
      // Validaciones similares a las de creación
      body('nombre', 'El nombre del producto debe ser una texto de no menos de 5 caracteres')
          .isString()
          .isLength({ min: 3 }) // Se permite un mínimo de 3 caracteres
          .trim(),
      body('precio').isFloat(), // Precio sigue siendo un número decimal
      body('descripcion', 'La descripcion debe tener no menos de 10 ni mas de 400 caracteres')
          .isLength({ min: 10, max: 400 })
          .trim()
  ],
  isAdmin, // Verifica que sea admin
  adminController.postEditarProducto // Controlador que procesa la edición
);

// Ruta para manejar la eliminación de productos
router.post('/eliminar-producto', isAdmin, adminController.postEliminarProducto);

// Ruta para mostrar el formulario de creación de usuarios
router.get('/crear-usuario', isAdmin, adminController.getCrearUsuario);

// Exporta las rutas para usarlas en otro lugar de la aplicación
exports.routes = router;