import taskRepository from '../repositories/taskRepository.js';
import boardRepository from '../repositories/boardRepository.js';
import AppError from '../utils/AppError.js';

const SORTABLE_FIELDS = new Set(['dueDate', 'title']);

/**
 * Confirms `userId` belongs to `boardId` before allowing a read or write.
 * A missing board means there's nothing to read/write, so it's treated the
 * same as a missing task; a board that exists but doesn't include the user
 * is a straightforward access denial.
 * @param {string} boardId - Board ID (e.g. 'BOARD-01')
 * @param {string} userId - Requesting user's ID
 * @returns {Promise<Object>} The board, once membership is confirmed
 * @throws {AppError} 404 if the board doesn't exist, 403 if not a member
 */
async function assertBoardMembership(boardId, userId) {
  const board = await boardRepository.findById(boardId);
  if (!board) {
    throw new AppError('Task not found', 404);
  }

  const isMember = await boardRepository.isUserMember(boardId, userId);
  if (!isMember) {
    throw new AppError('Forbidden', 403);
  }

  return board;
}

/**
 * Loads a task by ID and verifies the requesting user belongs to the
 * task's board. Used by every single-task read/write operation.
 * @param {string} taskId - Task ID (e.g. 'TSK-01')
 * @param {string} userId - Requesting user's ID
 * @returns {Promise<Object>} The task, once ownership is confirmed
 * @throws {AppError} 404 if the ID is missing/unknown, 403 if not a board member
 */
async function getOwnedTaskOrThrow(taskId, userId) {
  if (!taskId) {
    throw new AppError('Task not found', 404);
  }

  const task = await taskRepository.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  await assertBoardMembership(task.boardId, userId);
  return task;
}

/**
 * Applies `?status=` and `?assignee=` filters to a task collection.
 * Both are optional, case-insensitive exact matches; omitted filters
 * pass everything through.
 * @param {Array<Object>} tasks
 * @param {{status?: string, assignee?: string}} filters
 * @returns {Array<Object>}
 */
function applyFilters(tasks, { status, assignee } = {}) {
  return tasks.filter((task) => {
    const matchesStatus = status
      ? String(task.status).toLowerCase() === String(status).toLowerCase()
      : true;

    const matchesAssignee = assignee
      ? String(task.assignee).toLowerCase() === String(assignee).toLowerCase()
      : true;

    return matchesStatus && matchesAssignee;
  });
}

/**
 * Sorts tasks per `?sort=dueDate:asc|desc` or `?sort=title:asc|desc`.
 * Unrecognized or missing sort params leave the collection order untouched.
 * @param {Array<Object>} tasks
 * @param {string} [sort] - e.g. "dueDate:asc", "title:desc"
 * @returns {Array<Object>} A new, sorted array (input is not mutated)
 */
function applySort(tasks, sort) {
  if (!sort) return tasks;

  const [field, rawDirection] = sort.split(':');
  if (!SORTABLE_FIELDS.has(field)) return tasks;

  const direction = rawDirection?.toLowerCase() === 'desc' ? -1 : 1;

  return [...tasks].sort((a, b) => {
    const aValue = field === 'dueDate' ? new Date(a[field]).getTime() : String(a[field] ?? '');
    const bValue = field === 'dueDate' ? new Date(b[field]).getTime() : String(b[field] ?? '');

    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });
}

/**
 * Slices a collection per `?page=` / `?limit=` and reports totals.
 * Defaults to page 1 / limit 10; invalid values fall back to the defaults
 * rather than throwing, since pagination params are a convenience, not a
 * contract the caller must get exactly right.
 * @param {Array<Object>} tasks
 * @param {{page?: number|string, limit?: number|string}} pagination
 * @returns {{items: Array<Object>, total: number, page: number, limit: number, pageCount: number}}
 */
