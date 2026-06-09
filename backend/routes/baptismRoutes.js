import express from 'express';
import Baptism from '../models/Baptism.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();
let mockBaptisms = [];
let baptismId = 1;

const isMongoDBConnected = () => mongoose.connection.readyState === 1;

router.get('/', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const baptisms = await Baptism.find();
      res.json(baptisms);
    } else {
      res.json(mockBaptisms);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const baptism = await Baptism.findById(req.params.id);
      if (!baptism) return res.status(404).json({ message: 'Baptism not found' });
      res.json(baptism);
    } else {
      const baptism = mockBaptisms.find(b => b.id === parseInt(req.params.id) || b._id === req.params.id);
      if (!baptism) return res.status(404).json({ message: 'Baptism not found' });
      res.json(baptism);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const baptism = await Baptism.create(req.body);
      const response = { ...baptism.toObject(), id: baptism._id.toString() };
      res.status(201).json(response);
    } else {
      const newBaptism = { ...req.body, id: baptismId, _id: `mock-${baptismId++}` };
      mockBaptisms.push(newBaptism);
      res.status(201).json(newBaptism);
    }
  } catch (error) {
    console.error('Baptism creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const baptism = await Baptism.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(baptism);
    } else {
      const index = mockBaptisms.findIndex(b => b.id === parseInt(req.params.id) || b._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Baptism not found' });
      mockBaptisms[index] = { ...mockBaptisms[index], ...req.body };
      res.json(mockBaptisms[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      await Baptism.findByIdAndDelete(req.params.id);
      res.json({ message: 'Baptism deleted' });
    } else {
      const index = mockBaptisms.findIndex(b => b.id === parseInt(req.params.id) || b._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Baptism not found' });
      mockBaptisms.splice(index, 1);
      res.json({ message: 'Baptism deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
