/*exports.getLogin = (req, res, next) => {
    //console.log(req.session.autenticado);
    res.render('../views/login', {
      path: '/login',
      titulo: 'Ingresar'
    });
  };

exports.postLogin = (req, res, next) => {
    //res.setHeader('Set-Cookie', 'autenticado=true');
    //res.setHeader('Set-Cookie', 'autenticado=true; HttpOnly');
    //res.setHeader('Set-Cookie', 'autenticado=true; HttpOnly; Secure');
    req.session.autenticado = true;
    res.redirect('/');
};*/

const Usuario = require('../models/users');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { check, body } = require('express-validator');
const { validationResult } = require('express-validator');



const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');


// AQUI_SE_PONE_EL_API_KEY
const APIKEY = '';

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        APIKEY
    }
  })
);


exports.getLogin = (req, res, next) => {
  let mensaje = req.flash('error');
  if (mensaje.length > 0) {
    mensaje = mensaje[0];
  } else {
    mensaje = null;
  }
  res.render('auth/login', {
    path: '/login',
    titulo: 'Log-in',
    autenticado: false,
    mensajeError: mensaje,
    datosAnteriores: {
      email: '',
      password: ''
    },
    erroresValidacion: []
  });
};


exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      titulo: 'Log-in',
      mensajeError: errors.array()[0].msg,
      datosAnteriores: {
        email: email,
        password: password
      },
      erroresValidacion: errors.array()
    });
  }

  Usuario.findOne({ email: email })
    .then(usuario => {
      if (!usuario) {
        return res.status(422).render('auth/login', {
          path: '/login',
          titulo: 'Log-in',
          mensajeError: 'Invalido email o password.',
          datosAnteriores: {
            email: email,
            password: password
          },
          erroresValidacion: []
        });
      }
      bcrypt.compare(password, usuario.password)
        .then(hayCoincidencia => {
          if (hayCoincidencia) {
            req.session.autenticado = true;
            req.session.usuario = usuario;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/')
            })
          }
          req.flash('error', 'Las credenciales son invalidas')
          res.redirect('/login');
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
};

exports.getRegistrarse = (req, res, next) => {
  let mensaje = req.flash('error');
  if (mensaje.length > 0) {
    mensaje = mensaje[0];
  } else {
    mensaje = null;
  }
  res.render('auth/registrarse',{
    titulo: "Registrarse",
    path: "/registrarse",
    autenticado: false,
    mensajeError: mensaje,
    datosAnteriores: {
      nombre: '',
      fechaNacimiento: '',
      email: '',
      password: ''
    },
    erroresValidacion: []
  })
}

exports.postRegistrarse = (req, res, next) => {
  const nombre = req.body.nombre;
  const apellidoPaterno = req.body.apellidoPaterno;
  const apellidoMaterno = req.body.apellidoMaterno;
  const fechaNacimiento = req.body.fechaNacimiento;
  const email = req.body.email;
  const rol = req.session.usuario && req.session.usuario.rol === 'administrador' ? req.body.rol : 'lector';
  const password = req.body.password;
  const passwordConfirmado = req.body.passwordConfirmado;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('registrarse', {
      path: '/registrarse',
      titulo: 'Registrarse',
      mensajeError: errors.array()[0].msg,
      erroresValidacion: errors.array(),
      datosAnteriores: {
        nombre: nombre,
        apellidoPaterno: apellidoPaterno,
        apellidoMaterno: apellidoMaterno,
        fechaNacimiento: fechaNacimiento,
        email: email,
        rol: rol,
        password: password,
        passwordConfirmado: passwordConfirmado,

      }
    });
  }
  
  bcrypt.hash(password, 13)
    .then(passwordCifrado => {
      const user = new Usuario({
        nombre: nombre,
        apellidoPaterno: apellidoPaterno,
        apellidoMaterno: apellidoMaterno,
        fechaNacimiento: fechaNacimiento,
        email: email,
        rol: rol,
        password: passwordCifrado,
        carrito: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

};

exports.postSalir = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}
