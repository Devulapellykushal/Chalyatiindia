const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function verifyReset() {
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
      const verification = await bcrypt.compare('ChalyatiSecure2024!@#', admin.password);
      console.log('Password verification:', verification);
      console.log('Admin isActive:', admin.isActive);
      console.log('Admin failedLoginAttempts:', admin.failedLoginAttempts);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

verifyReset();
