import { useContext } from 'react';
import { TaskContext } from './taskContextDef';

/**
 * Custom Hook: useTasks
 * Provides easy access to global task state and action dispatchers.
 */
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

/**
 * Alias for useTasks
 */
export const useTaskContext = useTasks;
