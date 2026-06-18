const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
require('dotenv').config();

const User = require('./models/User');
const connectDB = require('./config/database');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to ask questions
const question = (query) => {
  return new Promise(resolve => rl.question(query, resolve));
};

const createAdmin = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Get admin details from user
    console.log('\n--- Create New Admin User ---');
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User with this email already exists!');
      process.exit(1);
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('--------------------------------');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log(`ID: ${admin._id}`);
    console.log('--------------------------------');

    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
