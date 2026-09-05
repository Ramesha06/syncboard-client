import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'syncboard_super_secret_jwt_key_2026',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/syncboard',
};

export default config;

