const express = require('express');
const Gallery = require('../models/Gallery');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();

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

// Configure multer for gallery image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/gallery');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `gallery-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Rate limiting for gallery operations
const galleryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

// Get all gallery images (public endpoint)
router.get('/', async (req, res) => {
  try {
    const { category = 'gallery' } = req.query;
    const images = await Gallery.getActiveImages(category);
    
    const imagesWithUrls = images.map(img => ({
      id: img._id,
      title: img.title,
      description: img.description,
      imageUrl: img.getFullImageUrl(),
      order: img.order,
      category: img.category
    }));

    res.json({
      success: true,
      data: imagesWithUrls
    });
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images'
    });
  }
});

// Get gallery images for admin (with all details)
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const images = await Gallery.find().sort({ order: 1, createdAt: -1 }).populate('uploadedBy', 'username');
    
    const imagesWithUrls = images.map(img => ({
      id: img._id,
      title: img.title,
      description: img.description,
      imageUrl: img.getFullImageUrl(),
      imagePath: img.imagePath,
      order: img.order,
      isActive: img.isActive,
      category: img.category,
      uploadedBy: img.uploadedBy?.username || 'Unknown',
      createdAt: img.createdAt,
      updatedAt: img.updatedAt
    }));

    res.json({
      success: true,
      data: imagesWithUrls
    });
  } catch (error) {
    console.error('Admin gallery fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images'
    });
  }
});

// Upload new gallery image (admin only)
router.post('/upload', galleryLimiter, authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const { title, description, category = 'gallery', order = 0 } = req.body;
    const uploadedBy = req.admin?.adminId; // From JWT middleware

    if (!uploadedBy) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const imagePath = `/uploads/gallery/${req.file.filename}`;
    const imageUrl = `${config.BASE_URL || 'http://localhost:5000'}${imagePath}`;

    const galleryImage = new Gallery({
      title: title || `Gallery Image ${Date.now()}`,
      description: description || '',
      imageUrl: imageUrl,
      imagePath: imagePath,
      order: parseInt(order) || 0,
      category: category,
      uploadedBy: uploadedBy
    });

    await galleryImage.save();

    res.json({
      success: true,
      message: 'Gallery image uploaded successfully',
      data: {
        id: galleryImage._id,
        title: galleryImage.title,
        description: galleryImage.description,
        imageUrl: galleryImage.getFullImageUrl(),
        order: galleryImage.order,
        category: galleryImage.category
      }
    });
  } catch (error) {
    console.error('Gallery upload error:', error);
    
    // Clean up uploaded file if database save fails
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/gallery', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload gallery image'
    });
  }
});

// Update gallery image (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order, isActive, category } = req.body;

    const galleryImage = await Gallery.findById(id);
    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    if (title) galleryImage.title = title;
    if (description !== undefined) galleryImage.description = description;
    if (order !== undefined) galleryImage.order = parseInt(order);
    if (isActive !== undefined) galleryImage.isActive = isActive;
    if (category) galleryImage.category = category;

    await galleryImage.save();

    res.json({
      success: true,
      message: 'Gallery image updated successfully',
      data: {
        id: galleryImage._id,
        title: galleryImage.title,
        description: galleryImage.description,
        imageUrl: galleryImage.getFullImageUrl(),
        order: galleryImage.order,
        isActive: galleryImage.isActive,
        category: galleryImage.category
      }
    });
  } catch (error) {
    console.error('Gallery update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery image'
    });
  }
});

// Delete gallery image (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const galleryImage = await Gallery.findById(id);
    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    // Delete the physical file
    const filePath = path.join(__dirname, '..', galleryImage.imagePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Gallery.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    console.error('Gallery delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery image'
    });
  }
});

module.exports = router;
