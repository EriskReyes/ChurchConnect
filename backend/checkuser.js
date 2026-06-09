import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const users = await User.find({});
console.log(users.map(u => ({ email: u.email, pass: u.password.substring(0, 30) })));
await mongoose.connection.close();