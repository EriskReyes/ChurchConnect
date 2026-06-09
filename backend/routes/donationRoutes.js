import express from 'express';
import Donation from '../models/Donation.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('Admin', 'Pastor', 'Treasurer'), async (req, res) => {
  try {
    const donations = await Donation.find().populate('donorId recordedBy');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, authorize('Admin', 'Pastor', 'Treasurer'), async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('donorId recordedBy');
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('Admin', 'Pastor', 'Treasurer'), async (req, res) => {
  try {
    req.body.recordedBy = req.userId;
    const donation = await Donation.create(req.body);
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Pastor', 'Treasurer'), async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('Admin', 'Treasurer'), async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Donation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
