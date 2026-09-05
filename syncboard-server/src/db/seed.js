import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectDB } from './connect.js';
import User from '../models/User.js';
import Board from '../models/Board.js';
import Task from '../models/Task.js';

const SALT_ROUNDS = 10;
const SEED_PASSWORD = 'password123';

/**
 * Clears the Users, Boards, and Tasks collections and repopulates them
 * with a small, consistent dataset for local development and demos.
 * Run with: npm run db:seed
 */
async function seed() {
    await connectDB();

    console.log('Clearing existing collections...');
    await Promise.all([User.deleteMany({}), Board.deleteMany({}), Task.deleteMany({})]);

    console.log('Seeding users...');
    const hashedPassword = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS);

    const [ramesha, gimhan, kavindu] = await User.create([
        { name: 'Ramesha', email: 'ramesha@syncboard.com', password: hashedPassword, initials: 'RW' },
        { name: 'Gimhan', email: 'gimhan@syncboard.com', password: hashedPassword, initials: 'GT' },
        { name: 'Kavindu', email: 'kavindu@syncboard.com', password: hashedPassword, initials: 'KS' },
    ]);

    console.log('Seeding boards...');
    const mainWorkspace = await Board.create({
        title: 'Main Workspace',
        description: 'Collaborative workspace for the SyncBoard project team',
        ownerId: ramesha._id,
        members: [ramesha._id, gimhan._id, kavindu._id],
    });

    const executiveBoard = await Board.create({
        title: 'Executive Board',
        description: 'Private board restricted to leadership',
        ownerId: ramesha._id,
        members: [ramesha._id],
    });

    // Keep each user's `boards` list in sync with the boards they were just added to
    await User.findByIdAndUpdate(ramesha._id, {
        boards: [mainWorkspace._id, executiveBoard._id],
    });
    await User.findByIdAndUpdate(gimhan._id, { boards: [mainWorkspace._id] });
    await User.findByIdAndUpdate(kavindu._id, { boards: [mainWorkspace._id] });

    console.log('Seeding tasks...');
    // 9 tasks: 3 todo, 3 in_progress, 3 done — spread across the 3 users
    const taskDefs = [
        { title: 'Usability Testing', description: 'Testing app with target users (16-20 y.o)', category: 'UX Design', status: 'todo', dueDate: '2025-08-25', owner: ramesha },
        { title: 'Design Landing Page', description: 'Create hero section and CTA layout', category: 'UI Design', status: 'todo', dueDate: '2025-08-26', owner: gimhan },
        { title: 'Setup CI Pipeline', description: 'Configure GitHub Actions for build and deploy', category: 'Other', status: 'todo', dueDate: '2025-08-27', owner: kavindu },
        { title: 'API Integration', description: 'Connect frontend to REST endpoints', category: 'UI Design', status: 'in_progress', dueDate: '2025-08-28', owner: ramesha },
        { title: 'Database Schema Design', description: 'Define collections and relationships', category: 'Other', status: 'in_progress', dueDate: '2025-08-29', owner: gimhan },
        { title: 'User Authentication', description: 'Implement login and registration flow', category: 'UX Design', status: 'in_progress', dueDate: '2025-08-30', owner: kavindu },
        { title: 'Write Unit Tests', description: 'Add test coverage for core components', category: 'Other', status: 'done', dueDate: '2025-08-20', owner: ramesha },
        { title: 'Project Documentation', description: 'Write setup guide and API docs', category: 'UX Design', status: 'done', dueDate: '2025-08-21', owner: gimhan },
        { title: 'Sprint Planning Meeting', description: 'Plan sprint backlog and assign tasks', category: 'UX Design', status: 'done', dueDate: '2025-08-22', owner: kavindu },
    ];

    const tasks = taskDefs.map(({ owner, ...task }) => ({
        ...task,
        assignee: owner.name,
        assigneeInitials: owner.initials,
        boardId: mainWorkspace._id,
        createdBy: owner._id,
    }));

    await Task.insertMany(tasks);

    console.log('\nSeed complete:');
    console.log(`  Users:  ${await User.countDocuments()}`);
    console.log(`  Boards: ${await Board.countDocuments()}`);
    console.log(`  Tasks:  ${await Task.countDocuments()}`);
    console.log(`\nLogin with any seeded user + password: "${SEED_PASSWORD}"`);
    console.log('  ramesha@syncboard.com / gimhan@syncboard.com / kavindu@syncboard.com');

    await mongoose.connection.close();
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});