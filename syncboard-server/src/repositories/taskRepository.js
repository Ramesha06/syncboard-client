import initialTasks from '../data/tasks.js';

/**
 * TaskRepository
 * Layered architecture repository encapsulating all data operations on tasks.
 * Stores tasks in-memory and provides isolated CRUD operations.
 */
class TaskRepository {
  constructor() {
    // Clone initial tasks so mutations are isolated
    this.tasks = initialTasks.map((t) => ({ ...t }));
    this.idCounter = this.tasks.length + 1;
  }

  /**
   * Retrieve all tasks
   * @returns {Array<Object>} List of task objects
   */
  async findAll() {
    return this.tasks.map((t) => ({ ...t }));
  }

  /**
   * Find a single task by its ID
   * @param {string} id - Task ID (e.g. 'TSK-01')
   * @returns {Object|null} Task object or null if not found
   */
  async findById(id) {
    const task = this.tasks.find((t) => t.id === id);
    return task ? { ...task } : null;
  }

  /**
   * Find all tasks belonging to a specific board
   * @param {string} boardId - Board ID (e.g. 'BOARD-01')
   * @returns {Array<Object>} List of tasks belonging to the board
   */
  async findByBoardId(boardId) {
    return this.tasks
      .filter((t) => t.boardId === boardId)
      .map((t) => ({ ...t }));
  }

  /**
   * Create a new task
   * @param {Object} taskData - Properties of the new task
   * @returns {Object} Newly created task object
   */
  async create(taskData) {
    const paddedIndex = String(this.idCounter++).padStart(2, '0');
    const newId = taskData.id || `TSK-${paddedIndex}`;
    const now = new Date().toISOString();

    const newTask = {
      id: newId,
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category || 'Other',
      assignee: taskData.assignee || 'Unassigned',
      assigneeInitials: taskData.assigneeInitials || (taskData.assignee ? taskData.assignee.substring(0, 2).toUpperCase() : 'UN'),
      status: taskData.status || 'todo',
      dueDate: taskData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      boardId: taskData.boardId || 'BOARD-01',
      createdBy: taskData.createdBy || 'USR-01',
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.push(newTask);
    return { ...newTask };
  }

  /**
   * Update an existing task by ID
   * @param {string} id - Task ID to update
   * @param {Object} updatedFields - Fields to update
   * @returns {Object|null} Updated task or null if not found
   */
  async update(id, updatedFields) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existingTask = this.tasks[index];
    const updatedTask = {
      ...existingTask,
      ...updatedFields,
      id: existingTask.id, // Prevent ID mutation
      createdAt: existingTask.createdAt, // Preserve creation timestamp
      updatedAt: new Date().toISOString(),
    };

    if (updatedFields.assignee && !updatedFields.assigneeInitials) {
      updatedTask.assigneeInitials = updatedFields.assignee.substring(0, 2).toUpperCase();
    }

    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  /**
   * Delete a task by ID
   * @param {string} id - Task ID to remove
   * @returns {boolean} True if deleted, false if not found
   */
  async delete(id) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }

  /**
   * Count total tasks
   * @returns {number}
   */
  async count() {
    return this.tasks.length;
  }

  /**
   * Reset repository to initial seed state
   */
  async reset() {
    this.tasks = initialTasks.map((t) => ({ ...t }));
    this.idCounter = this.tasks.length + 1;
  }
}

// Export a singleton instance for in-memory persistence across requests
export default new TaskRepository();
