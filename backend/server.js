import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import churchRoutes from './routes/churchRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import ministryRoutes from './routes/ministryRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import sermonRoutes from './routes/sermonRoutes.js';
import baptismRoutes from './routes/baptismRoutes.js';
import prayerRequestRoutes from './routes/prayerRequestRoutes.js';
import postRoutes from './routes/postRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/church', churchRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/ministries', ministryRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/baptisms', baptismRoutes);
app.use('/api/prayer-requests', prayerRequestRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/gallery', galleryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
