import express from 'express';
import * as taskController from '../controllers/taskController.js';
import validate from '../middlewares/validate.js';
import { createTaskSchema, updateTaskSchema } from '../validations/taskValidation.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = express.Router();

router.use(authMiddleware); // applies to every route below

router.get('/', taskController.getTasks);
router.get('/:id', validateObjectId, taskController.getTaskById);

router.post('/', validate(createTaskSchema), taskController.createTask);

router.patch('/:id', validateObjectId, validate(updateTaskSchema), taskController.updateTask);
router.put('/:id', validateObjectId, validate(updateTaskSchema), taskController.updateTask);

router.delete('/:id', validateObjectId, taskController.deleteTask);

export default router;