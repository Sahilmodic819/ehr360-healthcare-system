// Manually create a test user to verify the process
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

async function createTestUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📡 Connected to MongoDB');
        
        // Delete existing test user
        await User.deleteOne({ email: 'manual.test@example.com' });
        
        const testPassword = 'testpass123';
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        
        console.log('🔒 Hashed password length:', hashedPassword.length);
        console.log('🔒 Hashed password sample:', hashedPassword.substring(0, 20) + '...');
        
        const user = new User({
            email: 'manual.test@example.com',
            passwordHash: hashedPassword,
            role: 'patient',
            aabhaId: '12345678901234',
            aadharNo: '123456789012'
        });
        
        await user.save();
        console.log('✅ User created successfully');
        
        // Verify the saved user
        const savedUser = await User.findOne({ email: 'manual.test@example.com' });
        console.log('\n👤 Saved user verification:');
        console.log('   Email:', savedUser.email);
        console.log('   Role:', savedUser.role);
        console.log('   PasswordHash exists:', !!savedUser.passwordHash);
        console.log('   PasswordHash length:', savedUser.passwordHash?.length || 0);
        
        // Test password comparison
        const isValid = await bcrypt.compare(testPassword, savedUser.passwordHash);
        console.log('   Password validation:', isValid ? '✅ Valid' : '❌ Invalid');
        
        await mongoose.disconnect();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    }
}

createTestUser();