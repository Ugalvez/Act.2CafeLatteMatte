
//const path = require('path');
const express = require('express');

//const raizDir = require('../utils/path');

const adminController = require('../controllers/admin')



const router = express.Router();




router.get('/crear-producto', adminController.getCrearProducto);





router.post('/crear-producto', adminController.postCrearProducto);





router.get('/adminHome', adminController.getDisplayProductos);



router.get('/editar-producto/:idProducto', adminController.getEditarProducto);

router.post('/editar-producto', adminController.postEditarProducto);

//router.post('/eliminar-producto', adminController.postEliminarProducto);
 

   /*
   res.render('adminHome',{titulo: 'Admin Home', path: '/admin/adminHome'})
       });

*/



   exports.routes = router;
 