const express = require('express');
const Car = require('../models/Car');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const config = require('../config');
const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS, // 15 minutes
  max: config.RATE_LIMIT_MAX_ATTEMPTS, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Rate limiting for admin operations
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'car-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.MAX_FILE_SIZE || 5 * 1024 * 1024 // 5MB limit
  }
});

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Check if token is expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }
    
    // Additional security checks
    if (decoded.fallback) {
      return res.status(401).json({
        success: false,
        message: 'Fallback authentication not allowed. Please use proper credentials.'
      });
    }
    
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.'
    });
  }
};

// POST /api/admin/login - Admin login with rate limiting
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Validate input
    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials format'
      });
    }

    // Authenticate with the Admin model only
    const admin = await Admin.authenticate(username, password);
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Generate JWT token with secure settings
    const token = jwt.sign(
      { 
        adminId: admin._id,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions,
        iat: Math.floor(Date.now() / 1000)
      },
      config.JWT_SECRET,
      { 
        expiresIn: config.JWT_EXPIRES_IN,
        issuer: 'chalyati-admin',
        audience: 'chalyati-app'
      }
    );

    // Set secure cookie for additional security
    res.cookie('admin-token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        fullName: admin.fullName,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    
    // Don't reveal specific error details
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// POST /api/admin/logout - Admin logout
router.post('/logout', (req, res) => {
  res.clearCookie('admin-token');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// GET /api/admin/dashboard - Get admin dashboard data
router.get('/dashboard', adminLimiter, authenticateAdmin, async (req, res) => {
  try {
    // Get comprehensive dashboard statistics
    const [
      totalCars,
      availableCars,
      rentedCars,
      maintenanceCars,
      featuredCars,
      recentCars,
      brandStats,
      typeStats,
      priceStats,
      monthlyStats
    ] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ status: 'available' }),
      Car.countDocuments({ status: 'rented' }),
      Car.countDocuments({ status: 'maintenance' }),
      Car.countDocuments({ featured: true }),
      Car.find().sort({ createdAt: -1 }).limit(5),
      Car.aggregate([
        { $group: { _id: '$brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Car.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Car.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$pricePerDay' },
            maxPrice: { $max: '$pricePerDay' },
            avgPrice: { $avg: '$pricePerDay' },
            totalValue: { $sum: '$pricePerDay' }
          }
        }
      ]),
      Car.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ])
    ]);

    // Calculate utilization rate
    const utilizationRate = totalCars > 0 ? ((rentedCars / totalCars) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalCars,
          availableCars,
          rentedCars,
          maintenanceCars,
          featuredCars,
          utilizationRate: parseFloat(utilizationRate)
        },
        priceStats: priceStats[0] || {
          minPrice: 0,
          maxPrice: 0,
          avgPrice: 0,
          totalValue: 0
        },
        brandStats,
        typeStats,
        recentCars,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

// GET /api/admin/cars - Get all cars for admin (with pagination and filters)
router.get('/cars', adminLimiter, authenticateAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      brand,
      type,
      status,
      featured,
      minPrice,
      maxPrice
    } = req.query;

    // Build filter object
    const filters = {};
    
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (brand) filters.brand = brand;
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (featured !== undefined) filters.featured = featured === 'true';
    
    if (minPrice || maxPrice) {
      filters.pricePerDay = {};
      if (minPrice) filters.pricePerDay.$gte = parseInt(minPrice);
      if (maxPrice) filters.pricePerDay.$lte = parseInt(maxPrice);
    }

    // Build query
    const query = Car.find(filters);
    
    // Add sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    query.sort(sortOptions);

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query.skip(skip).limit(parseInt(limit));

    // Execute query
    const cars = await query.exec();
    const total = await Car.countDocuments(filters);

    res.json({
      success: true,
      data: cars,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: skip + cars.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching admin cars:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cars',
      error: error.message
    });
  }
});

