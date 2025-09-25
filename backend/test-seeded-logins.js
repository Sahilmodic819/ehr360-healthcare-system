// Test seeded user logins specifically
const axios = require('axios');

const seededUsers = [
    { type: 'Patient', email: 'sahil.modi@email.com', password: 'password123' },
    { type: 'Doctor', email: 'dr.sharma@hospital.com', password: 'doctor123' },
    { type: 'Insurer', email: 'healthplus@insurance.com', password: 'insurer123' }
];

async function testSeededLogins() {
    console.log('🔍 Testing Seeded User Logins...\n');
    
    for (const user of seededUsers) {
        try {
            console.log(`🔐 Testing ${user.type} Login: ${user.email}`);
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: user.email,
                password: user.password
            });
            console.log(`✅ ${user.type} Login Success:`, response.data.message);
            console.log(`   Role: ${response.data.role}, UserID: ${response.data.userId}`);
        } catch (error) {
            console.log(`❌ ${user.type} Login Failed:`, error.response?.data?.message || error.message);
            console.log('   Details:', error.response?.data || 'No additional details');
        }
        console.log('');
    }
}

testSeededLogins();