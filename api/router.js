const express = require('express');
const controller = require('./authController');
const router = express.Router();

router.post('/registration', controller.registration);
router.post('/login', controller.login);

module.exports = router;
