const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://dev:dev@cluster0.yeftyle.mongodb.net/car-rental?retryWrites=true&w=majority&appName=Cluster0');

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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

async function unlockAdmin() {
  try {
    // Delete existing admin
    await Admin.deleteOne({ username: 'chalyatiindia' });
    console.log('✅ Existing admin deleted');
    
    // Create new unlocked admin
    const hashedPassword = await bcrypt.hash('ChalyatiSecure2024!@#', 12);
    const admin = new Admin({
      username: 'chalyatiindia',
      email: 'admin@chalyati.com',
      password: hashedPassword,
      role: 'super_admin',
      fullName: 'Chalyati Admin',
      permissions: ['all'],
      failedLoginAttempts: 0,
      lockUntil: undefined
    });
    
    await admin.save();
    console.log('✅ New admin created successfully');
    console.log('🔑 Username: chalyatiindia');
    console.log('🔑 Password: ChalyatiSecure2024!@#');
    console.log('🔓 Account is unlocked and ready to use');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

unlockAdmin();
