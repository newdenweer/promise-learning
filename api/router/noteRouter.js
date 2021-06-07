const express = require('express');
const controller = require('../controller/noteController');
const checkToken = require('../middleware/authMiddleware');

const noteRouter = express.Router();

noteRouter.post('/', checkToken, controller.createdNote);
noteRouter.get('/', checkToken, controller.getNote);
noteRouter.put('/', checkToken, controller.updateNote);

module.exports = noteRouter;
