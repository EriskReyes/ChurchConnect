import mongoose from 'mongoose';

const roleCodeSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  role: {
    type: String,
    enum: ['Pastor', 'Admin', 'Treasurer', 'Ministry Leader', 'Staff'],
    required: true
  },
  usedBy: { type: String, default: null },
  usedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

export default mongoose.model('RoleCode', roleCodeSchema);
