const express = require('express');
const router = express.Router();
const { User } = require('../models');

// REGISTER
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
