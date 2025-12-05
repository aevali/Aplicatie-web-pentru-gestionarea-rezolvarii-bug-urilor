const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  repositoryUrl: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
});

module.exports = Project;
