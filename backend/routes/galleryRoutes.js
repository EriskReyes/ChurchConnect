import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();
let mockGallery = [];
let galleryId = 1;

const isMongoDBConnected = () => mongoose.connection.readyState === 1;

router.get('/', async (req, res) => {
  try {
    res.json(mockGallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const image = mockGallery.find(img => img.id === parseInt(req.params.id) || img._id === req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const newImage = { ...req.body, id: galleryId, _id: `mock-${galleryId++}`, uploadedBy: req.userId || "User" };
    mockGallery.push(newImage);
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Gallery error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Pastor', 'Ministry Leader'), async (req, res) => {
  try {
    const index = mockGallery.findIndex(img => img.id === parseInt(req.params.id) || img._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Image not found' });
    mockGallery[index] = { ...mockGallery[index], ...req.body };
    res.json(mockGallery[index]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    const index = mockGallery.findIndex(img => img.id === parseInt(req.params.id) || img._id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Image not found' });
    mockGallery.splice(index, 1);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
