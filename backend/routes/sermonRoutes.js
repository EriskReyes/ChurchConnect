import express from 'express';
import Sermon from '../models/Sermon.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sermons = await Sermon.find();
    res.json(sermons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) return res.status(404).json({ message: 'Sermon not found' });
    res.json(sermon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const sermon = await Sermon.create(req.body);
    res.status(201).json(sermon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(sermon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Sermon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sermon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
