const path = require('path');

const bodyParser = require("body-parser");
const express = require ("express");

const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin').routes;
const tiendaRoutes = require('./routes/tienda');

const errorController = require('./controllers/error');

const authRoutes = require('./routes/auth');
const Usuario = require('./models/users');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb+srv://ugalvez987:sfpa4774@cluster0.b1vsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views','views');




app.use(bodyParser.urlencoded({extended: false}));


//const ErrorRoutes = require('./routes/error')



app.use(express.static(path.join(__dirname,'public')));
app.use(session({ secret: 'algo muy secreto', resave: false, saveUninitialized: false, store: store }));


app.use((req, res, next) => {
  Usuario.findById('671d22e02248d4c355760d19')
      .then(usuario => {
          req.usuario = usuario;
          next();
      })
      .catch(err => console.log(err));

})

app.use('/admin',adminRoutes);

app.use(tiendaRoutes);

//Sistema de login--------
app.use(authRoutes);
//--------------------------


app.use(errorController.get404)
  






mongoose
   .connect(MONGODB_URI)
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