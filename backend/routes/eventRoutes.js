import express from 'express';
import Event from '../models/Event.js';
import Member from '../models/Member.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// GET /api/events — lista todos los eventos
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/events/:id — detalle de un evento con asistentes populados
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/events — crear evento
router.post('/', protect, authorize('Admin', 'Pastor', 'Ministry Leader', 'Staff'), async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      attendees: 0,
      attendeesList: []
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/events/:id — actualizar evento (incluye attendees count)
router.patch('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/events/:id — reemplazar evento completo
router.put('/:id', protect, authorize('Admin', 'Pastor', 'Ministry Leader'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/events/:id/register — registrar asistentes (sin JWT requerido)
router.post('/:id/register', async (req, res) => {
  try {
    const { memberIds, userId } = req.body;
    const ids = memberIds || (userId ? [userId] : []);

    if (!ids.length) {
      return res.status(400).json({ message: 'Se requiere al menos un ID' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

    const existing = event.attendeesList.map(id => id.toString());
    const newIds = ids.filter(id => !existing.includes(String(id)));

    if (newIds.length === 0) {
      return res.status(400).json({ message: 'Ya estás registrado en este evento' });
    }

    const capacity = event.capacity || 100;
    if (event.attendeesList.length + newIds.length > capacity) {
      return res.status(400).json({ message: `Sin lugares. Quedan ${capacity - event.attendeesList.length}` });
    }

    event.attendeesList.push(...newIds);
    event.attendees = event.attendeesList.length;
    event.updatedAt = new Date();
    await event.save();

    const updated = await Event.findById(event._id);

    res.json({
      message: `Registrado correctamente`,
      event: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/events/:id/register/:memberId — cancelar registro (sin JWT requerido)
router.delete('/:id/register/:memberId', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });

    event.attendeesList = event.attendeesList.filter(
      id => id.toString() !== req.params.memberId
    );
    event.attendees = event.attendeesList.length;
    event.updatedAt = new Date();
    await event.save();

    res.json({ message: 'Registro cancelado', attendees: event.attendees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/events/:id — eliminar evento
router.delete('/:id', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
    res.json({ message: 'Evento eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
