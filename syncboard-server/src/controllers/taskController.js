import taskService from '../services/taskService.js';
import userRepository from '../repositories/userRepository.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @param {import('express').Request} req
 * @returns {string}
 */
function resolveUserId(req) {
    return req.user?.id || req.body?.userId || req.query?.userId || 'USR-01';
}


export const getTasks = asyncHandler(async (req, res) => {
    const userId = resolveUserId(req);
    const user = await userRepository.findById(userId);
    const boardId = req.query.boardId || user?.boards?.[0] || 'BOARD-01';

    const result = await taskService.getTasks({ userId, boardId, query: req.query });

    res.status(200).json({
        success: true,
        ...result,
    });
});

export const getTaskById = asyncHandler(async (req, res) => {
    const userId = resolveUserId(req);
    const { id } = req.params;

    const task = await taskService.getTaskById({ userId, taskId: id });

    res.status(200).json({
        success: true,
        data: task,
    });
});

export const createTask = asyncHandler(async (req, res) => {
    const userId = resolveUserId(req);
    const user = await userRepository.findById(userId);
    const boardId = req.body?.boardId || user?.boards?.[0] || 'BOARD-01';

    const task = await taskService.createTask({ userId, boardId, data: req.body });

    res.status(201).json({
        success: true,
        data: task,
    });
});



export const updateTask = asyncHandler(async (req, res) => {
    const userId = resolveUserId(req);
    const { id } = req.params;

    const task = await taskService.updateTask({ userId, taskId: id, data: req.body });

    res.status(200).json({
        success: true,
        data: task,
    });
});

/**
 * DELETE /api/tasks/:id
 */
export const deleteTask = asyncHandler(async (req, res) => {
    const userId = resolveUserId(req);
    const { id } = req.params;

    await taskService.deleteTask({ userId, taskId: id });

    res.status(204).send();
});

export default {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};