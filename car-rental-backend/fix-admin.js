const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function checkAndFixAdmin() {
  try {
    await mongoose.connect('mongodb+srv://dev:dev@cluster0.yeftyle.mongodb.net/car-rental?retryWrites=true&w=majority&appName=Cluster0');
    
    const adminSchema = new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      role: String,
      fullName: String,
      permissions: [String],
      lastLogin: Date,
      failedLoginAttempts: Number,
      lockUntil: Date,
      isActive: Boolean,
      loginAttempts: Number,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    
    const Admin = mongoose.model('Admin', adminSchema);
    
    // Find the admin
    const admin = await Admin.findOne({ username: 'chalyatiindia' });
    if (admin) {
      console.log('🔍 Found admin:', admin.username);
      console.log('🔍 isActive:', admin.isActive);
      console.log('🔍 loginAttempts:', admin.loginAttempts);
      console.log('🔍 lockUntil:', admin.lockUntil);
      
      // Fix the admin record
      admin.isActive = true;
      admin.loginAttempts = 0;
      admin.lockUntil = undefined;
      admin.failedLoginAttempts = 0;
      await admin.save();
      
      console.log('✅ Admin record fixed');
      console.log('🔑 Username: chalyatiindia');
      console.log('🔑 Password: ChalyatiSecure2024!@#');
      console.log('🔑 isActive: true');
      console.log('🔑 loginAttempts: 0');
    } else {
      console.log('❌ Admin not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

checkAndFixAdmin();
