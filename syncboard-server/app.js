import express from 'express';
import cors from 'cors';
import healthRoutes from './src/routes/healthRoutes.js';

const app = express();

// Core Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);

export default app;
