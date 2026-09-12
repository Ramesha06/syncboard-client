import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import healthRoutes from './src/routes/healthRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import boardRoutes from './src/routes/boardRoutes.js';
import notFoundHandler from './src/middlewares/notFoundHandler.js';
import errorHandler from './src/middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Core Middlewares (must run before routes so req.body is parsed)
app.use(cors());
app.use(express.json());

// Load OpenAPI / Swagger JSON Specification
const swaggerFilePath = path.join(__dirname, 'src', 'config', 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf-8'));

// Swagger UI & JSON Endpoints
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'SyncBoard API Documentation (Swagger)',
    customCss: '.swagger-ui .topbar { background-color: #0f172a; }',
  })
);

app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);

// Error Handling Middlewares (must be added after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;