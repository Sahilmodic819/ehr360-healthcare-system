// Check existing users to find available master records
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Master = require('./models/MasterRecord');
const User = require('./models/User');

async function findAvailableMaster() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📡 Connected to MongoDB');
        
        const masters = await Master.find().limit(10);
        const users = await User.find();
        const usedAabhaIds = users.map(user => user.aabhaId);
        
        console.log('\n🔍 Available Master Records for New Registration:');
        let count = 0;
        for (const master of masters) {
            if (!usedAabhaIds.includes(master.aabhaId)) {
                count++;
                console.log(`${count}. Name: ${master.name}`);
                console.log(`   Aabha ID: ${master.aabhaId}`);
                console.log(`   Aadhar: ${master.aadharNo}`);
                console.log(`   DOB: ${master.dob.toISOString().split('T')[0]}`);
                console.log('   --- Available for new registration ---');
                
                if (count >= 3) break; // Show first 3 available
            }
        }
        
        if (count === 0) {
            console.log('❌ No available master records found for new registration');
        }
        
        await mongoose.disconnect();
        console.log('\n📡 Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

findAvailableMaster();