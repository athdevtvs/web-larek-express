import { config } from 'dotenv';

config();
export const {
  PORT = 3000,
  DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek',
  UPLOAD_TARGET_PATH = 'images',
  UPLOAD_TEMP_PATH = 'temp',
  ORIGIN_ALLOW = 'http://localhost:5173',
  NODE_ENV = 'develop',
  AUTH_REFRESH_TOKEN_EXPIRY = '7d',
  AUTH_ACCESS_TOKEN_EXPIRY = '1Om',
  JWT_SECRET = 'jwt_secret',
  AUTH_JWT_SECRET_KEY = process.env.NODE_ENV === 'production'
    ? process.env.JWT_SECRET!
    : 'dev-secret',
} = process.env;
