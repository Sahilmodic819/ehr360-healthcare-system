// Comprehensive API testing for all user types
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data for different user types - all require valid Aabha ID and Aadhar
const testData = {
    patient: {
        fullName: 'Test Patient User',
        email: 'test.patient@example.com',
        password: 'testpass123',
        confirmPassword: 'testpass123',
        aabhaId: '10000000000006', // Vikram Singh's available record
        aadharNo: '111122223338',
        phone: '9876543210'
    },
    doctor: {
        fullName: 'Dr. Test Doctor',
        email: 'test.doctor@hospital.com',
        password: 'testpass123',
        confirmPassword: 'testpass123',
        aabhaId: '10000000000009', // Simran Kaur's available record
        aadharNo: '111122223341',
        phone: '9876543211',
        nmcRegNo: 'NMC-TEST-123'
    },
    insurer: {
        fullName: 'Test Insurance Agent',
        email: 'test@testinsurance.com',
        password: 'testpass123',
        confirmPassword: 'testpass123',
        aabhaId: '10000000000010', // Rahul Desai's available record
        aadharNo: '111122223342',
        phone: '9876543212',
        irdaiNo: 'IRDAI-TEST-123',
        agencyCode: 'AGENCY-001'
    }
};

async function testRegistration(userType, data, endpoint) {
    try {
        console.log(`🧪 Testing ${userType} Registration...`);
        const response = await axios.post(`${BASE_URL}/auth/register/${endpoint}`, data);
        console.log(`✅ ${userType} Registration Success:`, response.data.message);
        return { success: true, data: response.data };
    } catch (error) {
        console.log(`❌ ${userType} Registration Error:`, error.response?.data?.message || error.message);
        console.log('   Error Details:', error.response?.data || 'No additional details');
        return { success: false, error: error.response?.data };
    }
}

async function testLogin(userType, email, password) {
    try {
        console.log(`🔐 Testing ${userType} Login...`);
        const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        console.log(`✅ ${userType} Login Success:`, response.data.message);
        return { success: true, data: response.data };
    } catch (error) {
        console.log(`❌ ${userType} Login Error:`, error.response?.data?.message || error.message);
        console.log('   Error Details:', error.response?.data || 'No additional details');
        return { success: false, error: error.response?.data };
    }
}

async function testExistingLogin() {
    console.log('\n🔍 Testing Existing User Logins...');
    
    const existingUsers = [
        { type: 'Patient', email: 'sahil.modi@email.com', password: 'password123' },
        { type: 'Doctor', email: 'dr.sharma@hospital.com', password: 'doctor123' },
        { type: 'Insurer', email: 'healthplus@insurance.com', password: 'insurer123' }
    ];
    
    for (const user of existingUsers) {
        await testLogin(user.type, user.email, user.password);
    }
}

async function runComprehensiveTests() {
    console.log('🚀 EHR360 COMPREHENSIVE API TESTING\n');
    console.log('=' .repeat(50));
    
    // Test all registration endpoints
    console.log('\n📝 REGISTRATION TESTING');
    console.log('-' .repeat(30));
    
    await testRegistration('Patient', testData.patient, 'patient');
    await testRegistration('Doctor', testData.doctor, 'doctor');
    await testRegistration('Insurer', testData.insurer, 'insurer');
    
    console.log('\n🔐 LOGIN TESTING (New Users)');
    console.log('-' .repeat(30));
    
    // Test login with newly registered users
    await testLogin('Patient', testData.patient.email, testData.patient.password);
    await testLogin('Doctor', testData.doctor.email, testData.doctor.password);
    await testLogin('Insurer', testData.insurer.email, testData.insurer.password);
    
    // Test existing users
    await testExistingLogin();
    
    console.log('\n🎉 COMPREHENSIVE API TESTING COMPLETE!');
    console.log('=' .repeat(50));
}

runComprehensiveTests();