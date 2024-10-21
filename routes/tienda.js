
const path = require('path');
const express = require('express');


const raizDir = require('../utils/path');


const adminData = require('./admin');

const router = express.Router();



router.get('/', (req, res, next) => {
   //console.log("bola",adminData.productos);

   //res.sendFile(path.join(raizDir,'views','tienda.html'));
    const productos = adminData.productos;
   res.render('tienda',{
    prods: productos,
    titulo: "Latte&Matte",
    path: "/"
   })

 });

 router.get('/productos', (req, res, next) => {
  const productos = adminData.productos;
  console.log("hola",productos.nombre)
  res.render('productos',{
    prods: productos,
    titulo: "Productos",
    path: "/productos"
  })
 })

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