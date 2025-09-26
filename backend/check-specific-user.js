// Check for specific user
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/EHR360');
    console.log('🔍 Checking for test.patient@example.com...\n');

    const testUser = await User.findOne({ email: 'test.patient@example.com' });
    
    if (testUser) {
      console.log('✅ Found test.patient@example.com:');
      console.log('- Role:', testUser.role);
      console.log('- Created:', testUser.createdAt);
      console.log('- Password hash exists:', !!testUser.passwordHash);
    } else {
      console.log('❌ test.patient@example.com NOT FOUND');
      
      console.log('\n📋 Available users:');
      const allUsers = await User.find({}).select('email role');
      allUsers.forEach(user => {
        console.log(`- ${user.email} (${user.role})`);
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUser();