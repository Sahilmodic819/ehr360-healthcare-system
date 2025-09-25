// Comprehensive Frontend Testing Script
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5173';

// Test credentials
const TEST_ACCOUNTS = {
    patient: { email: 'test.patient@example.com', password: 'password123' },
    doctor: { email: 'test.doctor@hospital.com', password: 'doctor123' },
    insurer: { email: 'test.insurer@insurance.com', password: 'insurer123' }
};

class EHR360Tester {
    constructor() {
        this.tokens = {};
        this.testResults = {
            login: { patient: false, doctor: false, insurer: false },
            dashboard: { patient: false, doctor: false, insurer: false },
            apiEndpoints: { patient: [], doctor: [], insurer: [] },
            pdfFunctionality: false,
            crossRoleIntegration: false
        };
    }

    async testLogin(userType) {
        try {
            console.log(`\n🔐 Testing ${userType.toUpperCase()} Login...`);
            const credentials = TEST_ACCOUNTS[userType];
            
            const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
            
            if (response.data.token && response.data.role === userType) {
                this.tokens[userType] = response.data.token;
                this.testResults.login[userType] = true;
                console.log(`✅ ${userType} login successful`);
                console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
                console.log(`   UserID: ${response.data.userId}`);
                return true;
            }
            return false;
            
        } catch (error) {
            console.log(`❌ ${userType} login failed:`, error.response?.data?.message || error.message);
            return false;
        }
    }

    async testPatientEndpoints() {
        console.log('\n👤 Testing Patient API Endpoints...');
        const token = this.tokens.patient;
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };
        const endpoints = [
            { name: 'Profile', url: '/patients/profile' },
            { name: 'Medical Records', url: '/patients/records' },
            { name: 'Lab Reports', url: '/patients/lab-reports' },
            { name: 'Doctors', url: '/patients/doctors' },
            { name: 'Insurance Info', url: '/patients/insurance' }
        ];

