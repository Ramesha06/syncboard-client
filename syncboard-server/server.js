import app from './app.js';
import { config } from './src/config/config.js';
import connectDB from './src/db/connect.js';

const PORT = config.port;

const startServer = async () => {
  try {
    // 1. Start listening for HTTP requests immediately
    app.listen(PORT, () => {
      console.log(`Syncboard Server running on http://localhost:${PORT}`);
      console.log(`Swagger UI Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`Raw OpenAPI Specification: http://localhost:${PORT}/api/docs.json`);
      console.log(`Environment: ${config.nodeEnv}`);
    });

    // 2. Connect to MongoDB (non-blocking)
    await connectDB();
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

startServer();