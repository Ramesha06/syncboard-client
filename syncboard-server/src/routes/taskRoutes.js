import express from 'express';
import * as taskController from '../controllers/taskController.js';
import validate from '../middlewares/validate.js';
import { createTaskSchema, updateTaskSchema } from '../validations/taskValidation.js';

const router = express.Router();

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);

router.post('/', validate(createTaskSchema), taskController.createTask);

router.patch('/:id', validate(updateTaskSchema), taskController.updateTask);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

export default router;