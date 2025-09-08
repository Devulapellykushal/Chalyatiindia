const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [2, 'Title must be at least 2 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    enum: {
      values: ['Renault', 'Honda', 'Suzuki', 'Toyota', 'Tata', 'Hyundai', 'Kia', 'Mercedes-Benz', 'Audi', 'BMW', 'Ford', 'Nissan', 'Volkswagen', 'Skoda', 'Mahindra'],
      message: 'Brand must be one of the supported brands'
    }
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    trim: true,
    enum: {
      values: ['Hatchback', 'Sedan', 'SUV', 'MPV', 'Coupe', 'Convertible', 'Wagon'],
      message: 'Type must be one of the supported vehicle types'
    }
  },
  transmission: {
    type: String,
    required: [true, 'Transmission is required'],
    enum: {
      values: ['Manual', 'Automatic', 'CVT', 'AMT'],
      message: 'Transmission must be Manual, Automatic, CVT, or AMT'
    }
  },
  fuel: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: {
      values: ['Petrol', 'Diesel', 'EV', 'Hybrid', 'CNG'],
      message: 'Fuel type must be Petrol, Diesel, EV, Hybrid, or CNG'
    }
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [0, 'Price per day cannot be negative'],
    max: [100000, 'Price per day cannot exceed ₹100,000']
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [1, 'Car must have at least 1 seat'],
    max: [10, 'Car cannot have more than 10 seats']
  },
  mileageKm: {
    type: Number,
    required: [true, 'Mileage is required'],
    min: [0, 'Mileage cannot be negative'],
    max: [1000000, 'Mileage cannot exceed 1,000,000 km']
  },
  yearOfManufacture: {
    type: Number,
    min: [1990, 'Year of manufacture cannot be before 1990'],
    max: [new Date().getFullYear() + 1, 'Year of manufacture cannot be in the future']
  },
  ownerName: {
    type: String,
    trim: true,
    maxlength: [100, 'Owner name cannot exceed 100 characters']
  },
  contactNumber: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || v === '—' || /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Contact number must be a valid phone number or dash'
    }
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^(https?:\/\/.+\.(jpg|jpeg|png|gif|webp)|.*\.(jpg|jpeg|png|gif|webp)|.*\/.*\.(jpg|jpeg|png|gif|webp))/i.test(v);
      },
      message: 'Image must be a valid URL or file path with image extension'
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance', 'unavailable'],
    default: 'available'
  },
  location: {
    city: {
      type: String,
      trim: true,
      maxlength: [50, 'City name cannot exceed 50 characters']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [50, 'State name cannot exceed 50 characters']
    },
    pincode: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[1-9][0-9]{5}$/.test(v);
        },
        message: 'Pincode must be a valid 6-digit Indian pincode'
      }
    }
  },
  features: [{
    type: String,
    trim: true
  }],
  insurance: {
    validTill: Date,
    policyNumber: String,
    company: String
  },
  lastServiceDate: Date,
  nextServiceDue: Date,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRentals: {
    type: Number,
    default: 0,
    min: 0
  },
  totalRevenue: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
carSchema.index({ brand: 1, type: 1 });
carSchema.index({ pricePerDay: 1 });
carSchema.index({ featured: 1 });
carSchema.index({ status: 1 });
carSchema.index({ 'location.city': 1 });
carSchema.index({ createdAt: -1 });

// Virtual for age calculation
carSchema.virtual('age').get(function() {
  if (!this.yearOfManufacture) return null;
  return new Date().getFullYear() - this.yearOfManufacture;
});

// Virtual for formatted price
carSchema.virtual('formattedPrice').get(function() {
  return `₹${this.pricePerDay.toLocaleString()}`;
});

// Virtual for average rating
carSchema.virtual('averageRating').get(function() {
  return this.rating ? this.rating.toFixed(1) : '0.0';
});

// Pre-save middleware to validate data
carSchema.pre('save', function(next) {
  // Ensure images array is not empty if provided
  if (this.images && this.images.length === 0) {
    this.images = undefined;
  }
  
  // Set default location if not provided
  if (!this.location || !this.location.city) {
    this.location = {
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001'
    };
  }
  
  next();
});

// Static method to get cars by filters
carSchema.statics.getCarsByFilters = function(filters = {}) {
  const query = {};
  
  if (filters.brand) query.brand = filters.brand;
  if (filters.type) query.type = filters.type;
  if (filters.transmission) query.transmission = filters.transmission;
  if (filters.fuel) query.fuel = filters.fuel;
  if (filters.status) query.status = filters.status;
  if (filters.featured !== undefined) query.featured = filters.featured;
  
  if (filters.minPrice || filters.maxPrice) {
    query.pricePerDay = {};
    if (filters.minPrice) query.pricePerDay.$gte = filters.minPrice;
    if (filters.maxPrice) query.pricePerDay.$lte = filters.maxPrice;
  }
  
  if (filters.minSeats || filters.maxSeats) {
    query.seats = {};
    if (filters.minSeats) query.seats.$gte = filters.minSeats;
    if (filters.maxSeats) query.seats.$lte = filters.maxSeats;
  }
  
  if (filters.minYear || filters.maxYear) {
    query.yearOfManufacture = {};
    if (filters.minYear) query.yearOfManufacture.$gte = filters.minYear;
    if (filters.maxYear) query.yearOfManufacture.$lte = filters.maxYear;
  }
  
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { brand: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  return this.find(query);
};

// Instance method to calculate availability
carSchema.methods.isAvailable = function() {
  return this.status === 'available';
};

// Instance method to update rental stats
carSchema.methods.updateRentalStats = function(rentalAmount) {
  this.totalRentals += 1;
  this.totalRevenue += rentalAmount;
  return this.save();
};

module.exports = mongoose.model('Car', carSchema);
