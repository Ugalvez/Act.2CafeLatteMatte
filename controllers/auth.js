const Usuario = require('../models/users');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { check, body } = require('express-validator');
const { validationResult } = require('express-validator');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const isAdmin = require('../middleware/is-admin');


const APIKEY = ''

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: APIKEY
    }
  })
);

// Muestra el formulario de login
exports.getLogin = (req, res, next) => {
  let mensaje = req.flash('error');
  mensaje = mensaje.length > 0 ? mensaje[0] : null;  // Manda errores si hay
  res.render('auth/login', {
    path: '/login',
    titulo: 'Log-in',
    autenticado: false,
    mensajeError: mensaje,
    datosAnteriores: { email: '', password: '' },
    erroresValidacion: []
  });
};


// Maneja el proceso de login
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;  // Obtiene los datos del formulario

  const errors = validationResult(req);  // Valida si hay errores

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      titulo: 'Log-in',
      mensajeError: errors.array()[0].msg,  // Muestra el primer error encontrado
      datosAnteriores: { email, password },
      erroresValidacion: errors.array()
    });
  }

  Usuario.findOne({ email })  // Busca el usuario por correo electrónico
    .then(usuario => {
      if (!usuario) {  // Si no encuentra al usuario, muestra un mensaje de error
        return res.status(422).render('auth/login', {
          path: '/login',
          titulo: 'Log-in',
          mensajeError: 'Email o password inválidos.',
          datosAnteriores: { email, password },
          erroresValidacion: []
        });
      }
      bcrypt.compare(password, usuario.password)  // Compara la contraseña con la guardada en la base de datos
        .then(hayCoincidencia => {
          if (hayCoincidencia) {
            req.session.autenticado = true;
            req.session.usuario = usuario;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');  // Redirige a la página principal si el login es exitoso
            });
          }
          req.flash('error', 'Email o password inválidos.');
          res.redirect('/login');  // Si la contraseña no coincide, redirige al login
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);  // Manejo de errores si algo falla en la comparación
        });
    });
};

// Muestra el formulario de registro
exports.getRegistrarse = (req, res, next) => {
  let mensaje = req.flash('error');
  mensaje = mensaje.length > 0 ? mensaje[0] : null;
  res.render('auth/registrarse', {
    titulo: "Registrarse",
    path: "/registrarse",
    autenticado: req.session.usuario,  // Si el usuario está autenticado, lo indica
    mensajeError: mensaje,
    datosAnteriores: { nombre: '', fechaNacimiento: '', email: '', password: '' },
    erroresValidacion: []
  });
};

// Maneja el proceso de registro
exports.postRegistrarse = (req, res, next) => {
  const { nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, email, password, passwordConfirmado } = req.body;
  const rol = req.session.usuario && req.session.usuario.rol === 'administrador' ? req.body.rol : 'cliente';  // Verifica si el usuario es admin

  const errors = validationResult(req);  // Valida si hay errores en el formulario

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('auth/registrarse', {
      path: '/registrarse',
      titulo: 'Registrarse',
      mensajeError: errors.array()[0].msg,
      erroresValidacion: errors.array(),
      datosAnteriores: { nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, email, rol, password, passwordConfirmado }
    });
  }

  bcrypt.hash(password, 13)  // Encripta la contraseña con bcrypt
    .then(passwordCifrado => {
      const user = new Usuario({
        nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, email, rol, password: passwordCifrado, carrito: { items: [] }
      });
      return user.save();  // Guarda el nuevo usuario
    })
    .then(result => {
      res.redirect('/login');  // Redirige al login después de un registro exitoso
      return transporter.sendMail({  // Envía un correo de confirmación al usuario
        to: email,
        from: 'ugalvez9879@gmail.com',
        subject: '¡Registro exitoso!',
        html: '<h2>¡Bienvenido a Café Latte Mate!</h2>'
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);  // Manejo de errores si algo falla
    });
};

// Maneja el logout
exports.postSalir = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');  // Redirige a la página principal después del logout
  });
};

// Muestra el formulario para restablecer la contraseña
exports.getResetPassword = (req, res, next) => {
  let mensaje = req.flash('error');
  mensaje = mensaje.length > 0 ? mensaje[0] : null;
  res.render('auth/reset', {
    titulo: "Restablecer Password",
    path: "/resetPassword",
    autenticado: false,
    mensajeError: mensaje,
    datosAnteriores: { email: '' },
    erroresValidacion: []
  });
};

// Maneja el proceso de reset de contraseña
exports.postResetPassword = (req, res, next) => {

  const email = req.body.email;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('auth/reset', {
      path: '/resetPassword',
      titulo: 'Recuperar contraseña',
      mensajeError: errors.array()[0].msg,
      erroresValidacion: errors.array(),
      datosAnteriores: { email }
    });
  }

  crypto.randomBytes(32, (err, buffer) => {  // Genera un token aleatorio para el restablecimiento
    if (err) {
      console.log(err);
      const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
    }
    const token = buffer.toString('hex');
    Usuario.findOne({ email: req.body.email })  // Busca al usuario por su email
      .then(usuario => {
        if (!usuario) {
          req.flash('error', 'No se encontro usuario con dicho email');
          return res.redirect('/resetPassword');
        }
        usuario.tokenReinicio = token;
        usuario.expiracionTokenReinicio = Date.now() + 3600000;  // El token expira en una hora
        return usuario.save();  // Guarda el usuario con el token de restablecimiento
      })
      .then(result => {
        if(!result) {
          return;
        }
        const email = req.body.email;
        transporter.sendMail({
          to: req.body.email,
          from: 'ugalvez9879@gmail.com',
          subject: 'Reinicio de Password',
          html: `
            <p>Tu has solicitado un reinicio de password</p>
            <p>Has click en el siguiente link <br>
            <a href="http://localhost:3000/resetPassword/${token}">link</a> <br>
            para restablecer tu password.</p>
          `
        });
        res.render('auth/reset-msg', {
          titulo: "Restablecer Password",
          path: "/reset-msg",
          email: email,
        });
      })
      .catch(err => {
        console.log(err);
        const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
      });
  });
};

// Muestra el formulario para establecer un nuevo password
exports.getNuevoPassword = (req, res, next) => {
  const token = req.params.token;
  Usuario.findOne({ tokenReinicio: token, expiracionTokenReinicio: { $gt: Date.now() } })
    .then(usuario => {
      let mensaje = req.flash('error');
      mensaje = mensaje.length > 0 ? mensaje[0] : null;
      res.render('auth/newPassword', {
        path: '/newPassword',
        titulo: 'Nuevo Password',
        mensajeError: mensaje,
        idUsuario: usuario._id.toString(),
        tokenPassword: token
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
    });
};

// Maneja el proceso de actualización de la contraseña
exports.postNuevoPassword = (req, res, next) => {
  const { password, passwordConfirmado, idUsuario, tokenPassword } = req.body;
  let usuarioParaActualizar;

  Usuario.findOne({
    tokenReinicio: tokenPassword,
    expiracionTokenReinicio: { $gt: Date.now() },
    _id: idUsuario
  })
    .then(usuario => {
      usuarioParaActualizar = usuario;
      return bcrypt.hash(password, 12);  // Encripta la nueva contraseña
    })
    .then(hashedPassword => {
      usuarioParaActualizar.password = hashedPassword;
      usuarioParaActualizar.tokenReinicio = undefined;
      usuarioParaActualizar.expiracionTokenReinicio = undefined;
      return usuarioParaActualizar.save();  // Guarda el nuevo password
    })
    .then(result => {
      res.redirect('/login');  // Redirige a login después de actualizar la contraseña
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
    });
};