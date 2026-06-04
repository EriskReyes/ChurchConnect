import express from 'express';
import Church from '../models/Church.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const churches = await Church.find();
    res.json(churches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const church = await Church.findById(req.params.id);
    if (!church) return res.status(404).json({ message: 'Church not found' });
    res.json(church);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    const church = await Church.create(req.body);
    res.status(201).json(church);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    const church = await Church.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(church);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    await Church.findByIdAndDelete(req.params.id);
    res.json({ message: 'Church deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
