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

import mockTasks from '../data/mockTasks';

/**
 * Initial Task State — seeded from mock data
 */
export const initialTaskState = {
  tasks: mockTasks,
  searchQuery: '',
  loading: false,
  error: null,
};
