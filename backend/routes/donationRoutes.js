import express from 'express';
import Donation from '../models/Donation.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();
let mockDonations = [];
let donationId = 1;

const isMongoDBConnected = () => mongoose.connection.readyState === 1;

router.get('/', protect, authorize('Admin', 'Pastor', 'Treasurer'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const donations = await Donation.find().populate('donorId recordedBy');
        res.json(donations);
      } catch (dbError) {
        res.json(mockDonations);
      }
    } else {
      res.json(mockDonations);
    }
  } catch (error) {
    console.error('GET /api/donations error:', error);
    res.json(mockDonations);
  }
});

router.get('/:id', protect, authorize('Admin', 'Pastor', 'Treasurer'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const donation = await Donation.findById(req.params.id).populate('donorId recordedBy');
        if (!donation) throw new Error('Not found');
        res.json(donation);
      } catch (dbError) {
        const donation = mockDonations.find(d => d.id === parseInt(req.params.id) || d._id === req.params.id);
        if (!donation) return res.status(404).json({ message: 'Donation not found' });
        res.json(donation);
      }
    } else {
      const donation = mockDonations.find(d => d.id === parseInt(req.params.id) || d._id === req.params.id);
      if (!donation) return res.status(404).json({ message: 'Donation not found' });
      res.json(donation);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('Admin', 'Pastor', 'Treasurer'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        req.body.recordedBy = req.userId;
        const donation = await Donation.create(req.body);
        res.status(201).json(donation);
      } catch (dbError) {
        const newDonation = { ...req.body, id: donationId, _id: `mock-${donationId++}`, recordedBy: req.userId };
        mockDonations.push(newDonation);
        res.status(201).json(newDonation);
      }
    } else {
      const newDonation = { ...req.body, id: donationId, _id: `mock-${donationId++}`, recordedBy: req.userId };
      mockDonations.push(newDonation);
      res.status(201).json(newDonation);
    }
  } catch (error) {
    console.error('POST /api/donations error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Pastor', 'Treasurer'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(donation);
      } catch (dbError) {
        const index = mockDonations.findIndex(d => d.id === parseInt(req.params.id) || d._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Donation not found' });
        mockDonations[index] = { ...mockDonations[index], ...req.body };
        res.json(mockDonations[index]);
      }
    } else {
      const index = mockDonations.findIndex(d => d.id === parseInt(req.params.id) || d._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Donation not found' });
      mockDonations[index] = { ...mockDonations[index], ...req.body };
      res.json(mockDonations[index]);
    }
  } catch (error) {
    console.error('PUT /api/donations error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('Admin', 'Treasurer'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      await Donation.findByIdAndDelete(req.params.id);
      res.json({ message: 'Donation deleted' });
    } else {
      const index = mockDonations.findIndex(d => d.id === parseInt(req.params.id) || d._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Donation not found' });
      mockDonations.splice(index, 1);
      res.json({ message: 'Donation deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
