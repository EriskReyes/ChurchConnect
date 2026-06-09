import express from 'express';
import Event from '../models/Event.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();
let mockEvents = [];
let eventId = 1;

const isMongoDBConnected = () => mongoose.connection.readyState === 1;

router.get('/', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const events = await Event.find().populate('leadId');
      res.json(events);
    } else {
      res.json(mockEvents);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const event = await Event.findById(req.params.id).populate('leadId attendeesList');
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    } else {
      const event = mockEvents.find(e => e._id === req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('Admin', 'Pastor', 'Ministry Leader'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const event = await Event.create(req.body);
      const response = { ...event.toObject(), id: event._id.toString() };
      res.status(201).json(response);
    } else {
      const newEvent = { ...req.body, id: eventId, _id: `mock-${eventId++}` };
      mockEvents.push(newEvent);
      res.status(201).json(newEvent);
    }
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Pastor', 'Ministry Leader'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(event);
    } else {
      const index = mockEvents.findIndex(e => e._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Event not found' });
      mockEvents[index] = { ...mockEvents[index], ...req.body };
      res.json(mockEvents[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      await Event.findByIdAndDelete(req.params.id);
      res.json({ message: 'Event deleted' });
    } else {
      const index = mockEvents.findIndex(e => e._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Event not found' });
      mockEvents.splice(index, 1);
      res.json({ message: 'Event deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
