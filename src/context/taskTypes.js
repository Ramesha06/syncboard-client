/**
 * Action types for Task State Management
 * Following Session 01 React Frontend Frameworks patterns
 */
export const TASK_ACTIONS = {
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  MOVE_TASK: 'MOVE_TASK',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

/**
 * Default mock tasks for SyncBoard JERRAA Design Template
 */
export const INITIAL_TASKS = [
  {
    id: 'TSK-01',
    title: 'Usability Testing',
    description: 'Testing App ke user (16-20 y.o)',
    category: 'UX Design',
    status: 'todo',
    dueDate: '09 Nov 2021',
    assigneeInitials: 'RW',
  },
  {
    id: 'TSK-02',
    title: 'Designing 3D Travel App',
    description: 'Membuat 3D Design untuk Aplikasi Travel App.',
    category: '3D Design',
    status: 'todo',
    dueDate: '10 Nov 2021',
    assigneeInitials: 'MB',
  },
  {
    id: 'TSK-03',
    title: 'Wireframe Landing Page',
    description: 'Wireframing desktop & mobile views',
    category: 'UX Design',
    status: 'todo',
    dueDate: '10 Nov 2021',
    assigneeInitials: 'DS',
  },
  {
    id: 'TSK-04',
    title: 'Landing Page Brainout',
    description: 'Redesign main marketing page',
    category: 'UI Design',
    status: 'in_progress',
    dueDate: '12-14 Nov 2021',
    assigneeInitials: 'M2',
  },
  {
    id: 'TSK-05',
    title: 'Designing 3D Envato Assets',
    description: 'Set Tema, Set Character, Membuat color pallete',
    category: '3D Design',
    status: 'in_progress',
    dueDate: '12-15 Nov 2021',
    assigneeInitials: 'M3',
  },
  {
    id: 'TSK-06',
    title: 'Flat Illustration Hero Pack',
    description: 'Ilustrasi simple untuk marketing',
    category: 'Illustration',
    status: 'in_review',
    dueDate: '12 Nov 2021',
    assigneeInitials: 'M4',
  },
  {
    id: 'TSK-07',
    title: 'Wireframing Mobile Flow',
    description: 'Selesai wireframe & user journey',
    category: 'UX Design',
    status: 'in_review',
    dueDate: '11 Nov 2021',
    assigneeInitials: 'M9',
  },
  {
    id: 'TSK-08',
    title: 'Component Library & Design Tokens',
    description: 'DS setup completed',
    category: 'UI Design',
    status: 'done',
    dueDate: '08 Nov 2021',
    assigneeInitials: 'M1',
  },
];

/**
 * Initial Task State
 */
export const initialTaskState = {
  tasks: INITIAL_TASKS,
  searchQuery: '',
  loading: false,
  error: null,
};
