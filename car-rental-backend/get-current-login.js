const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function getCurrentPassword() {
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
      console.log('🔍 Current admin details:');
      console.log('- Username:', admin.username);
      console.log('- Password hash:', admin.password);
      console.log('- Updated at:', admin.updatedAt);
      console.log('- isActive:', admin.isActive);
      
      // Test common passwords
      const testPasswords = [
        'ChalyatiSecure2024!@#',
        'NewSecurePassword123!@#',
        'NewPassword123!@#',
        'MyNewPassword2024!@#',
        'SecurePassword123!@#'
      ];
      
      console.log('\n🔍 Testing passwords:');
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

getCurrentPassword();
