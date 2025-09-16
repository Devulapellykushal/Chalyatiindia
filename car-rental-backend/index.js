const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables FIRST
dotenv.config();

// Then require config
const config = require('./config');

const app = express();
const PORT = config.PORT;

// Security Middleware - Temporarily disabled for debugging
// app.use(helmet({
//   crossOriginResourcePolicy: { policy: "cross-origin" },
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       scriptSrc: ["'self'"],
//       imgSrc: ["'self'", "data:", "https:"],
//       connectSrc: ["'self'"],
//       fontSrc: ["'self'"],
//       objectSrc: ["'none'"],
//       mediaSrc: ["'self'"],
//       frameSrc: ["'none'"],
//     },
//   },
//   hsts: {
//     maxAge: 31536000,
//     includeSubDomains: true,
//     preload: true
//   }
// }));

// Logging
app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS Configuration - Production Ready
const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:3000',                    // Development frontend
    'https://chalyati.com',                     // Production frontend domain
    'https://chalyati.vercel.app',              // Vercel deployment
    'https://chalyatiindia.onrender.com',       // Render backend (for internal requests)
    'https://chalyati-jp3xxys77-devulapellykushals-projects.vercel.app'  // Specific Vercel URL
  ];
  
  // Add additional development origins if needed
  if (config.NODE_ENV === 'development') {
    origins.push(
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    );
  }
  
  return origins;
};

// CORS middleware with credentials support
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = getAllowedOrigins();
    
    // Check exact matches first
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } 
    // Allow all Vercel deployments
    else if (origin.includes('.vercel.app')) {
      console.log(`✅ CORS allowing Vercel deployment: ${origin}`);
      callback(null, true);
    }
    // Allow localhost for development
    else if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      console.log(`✅ CORS allowing local development: ${origin}`);
      callback(null, true);
    }
    else {
      console.warn(`🚫 CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Enable credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin', 
    'X-Requested-With', 
    'Content-Type', 
    'Accept', 
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Set-Cookie'], // Expose cookies to frontend
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

// Body parsing with limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for signature verification if needed
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
  parameterLimit: 1000
}));

// Trust proxy for rate limiting and IP detection
app.set('trust proxy', 1);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Initialize default admin if none exists
const initializeDefaultAdmin = async () => {
  try {
    const Admin = require('./models/Admin');
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      console.log('🔧 No admins found. Creating default admin...');
      await Admin.createDefaultAdmin();
      console.log('✅ Default admin created successfully');
    }
  } catch (error) {
    console.error('❌ Error initializing default admin:', error);
  }
};

// Initialize admin after database connection
setTimeout(initializeDefaultAdmin, 2000);

// Handle preflight requests for uploads
app.options('/uploads/*', (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  res.sendStatus(200);
});

// Serve uploaded images with CORS headers
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/cars', require('./routes/cars'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/gallery', require('./routes/gallery'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Car Rental API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: config.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);
  console.error('Request headers:', req.headers);
  console.error('Error stack:', error.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;
