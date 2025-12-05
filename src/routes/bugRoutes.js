const express = require('express');
const router = express.Router();
const { Bug, Project, User } = require('../models');

// CREATE BUG
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      description,
      severity,
      priority,
      reportCommitUrl,
      projectId,
      reporterId
    } = req.body;

    const bug = await Bug.create({
      title,
      description,
      severity,
      priority,
      reportCommitUrl,
      ProjectId: projectId,
      reporterId
    });

    res.status(201).json(bug);
  } catch (err) {
    next(err);
  }
});

// ASSIGN BUG
router.patch('/:id/assign', async (req, res, next) => {
  try {
    const { assigneeId } = req.body;
    const bug = await Bug.findByPk(req.params.id);
    bug.assigneeId = assigneeId;
    bug.status = 'IN_PROGRESS';
    await bug.save();
    res.json(bug);
  } catch (err) {
    next(err);
  }
});

// RESOLVE BUG
router.patch('/:id/resolve', async (req, res, next) => {
  try {
    const { resolveCommitUrl } = req.body;
    const bug = await Bug.findByPk(req.params.id);
    bug.resolveCommitUrl = resolveCommitUrl;
    bug.status = 'RESOLVED';
    await bug.save();
    res.json(bug);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
