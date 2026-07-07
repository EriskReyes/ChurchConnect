import express from 'express';
import PrayerRequest from '../models/PrayerRequest.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const prayers = await PrayerRequest.find().sort({ createdAt: -1 });
    res.json(prayers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const prayer = await PrayerRequest.findById(req.params.id);
    if (!prayer) return res.status(404).json({ message: 'Prayer request not found' });
    res.json(prayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const prayer = await PrayerRequest.create(req.body);
    res.status(201).json(prayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const prayer = await PrayerRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(prayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await PrayerRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prayer request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
