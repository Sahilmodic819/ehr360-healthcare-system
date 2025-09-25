// Test manual user login
const axios = require('axios');

async function testManualUserLogin() {
    try {
        console.log('🔐 Testing manual user login...');
        
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'manual.test@example.com',
            password: 'testpass123'
        });
        
        console.log('✅ Login Success:', response.data.message);
        console.log('   Role:', response.data.role);
        console.log('   UserID:', response.data.userId);
        
    } catch (error) {
        console.log('❌ Login Failed:', error.response?.data?.message || error.message);
        console.log('   Details:', error.response?.data || 'No additional details');
    }
}

testManualUserLogin();