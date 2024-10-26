const path = require('path');

const bodyParser = require("body-parser");
const express = require ("express");

const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin').routes;
const tiendaRoutes = require('./routes/tienda');

const errorController = require('./controllers/error');

const usersRoutes = require('./routes/users');

const app = express();

app.set('view engine', 'ejs');
app.set('views','views');



app.use(bodyParser.urlencoded({extended: false}));


//const ErrorRoutes = require('./routes/error')



app.use(express.static(path.join(__dirname,'public')));


app.use('/admin',adminRoutes);

app.use(tiendaRoutes);

//Sistema de login--------
app.use(usersRoutes);
//--------------------------


app.use(errorController.get404)
  










 app.listen(3000,()=>{
    console.log("Se ha iniciado el servidor express.js")
 });