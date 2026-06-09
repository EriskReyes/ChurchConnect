import express from 'express';
import Ministry from '../models/Ministry.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();
let mockMinistries = [];
let ministryId = 100;

const isMongoDBConnected = () => {
  try {
    return mongoose.connection.readyState === 1;
  } catch {
    return false;
  }
};

router.get('/', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const ministries = await Ministry.find().populate('leadId members');
        res.json(ministries);
      } catch (dbError) {
        res.json(mockMinistries);
      }
    } else {
      res.json(mockMinistries);
    }
  } catch (error) {
    console.error('GET /api/ministries error:', error);
    res.json(mockMinistries);
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const ministry = await Ministry.findById(req.params.id).populate('leadId members');
        if (!ministry) throw new Error('Not found');
        res.json(ministry);
      } catch (dbError) {
        const ministry = mockMinistries.find(m => m.id === parseInt(req.params.id) || m._id === req.params.id);
        if (!ministry) return res.status(404).json({ message: 'Ministry not found' });
        res.json(ministry);
      }
    } else {
      const ministry = mockMinistries.find(m => m.id === parseInt(req.params.id) || m._id === req.params.id);
      if (!ministry) return res.status(404).json({ message: 'Ministry not found' });
      res.json(ministry);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const ministry = await Ministry.create(req.body);
        res.status(201).json(ministry);
      } catch (dbError) {
        const newMinistry = { ...req.body, id: ministryId, _id: `mock-${ministryId++}` };
        mockMinistries.push(newMinistry);
        res.status(201).json(newMinistry);
      }
    } else {
      const newMinistry = { ...req.body, id: ministryId, _id: `mock-${ministryId++}` };
      mockMinistries.push(newMinistry);
      res.status(201).json(newMinistry);
    }
  } catch (error) {
    console.error('POST /api/ministries error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Pastor', 'Ministry Leader'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const ministry = await Ministry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(ministry);
      } catch (dbError) {
        const index = mockMinistries.findIndex(m => m.id === parseInt(req.params.id) || m._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Ministry not found' });
        mockMinistries[index] = { ...mockMinistries[index], ...req.body };
        res.json(mockMinistries[index]);
      }
    } else {
      const index = mockMinistries.findIndex(m => m.id === parseInt(req.params.id) || m._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Ministry not found' });
      mockMinistries[index] = { ...mockMinistries[index], ...req.body };
      res.json(mockMinistries[index]);
    }
  } catch (error) {
    console.error('PUT /api/ministries error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        await Ministry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Ministry deleted' });
      } catch (dbError) {
        const index = mockMinistries.findIndex(m => m.id === parseInt(req.params.id) || m._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Ministry not found' });
        mockMinistries.splice(index, 1);
        res.json({ message: 'Ministry deleted' });
      }
    } else {
      const index = mockMinistries.findIndex(m => m.id === parseInt(req.params.id) || m._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Ministry not found' });
      mockMinistries.splice(index, 1);
      res.json({ message: 'Ministry deleted' });
    }
  } catch (error) {
    console.error('DELETE /api/ministries error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
