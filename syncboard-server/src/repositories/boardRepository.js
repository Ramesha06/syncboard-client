import initialBoards from '../data/boards.js';

/**
 * BoardRepository
 * Encapsulates in-memory board management and member verification for access control
 */
class BoardRepository {
  constructor() {
    this.boards = initialBoards.map((b) => ({ ...b, members: [...b.members] }));
    this.idCounter = this.boards.length + 1;
  }

  /**
   * Retrieve all boards
   * @returns {Array<Object>}
   */
  async findAll() {
    return this.boards.map((b) => ({ ...b, members: [...b.members] }));
  }

  /**
   * Find a board by unique ID
   * @param {string} id - Board ID (e.g. 'BOARD-01')
   * @returns {Object|null}
   */
  async findById(id) {
    const board = this.boards.find((b) => b.id === id);
    return board ? { ...board, members: [...board.members] } : null;
  }

  /**
   * Check whether a user is an owner or member of a specific board
   * @param {string} boardId - Board ID
   * @param {string} userId - User ID
   * @returns {boolean} True if user has access, false otherwise
   */
  async isUserMember(boardId, userId) {
    const board = await this.findById(boardId);
    if (!board) return false;

    if (board.ownerId === userId) return true;
    return board.members && board.members.includes(userId);
  }

  /**
   * Create a new board
   * @param {Object} boardData
   * @returns {Object} Created board
   */
  async create(boardData) {
    const paddedIndex = String(this.idCounter++).padStart(2, '0');
    const newId = boardData.id || `BOARD-${paddedIndex}`;
    const now = new Date().toISOString();

    const newBoard = {
      id: newId,
      title: boardData.title,
      description: boardData.description || '',
      ownerId: boardData.ownerId,
      members: Array.from(new Set([boardData.ownerId, ...(boardData.members || [])])),
      createdAt: now,
    };

    this.boards.push(newBoard);
    return { ...newBoard, members: [...newBoard.members] };
  }

  /**
   * Reset repository to initial seed state
   */
  async reset() {
    this.boards = initialBoards.map((b) => ({ ...b, members: [...b.members] }));
    this.idCounter = this.boards.length + 1;
  }
}

export default new BoardRepository();
