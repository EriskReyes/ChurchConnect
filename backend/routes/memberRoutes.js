import express from 'express';
import Member from '../models/Member.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();
let mockMembers = [];
let memberId = 1;

const isMongoDBConnected = () => mongoose.connection.readyState === 1;

router.get('/', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const members = await Member.find().populate('church');
      res.json(members);
    } else {
      res.json(mockMembers);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const member = await Member.findById(req.params.id).populate('church');
      if (!member) return res.status(404).json({ message: 'Member not found' });
      res.json(member);
    } else {
      const member = mockMembers.find(m => m.id === parseInt(req.params.id) || m._id === req.params.id);
      if (!member) return res.status(404).json({ message: 'Member not found' });
      res.json(member);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('Admin', 'Pastor', 'Ministry Leader'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const member = await Member.create(req.body);
      const response = { ...member.toObject(), id: member._id.toString() };
      res.status(201).json(response);
    } else {
      const newMember = { ...req.body, id: memberId, _id: `mock-${memberId++}` };
      mockMembers.push(newMember);
      res.status(201).json(newMember);
    }
  } catch (error) {
    console.error('Member creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Pastor', 'Ministry Leader'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(member);
    } else {
      const index = mockMembers.findIndex(m => m.id === parseInt(req.params.id) || m._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Member not found' });
      mockMembers[index] = { ...mockMembers[index], ...req.body };
      res.json(mockMembers[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      await Member.findByIdAndDelete(req.params.id);
      res.json({ message: 'Member deleted' });
    } else {
      const index = mockMembers.findIndex(m => m.id === parseInt(req.params.id) || m._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Member not found' });
      mockMembers.splice(index, 1);
      res.json({ message: 'Member deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
