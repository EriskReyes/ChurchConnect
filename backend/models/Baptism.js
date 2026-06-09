import mongoose from 'mongoose';

const baptismSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  age: Number,
  ministry: String,
  sponsor: String,
  status: { type: String, enum: ['Scheduled', 'Completed', 'Postponed'], default: 'Scheduled' },
  testimony: String,
  church: { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Baptism', baptismSchema);
