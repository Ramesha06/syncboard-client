import express from 'express';
import * as authController from '../controllers/authController.js';
import { loginRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', loginRateLimiter, authController.login);

export default router;