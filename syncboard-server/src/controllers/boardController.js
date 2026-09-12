import mongoose from 'mongoose';
import boardRepository from '../repositories/boardRepository.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Resolve user ID from JWT token or fallback
 */
function resolveUserId(req) {
  return req.user?.id || req.body?.userId || req.query?.userId || 'USR-01';
}

/**
 * GET /api/boards
 * List all boards accessible to the current user
 */
export const getBoards = asyncHandler(async (req, res) => {
  const userId = resolveUserId(req);
  const boards = await boardRepository.findAll();
  
  // Filter boards where user is owner or member, or return all if public/demo mode
  const accessibleBoards = boards.filter(
    (b) => !b.members || b.members.length === 0 || b.members.includes(userId) || b.ownerId === userId
  );

  res.status(200).json({
    success: true,
    count: accessibleBoards.length > 0 ? accessibleBoards.length : boards.length,
    data: accessibleBoards.length > 0 ? accessibleBoards : boards,
  });
});

/**
 * GET /api/boards/:id
 * Get a specific board by ID
 */
export const getBoardById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const board = await boardRepository.findById(id);

  if (!board) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: `Board not found with id: ${id}`,
    });
  }

  res.status(200).json({
    success: true,
    data: board,
  });
});

/**
 * POST /api/boards
 * Create a new board workspace
 */
export const createBoard = asyncHandler(async (req, res) => {
  const userId = resolveUserId(req);
  const { title, description } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Board title is required',
    });
  }

  const ownerObjectId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : new mongoose.Types.ObjectId();

  const newBoard = await boardRepository.create({
    title: title.trim(),
    description: description ? description.trim() : '',
    ownerId: ownerObjectId,
    members: [ownerObjectId],
  });

  res.status(201).json({
    success: true,
    data: newBoard,
  });
});

export default {
  getBoards,
  getBoardById,
  createBoard,
};
