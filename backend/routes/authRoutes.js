import express from 'express';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const users = new Map([
  ['pastor.james@example.com', { id: 'user_1', name: 'Pastor James', email: 'pastor.james@example.com', password: 'password', role: 'Admin' }]
]);

router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (users.has(email)) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const id = `user_${Date.now()}`;
  const user = { id, name, email, password, role: role || 'Member' };
  users.set(email, user);

  const token = generateToken(id, user.role);
  res.status(201).json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = users.get(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user.id, user.role);
  res.status(200).json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

router.get('/me', protect, (req, res) => {
  res.status(200).json({ success: true, user: { id: req.userId } });
});

export default router;
