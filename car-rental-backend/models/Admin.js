const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
        },
        message: 'Phone number must be a valid phone number'
      }
    }
  },
  permissions: [{
    type: String,
    enum: [
      'cars.create',
      'cars.read',
      'cars.update',
      'cars.delete',
      'users.read',
      'users.update',
      'users.delete',
      'analytics.read',
      'settings.update'
    ]
  }]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.loginAttempts;
      delete ret.lockUntil;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for better query performance
adminSchema.index({ username: 1 });
adminSchema.index({ email: 1 });
adminSchema.index({ isActive: 1 });
adminSchema.index({ role: 1 });

// Virtual for full name
adminSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// Virtual for account lock status
adminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
adminSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Instance method to increment login attempts
adminSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
adminSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Instance method to check permissions
adminSchema.methods.hasPermission = function(permission) {
  if (this.role === 'super_admin') return true;
  return this.permissions.includes(permission);
};

// Static method to create default admin
adminSchema.statics.createDefaultAdmin = async function() {
  try {
    const existingAdmin = await this.findOne({ username: 'chalyatiindia' });
    if (existingAdmin) {
      console.log('Default admin already exists');
      return existingAdmin;
    }

    const defaultAdmin = new this({
      username: 'chalyatiindia',
      email: 'admin@chalyati.com',
      password: process.env.ADMIN_PASSWORD || 'santoshmetta',
      role: 'super_admin',
      profile: {
        firstName: 'Chalyati',
        lastName: 'India'
      },
      permissions: [
        'cars.create',
        'cars.read',
        'cars.update',
        'cars.delete',
        'users.read',
        'users.update',
        'users.delete',
        'analytics.read',
        'settings.update'
      ]
    });

    await defaultAdmin.save();
    console.log('Default admin created successfully');
    return defaultAdmin;
  } catch (error) {
    console.error('Error creating default admin:', error);
    throw error;
  }
};

// Static method to authenticate admin
adminSchema.statics.authenticate = async function(username, password) {
  try {
    const admin = await this.findOne({ 
      $or: [{ username }, { email: username }],
      isActive: true 
    });

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    if (admin.isLocked) {
      throw new Error('Account is temporarily locked due to too many failed login attempts');
    }

    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      await admin.incLoginAttempts();
      throw new Error('Invalid credentials');
    }

    // Reset login attempts on successful login
    await admin.resetLoginAttempts();
    
    return admin;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('Admin', adminSchema);
