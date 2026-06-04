import mongoose from 'mongoose';

const ministrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  lead: String,
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  color: String,
  meetingTime: String,
  church: { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ministry', ministrySchema);
