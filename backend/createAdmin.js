const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

// Google DNS for Node.js SRV lookup (MongoDB Atlas ke liye zaroori)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const createAdmin = async () => {
  try {
    // MongoDB se connect karein
    await connectDB();

    const adminEmail = 'admin@brozento.com';
    const newPassword = 'Brozento@2026#Admin'; // Naya Strong Password

    // Check karein ke admin pehle se hai ya nahi
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists!');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Naya password hash karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Admin user banayein
    await User.create({
      name: 'Brozento Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin Created Successfully!');
    console.log('📧 Email: ' + adminEmail);
    console.log('🔑 Password: ' + newPassword);
    console.log('⚠️  Is password ko safe rakhein aur login ke baad change karein.');

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Admin Creation Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();