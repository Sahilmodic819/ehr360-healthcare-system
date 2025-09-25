// Check master records in database
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Master = require('./models/MasterRecord');

async function checkMasterRecords() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📡 Connected to MongoDB');
        
        const masters = await Master.find().limit(5);
        console.log('\n🏥 Available Master Records:');
        masters.forEach((master, index) => {
            console.log(`${index + 1}. Name: ${master.name}`);
            console.log(`   Aabha ID: ${master.aabhaId}`);
            console.log(`   Aadhar: ${master.aadharNo}`);
            console.log(`   DOB: ${master.dob}`);
            console.log('   ---');
        });
        
        await mongoose.disconnect();
        console.log('\n📡 Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkMasterRecords();