const path = require('path');
const bodyParser = require("body-parser");
const express = require("express");
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const fs = require('fs');

const MONGODB_URI = 'mongodb+srv://ugalvez987:sfpa4774@cluster0.b1vsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // URI de la base de datos

// Rutas
const adminRoutes = require('./routes/admin').routes;
const tiendaRoutes = require('./routes/tienda');
const errorController = require('./controllers/error');
const authRoutes = require('./routes/auth');
const Usuario = require('./models/users');

const app = express();

// Configuración para almacenar sesiones en MongoDB
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});


const csrfProtection = csrf();


/*
// Protección CSRF con un token que dura 2 horas
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 2 * 60 * 60 * 1000  // Duración del token CSRF: 2 horas
  }
});*/




// Middleware para manejar datos del formulario
app.use(bodyParser.urlencoded({ extended: false }));

// Crea la carpeta de imágenes si no existe
if (!fs.existsSync('./imagenes')) {
  fs.mkdirSync('./imagenes');
}

// Configuración de multer para subir imágenes
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/imagenes');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/:/g, '-'));
  }
});

// Filtra solo imágenes permitidas
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Middleware para la subida de archivos
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('urlImagen'));

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({ secret: 'algo muy secreto', resave: false, saveUninitialized: false, store: store }));

// Aplicar CSRF después de la configuración de la sesión
app.use(csrfProtection);
app.use(flash());

// Middleware para encontrar al usuario si está logueado
app.use((req, res, next) => {
  if (!req.session.usuario) {
    return next();
  }

  Usuario.findById(req.session.usuario._id)
    .then(usuario => {
      req.usuario = usuario;
      next();
    })
    .catch(err => console.log(err));
});

// Middleware para pasar el token CSRF a las vistas
app.use((req, res, next) => {
  res.locals.autenticado = req.session.autenticado;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Middleware para determinar si el usuario es admin
app.use((req, res, next) => {
  res.locals.esAdmin = req.session.usuario && req.session.usuario.rol === 'administrador';
  next();
});

// Rutas de la aplicación
app.use('/admin', adminRoutes);
app.use(tiendaRoutes);
app.use(authRoutes);

// Rutas para errores
app.get('/500', errorController.get500);
app.use(errorController.get404);

// Conexión a la base de datos y arranque del servidor
if (require.main === module) {
  mongoose
    .connect(MONGODB_URI)
    .then(result => {
      // Si no existe un usuario, crea uno por defecto
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
      console.log('conectado al servidor');
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = app;
