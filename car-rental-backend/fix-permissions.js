const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fixAdminPermissions() {
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
    
    // Delete the problematic admin
    await Admin.deleteOne({ username: 'chalyatiindia' });
    console.log('✅ Deleted problematic admin record');
    
    // Create a new admin with correct permissions
    const hashedPassword = await bcrypt.hash('ChalyatiSecure2024!@#', 12);
    const admin = new Admin({
      username: 'chalyatiindia',
      email: 'admin@chalyati.com',
      password: hashedPassword,
      role: 'super_admin',
      fullName: 'Chalyati Admin',
      permissions: [
        'cars.create',
        'cars.read',
        'cars.update',
        'cars.delete',
        'users.read',
        'users.update',
        'users.delete',
        'analytics.read',
        'settings.update'
      ],
      isActive: true,
      loginAttempts: 0,
      failedLoginAttempts: 0,
      lockUntil: undefined
    });
    
    await admin.save();
    console.log('✅ New admin created with correct permissions');
    console.log('🔑 Username: chalyatiindia');
    console.log('🔑 Password: ChalyatiSecure2024!@#');
    console.log('🔑 Role: super_admin');
    console.log('🔑 Permissions: All valid permissions');
    console.log('🔑 isActive: true');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

fixAdminPermissions();
