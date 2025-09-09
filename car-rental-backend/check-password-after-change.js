const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function checkPasswordAfterChange() {
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
    
    const admin = await Admin.findOne({ username: 'chalyatiindia' });
    if (admin) {
      console.log('🔍 Current password hash:', admin.password);
      console.log('🔍 Updated at:', admin.updatedAt);
      
      // Test the password that should work
      const testPassword = 'NewSecurePassword123!@#';
      const match = await bcrypt.compare(testPassword, admin.password);
      console.log('Test password match:', match);
      
      // Test old password
      const oldMatch = await bcrypt.compare('ChalyatiSecure2024!@#', admin.password);
      console.log('Old password match:', oldMatch);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

checkPasswordAfterChange();