function applyPagination(tasks, { page, limit } = {}) {
  const total = tasks.length;

  const parsedPage = Number.parseInt(page, 10);
  const parsedLimit = Number.parseInt(limit, 10);

  const safePage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const safeLimit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;

  const pageCount = Math.max(Math.ceil(total / safeLimit), 1);
  const start = (safePage - 1) * safeLimit;
  const items = tasks.slice(start, start + safeLimit);

  return { items, total, page: safePage, limit: safeLimit, pageCount };
}

/**
 * Lists tasks on a board, applying filtering, sorting, and pagination.
 * Requires the requesting user to belong to the board.
 * @param {Object} params
 * @param {string} params.userId - Requesting user's ID
 * @param {string} params.boardId - Board whose tasks are being listed
 * @param {Object} [params.query] - Raw query params (e.g. req.query)
 * @param {string} [params.query.status] - Filter by task status
 * @param {string} [params.query.assignee] - Filter by assignee
 * @param {string} [params.query.sort] - "dueDate:asc|desc" or "title:asc|desc"
 * @param {number|string} [params.query.page] - 1-indexed page number (default 1)
 * @param {number|string} [params.query.limit] - Page size (default 10)
 * @returns {Promise<{items: Array<Object>, total: number, page: number, limit: number, pageCount: number}>}
 * @throws {AppError} 404 if the board doesn't exist, 403 if the user isn't a member
 */
export async function getTasks({ userId, boardId, query = {} } = {}) {
  await assertBoardMembership(boardId, userId);

  const boardTasks = await taskRepository.findByBoardId(boardId);
  const filtered = applyFilters(boardTasks, query);
  const sorted = applySort(filtered, query.sort);

  return applyPagination(sorted, query);
}

/**
 * Fetches a single task, enforcing board membership.
 * @param {Object} params
 * @param {string} params.userId - Requesting user's ID
 * @param {string} params.taskId - Task ID to fetch
 * @returns {Promise<Object>} The task
 * @throws {AppError} 404 if the ID is missing/unknown, 403 if not a board member
 */
export async function getTaskById({ userId, taskId } = {}) {
  return getOwnedTaskOrThrow(taskId, userId);
}

/**
 * Creates a task on a board. Requires the requesting user to belong to
 * that board.
 * @param {Object} params
 * @param {string} params.userId - Requesting user's ID
 * @param {string} params.boardId - Board to create the task on
 * @param {Object} params.data - Task fields (title, description, status, etc.)
 * @returns {Promise<Object>} The created task
 * @throws {AppError} 404 if the board doesn't exist, 403 if not a member
 */
export async function createTask({ userId, boardId, data = {} } = {}) {
  await assertBoardMembership(boardId, userId);

  return taskRepository.create({
    ...data,
    boardId,
    createdBy: userId,
  });
}

/**
 * Updates an existing task. Requires the requesting user to belong to
 * the task's board.
 * @param {Object} params
 * @param {string} params.userId - Requesting user's ID
 * @param {string} params.taskId - Task ID to update
 * @param {Object} params.data - Partial fields to merge into the task
 * @returns {Promise<Object>} The updated task
 * @throws {AppError} 404 if the ID is missing/unknown, 403 if not a board member
 */
export async function updateTask({ userId, taskId, data = {} } = {}) {
  await getOwnedTaskOrThrow(taskId, userId);
  return taskRepository.update(taskId, data);
}

/**
 * Deletes a task. Requires the requesting user to belong to the task's board.
 * @param {Object} params
 * @param {string} params.userId - Requesting user's ID
 * @param {string} params.taskId - Task ID to delete
 * @returns {Promise<{id: string}>} The ID of the deleted task
 * @throws {AppError} 404 if the ID is missing/unknown, 403 if not a board member
 */
export async function deleteTask({ userId, taskId } = {}) {
  const task = await getOwnedTaskOrThrow(taskId, userId);
  await taskRepository.delete(task.id);
  return { id: task.id };
}

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};