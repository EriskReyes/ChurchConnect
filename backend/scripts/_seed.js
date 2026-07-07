import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const userSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, status: String, authProvider: String, createdAt: Date, updatedAt: Date }, { strict: false });
const User = mongoose.model('User', userSchema);

await mongoose.connect(process.env.MONGODB_URI);

const salt   = await bcryptjs.genSalt(10);
const hashed = await bcryptjs.hash('Jesus777', salt);

const existing = await User.findOne({ email: 'admin@churchconnect.com' });
if (existing) {
  await User.findByIdAndUpdate(existing._id, { name: 'Admin', role: 'Admin', status: 'Approved', password: hashed });
  console.log('✅ Cuenta Admin actualizada');
} else {
  await User.create({ name: 'Admin', email: 'admin@churchconnect.com', password: hashed, role: 'Admin', status: 'Approved', authProvider: 'local', createdAt: new Date(), updatedAt: new Date() });
  console.log('✅ Cuenta Admin creada');
}

console.log('   Email: admin@churchconnect.com');
console.log('   Pass:  Jesus777');
await mongoose.disconnect();
