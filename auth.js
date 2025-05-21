const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = 'secret123'; 


const users = [];

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find(user => user.username === username);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: 'Invalid username or password' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ message: 'Invalid username or password' });

  const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });

  res.json({ token });
});

module.exports = router;

const verifyToken = require('./authMiddleware');

router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}, you have access!` });
});
