const express = require('express');

const { check, body } = require('express-validator');
const Usuario = require('../models/users')

const authController = require('../controllers/auth');

const router = express.Router();

// Ruta para mostrar el formulario de login
router.get('/login', authController.getLogin);

// Ruta para procesar el login del usuario
router.post('/login', 
    [
    body('email').isEmail().withMessage('Por favor ingrese un email válido ejemplo@ejemplo.com').normalizeEmail(),
    body('password').isLength({ min: 5 }).isAlphanumeric().trim(),
    ],
    authController.postLogin
);

// Ruta para mostrar el formulario de registro
router.get('/registrarse', authController.getRegistrarse);

// Ruta para procesar el registro de un nuevo usuario
router.post('/registrarse', [
    check('email')
        .isEmail()
        .withMessage('Por favor ingrese un email válido ejemplo@ejemplo.com')
        .normalizeEmail()
        .custom((value, { req }) => {
            /*
            if (value === 'no-reply@gmail.com') {
                throw new Error('Este email no permitido');
            }
            return true; */
            return Usuario.findOne({ email: value }).then(usuarioDoc => {
                if (usuarioDoc) {
                    return Promise.reject('El email ingresado ya existe');
                }
            });
        }),
    body('nombre', 'Ingrese el nombre')
        .notEmpty()
        .isString(),
    body('apellidoPaterno', 'Ingrese el apellido paterno')
        .isString()
        .notEmpty(),
    body('apellidoMaterno', 'Ingrese el apellido materno')
        .notEmpty()
        .isString(),
    body(
        'password',
        'Por favor ingrese un password que tenga solo letras o números y no menos de 5 caracteres.'
    )
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    body('passwordConfirmado').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Los valores de password no coinciden');
        }
        return true;
    })

],
    authController.postRegistrarse);



// Ruta para procesar la salida del usuario (logout)
router.post('/salir', authController.postSalir);

// Ruta para procesar la solicitud de reset de contraseña
router.post('/resetPassword',
    [body('email').isEmail().withMessage('Por favor ingrese un email válido ejemplo@ejemplo.com').normalizeEmail()],
    authController.postResetPassword
);

// Ruta para procesar el cambio de contraseña con el token
router.post('/newPassword', authController.postNuevoPassword)

module.exports = router;