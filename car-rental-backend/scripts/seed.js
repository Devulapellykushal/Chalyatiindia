const mongoose = require('mongoose');
const Car = require('../models/Car');
const { seedCars } = require('../data/seedData');
const config = require('../config');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing cars
    const existingCars = await Car.countDocuments();
    if (existingCars > 0) {
      console.log(`🗑️  Clearing ${existingCars} existing cars...`);
      await Car.deleteMany({});
      console.log('✅ Existing cars cleared');
    }

    // Insert seed cars
    console.log(`📝 Inserting ${seedCars.length} cars...`);
    const cars = await Car.insertMany(seedCars);
    console.log(`✅ Successfully inserted ${cars.length} cars`);

    // Display summary
    const stats = await Car.aggregate([
      {
        $group: {
          _id: null,
          totalCars: { $sum: 1 },
          featuredCars: { $sum: { $cond: ['$featured', 1, 0] } },
          avgPrice: { $avg: '$pricePerDay' },
          totalValue: { $sum: '$pricePerDay' }
        }
      }
    ]);

    const brandStats = await Car.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Database Summary:');
    console.log(`   Total Cars: ${stats[0].totalCars}`);
    console.log(`   Featured Cars: ${stats[0].featuredCars}`);
    console.log(`   Average Price: ₹${Math.round(stats[0].avgPrice)}`);
    console.log(`   Total Value: ₹${stats[0].totalValue.toLocaleString()}`);
    
    console.log('\n🏷️  Cars by Brand:');
    brandStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} cars`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
seedDatabase();
