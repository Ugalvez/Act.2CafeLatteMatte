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
  mensaje = mensaje.length > 0 ? mensaje[0] : null;
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
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      titulo: 'Log-in',
      mensajeError: errors.array()[0].msg,
      datosAnteriores: { email, password },
      erroresValidacion: errors.array()
    });
  }

  Usuario.findOne({ email })
    .then(usuario => {
      if (!usuario) {
        return res.status(422).render('auth/login', {
          path: '/login',
          titulo: 'Log-in',
          mensajeError: 'Email o password inválidos.',
          datosAnteriores: { email, password },
          erroresValidacion: []
        });
      }
      //Hasheo de login - SEGURIDAD
      bcrypt.compare(password, usuario.password)
        .then(hayCoincidencia => {
          if (hayCoincidencia) {
            req.session.autenticado = true;
            req.session.usuario = usuario;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Email o password inválidos.');
          res.redirect('/login');
        })
        .catch(err => {
          console.error('Error durante la autenticación:', err); // Agregado para depuración
          const error = new Error('Error interno del servidor');
          error.httpStatusCode = 500;
          return next(error);
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
    autenticado: req.session.usuario,
    mensajeError: mensaje,
    datosAnteriores: { nombre: '', fechaNacimiento: '', email: '', password: '' },
    erroresValidacion: []
  });
};

// Maneja el proceso de registro
exports.postRegistrarse = (req, res, next) => {
  const { nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, email, password, passwordConfirmado } = req.body;
  const rol = req.session.usuario && req.session.usuario.rol === 'administrador' ? req.body.rol : 'cliente';

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/registrarse', {
      path: '/registrarse',
      titulo: 'Registrarse',
      mensajeError: errors.array()[0].msg,
      erroresValidacion: errors.array(),
      datosAnteriores: { nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, email, rol, password, passwordConfirmado }
    });
  }
  //Encriptado de CONTRASEÑAS - SEGURIDAD
  bcrypt.hash(password, 13)
    .then(passwordCifrado => {
      const user = new Usuario({
        nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, email, rol, password: passwordCifrado, carrito: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: 'ugalvez9879@gmail.com',
        subject: '¡Registro exitoso!',
        html: '<h2>¡Bienvenido a Café Latte Mate!</h2>'
      });
    })
    .catch(err => {
      console.error('Error durante el registro de usuario:', err); // Agregado para depuración
      const error = new Error('Error interno del servidor');
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Maneja el logout
exports.postSalir = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
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
    console.log(errors.array());
    return res.status(422).render('auth/reset', {
      path: '/resetPassword',
      titulo: 'Recuperar contraseña',
      mensajeError: errors.array()[0].msg,
      erroresValidacion: errors.array(),
      datosAnteriores: { email }
    });
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.error('Error al generar el token:', err); // Agregado para depuración
      const error = new Error('Error interno del servidor');
      error.httpStatusCode = 500;
      return next(error);
    }
    const token = buffer.toString('hex');
    Usuario.findOne({ email: req.body.email })
      .then(usuario => {
        if (!usuario) {
          req.flash('error', 'No se encontró usuario con dicho email');
          return res.redirect('/resetPassword');
        }
        usuario.tokenReinicio = token;
        usuario.expiracionTokenReinicio = Date.now() + 3600000;
        return usuario.save();
      })
      .then(result => {
        if (!result) return;
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
        console.error('Error durante el proceso de reinicio de password:', err); // Agregado para depuración
        const error = new Error('Error interno del servidor');
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
      console.error('Error al mostrar formulario de nuevo password:', err); // Agregado para depuración
      const error = new Error('Error interno del servidor');
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
      return bcrypt.hash(password, 12);
    })
    .then(hashedPassword => {
      usuarioParaActualizar.password = hashedPassword;
      usuarioParaActualizar.tokenReinicio = undefined;
      usuarioParaActualizar.expiracionTokenReinicio = undefined;
      return usuarioParaActualizar.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.error('Error durante la actualización de la contraseña:', err); // Agregado para depuración
      const error = new Error('Error interno del servidor');
      error.httpStatusCode = 500;
      return next(error);
    });
};