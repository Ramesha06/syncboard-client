/**
 * In-Memory Seed Data for Boards
 * Defines board ownership and member access lists for ownership validation
 */

export const initialBoards = [
  {
    id: 'BOARD-01',
    title: 'SyncBoard Main Workspace',
    description: 'Collaborative development board for the SyncBoard project team',
    ownerId: 'USR-01',
    members: ['USR-01', 'USR-02', 'USR-03'],
    createdAt: '2025-08-01T08:00:00.000Z',
  },
  {
    id: 'BOARD-02',
    title: 'Executive Strategy Board',
    description: 'Private board restricted to executive team',
    ownerId: 'USR-04',
    members: ['USR-04'],
    createdAt: '2025-08-01T08:00:00.000Z',
  },
];

export default initialBoards;
