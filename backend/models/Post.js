import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  by: String,
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  role: String,
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  pinned: { type: Boolean, default: false },
  image: { type: Boolean, default: false },
  church: { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', postSchema);
