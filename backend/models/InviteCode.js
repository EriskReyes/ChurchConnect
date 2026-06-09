import mongoose from 'mongoose';

const inviteCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church',
    required: true
  },
  maxUses: {
    type: Number,
    required: true,
    default: 1
  },
  usedCount: {
    type: Number,
    required: true,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

inviteCodeSchema.methods.isValid = function() {
  return this.usedCount < this.maxUses && new Date() < this.expiresAt;
};

inviteCodeSchema.methods.use = async function() {
  if (!this.isValid()) {
    throw new Error('Invite code is invalid, expired, or has reached maximum uses');
  }
  this.usedCount += 1;
  await this.save();
};

export default mongoose.model('InviteCode', inviteCodeSchema);
