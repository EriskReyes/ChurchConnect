import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const user = await User.findOne({ email: 'pastor@gracecc.org' });
const isMatch = await user.comparePassword('password123');
console.log('Password match:', isMatch);
await mongoose.connection.close();