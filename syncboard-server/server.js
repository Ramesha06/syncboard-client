import app from './app.js';
import { config } from './src/config/config.js';
import connectDB from './src/db/connect.js';

const PORT = config.port;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB first
    await connectDB();

    // 2. Start listening for HTTP requests
    app.listen(PORT, () => {
      console.log(`Syncboard Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

startServer();