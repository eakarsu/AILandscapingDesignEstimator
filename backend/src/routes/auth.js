const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
router.use((req, res, next) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 ||
      !/^[A-Za-z0-9][A-Za-z0-9._:-]+$/.test(process.env.GOVERNANCE_TENANT_ID || '')) {
    return res.status(503).json({ error: 'Authentication is not configured' });
  }
  next();
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, tenantId: process.env.GOVERNANCE_TENANT_ID },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, company: user.company, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, company } = req.body;
    if (!email || !password || password.length < 12) return res.status(400).json({ error: 'Valid email and 12-character password required' });
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, company });
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, tenantId: process.env.GOVERNANCE_TENANT_ID },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, company: user.company, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'company', 'role']
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
