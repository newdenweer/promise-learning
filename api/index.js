const Sequelize = require('sequelize');
const models = require('./models');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.status(200).json('Server is working');
});
app.listen(3000, () => {
	console.log('Server started at 3000');
});
console.log('up');
