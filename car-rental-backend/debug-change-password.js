const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function debugChangePassword() {
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
    
    // Find admin by username
    const admin = await Admin.findOne({ username: 'chalyatiindia' });
    if (admin) {
      console.log('🔍 Admin found:');
      console.log('- ID:', admin._id);
      console.log('- Username:', admin.username);
      console.log('- Current password hash:', admin.password);
      
      // Test password change process
      const oldPassword = 'ChalyatiSecure2024!@#';
      const newPassword = 'NewSecurePassword123!@#';
      
      console.log('\n🔍 Testing password change process:');
      
      // Verify old password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, admin.password);
      console.log('Old password valid:', isOldPasswordValid);
      
      if (isOldPasswordValid) {
        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        console.log('New password hashed:', hashedNewPassword);
        
        // Update password
        admin.password = hashedNewPassword;
        admin.updatedAt = new Date();
        await admin.save();
        
        console.log('✅ Password updated successfully');
        
        // Verify new password works
        const newPasswordValid = await bcrypt.compare(newPassword, admin.password);
        console.log('New password verification:', newPasswordValid);
        
        // Verify old password no longer works
        const oldPasswordStillValid = await bcrypt.compare(oldPassword, admin.password);
        console.log('Old password still valid (should be false):', oldPasswordStillValid);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

debugChangePassword();
