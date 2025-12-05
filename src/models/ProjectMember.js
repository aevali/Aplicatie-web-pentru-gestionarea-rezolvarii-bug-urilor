const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ProjectMember = sequelize.define('ProjectMember', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  role: {
    type: DataTypes.ENUM('MP', 'TST'),
    allowNull: false
  }
});

module.exports = ProjectMember;
