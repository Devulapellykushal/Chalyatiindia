const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/car-rental');

const adminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  fullName: String,
  permissions: [String],
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

async function resetPassword() {
  try {
    const admin = await Admin.findOne({ username: 'chalyatiindia' });
    if (admin) {
      const hashedPassword = await bcrypt.hash('ChalyatiSecure2024!@#', 12);
      admin.password = hashedPassword;
      await admin.save();
      console.log('✅ Admin password reset to: ChalyatiSecure2024!@#');
    } else {
      console.log('❌ Admin not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  mongoose.connection.close();
}

resetPassword();
