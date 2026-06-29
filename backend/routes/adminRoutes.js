import express from 'express';
import jwt from 'jsonwebtoken';
import AdminCode from '../models/AdminCode.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const requireAdmin = (req, res, next) => {
  if (req.role !== 'Admin') return res.status(403).json({ message: 'Solo Admin puede hacer esto' });
  next();
};

// Entrar como Admin: verifica contraseña y cambia tu rol a Admin
router.post('/enter', protect, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Contraseña requerida' });

    const doc = await AdminCode.getOrCreate();
    if (doc.code !== code) return res.status(403).json({ message: 'Contraseña incorrecta' });

    const user = await User.findByIdAndUpdate(req.userId, { role: 'Admin' }, { new: true });
    const token = generateToken(user._id, 'Admin');

    res.json({
      message: 'Ahora eres Admin',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: 'Admin' }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los usuarios (solo Admin)
router.get('/users', protect, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cambiar el rol de un usuario (solo Admin)
router.patch('/users/:id/role', protect, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const allowed = ['Admin', 'Pastor', 'Treasurer', 'Ministry Leader', 'Staff', 'Member', 'Visitor'];
    if (!allowed.includes(role)) return res.status(400).json({ message: 'Rol inválido' });

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: `${user.name} ahora es ${role}`, user: { id: user._id, name: user.name, email: user.email, role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cambiar contraseña de admin (solo Admin + contraseña actual)
router.post('/change-code', protect, requireAdmin, async (req, res) => {
  try {
    const { currentCode, newCode } = req.body;
    if (!currentCode || !newCode) return res.status(400).json({ message: 'Se requieren ambos códigos' });
    if (newCode.trim().length < 4) return res.status(400).json({ message: 'La contraseña debe tener al menos 4 caracteres' });

    const doc = await AdminCode.getOrCreate();
    if (doc.code !== currentCode) return res.status(403).json({ message: 'Contraseña actual incorrecta' });

    await AdminCode.setCode(newCode.trim());
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
