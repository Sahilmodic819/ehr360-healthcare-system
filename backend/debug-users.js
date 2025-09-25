// Debug seeded user data
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

async function debugSeededUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📡 Connected to MongoDB');
        
        const testEmail = 'sahil.modi@email.com';
        const testPassword = 'password123';
        
        const user = await User.findOne({ email: testEmail });
        if (!user) {
            console.log('❌ User not found:', testEmail);
        } else {
            console.log('\n👤 Found user:', testEmail);
            console.log('   User ID:', user._id);
            console.log('   Role:', user.role);
            console.log('   PasswordHash exists:', !!user.passwordHash);
            console.log('   PasswordHash length:', user.passwordHash?.length || 0);
            console.log('   Aabha ID:', user.aabhaId);
            
            // Test password comparison
            const isPasswordValid = await bcrypt.compare(testPassword, user.passwordHash || '');
            console.log('   Password Valid:', isPasswordValid);
        }
        
        // Check all users count
        const totalUsers = await User.countDocuments();
        console.log('\n📊 Total users in database:', totalUsers);
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

debugSeededUsers();