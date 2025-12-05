const sequelize = require('../db');
const User = require('./User');
const Project = require('./Project');
const ProjectMember = require('./ProjectMember');
const Bug = require('./Bug');

// RELATIONS

Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasMany(Project, { as: 'ownedProjects', foreignKey: 'ownerId' });

ProjectMember.belongsTo(User);
User.hasMany(ProjectMember);

ProjectMember.belongsTo(Project);
Project.hasMany(ProjectMember);

Bug.belongsTo(Project);
Project.hasMany(Bug);

Bug.belongsTo(User, { as: 'reporter', foreignKey: 'reporterId' });
User.hasMany(Bug, { as: 'reportedBugs', foreignKey: 'reporterId' });

Bug.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });
User.hasMany(Bug, { as: 'assignedBugs', foreignKey: 'assigneeId' });

module.exports = {
  sequelize,
  User,
  Project,
  ProjectMember,
  Bug
};
