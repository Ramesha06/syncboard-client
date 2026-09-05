import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const getMongooseState = (state) => {
  switch (state) {
    case 0: return 'disconnected';
    case 1: return 'connected';
    case 2: return 'connecting';
    case 3: return 'disconnecting';
    default: return 'unknown';
  }
};

router.get('/', (req, res) => {
  const readyState = mongoose.connection.readyState;
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: getMongooseState(readyState),
      readyState,
    },
  });
});

export default router;