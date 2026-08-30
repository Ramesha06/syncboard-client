import express from 'express';
import cors from 'cors';
import healthRoutes from './src/routes/healthRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import notFoundHandler from './src/middlewares/notFoundHandler.js';
import errorHandler from './src/middlewares/errorHandler.js';

const app = express();

// Core Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling Middlewares (Must be added after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;