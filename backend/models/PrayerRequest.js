import mongoose from 'mongoose';

const prayerRequestSchema = new mongoose.Schema({
  text: { type: String, required: true },
  by: String,
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  category: {
    type: String,
    enum: ['Health', 'Guidance', 'Praise', 'Outreach', 'Youth', 'Family', 'Work', 'Other'],
    default: 'Other'
  },
  prayers: { type: Number, default: 0 },
  answered: { type: Boolean, default: false },
  urgent: { type: Boolean, default: false },
  church: { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('PrayerRequest', prayerRequestSchema);
