// backend/scripts/seedTestUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Insurer = require('../models/Insurer');

const testUsers = [
  {
    email: 'sahil@example.com',
    password: 'password123',
    role: 'patient',
    profile: {
      fullName: 'Sahil Patient',
      phone: '+1-555-0101',
      dateOfBirth: '1995-01-15',
      gender: 'Male',
      address: '123 Patient Street, City, State 12345',
      aabhaId: 'AABHA001',
      emergencyContact: {
        name: 'Emergency Contact',
        phone: '+1-555-0102',
        relationship: 'Family'
      }
    }
  },
  {
    email: 'doctor@example.com',
    password: 'password123',
    role: 'doctor',
    profile: {
      fullName: 'Dr. Test Doctor',
      phone: '+1-555-0201',
      licenseNumber: 'DOC123456',
      specialization: 'General Medicine',
      hospitalName: 'Test General Hospital',
      experience: 5,
      address: '456 Doctor Avenue, City, State 12346'
    }
  },
  {
    email: 'test.insurer@gmail.com',
    password: 'password123',
    role: 'insurer',
    profile: {
      companyName: 'Test Insurance Company',
      phone: '+1-555-0301',
      licenseNumber: 'INS123456',
      contactPerson: 'Insurance Manager',
      address: '789 Insurance Plaza, City, State 12347'
    }
  }
];

async function seedTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/EHR360');
    console.log('Connected to MongoDB');

    // Clear existing test users
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    await Patient.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    await Doctor.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    await Insurer.deleteMany({ email: { $in: testUsers.map(u => u.email) } });

    console.log('Cleared existing test users');

    for (const userData of testUsers) {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create User
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        isVerified: true
      });
      await user.save();

      console.log(`Created user: ${userData.email}`);

      // Create role-specific profile
      if (userData.role === 'patient') {
        const patient = new Patient({
          userId: user._id,
          email: userData.email,
          ...userData.profile
        });
        await patient.save();
        console.log(`Created patient profile for: ${userData.email}`);
      }

      if (userData.role === 'doctor') {
        const doctor = new Doctor({
          userId: user._id,
          email: userData.email,
          ...userData.profile
        });
        await doctor.save();
        console.log(`Created doctor profile for: ${userData.email}`);
      }

      if (userData.role === 'insurer') {
        const insurer = new Insurer({
          userId: user._id,
          email: userData.email,
          ...userData.profile
        });
        await insurer.save();
        console.log(`Created insurer profile for: ${userData.email}`);
      }
    }

    console.log('\n✅ Test users created successfully!');
    console.log('\nLogin credentials:');
    testUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / password123`);
    });

  } catch (error) {
    console.error('Error seeding test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seedTestUsers();