import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from '../config/config.js';
import Board from '../models/Board.js';

let mongod = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // 1. If explicit Atlas or custom MONGODB_URI is provided, try connecting to it
  if (uri && !uri.includes('localhost:27017')) {
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`[DB] Connected to MongoDB Atlas: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.warn(`[DB Warning] Failed to connect to MONGODB_URI: ${error.message}`);
      console.log('[DB] Falling back to automated in-memory MongoDB...');
    }
  }

  // 2. Automated in-memory MongoDB fallback
  try {
    mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`[DB] Connected to automated In-Memory MongoDB at: ${memUri}`);

    // Seed initial default board so GET /api/boards returns an accessible board right away
    const boardCount = await Board.countDocuments();
    if (boardCount === 0) {
      await Board.create({
        title: 'SyncBoard Main Workspace',
        description: 'Collaborative development board for the SyncBoard project team',
        ownerId: new mongoose.Types.ObjectId(),
        members: [],
      });
      console.log('[DB] Seeded initial default board workspace.');
    }

    return conn;
  } catch (error) {
    console.error(`[DB Error] Could not initialize in-memory database: ${error.message}`);
    return null;
  }
};

export default connectDB;