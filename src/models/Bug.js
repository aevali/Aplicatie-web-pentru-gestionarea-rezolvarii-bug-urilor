const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Bug = sequelize.define('Bug', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  severity: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'),
    allowNull: false,
    defaultValue: 'OPEN'
  },
  reportCommitUrl: { type: DataTypes.STRING },
  resolveCommitUrl: { type: DataTypes.STRING }
});

module.exports = Bug;
