import initialTasks from './tasks.js';
import initialUsers from './users.js';
import initialBoards from './boards.js';

/**
 * Unified Seed Data Export
 * Aggregates initial mock datasets for tasks, users, and boards.
 */
export const seedData = {
  tasks: initialTasks,
  users: initialUsers,
  boards: initialBoards,
};

export { initialTasks, initialUsers, initialBoards };
export default seedData;
