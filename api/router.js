const express = require('express');
const controller = require('./authController');
const checkToken = require('./authMiddleware');
const router = express.Router();

router.post('/registration', controller.registration);
router.post('/login', controller.login);
router.get('/users', checkToken, controller.getUsers);

module.exports = router;
