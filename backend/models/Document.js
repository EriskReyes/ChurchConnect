import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['Finance', 'Policy', 'Members', 'Children', 'Other'],
    default: 'Other'
  },
  size: String,
  by: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  access: {
    type: String,
    enum: ['All', 'Leadership', 'Ministry', 'Private'],
    default: 'All'
  },
  url: String,
  church: { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', documentSchema);
