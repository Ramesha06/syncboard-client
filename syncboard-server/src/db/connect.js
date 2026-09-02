import mongoose from 'mongoose';
import { config } from '../config/config.js';

export const connectDB = async () => {
  const uri = config.mongodbUri || process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;