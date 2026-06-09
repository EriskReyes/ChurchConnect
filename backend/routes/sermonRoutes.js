import express from 'express';
import Sermon from '../models/Sermon.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();
let mockSermons = [];
let sermonId = 1;

const isMongoDBConnected = () => mongoose.connection.readyState === 1;

router.get('/', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const sermons = await Sermon.find().populate('speakerId');
      res.json(sermons);
    } else {
      res.json(mockSermons);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const sermon = await Sermon.findById(req.params.id).populate('speakerId');
      if (!sermon) return res.status(404).json({ message: 'Sermon not found' });
      res.json(sermon);
    } else {
      const sermon = mockSermons.find(s => s.id === parseInt(req.params.id) || s._id === req.params.id);
      if (!sermon) return res.status(404).json({ message: 'Sermon not found' });
      res.json(sermon);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const sermon = await Sermon.create(req.body);
      const response = { ...sermon.toObject(), id: sermon._id.toString() };
      res.status(201).json(response);
    } else {
      const newSermon = { ...req.body, id: sermonId, _id: `mock-${sermonId++}`, plays: 0 };
      mockSermons.push(newSermon);
      res.status(201).json(newSermon);
    }
  } catch (error) {
    console.error('Sermon creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const sermon = await Sermon.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(sermon);
    } else {
      const index = mockSermons.findIndex(s => s.id === parseInt(req.params.id) || s._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Sermon not found' });
      mockSermons[index] = { ...mockSermons[index], ...req.body };
      res.json(mockSermons[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      await Sermon.findByIdAndDelete(req.params.id);
      res.json({ message: 'Sermon deleted' });
    } else {
      const index = mockSermons.findIndex(s => s.id === parseInt(req.params.id) || s._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Sermon not found' });
      mockSermons.splice(index, 1);
      res.json({ message: 'Sermon deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
