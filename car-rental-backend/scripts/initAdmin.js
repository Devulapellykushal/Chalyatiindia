const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const config = require('../config');

const initializeAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB for admin initialization');

    // Check if any admins exist
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      console.log('🔧 No admins found. Creating default admin...');
      
      const admin = await Admin.createDefaultAdmin();
      console.log('✅ Default admin created successfully:');
      console.log(`   Username: ${admin.username}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'santoshmetta'}`);
    } else {
      console.log(`✅ Found ${adminCount} existing admin(s). Skipping initialization.`);
    }

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Admin initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during admin initialization:', error);
    process.exit(1);
  }
};

// Run initialization
initializeAdmin();
