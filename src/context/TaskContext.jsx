import { useReducer, useMemo, useCallback } from 'react';
import { TaskContext } from './taskContextDef';
import { taskReducer } from './taskReducer';
import { TASK_ACTIONS, initialTaskState } from './taskTypes';

/**
 * TaskProvider Component
 * Wraps children in TaskContext.Provider with state and action helpers
 */
export function TaskProvider({ children, initialData = initialTaskState }) {
  const [state, dispatch] = useReducer(taskReducer, initialData);

  // Memoized action helper methods for convenience
  const addTask = useCallback((taskData) => {
    dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: taskData });
  }, []);

  const updateTask = useCallback((taskData) => {
    dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: taskData });
  }, []);

  const deleteTask = useCallback((taskId) => {
    dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: taskId });
  }, []);

  const moveTask = useCallback((taskId, newStatus) => {
    dispatch({ type: TASK_ACTIONS.MOVE_TASK, payload: { taskId, newStatus } });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: TASK_ACTIONS.SET_SEARCH_QUERY, payload: query });
  }, []);

  const setTasks = useCallback((tasks) => {
    dispatch({ type: TASK_ACTIONS.SET_TASKS, payload: tasks });
  }, []);

  const setLoading = useCallback((isLoading) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: isLoading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: error });
  }, []);

  // Filtered tasks computed property based on search query
  const filteredTasks = useMemo(() => {
    if (!state.searchQuery || state.searchQuery.trim() === '') {
      return state.tasks;
    }
    const query = state.searchQuery.toLowerCase().trim();
    return state.tasks.filter(
      (t) =>
        t.title?.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query) ||
        t.id?.toLowerCase().includes(query)
    );
  }, [state.tasks, state.searchQuery]);

  const value = useMemo(
    () => ({
      // State properties
      tasks: state.tasks,
      filteredTasks,
      searchQuery: state.searchQuery,
      loading: state.loading,
      error: state.error,
      // Dispatch
      dispatch,
      // Action helper methods
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      setSearchQuery,
      setTasks,
      setLoading,
      setError,
    }),
    [
      state.tasks,
      filteredTasks,
      state.searchQuery,
      state.loading,
      state.error,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      setSearchQuery,
      setTasks,
      setLoading,
      setError,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export default TaskProvider;
