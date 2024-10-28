const path = require('path');

const bodyParser = require("body-parser");
const express = require ("express");

const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin').routes;
const tiendaRoutes = require('./routes/tienda');

const errorController = require('./controllers/error');

const usersRoutes = require('./routes/users');
const Usuario = require('./models/users');

const app = express();

app.set('view engine', 'ejs');
app.set('views','views');



app.use(bodyParser.urlencoded({extended: false}));


//const ErrorRoutes = require('./routes/error')



app.use(express.static(path.join(__dirname,'public')));

app.use((req, res, next) => {
  Usuario.findById('671d22e02248d4c355760d19')
      .then(usuario => {
          req.usuario = usuario;
          console.log(`el usuario es ${req.usuario}`)
          next();
      })
      .catch(err => console.log(err));

})

app.use('/admin',adminRoutes);

app.use(tiendaRoutes);

//Sistema de login--------
app.use(usersRoutes);
//--------------------------


app.use(errorController.get404)
  






mongoose
   .connect(
      'mongodb+srv://ugalvez987:sfpa4774@cluster0.b1vsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(result => {
    console.log(result)

    Usuario.findOne().then(usuario => {
        if (!usuario) {
          const usuario = new Usuario({
            nombre: 'ugalvez',
            email: 'ugalvez987@gmail.com',
            carrito: {
              items: []
            }
          });
          usuario.save();
        }
      });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });




 /*app.listen(3000,()=>{
    console.log("Se ha iniciado el servidor express.js")
 });*/