const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function checkAndFixPassword() {
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
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });
    
    const Admin = mongoose.model('Admin', adminSchema);
    
    // Find the admin
    const admin = await Admin.findOne({ username: 'chalyatiindia' });
    if (admin) {
      console.log('🔍 Found admin:', admin.username);
      console.log('🔍 Current password hash:', admin.password);
      
      // Test the password
      const testPassword = 'ChalyatiSecure2024!@#';
      const isMatch = await bcrypt.compare(testPassword, admin.password);
      console.log('🔍 Password match test:', isMatch);
      
      if (!isMatch) {
        console.log('❌ Password does not match. Fixing...');
        
        // Create correct password hash
        const correctHash = await bcrypt.hash(testPassword, 12);
        admin.password = correctHash;
        admin.failedLoginAttempts = 0;
        admin.lockUntil = undefined;
        await admin.save();
        
        console.log('✅ Password fixed successfully');
        console.log('�� Username: chalyatiindia');
        console.log('🔑 Password: ChalyatiSecure2024!@#');
        console.log('🔑 New hash:', correctHash);
      } else {
        console.log('✅ Password is correct');
      }
    } else {
      console.log('❌ Admin not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

checkAndFixPassword();
