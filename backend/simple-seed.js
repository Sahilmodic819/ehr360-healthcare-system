// Simple working seed script
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Insurer = require('./models/Insurer');

async function createWorkingSeededData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📡 Connected to MongoDB');
        
        // Clear existing users
        await User.deleteMany({});
        await Patient.deleteMany({});
        await Doctor.deleteMany({});
        await Insurer.deleteMany({});
        
        console.log('🗑️ Cleared existing data');
        
        // Create test patient
        console.log('\n👥 Creating Test Patient...');
        const patientPassword = await bcrypt.hash('password123', 10);
        const patientUser = await User.create({
            email: 'test.patient@example.com',
            passwordHash: patientPassword,
            role: 'patient',
            aabhaId: '10000000000001',
            aadharNo: '111122223333'
        });
        
        await Patient.create({
            userId: patientUser._id,
            fullName: 'Test Patient',
            email: 'test.patient@example.com',
            aabhaId: '10000000000001',
            aadharNo: '111122223333',
            phone: '9876543210',
            dob: new Date('2000-01-10'),
            gender: 'Male'
        });
        
        console.log('✅ Created: test.patient@example.com / password123');
        
        // Create test doctor
        console.log('\n👨‍⚕️ Creating Test Doctor...');
        const doctorPassword = await bcrypt.hash('doctor123', 10);
        const doctorUser = await User.create({
            email: 'test.doctor@hospital.com',
            passwordHash: doctorPassword,
            role: 'doctor',
            aabhaId: '10000000000002',
            aadharNo: '111122223334'
        });
        
        await Doctor.create({
            userId: doctorUser._id,
            fullName: 'Dr. Test Doctor',
            email: 'test.doctor@hospital.com',
            aabhaId: '10000000000002',
            aadharNo: '111122223334',
            phone: '9876543211',
            specialty: 'General Medicine',
            nmcRegNo: 'NMC123456'
        });
        
        console.log('✅ Created: test.doctor@hospital.com / doctor123');
        
        // Create test insurer
        console.log('\n🏢 Creating Test Insurer...');
        const insurerPassword = await bcrypt.hash('insurer123', 10);
        const insurerUser = await User.create({
            email: 'test.insurer@insurance.com',
            passwordHash: insurerPassword,
            role: 'insurer',
            aabhaId: '10000000000003',
            aadharNo: '111122223335'
        });
        
        await Insurer.create({
            userId: insurerUser._id,
            fullName: 'Test Insurer',
            email: 'test.insurer@insurance.com',
            aabhaId: '10000000000003',
            aadharNo: '111122223335',
            phone: '9876543212',
            companyName: 'Test Insurance Co.',
            irdaiNo: 'IRDAI123'
        });
        
        console.log('✅ Created: test.insurer@insurance.com / insurer123');
        
        console.log('\n🎉 Simple seed data created successfully!');
        console.log('\n📋 LOGIN CREDENTIALS:');
        console.log('Patient: test.patient@example.com / password123');
        console.log('Doctor: test.doctor@hospital.com / doctor123');  
        console.log('Insurer: test.insurer@insurance.com / insurer123');
        
        await mongoose.disconnect();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    }
}

createWorkingSeededData();