const bodyParser = require("body-parser");
const express = require ("express");
const app = express();


const adminRoutes = require('./routes/admin')
const tiendaRoutes = require('./routes/tienda')
const ErrorRoutes = require('./routes/error')

app.use(bodyParser.urlencoded({extended: false}));


app.use('/admin',adminRoutes);
app.use(tiendaRoutes);


app.use(ErrorRoutes);







 app.listen(3000,()=>{
    console.log("Se ha iniciado el servidor express.js")
 });