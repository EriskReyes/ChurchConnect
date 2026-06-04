import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  time: String,
  location: String,
  ministry: String,
  attendees: { type: Number, default: 0 },
  capacity: { type: Number, default: 100 },
  status: {
    type: String,
    enum: ['Planning', 'Upcoming', 'Past', 'Cancelled'],
    default: 'Planning'
  },
  recurring: { type: Boolean, default: false },
  lead: String,
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  church: { type: mongoose.Schema.Types.ObjectId, ref: 'Church' },
  attendeesList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema);
