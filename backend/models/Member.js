import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  role: {
    type: String,
    enum: ['Pastor', 'Member', 'Ministry Leader', 'Treasurer', 'Staff', 'Visitor'],
    default: 'Member'
  },
  ministry: String,
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'New', 'On Leave', 'Retired'],
    default: 'Active'
  },
  joinDate: { type: Date, default: Date.now },
  baptized: {
    type: String,
    enum: ['Baptized', 'New believer', 'Not yet'],
    default: 'Not yet'
  },
  position: String,
  schedule: String,
  giving: { type: Number, default: 0 },
  group: String,
  church: { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Member', memberSchema);