        for (const endpoint of endpoints) {
            try {
                await axios.get(`${BASE_URL}${endpoint.url}`, { headers });
                console.log(`✅ ${endpoint.name}: Available`);
                this.testResults.apiEndpoints.patient.push(endpoint.name);
            } catch (error) {
                console.log(`❌ ${endpoint.name}: ${error.response?.status || 'Failed'} - ${error.response?.data?.message || 'Not available'}`);
            }
        }
    }

    async testDoctorEndpoints() {
        console.log('\n👨‍⚕️ Testing Doctor API Endpoints...');
        const token = this.tokens.doctor;
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };
        const endpoints = [
            { name: 'Profile', url: '/doctors/profile' },
            { name: 'Patients List', url: '/doctors/patients' },
            { name: 'Lab Upload', url: '/labs/upload' },
            { name: 'Medical Records', url: '/doctors/records' }
        ];

        for (const endpoint of endpoints) {
            try {
                await axios.get(`${BASE_URL}${endpoint.url}`, { headers });
                console.log(`✅ ${endpoint.name}: Available`);
                this.testResults.apiEndpoints.doctor.push(endpoint.name);
            } catch (error) {
                console.log(`❌ ${endpoint.name}: ${error.response?.status || 'Failed'} - ${error.response?.data?.message || 'Not available'}`);
            }
        }
    }

    async testInsurerEndpoints() {
        console.log('\n🏢 Testing Insurer API Endpoints...');
        const token = this.tokens.insurer;
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };
        const endpoints = [
            { name: 'Profile', url: '/insurers/profile' },
            { name: 'Clients', url: '/insurers/clients' },
            { name: 'Claims', url: '/claims' },
            { name: 'Risk Analysis', url: '/insurers/risk-analysis' }
        ];

        for (const endpoint of endpoints) {
            try {
                await axios.get(`${BASE_URL}${endpoint.url}`, { headers });
                console.log(`✅ ${endpoint.name}: Available`);
                this.testResults.apiEndpoints.insurer.push(endpoint.name);
            } catch (error) {
                console.log(`❌ ${endpoint.name}: ${error.response?.status || 'Failed'} - ${error.response?.data?.message || 'Not available'}`);
            }
        }
    }

    async testPDFCapabilities() {
        console.log('\n📄 Testing PDF Functionality...');
        
        // Test if lab reports endpoint supports file operations
        const token = this.tokens.doctor;
        if (!token) {
            console.log('❌ No doctor token available for PDF testing');
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        
        try {
            // Test PDF upload endpoint
            const response = await axios.get(`${BASE_URL}/labs/upload-form`, { headers });
            console.log('✅ PDF Upload endpoint available');
            this.testResults.pdfFunctionality = true;
        } catch (error) {
            console.log('❌ PDF Upload endpoint:', error.response?.data?.message || 'Not available');
        }

        // Check for existing PDF files in uploads directory
        const uploadsPath = path.join(__dirname, 'uploads', 'labReports');
        try {
            if (fs.existsSync(uploadsPath)) {
                const files = fs.readdirSync(uploadsPath);
                console.log(`📁 Found ${files.length} files in lab reports directory`);
                files.forEach(file => {
                    if (file.endsWith('.pdf')) {
                        console.log(`   📄 ${file}`);
                    }
                });
            }
        } catch (error) {
            console.log('📁 Uploads directory check failed');
        }
    }

    generateTestReport() {
        console.log('\n\n📊 COMPREHENSIVE TESTING REPORT');
        console.log('=' .repeat(50));
        
        // Login Tests
        console.log('\n🔐 LOGIN TESTS:');
        Object.entries(this.testResults.login).forEach(([user, success]) => {
            console.log(`   ${user.toUpperCase()}: ${success ? '✅ PASS' : '❌ FAIL'}`);
        });

        // API Endpoint Tests
        console.log('\n🔗 API ENDPOINT TESTS:');
        Object.entries(this.testResults.apiEndpoints).forEach(([user, endpoints]) => {
            console.log(`   ${user.toUpperCase()}: ${endpoints.length} endpoints available`);
            endpoints.forEach(endpoint => console.log(`     ✅ ${endpoint}`));
        });

        // PDF Functionality
        console.log('\n📄 PDF FUNCTIONALITY:');
        console.log(`   PDF Support: ${this.testResults.pdfFunctionality ? '✅ AVAILABLE' : '❌ NOT AVAILABLE'}`);

        // Overall Score
        const loginScore = Object.values(this.testResults.login).filter(Boolean).length;
        const totalEndpoints = Object.values(this.testResults.apiEndpoints).reduce((sum, arr) => sum + arr.length, 0);
        
        console.log('\n🎯 OVERALL SCORE:');
        console.log(`   Login Success: ${loginScore}/3 (${Math.round(loginScore/3*100)}%)`);
        console.log(`   API Endpoints: ${totalEndpoints} total`);
        console.log(`   PDF Ready: ${this.testResults.pdfFunctionality ? 'Yes' : 'No'}`);
        
        if (loginScore === 3 && totalEndpoints > 0) {
            console.log('\n🎉 SYSTEM READY FOR COMPREHENSIVE UI TESTING!');
            console.log('\n📋 UI TESTING CHECKLIST:');
            console.log('   □ Patient Dashboard - Login, Profile, Records, Lab Reports');
            console.log('   □ Doctor Dashboard - Patients, Lab Upload, Medical Records');  
            console.log('   □ Insurer Dashboard - Clients, Claims, Risk Analysis');
            console.log('   □ PDF Upload/Download/Viewing (CRITICAL)');
            console.log('   □ Cross-role Data Integration');
            console.log('   □ Real-time Updates and Notifications');
            
            console.log('\n🚀 READY TO BEGIN UI TESTING AT: http://localhost:5173');
        }
    }

    async runAllTests() {
        console.log('🚀 EHR360 COMPREHENSIVE SYSTEM TESTING');
        console.log('📅 Date:', new Date().toLocaleString());
        console.log('🔗 Frontend:', FRONTEND_URL);
        console.log('🔗 Backend:', BASE_URL);
        
        // Test all logins
        await this.testLogin('patient');
        await this.testLogin('doctor');
        await this.testLogin('insurer');
        
        // Test API endpoints
        await this.testPatientEndpoints();
        await this.testDoctorEndpoints();
        await this.testInsurerEndpoints();
        
        // Test PDF functionality
        await this.testPDFCapabilities();
        
        // Generate final report
        this.generateTestReport();
    }
}

// Run comprehensive tests
const tester = new EHR360Tester();
tester.runAllTests().catch(console.error);