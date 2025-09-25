// Test script for API endpoints
const axios = require('axios');

async function testPatientRegistration() {
    const testData = {
        fullName: 'Priya Sharma Test',
        email: 'priya.test@testmail.com',
        password: 'testpass123',
        confirmPassword: 'testpass123',
        aabhaId: '10000000000003', // Priya Sharma's Aabha ID
        aadharNo: '111122223335', // Priya Sharma's Aadhar
        phone: '9876543210'
    };

    try {
        console.log('🧪 Testing Patient Registration API...');
        const response = await axios.post('http://localhost:5000/api/auth/register/patient', testData);
        console.log('✅ Registration Success:', response.data.message);
        return response.data;
    } catch (error) {
        console.log('❌ Registration Error:', error.response?.data?.message || error.message);
        console.log('   Error Details:', error.response?.data || 'No additional details');
        return null;
    }
}

async function testLogin() {
    const loginData = {
        email: 'priya.test@testmail.com',
        password: 'testpass123'
    };

    try {
        console.log('🔐 Testing Patient Login...');
        const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
        console.log('✅ Login Success:', response.data.message);
        return response.data;
    } catch (error) {
        console.log('❌ Login Error:', error.response?.data?.message || error.message);
        console.log('   Error Details:', error.response?.data || 'No additional details');
        return null;
    }
}

async function runTests() {
    console.log('🚀 Starting EHR360 API Testing...\n');
    
    // Test patient registration
    await testPatientRegistration();
    console.log('\n');
    
    // Test login with existing user
    await testLogin();
    console.log('\n');
    
    console.log('📋 API Testing Complete!');
}

runTests();