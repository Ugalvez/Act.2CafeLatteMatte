const express = require('express');

const { check, body } = require('express-validator');
const Usuario = require('../models/users')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', 
    [
    body('email')
        .isEmail()
        .withMessage('Por favor ingrese un email valido')
        .normalizeEmail(),
    body(
        'password',
        'Por favor ingrese un password que tenga solo letras o números y no menos de 5 caracteres.'
    )
        .isLength({ min: 5 })
        .trim()
        .isAlphanumeric(),
    ],
    authController.postLogin);


module.exports = router;