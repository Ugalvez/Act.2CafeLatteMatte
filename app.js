const path = require('path');
const bodyParser = require("body-parser");
const express = require ("express");
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


const MONGODB_URI = 'mongodb+srv://ugalvez987:sfpa4774@cluster0.b1vsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';




const adminRoutes = require('./routes/admin').routes;
const tiendaRoutes = require('./routes/tienda');

const errorController = require('./controllers/error');

const authRoutes = require('./routes/auth');
const Usuario = require('./models/users');


const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();




app.set('view engine', 'ejs');
app.set('views','views');




app.use(bodyParser.urlencoded({extended: false}));


//const ErrorRoutes = require('./routes/error')



app.use(express.static(path.join(__dirname,'public')));
app.use(session({ secret: 'algo muy secreto', resave: false, saveUninitialized: false, store: store }));

app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
  if(!req.session.usuario) {
    return next();
  }

  Usuario.findById(req.session.usuario._id)
    .then(usuario => {
        req.usuario = usuario;
        next();
    })
    .catch(err => console.log(err));

})

app.use((req, res, next) => {
  res.locals.autenticado = req.session.autenticado;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  res.locals.esAdmin = req.session.usuario && req.session.usuario.rol === 'administrador';
  next();
});

app.use('/admin',adminRoutes);
app.use(tiendaRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404)

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).render('500', {
    titulo: 'Error!',
    path: '/500',
    autenticado: req.session.autenticado
  });
})






mongoose
   .connect(MONGODB_URI)
  .then(result => {
    //console.log(result)

    Usuario.findOne().then(usuario => {
        if (!usuario) {
          const usuario = new Usuario({
            nombre: 'ugalvez',
            email: 'ugalvez987@gmail.com',
            password: '12345',
            carrito: {
              items: []
            }
          });
          usuario.save();
        }
      });
    app.listen(3000);
    console.log('conectado al servidor')
  })
  .catch(err => {
    console.log(err);
  });




 /*app.listen(3000,()=>{
    console.log("Se ha iniciado el servidor express.js")
 });*/