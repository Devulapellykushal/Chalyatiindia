const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  imagePath: {
    type: String,
    required: [true, 'Image path is required'],
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['featured', 'gallery', 'hero'],
    default: 'gallery'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
gallerySchema.index({ category: 1, isActive: 1, order: 1 });
gallerySchema.index({ uploadedBy: 1 });

// Static method to get active gallery images
gallerySchema.statics.getActiveImages = function(category = 'gallery') {
  return this.find({ 
    category: category, 
    isActive: true 
  }).sort({ order: 1, createdAt: -1 });
};

// Instance method to get full image URL
gallerySchema.methods.getFullImageUrl = function() {
  if (this.imageUrl.startsWith('http')) {
    return this.imageUrl;
  }
  return `${process.env.BASE_URL || 'https://chalyatiindia.onrender.com'}${this.imageUrl}`;
};

module.exports = mongoose.model('Gallery', gallerySchema);
