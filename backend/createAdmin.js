const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const adminEmail = "admin@brozento.com";
    
    // Check karein ke admin pehle se hai ya nahi
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit();
    }

    // Password ko secure (hash) karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Naya Admin banayein
    await User.create({
      name: "Brozento Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin Created Successfully!");
    console.log("Email: admin@brozento.com");
    console.log("Password: admin123");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();