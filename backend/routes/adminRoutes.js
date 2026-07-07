import express from 'express';
import AdminCode from '../models/AdminCode.js';
import User from '../models/User.js';

const router = express.Router();

const checkCode = async (req, res, next) => {
  const code = req.headers['x-admin-code'];
  if (!code) return res.status(401).json({ message: 'Contraseña requerida' });
  const doc = await AdminCode.getOrCreate();
  if (doc.code !== code) return res.status(403).json({ message: 'Contraseña incorrecta' });
  next();
};

// Verificar contraseña (solo valida, no cambia nada)
router.post('/verify-code', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Contraseña requerida' });
    const doc = await AdminCode.getOrCreate();
    if (doc.code !== code) return res.status(403).json({ message: 'Contraseña incorrecta' });
    res.json({ valid: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los usuarios (requiere contraseña)
router.get('/users', checkCode, async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cambiar el rol de un usuario (requiere contraseña)
router.patch('/users/:id/role', checkCode, async (req, res) => {
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

// GET /api/admin/pending-users — usuarios pendientes de aprobación
router.get('/pending-users', checkCode, async (req, res) => {
  try {
    const users = await User.find({ status: 'Pending' }, '-password').sort({ createdAt: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/pending-count — solo el número (sin contraseña)
router.get('/pending-count', async (req, res) => {
  try {
    const count = await User.countDocuments({ status: 'Pending' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/admin/approve-user/:userId — aprobar o rechazar usuario
router.post('/approve-user/:userId', checkCode, async (req, res) => {
  try {
    const { action } = req.body;
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Acción inválida. Usa "approve" o "reject"' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
    const updated = await User.findByIdAndUpdate(
      req.params.userId,
      { status: newStatus, approvedAt: new Date(), approvedBy: 'Admin' },
      { new: true, select: '-password' }
    );

    const msg = action === 'approve' ? '✅ Usuario aprobado' : '❌ Usuario rechazado';
    res.json({ message: msg, user: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cambiar contraseña de admin (requiere contraseña actual)
router.post('/change-code', async (req, res) => {
  try {
    const { currentCode, newCode } = req.body;
    if (!currentCode || !newCode) return res.status(400).json({ message: 'Se requieren ambos campos' });
    if (newCode.trim().length < 4) return res.status(400).json({ message: 'Mínimo 4 caracteres' });
    const doc = await AdminCode.getOrCreate();
    if (doc.code !== currentCode) return res.status(403).json({ message: 'Contraseña actual incorrecta' });
    await AdminCode.setCode(newCode.trim());
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
