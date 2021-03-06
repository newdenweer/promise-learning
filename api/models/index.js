'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
	dialect: 'mysql',
	host: process.env.DB_HOST,
});

fs.readdirSync(__dirname)
	.filter(file => {
		return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
	})
	.forEach(file => {
		const modelPath = path.join(__dirname, file);

		const initFunction = require(modelPath);

		const model = initFunction(sequelize, Sequelize.DataTypes);

		db[model.name] = model;
	});
Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

const syncPromise = sequelize.sync();

syncPromise
	.then(() => {
		console.log('sequelize.sync() is OK');
	})
	.catch(err => console.log(err));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
