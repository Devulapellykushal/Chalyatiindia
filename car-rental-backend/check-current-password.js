const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function checkCurrentPassword() {
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
      console.log('🔍 Current admin password hash:', admin.password);
      console.log('🔍 Testing passwords...');
      
      // Test old password
      const oldPasswordMatch = await bcrypt.compare('ChalyatiSecure2024!@#', admin.password);
      console.log('Old password (ChalyatiSecure2024!@#) match:', oldPasswordMatch);
      
      // Test common new passwords
      const testPasswords = [
        'NewPassword123!@#',
        'MyNewPassword2024!@#', 
        'SecurePassword123!@#',
        'NewSecurePassword123!@#',
        'Password123!@#'
      ];
      
      for (const testPass of testPasswords) {
        const match = await bcrypt.compare(testPass, admin.password);
        console.log(`Password "${testPass}" match: ${match}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

checkCurrentPassword();
