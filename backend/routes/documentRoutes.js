import express from 'express';
import Document from '../models/Document.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();
let mockDocuments = [];
let documentId = 1;

const isMongoDBConnected = () => mongoose.connection.readyState === 1;

router.get('/', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const documents = await Document.find().populate('uploadedBy');
        res.json(documents);
      } catch (dbError) {
        res.json(mockDocuments);
      }
    } else {
      res.json(mockDocuments);
    }
  } catch (error) {
    console.error('GET /api/documents error:', error);
    res.json(mockDocuments);
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const document = await Document.findById(req.params.id).populate('uploadedBy');
        if (!document) throw new Error('Not found');
        res.json(document);
      } catch (dbError) {
        const document = mockDocuments.find(d => d.id === parseInt(req.params.id) || d._id === req.params.id);
        if (!document) return res.status(404).json({ message: 'Document not found' });
        res.json(document);
      }
    } else {
      const document = mockDocuments.find(d => d.id === parseInt(req.params.id) || d._id === req.params.id);
      if (!document) return res.status(404).json({ message: 'Document not found' });
      res.json(document);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        req.body.uploadedBy = req.userId;
        const document = await Document.create(req.body);
        res.status(201).json(document);
      } catch (dbError) {
        const newDocument = { ...req.body, id: documentId, _id: `mock-${documentId++}`, uploadedBy: req.userId };
        mockDocuments.push(newDocument);
        res.status(201).json(newDocument);
      }
    } else {
      const newDocument = { ...req.body, id: documentId, _id: `mock-${documentId++}`, uploadedBy: req.userId };
      mockDocuments.push(newDocument);
      res.status(201).json(newDocument);
    }
  } catch (error) {
    console.error('POST /api/documents error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('Admin', 'Pastor'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        const document = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(document);
      } catch (dbError) {
        const index = mockDocuments.findIndex(d => d.id === parseInt(req.params.id) || d._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Document not found' });
        mockDocuments[index] = { ...mockDocuments[index], ...req.body };
        res.json(mockDocuments[index]);
      }
    } else {
      const index = mockDocuments.findIndex(d => d.id === parseInt(req.params.id) || d._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Document not found' });
      mockDocuments[index] = { ...mockDocuments[index], ...req.body };
      res.json(mockDocuments[index]);
    }
  } catch (error) {
    console.error('PUT /api/documents error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    if (isMongoDBConnected()) {
      try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Document deleted' });
      } catch (dbError) {
        const index = mockDocuments.findIndex(d => d.id === parseInt(req.params.id) || d._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Document not found' });
        mockDocuments.splice(index, 1);
        res.json({ message: 'Document deleted' });
      }
    } else {
      const index = mockDocuments.findIndex(d => d.id === parseInt(req.params.id) || d._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Document not found' });
      mockDocuments.splice(index, 1);
      res.json({ message: 'Document deleted' });
    }
  } catch (error) {
    console.error('DELETE /api/documents error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
