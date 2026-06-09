import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

const events = [];

router.get('/', (req, res) => {
  res.json(events);
});

router.get('/:id', (req, res) => {
  const event = events.find(e => e._id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

router.post('/', protect, authorize('Admin', 'Pastor', 'Ministry Leader'), (req, res) => {
  const event = {
    _id: `event_${Date.now()}`,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  events.push(event);
  res.status(201).json(event);
});

router.put('/:id', protect, authorize('Admin', 'Pastor', 'Ministry Leader'), (req, res) => {
  const idx = events.findIndex(e => e._id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Event not found' });
  events[idx] = { ...events[idx], ...req.body, updatedAt: new Date() };
  res.json(events[idx]);
});

router.delete('/:id', protect, authorize('Admin', 'Pastor'), (req, res) => {
  const idx = events.findIndex(e => e._id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Event not found' });
  events.splice(idx, 1);
  res.json({ message: 'Event deleted' });
});

export default router;
