
//const path = require('path');
const express = require('express');
const { body } = require('express-validator');

//const raizDir = require('../utils/path');

const adminController = require('../controllers/admin');
const authController = require('../controllers/auth');
const isAdmin = require('../middleware/is-admin');



const router = express.Router();




router.get('/crear-producto',
   [
      body('nombre', 'El nombre del producto debe ser una texto de no menos de 5 caracteres')
          .isString()
          .isLength({ min: 5 })
          .trim(),
      //body('urlImagen').isURL(),
      body('precio').isFloat(),
      body('descripcion')
          .isLength({ min: 10, max: 400 })
          .trim()
  ],
  isAdmin,
   adminController.getCrearProducto);





router.post('/crear-producto', isAdmin, adminController.postCrearProducto);





router.get('/adminHome', isAdmin, adminController.getDisplayProductos);



router.get('/editar-producto/:idProducto', isAdmin, adminController.getEditarProducto);

router.post('/editar-producto', 
   [
      body('nombre', 'El nombre del producto debe ser una texto de no menos de 5 caracteres')
          .isString()
          .isLength({ min: 3 })
          .trim(),
      //body('urlImagen').isURL(),
      body('precio').isFloat(),
      body('descripcion', 'La descripcion debe tener no menos de 10 ni mas de 400 caracteres')
          .isLength({ min: 10, max: 400 })
          .trim()
  ],
  isAdmin, 
  adminController.postEditarProducto);

router.post('/eliminar-producto', isAdmin, adminController.postEliminarProducto);

router.get('/crear-usuario', isAdmin, adminController.getCrearUsuario);
 

   /*
   res.render('adminHome',{titulo: 'Admin Home', path: '/admin/adminHome'})
       });

*/



   exports.routes = router;
 