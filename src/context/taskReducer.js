import { TASK_ACTIONS } from './taskTypes';

/**
 * Pure reducer function for task management
 *
 * @param {Object} state - Current global task state
 * @param {Object} action - Dispatched action with type and payload
 * @returns {Object} Next state
 */
export function taskReducer(state, action) {
  switch (action.type) {
    case TASK_ACTIONS.SET_TASKS:
      return {
        ...state,
        tasks: Array.isArray(action.payload) ? action.payload : state.tasks,
        loading: false,
        error: null,
      };

    case TASK_ACTIONS.ADD_TASK: {
      const newTask = {
        id: action.payload.id || `TSK-${String(state.tasks.length + 1).padStart(2, '0')}`,
        title: action.payload.title || 'Untitled Task',
        description: action.payload.description || '',
        category: action.payload.category || 'UX Design',
        status: action.payload.status || 'todo',
        dueDate: action.payload.dueDate || 'Today',
        assigneeInitials: action.payload.assigneeInitials || 'ME',
        ...action.payload,
      };
      return {
        ...state,
        tasks: [newTask, ...state.tasks],
        error: null,
      };
    }

    case TASK_ACTIONS.UPDATE_TASK: {
      const updatedTask = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        ),
        error: null,
      };
    }

    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        error: null,
      };

    case TASK_ACTIONS.MOVE_TASK: {
      const { taskId, newStatus } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ),
        error: null,
      };
    }

    case TASK_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: typeof action.payload === 'string' ? action.payload : '',
      };

    case TASK_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: Boolean(action.payload),
      };

    case TASK_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
}
