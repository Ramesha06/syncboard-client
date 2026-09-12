import express from 'express';
import * as boardController from '../controllers/boardController.js';
import validateObjectId from '../middlewares/validateObjectId.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const router = express.Router();

// Optional auth helper: decodes JWT if provided, otherwise passes through
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, config.jwtSecret);
    } catch {
      // invalid token, proceed unauthenticated
    }
  }
  next();
};

router.use(optionalAuth);

router.get('/', boardController.getBoards);
router.get('/:id', validateObjectId, boardController.getBoardById);
router.post('/', boardController.createBoard);

export default router;
