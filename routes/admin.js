
//const path = require('path');
const express = require('express');

//const raizDir = require('../utils/path');

const productosController = require('../controllers/admin')


const router = express.Router();




router.get('/crear-producto', productosController.getCrearProducto);





router.post('/crear-producto',productosController.postCrearProducto);





router.get('/adminHome',(req, res, next) => {
 
   res.render('adminHome',{titulo: 'Admin Home', path: '/admin/adminHome'})
       });





   exports.routes = router;
 