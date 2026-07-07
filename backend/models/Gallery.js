import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, default: 'General' },
  type: { type: String, enum: ['photo', 'video'], default: 'photo' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  uploadedBy: { type: String, default: 'Unknown' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Gallery', gallerySchema);
