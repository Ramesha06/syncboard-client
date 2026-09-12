import mongoose from 'mongoose';
import { connectDB } from './connect.js';
import User from '../models/User.js';
import Board from '../models/Board.js';
import Task from '../models/Task.js';

/**
 * Resets the database by clearing Users, Boards, and Tasks collections
 * without adding predefined accounts or tasks.
 * Run with: npm run db:seed
 */
async function seed() {
    await connectDB();

    console.log('Clearing existing collections (Users, Boards, Tasks)...');
    await Promise.all([User.deleteMany({}), Board.deleteMany({}), Task.deleteMany({})]);

    console.log('\nDatabase reset complete:');
    console.log(`  Users:  ${await User.countDocuments()}`);
    console.log(`  Boards: ${await Board.countDocuments()}`);
    console.log(`  Tasks:  ${await Task.countDocuments()}`);
    console.log('\nDatabase is clean. You can now register a fresh account from the UI.');

    await mongoose.connection.close();
    process.exit(0);
}

seed().catch((err) => {
    console.error('Database reset failed:', err);
    process.exit(1);
});