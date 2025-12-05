const express = require('express');
const router = express.Router();
const { Project, ProjectMember, User, Bug } = require('../models');

// CREATE PROJECT
router.post('/', async (req, res, next) => {
  try {
    const { name, repositoryUrl, description, ownerId } = req.body;
    const project = await Project.create({ name, repositoryUrl, description, ownerId });

    // owner becomes a member (MP)
    await ProjectMember.create({ UserId: ownerId, ProjectId: project.id, role: 'MP' });

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

// LIST PROJECTS
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// GET PROJECT DETAILS
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: ProjectMember, include: User },
        Bug
      ]
    });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// ADD MEMBER
router.post('/:id/members', async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    const m = await ProjectMember.create({ UserId: userId, ProjectId: req.params.id, role });
    res.status(201).json(m);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
