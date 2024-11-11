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

const Usuario = require('../models/users')
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
    return res.status(422).render('auth/ingresar', {
      path: '/ingresar',
      titulo: 'Ingresar',
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
        return res.status(422).render('auth/ingresar', {
          path: '/ingresar',
          titulo: 'Ingresar',
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
          res.redirect('/ingresar');
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
};