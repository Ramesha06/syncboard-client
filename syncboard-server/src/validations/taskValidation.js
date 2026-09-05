import { z } from 'zod';

export const TASK_STATUSES = ['todo', 'in_progress', 'done'];


const requiredString = (label) =>
    z.string({
        error: (issue) => (issue.input === undefined ? `${label} is required` : `${label} must be a string`),
    });

const baseTaskShape = {
    title: requiredString('Title').trim().min(1, 'Title is required'),

    status: z.enum(TASK_STATUSES, {
        error: () => `Status must be one of: ${TASK_STATUSES.join(', ')}`,
    }),

    category: requiredString('Category').trim().min(1, 'Category is required'),

    dueDate: requiredString('Due date')
        .trim()
        .refine((value) => !Number.isNaN(Date.parse(value)), {
            message: 'Due date must be a valid date (e.g. 2025-08-25)',
        }),

    boardId: z.string().trim().optional(),

    description: z.string().trim().optional(),
    assignee: z.string().trim().optional(),
};


export const createTaskSchema = z.object(baseTaskShape);

export const updateTaskSchema = z.object(baseTaskShape).partial();

export default {
    createTaskSchema,
    updateTaskSchema,
    TASK_STATUSES,
};