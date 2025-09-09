const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function resetPassword() {
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
      const hashedPassword = await bcrypt.hash('ChalyatiSecure2024!@#', 12);
      admin.password = hashedPassword;
      admin.loginAttempts = 0;
      admin.lockUntil = undefined;
      await admin.save();
      console.log('✅ Password reset to original');
      console.log('🔑 Username: chalyatiindia');
      console.log('🔑 Password: ChalyatiSecure2024!@#');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

resetPassword();
