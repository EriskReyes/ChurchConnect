import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RoleCode from '../models/RoleCode.js';
import { protect } from '../middleware/authMiddleware.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    await User.create({ name, email, password, role: 'Member', status: 'Pending' });
    res.status(201).json({
      success: true,
      pending: true,
      message: '⏳ Tu cuenta fue creada. El administrador revisará tu solicitud pronto.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Check approval status (skip for existing users without status)
    if (user.status === 'Pending') {
      return res.status(403).json({ message: '⏳ Tu cuenta está pendiente de aprobación del admin' });
    }
    if (user.status === 'Rejected') {
      return res.status(403).json({ message: '❌ Tu solicitud fue rechazada. Contacta al administrador' });
    }
    const token = generateToken(user._id, user.role);
    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential required' });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        user.authProvider = 'google';
        await user.save();
      } else {
        user = await User.create({
          name,
          email,
          googleId,
          authProvider: 'google',
          role: 'Member'
        });
      }
    }

    const token = generateToken(user._id, user.role);
    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(401).json({ message: 'Google authentication failed: ' + error.message });
  }
});

// Usar código para upgrade de rol
router.post('/upgrade-role', protect, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Código requerido' });

    const roleCode = await RoleCode.findOne({ code: code.trim().toUpperCase() });
    if (!roleCode) return res.status(404).json({ message: 'Código inválido' });
    if (roleCode.usedBy) return res.status(400).json({ message: 'Este código ya fue usado' });
    if (roleCode.expiresAt && roleCode.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Este código ha expirado' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { role: roleCode.role },
      { new: true }
    );

    await RoleCode.findByIdAndUpdate(roleCode._id, {
      usedBy: updatedUser.email,
      usedAt: new Date()
    });

    const newToken = generateToken(updatedUser._id, updatedUser.role);
    res.json({
      message: `Ahora eres ${roleCode.role}`,
      role: updatedUser.role,
      token: newToken,
      user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Restaurar rol original al cerrar sesión
router.post('/restore-role', protect, async (req, res) => {
  try {
    const { role } = req.body;
    const allowed = ['Pastor', 'Treasurer', 'Ministry Leader', 'Staff', 'Member', 'Visitor'];
    if (!allowed.includes(role)) return res.status(400).json({ message: 'Rol inválido' });
    await User.findByIdAndUpdate(req.userId, { role });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete account
router.delete('/delete-account', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Account deletion failed: ' + error.message });
  }
});

export default router;
