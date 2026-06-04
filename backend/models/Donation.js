import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donor: String,
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  fund: {
    type: String,
    enum: ['General Tithe', 'Building Fund', 'Missions', 'Benevolence', 'Other'],
    default: 'General Tithe'
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: {
    type: String,
    enum: ['Cash', 'Card', 'Bank', 'Check', 'Online'],
    default: 'Cash'
  },
  recurring: { type: Boolean, default: false },
  frequency: String,
  church: { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Donation', donationSchema);
