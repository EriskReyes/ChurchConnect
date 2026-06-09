import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/churchconnect', {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('⚠️  Using in-memory database for development');
    // Continúa sin salir - usará mongoose en memoria
  }
};
