const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fixAdminLogin() {
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
      console.log('🔍 Admin account state:');
      console.log('- Username:', admin.username);
      console.log('- isActive:', admin.isActive);
      console.log('- failedLoginAttempts:', admin.failedLoginAttempts);
      console.log('- lockUntil:', admin.lockUntil);
      
      // Test with original password
      const originalMatch = await bcrypt.compare('ChalyatiSecure2024!@#', admin.password);
      console.log('Original password match:', originalMatch);
      
      if (!originalMatch) {
        console.log('❌ Original password not working - resetting...');
        const newHashedPassword = await bcrypt.hash('ChalyatiSecure2024!@#', 12);
        admin.password = newHashedPassword;
        admin.isActive = true;
        admin.failedLoginAttempts = 0;
        admin.lockUntil = undefined;
        await admin.save();
        console.log('✅ Admin password reset successfully');
      }
    } else {
      console.log('❌ Admin not found - creating new one...');
      const hashedPassword = await bcrypt.hash('ChalyatiSecure2024!@#', 12);
      const newAdmin = new Admin({
        username: 'chalyatiindia',
        email: 'admin@chalyati.com',
        password: hashedPassword,
        role: 'super_admin',
        fullName: 'Chalyati Admin',
        permissions: ['cars.create', 'cars.read', 'cars.update', 'cars.delete'],
        isActive: true,
        failedLoginAttempts: 0,
        lockUntil: undefined,
        loginAttempts: 0
      });
      await newAdmin.save();
      console.log('✅ New admin created successfully');
    }
    
    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('Username: chalyatiindia');
    console.log('Password: ChalyatiSecure2024!@#');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

fixAdminLogin();
