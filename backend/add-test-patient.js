// Add test.patient@example.com back to database
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Patient = require('./models/Patient');

async function addTestPatient() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/EHR360');
    console.log('📡 Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test.patient@example.com' });
    if (existingUser) {
      console.log('✅ test.patient@example.com already exists');
      return;
    }

    // Create the test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const testUser = new User({
      email: 'test.patient@example.com',
      passwordHash: hashedPassword,
      role: 'patient'
    });

    await testUser.save();

    // Create patient profile
    const testPatient = new Patient({
      userId: testUser._id,
      fullName: 'Test Patient',
      aabhaId: '10000000000999',
      aadharNo: '999999999999',
      phone: '9999999999',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      address: '123 Test Street, Test City',
      bloodGroup: 'O+',
      height: 175,
      weight: 70,
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '8888888888',
        relationship: 'Friend'
      }
    });

    await testPatient.save();

    console.log('✅ Created test.patient@example.com with profile');
    console.log('📧 Email: test.patient@example.com');
    console.log('🔑 Password: password123');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addTestPatient();