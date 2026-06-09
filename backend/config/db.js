import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/churchconnect');
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Warning: Could not connect to MongoDB: ${error.message}`);
    console.warn('API will run without database - data will not persist');
  }
};
