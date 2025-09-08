const mongoose = require('mongoose');
const Car = require('./models/Car');
const config = require('./config');

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return fixCarImages();
  })
  .then(() => {
    console.log('✅ All car images fixed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });

async function fixCarImages() {
  try {
    // The image path from Kia CARENS
    const kiaCarensImage = '/uploads/car-1756809844887-758437824.png';
    
    // Find all cars with broken image paths
    const carsWithBrokenImages = await Car.find({
      images: { $in: ['/assets/logo.png'] }
    });
    
    console.log(`Found ${carsWithBrokenImages.length} cars with broken images`);
    
    // Update each car
    for (const car of carsWithBrokenImages) {
      console.log(`Updating ${car.title}...`);
      
      // Update the car with the Kia CARENS image
      await Car.findByIdAndUpdate(
        car._id,
        { 
          images: [kiaCarensImage],
          updatedAt: new Date()
        },
        { new: true }
      );
      
      console.log(`✅ Updated ${car.title}`);
    }
    
    console.log(`\n🎉 Successfully updated ${carsWithBrokenImages.length} cars with the Kia CARENS image!`);
    
  } catch (error) {
    console.error('Error fixing car images:', error);
    throw error;
  }
}
