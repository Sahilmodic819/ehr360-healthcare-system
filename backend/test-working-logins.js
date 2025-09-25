// Test all working credentials
const axios = require('axios');

const workingCredentials = [
    { type: 'Patient', email: 'test.patient@example.com', password: 'password123' },
    { type: 'Doctor', email: 'test.doctor@hospital.com', password: 'doctor123' },
    { type: 'Insurer', email: 'test.insurer@insurance.com', password: 'insurer123' }
];

async function testAllWorkingLogins() {
    console.log('🔐 Testing All Working Login Credentials...\n');
    
    for (const cred of workingCredentials) {
        try {
            console.log(`🔐 Testing ${cred.type}: ${cred.email}`);
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: cred.email,
                password: cred.password
            });
            console.log(`✅ ${cred.type} Login Success: ${response.data.message}`);
            console.log(`   Role: ${response.data.role}, UserID: ${response.data.userId}`);
        } catch (error) {
            console.log(`❌ ${cred.type} Login Failed: ${error.response?.data?.message || error.message}`);
        }
        console.log('');
    }
    
    console.log('🎉 All login tests completed!');
}

testAllWorkingLogins();