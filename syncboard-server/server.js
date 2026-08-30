import app from './app.js';
import { config } from './src/config/config.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Syncboard Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
