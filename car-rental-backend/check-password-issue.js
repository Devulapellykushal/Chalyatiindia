const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function checkPassword() {
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
      console.log('- lockUntil:', admin.lockUntil);
      console.log('- failedLoginAttempts:', admin.failedLoginAttempts);
      
      // Test with your new password
      const newPasswordMatch = await bcrypt.compare('Kushal@123$', admin.password);
      console.log('New password (Kushal@123$) match:', newPasswordMatch);
      
      // Test with original password
      const originalMatch = await bcrypt.compare('ChalyatiSecure2024!@#', admin.password);
      console.log('Original password match:', originalMatch);
      
      if (!newPasswordMatch && !originalMatch) {
        console.log('❌ Neither password works - resetting to working state...');
        const hashedPassword = await bcrypt.hash('ChalyatiSecure2024!@#', 12);
        admin.password = hashedPassword;
        admin.isActive = true;
        admin.lockUntil = undefined;
        admin.failedLoginAttempts = 0;
        await admin.save();
        console.log('✅ Password reset to working state');
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

checkPassword();
