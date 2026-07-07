import express from 'express';
import Ministry from '../models/Ministry.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const ministries = await Ministry.find();
    res.json(ministries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.id);
    if (!ministry) return res.status(404).json({ message: 'Ministry not found' });
    res.json(ministry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const ministry = await Ministry.create(req.body);
    res.status(201).json(ministry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const ministry = await Ministry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ministry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Ministry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ministry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
