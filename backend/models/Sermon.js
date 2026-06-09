import mongoose from 'mongoose';

const sermonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  speaker: String,
  speakerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  series: String,
  date: { type: Date, required: true },
  duration: String,
  scripture: String,
  description: String,
  videoUrl: String,
  audioUrl: String,
  plays: { type: Number, default: 0 },
  tags: [String],
  church: { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Sermon', sermonSchema);
