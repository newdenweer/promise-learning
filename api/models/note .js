'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Note extends Model {
		static associate(models) {
			this.belongsTo(models.User);
			// define association here
		}
	}
	Note.init(
		{
			text: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Note',
		}
	);
	return Note;
};
