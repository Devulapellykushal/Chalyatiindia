const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function checkCurrentState() {
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
      console.log('🔍 Current admin state:');
      console.log('- Username:', admin.username);
      console.log('- Password hash:', admin.password);
      console.log('- isActive:', admin.isActive);
      console.log('- failedLoginAttempts:', admin.failedLoginAttempts);
      console.log('- lockUntil:', admin.lockUntil);
      console.log('- Updated at:', admin.updatedAt);
      
      // Test with original password
      const originalMatch = await bcrypt.compare('ChalyatiSecure2024!@#', admin.password);
      console.log('Original password match:', originalMatch);
      
      // Test with common new passwords
      const testPasswords = [
        'NewPassword123!@#',
        'MyNewPassword2024!@#',
        'SecurePassword123!@#',
        'NewSecurePassword123!@#'
      ];
      
      console.log('\n🔍 Testing common passwords:');
      for (const testPass of testPasswords) {
        const match = await bcrypt.compare(testPass, admin.password);
        console.log(`- "${testPass}": ${match ? '✅ WORKS' : '❌'}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

checkCurrentState();
