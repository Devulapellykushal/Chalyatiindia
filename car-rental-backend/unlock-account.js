const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function unlockAccount() {
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
      console.log('- lockUntil:', admin.lockUntil);
      console.log('- failedLoginAttempts:', admin.failedLoginAttempts);
      console.log('- loginAttempts:', admin.loginAttempts);
      
      // Unlock the account
      admin.lockUntil = undefined;
      admin.failedLoginAttempts = 0;
      admin.loginAttempts = 0;
      admin.isActive = true;
      await admin.save();
      
      console.log('✅ Account unlocked successfully');
      console.log('✅ All lock fields cleared');
      
      // Test password
      const passwordMatch = await bcrypt.compare('ChalyatiSecure2024!@#', admin.password);
      console.log('Password verification:', passwordMatch);
      
      console.log('\n🔑 LOGIN CREDENTIALS:');
      console.log('Username: chalyatiindia');
      console.log('Password: ChalyatiSecure2024!@#');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

unlockAccount();
