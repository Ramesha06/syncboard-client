import mongoose from 'mongoose';
import Board from '../models/Board.js';

/**
 * BoardRepository
 * Encapsulates MongoDB database operations for boards using Mongoose.
 */
class BoardRepository {
  /**
   * Retrieve all boards
   * @returns {Promise<Array<Object>>} List of boards
   */
  async findAll() {
    const boards = await Board.find();
    return boards.map((b) => b.toJSON());
  }

  /**
   * Find a board by unique ID
   * @param {string} id - Board ObjectId string
   * @returns {Promise<Object|null>} Board object or null
   */
  async findById(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const board = await Board.findById(id);
    return board ? board.toJSON() : null;
  }

  /**
   * Check whether a user is an owner or member of a specific board
   * @param {string} boardId - Board ObjectId string
   * @param {string} userId - User ObjectId string
   * @returns {Promise<boolean>} True if user has access, false otherwise
   */
  async isUserMember(boardId, userId) {
    if (!boardId || !userId) return false;
    if (!mongoose.Types.ObjectId.isValid(boardId)) return false;

    const board = await Board.findById(boardId);
    if (!board) return false;

    const isOwner = board.ownerId?.toString() === userId.toString();
    const isMember = board.members?.some((m) => m.toString() === userId.toString());

    return Boolean(isOwner || isMember);
  }

  /**
   * Add a user to a board's member list
   * @param {string} boardId - Board ObjectId string
   * @param {string} userId - User ObjectId string
   * @returns {Promise<boolean>} True if added or already a member, false if board not found
   */
  async addMember(boardId, userId) {
    if (!boardId || !userId || !mongoose.Types.ObjectId.isValid(boardId)) {
      return false;
    }

    const updated = await Board.findByIdAndUpdate(
      boardId,
      { $addToSet: { members: userId } },
      { returnDocument: 'after' }
    );

    return Boolean(updated);
  }

  /**
   * Create a new board
   * @param {Object} boardData - Board creation properties
   * @returns {Promise<Object>} Created board object
   */
  async create(boardData) {
    const ownerId = boardData.ownerId || new mongoose.Types.ObjectId();
    const members = Array.from(
      new Set([ownerId.toString(), ...(boardData.members || []).map((m) => m.toString())])
    );

    const board = await Board.create({
      title: boardData.title,
      description: boardData.description || '',
      ownerId,
      members,
    });

    return board.toJSON();
  }

  /**
   * Reset repository state in MongoDB
   */
  async reset() {
    await Board.deleteMany({});
  }
}

export default new BoardRepository();
