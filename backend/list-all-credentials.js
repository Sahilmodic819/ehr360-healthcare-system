// Check all available credentials
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function getAllCredentials() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/EHR360');
    console.log('🔍 CHECKING ALL AVAILABLE CREDENTIALS...\n');

    const users = await User.find({}).select('email role createdAt');
    
    console.log('📋 COMPLETE CREDENTIALS LIST:');
    console.log('=====================================\n');

    // Group by role
    const patients = users.filter(u => u.role === 'patient');
    const doctors = users.filter(u => u.role === 'doctor');
    const insurers = users.filter(u => u.role === 'insurer');

    console.log('👥 PATIENTS (password: password123):');
    console.log('-----------------------------------');
    patients.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
    });

    console.log('\n🩺 DOCTORS (password: doctor123):');
    console.log('----------------------------------');
    doctors.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
    });

    console.log('\n🏢 INSURERS (password: insurer123):');
    console.log('-----------------------------------');
    insurers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
    });

    console.log('\n📊 SUMMARY:');
    console.log(`Total Users: ${users.length}`);
    console.log(`Patients: ${patients.length}`);
    console.log(`Doctors: ${doctors.length}`);
    console.log(`Insurers: ${insurers.length}`);

    console.log('\n🎯 QUICK TEST CREDENTIALS:');
    console.log('========================');
    if (patients.length > 0) console.log(`Patient: ${patients[0].email} / password123`);
    if (doctors.length > 0) console.log(`Doctor: ${doctors[0].email} / doctor123`);
    if (insurers.length > 0) console.log(`Insurer: ${insurers[0].email} / insurer123`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getAllCredentials();