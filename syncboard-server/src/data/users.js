/**
 * In-Memory Seed Data for Users
 * Pre-seeded with bcrypt hashed passwords ('password123') and board associations
 */

export const initialUsers = [
  {
    id: 'USR-01',
    name: 'Ramesha',
    email: 'ramesha@syncboard.com',
    // bcrypt hash of 'password123' (10 salt rounds)
    password: '$2b$10$WsBWhePZ4GBp7bvxNwaQzukV4qWzU47yJErfBzMdEuyWCG7iD9Fiu',
    initials: 'RW',
    boards: ['BOARD-01'],
    createdAt: '2025-08-01T08:00:00.000Z',
  },
  {
    id: 'USR-02',
    name: 'Gimhan',
    email: 'gimhan@syncboard.com',
    password: '$2b$10$WsBWhePZ4GBp7bvxNwaQzukV4qWzU47yJErfBzMdEuyWCG7iD9Fiu',
    initials: 'GT',
    boards: ['BOARD-01'],
    createdAt: '2025-08-01T08:00:00.000Z',
  },
  {
    id: 'USR-03',
    name: 'Kavindu',
    email: 'kavindu@syncboard.com',
    password: '$2b$10$WsBWhePZ4GBp7bvxNwaQzukV4qWzU47yJErfBzMdEuyWCG7iD9Fiu',
    initials: 'KS',
    boards: ['BOARD-01'],
    createdAt: '2025-08-01T08:00:00.000Z',
  },
  {
    id: 'USR-04',
    name: 'Alex',
    email: 'alex@otherboard.com',
    password: '$2b$10$WsBWhePZ4GBp7bvxNwaQzukV4qWzU47yJErfBzMdEuyWCG7iD9Fiu',
    initials: 'AO',
    boards: ['BOARD-02'],
    createdAt: '2025-08-01T08:00:00.000Z',
  },
];


export default initialUsers;
