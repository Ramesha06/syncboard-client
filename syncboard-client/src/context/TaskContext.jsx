import { useContext, useReducer, useEffect, useCallback } from 'react';

import { taskApi } from '../api/taskApi';
import { TaskContext } from './taskContextDef';
import { TASK_ACTIONS } from './taskTypes';
import { useAuth } from './AuthContext';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

function taskReducer(state, action) {
  switch (action.type) {
    case TASK_ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };
    case TASK_ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, tasks: action.payload, error: null };
    case TASK_ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case TASK_ACTIONS.ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task)),
      };
    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'RESET_TASKS':
      return initialState;
    default:
      return state;
  }
}

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { isAuthenticated } = useAuth();

  const fetchTasks = useCallback(async (filters = {}) => {
    if (!localStorage.getItem('token') && !localStorage.getItem('syncboard_token')) {
      dispatch({ type: 'RESET_TASKS' });
      return;
    }

    dispatch({ type: TASK_ACTIONS.FETCH_START });
    try {
      const response = await taskApi.getAll(filters);
      const list = Array.isArray(response)
        ? response
        : response?.items || response?.data || response?.tasks || [];
      dispatch({ type: TASK_ACTIONS.FETCH_SUCCESS, payload: list });
    } catch (err) {
      dispatch({ type: TASK_ACTIONS.FETCH_ERROR, payload: err.message || 'Failed to load tasks' });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      dispatch({ type: 'RESET_TASKS' });
    }
  }, [isAuthenticated, fetchTasks]);

  const addTask = async (taskData) => {
    const created = await taskApi.create(taskData);
    const newTask = created.data || created;
    dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: newTask });
    return newTask;
  };

  const updateTask = async (id, updates) => {
    const updated = await taskApi.update(id, updates);
    const task = updated.data || updated;
    dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: task });
    return task;
  };

  const moveTask = async (id, newStatus) => {
    return updateTask(id, { status: newStatus });
  };

  const deleteTask = async (id) => {
    await taskApi.delete(id);
    dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: id });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        loading: state.loading,
        error: state.error,
        fetchTasks,
        addTask,
        updateTask,
        moveTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);

export default TaskProvider;

