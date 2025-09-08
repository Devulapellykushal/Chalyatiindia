const crypto = require('crypto');

module.exports = {
  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://dev:dev@cluster0.yeftyle.mongodb.net/car-rental?retryWrites=true&w=majority&appName=Cluster0',
  
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '0.0.0.0',
  
  // Frontend Configuration
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // JWT Configuration - Generate secure secret if not provided
  JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // Admin Configuration
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'chalyatiindia',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'santoshmetta',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@chalyati.com',
  
  // Security Configuration
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  RATE_LIMIT_MAX_ATTEMPTS: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS) || 5,
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Session Configuration
  SESSION_SECRET: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  SESSION_COOKIE_MAX_AGE: parseInt(process.env.SESSION_COOKIE_MAX_AGE) || 86400000, // 24 hours
};
