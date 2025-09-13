const express = require('express');
const Car = require('../models/Car');
const router = express.Router();

// GET /api/cars - Get all cars with optional filtering
router.get('/', async (req, res) => {
  try {
    console.log('Cars route called with headers:', req.headers);
    console.log('Cars route called with origin:', req.get('Origin'));
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      brand,
      type,
      transmission,
      fuel,
      minPrice,
      maxPrice,
      minSeats,
      maxSeats,
      minYear,
      maxYear,
      featured,
      status = 'available'
    } = req.query;

    // Build filter object
    const filters = {
      search,
      brand,
      type,
      transmission,
      fuel,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      minSeats: minSeats ? parseInt(minSeats) : undefined,
      maxSeats: maxSeats ? parseInt(maxSeats) : undefined,
      minYear: minYear ? parseInt(minYear) : undefined,
      maxYear: maxYear ? parseInt(maxYear) : undefined,
      featured: featured !== undefined ? featured === 'true' : undefined,
      status
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    // Build query
    const query = Car.getCarsByFilters(filters);

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
    console.error('Error fetching cars:', error);
    console.error('Error stack:', error.stack);
    console.error('Request headers:', req.headers);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cars',
      error: error.message
    });
  }
});

// GET /api/cars/featured - Get featured cars
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const cars = await Car.find({ 
      featured: true, 
      status: 'available' 
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: cars
    });
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured cars',
      error: error.message
    });
  }
});

// GET /api/cars/stats - Get car statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Car.aggregate([
      {
        $group: {
          _id: null,
          totalCars: { $sum: 1 },
          totalValue: { $sum: '$pricePerDay' },
          avgPrice: { $avg: '$pricePerDay' },
          featuredCars: {
            $sum: { $cond: ['$featured', 1, 0] }
          },
          availableCars: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          }
        }
      }
    ]);

    const brandStats = await Car.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const typeStats = await Car.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const transmissionStats = await Car.aggregate([
      { $group: { _id: '$transmission', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const fuelStats = await Car.aggregate([
      { $group: { _id: '$fuel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalCars: 0,
          totalValue: 0,
          avgPrice: 0,
          featuredCars: 0,
          availableCars: 0
        },
        brandStats,
        typeStats,
        transmissionStats,
        fuelStats
      }
    });
  } catch (error) {
    console.error('Error fetching car stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch car statistics',
      error: error.message
    });
  }
});

// GET /api/cars/options - Get filter options
router.get('/options', async (req, res) => {
  try {
    const brands = await Car.distinct('brand');
    const types = await Car.distinct('type');
    const transmissions = await Car.distinct('transmission');
    const fuels = await Car.distinct('fuel');
    const cities = await Car.distinct('location.city');

    // Get price range
    const priceRange = await Car.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$pricePerDay' },
          maxPrice: { $max: '$pricePerDay' }
        }
      }
    ]);

    // Get year range
    const yearRange = await Car.aggregate([
      {
        $match: { yearOfManufacture: { $exists: true, $ne: null } }
      },
      {
        $group: {
          _id: null,
          minYear: { $min: '$yearOfManufacture' },
          maxYear: { $max: '$yearOfManufacture' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        brands: brands.sort(),
        types: types.sort(),
        transmissions: transmissions.sort(),
        fuels: fuels.sort(),
        cities: cities.sort(),
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 },
        yearRange: yearRange[0] || { minYear: 1990, maxYear: new Date().getFullYear() }
      }
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filter options',
      error: error.message
    });
  }
});

// GET /api/cars/:id - Get single car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch car',
      error: error.message
    });
  }
});

// POST /api/cars - Create new car
router.post('/', async (req, res) => {
  try {
    const carData = req.body;
    
    // Validate required fields
    const requiredFields = ['title', 'brand', 'type', 'transmission', 'fuel', 'pricePerDay', 'seats', 'mileageKm'];
    const missingFields = requiredFields.filter(field => !carData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Process images array
    if (carData.images && typeof carData.images === 'string') {
      carData.images = carData.images.split(',').map(img => img.trim()).filter(img => img);
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

// PUT /api/cars/:id - Update car
router.put('/:id', async (req, res) => {
  try {
    const carData = req.body;
    
    // Process images array
    if (carData.images && typeof carData.images === 'string') {
      carData.images = carData.images.split(',').map(img => img.trim()).filter(img => img);
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

// DELETE /api/cars/:id - Delete car
router.delete('/:id', async (req, res) => {
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

// PATCH /api/cars/:id/featured - Toggle featured status
router.patch('/:id/featured', async (req, res) => {
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

// PATCH /api/cars/:id/status - Update car status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['available', 'rented', 'maintenance', 'unavailable'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: available, rented, maintenance, unavailable'
      });
    }

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.json({
      success: true,
      message: 'Car status updated successfully',
      data: car
    });
  } catch (error) {
    console.error('Error updating car status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update car status',
      error: error.message
    });
  }
});

module.exports = router;
