const express = require('express');

const usersController = require('../controllers/users')

const router = express.Router();

router.get('/login', usersController.getLogin)

router.post('/login', usersController.postLogin)

module.exports = router;