// POST /api/admin/cars - Create new car (admin only)
router.post('/cars', adminLimiter, authenticateAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const carData = req.body;
    
    console.log('POST /cars - Request received');
    console.log('carData:', carData);
    console.log('req.files:', req.files ? req.files.length : 'none');
    
    // Validate required fields
    const requiredFields = ['title', 'brand', 'type', 'transmission', 'fuel', 'pricePerDay', 'seats', 'mileageKm'];
    const missingFields = requiredFields.filter(field => !carData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Process uploaded images
    if (req.files && req.files.length > 0) {
      carData.images = req.files.map(file => `/uploads/${file.filename}`);
      console.log('Processed uploaded images:', carData.images);
    } else if (carData.images && typeof carData.images === 'string') {
      // Fallback to comma-separated URLs if no files uploaded
      carData.images = carData.images.split(',').map(img => img.trim()).filter(img => img);
      console.log('Processed URL images:', carData.images);
    }

    const car = new Car(carData);
    await car.save();

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: car
    });
  } catch (error) {
    console.error('Error creating car:', error);
    
    // Clean up uploaded files if car creation fails
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create car',
      error: error.message
    });
  }
});

// PUT /api/admin/cars/:id - Update car (admin only)
router.put('/cars/:id', adminLimiter, authenticateAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const carData = req.body;
    
    console.log('PUT /cars/:id - Request received');
    console.log('carData:', carData);
    console.log('req.files:', req.files ? req.files.length : 'none');
    
    // Process uploaded images
    if (req.files && req.files.length > 0) {
      carData.images = req.files.map(file => `/uploads/${file.filename}`);
      console.log('Processed uploaded images:', carData.images);
    } else if (carData.images && typeof carData.images === 'string') {
      // Fallback to comma-separated URLs if no files uploaded
      carData.images = carData.images.split(',').map(img => img.trim()).filter(img => img);
      console.log('Processed URL images:', carData.images);
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      carData,
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.json({
      success: true,
      message: 'Car updated successfully',
      data: car
    });
  } catch (error) {
    console.error('Error updating car:', error);
    
    // Clean up uploaded files if car update fails
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update car',
      error: error.message
    });
  }
});

// DELETE /api/admin/cars/:id - Delete car (admin only)
router.delete('/cars/:id', adminLimiter, authenticateAdmin, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete car',
      error: error.message
    });
  }
});

// PATCH /api/admin/cars/:id/featured - Toggle featured status (admin only)
router.patch('/cars/:id/featured', adminLimiter, authenticateAdmin, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    car.featured = !car.featured;
    await car.save();

    res.json({
      success: true,
      message: `Car ${car.featured ? 'featured' : 'unfeatured'} successfully`,
      data: car
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle featured status',
      error: error.message
    });
  }
});

// POST /api/admin/seed - Seed database with initial data
router.post('/seed', adminLimiter, authenticateAdmin, async (req, res) => {
  try {
    // Check if cars already exist
    const existingCars = await Car.countDocuments();
    if (existingCars > 0) {
      return res.status(400).json({
        success: false,
        message: 'Database already contains cars. Clear database first if you want to reseed.'
      });
    }

    // Import seed data
    const { seedCars } = require('../data/seedData');
    
    // Insert seed cars
    const cars = await Car.insertMany(seedCars);

    res.json({
      success: true,
      message: `Successfully seeded database with ${cars.length} cars`,
      data: { count: cars.length }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

// DELETE /api/admin/clear - Clear all cars (admin only)
router.delete('/clear', adminLimiter, authenticateAdmin, async (req, res) => {
  try {
    const result = await Car.deleteMany({});
    
    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} cars`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('Error clearing database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear database',
      error: error.message
    });
  }
});

// POST /api/admin/init - Initialize default admin (development only)
router.post('/init', async (req, res) => {
  try {
    // Only allow in development or if no admins exist
    if (process.env.NODE_ENV === 'production') {
      const adminCount = await Admin.countDocuments();
      if (adminCount > 0) {
        return res.status(403).json({
          success: false,
          message: 'Admin initialization not allowed in production'
        });
      }
    }

    const admin = await Admin.createDefaultAdmin();
    
    res.json({
      success: true,
      message: 'Default admin created successfully',
      data: {
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error initializing admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize admin',
      error: error.message
    });
  }
});

// GET /api/admin/profile - Get current admin profile
router.get('/profile', adminLimiter, authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId || req.admin.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        fullName: admin.fullName,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile',
      error: error.message
    });
  }
});

module.exports = router;
