import express from 'express';
import cors from 'cors';
import healthRoutes from './src/routes/healthRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import notFoundHandler from './src/middlewares/notFoundHandler.js';
import errorHandler from './src/middlewares/errorHandler.js';

const app = express();

// Core Middlewares (must run before routes so req.body is parsed)
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Error Handling Middlewares (must be added after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;