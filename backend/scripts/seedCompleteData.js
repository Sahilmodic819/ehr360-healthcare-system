// backend/scripts/seedCompleteData.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Insurer = require('../models/Insurer');
const MasterRecord = require('../models/MasterRecord');

// 10 Patients Data
const patientsData = [
  {
    email: 'sahil.modi@email.com',
    password: 'password123',
    profile: {
      fullName: 'Sahil Modi',
      aabhaId: '10000000000001',
      aadharNo: '111122223333',
      phone: '9999999999',
      dateOfBirth: '2000-01-10',
      gender: 'Male',
      address: '123 Mumbai Street, Mumbai, MH 400001',
      bloodGroup: 'O+',
      height: 175,
      weight: 70,
      emergencyContact: { name: 'Priya Modi', phone: '9999999998', relationship: 'Mother' },
      assignedDoctor: 'dr.sharma@hospital.com',
      insuranceProvider: 'healthplus@insurance.com'
    }
  },
  {
    email: 'aman.kumar@email.com',
    password: 'password123',
    profile: {
      fullName: 'Aman Kumar',
      aabhaId: '10000000000002',
      aadharNo: '111122223334',
      phone: '8888888888',
      dateOfBirth: '1999-05-12',
      gender: 'Male',
      address: '456 Delhi Road, Delhi, DL 110001',
      bloodGroup: 'A+',
      height: 180,
      weight: 75,
      emergencyContact: { name: 'Sunita Kumar', phone: '8888888887', relationship: 'Mother' },
      assignedDoctor: 'dr.patel@hospital.com',
      insuranceProvider: 'lifecare@insurance.com'
    }
  },
  {
    email: 'priya.sharma@email.com',
    password: 'password123',
    profile: {
      fullName: 'Priya Sharma',
      aabhaId: '10000000000003',
      aadharNo: '111122223335',
      phone: '7777777777',
      dateOfBirth: '1998-03-22',
      gender: 'Female',
      address: '789 Bangalore Avenue, Bangalore, KA 560001',
      bloodGroup: 'B+',
      height: 165,
      weight: 60,
      emergencyContact: { name: 'Raj Sharma', phone: '7777777776', relationship: 'Father' },
      assignedDoctor: 'dr.singh@hospital.com',
      insuranceProvider: 'securemed@insurance.com'
    }
  },
  {
    email: 'rohit.verma@email.com',
    password: 'password123',
    profile: {
      fullName: 'Rohit Verma',
      aabhaId: '10000000000004',
      aadharNo: '111122223336',
      phone: '6666666666',
      dateOfBirth: '1997-07-04',
      gender: 'Male',
      address: '321 Pune Square, Pune, MH 411001',
      bloodGroup: 'AB+',
      height: 178,
      weight: 80,
      emergencyContact: { name: 'Meera Verma', phone: '6666666665', relationship: 'Wife' },
      assignedDoctor: 'dr.sharma@hospital.com',
      insuranceProvider: 'healthplus@insurance.com'
    }
  },
  {
    email: 'neha.gupta@email.com',
    password: 'password123',
    profile: {
      fullName: 'Neha Gupta',
      aabhaId: '10000000000005',
      aadharNo: '111122223337',
      phone: '5555555555',
      dateOfBirth: '1996-11-11',
      gender: 'Female',
      address: '654 Chennai Lane, Chennai, TN 600001',
      bloodGroup: 'O-',
      height: 160,
      weight: 55,
      emergencyContact: { name: 'Amit Gupta', phone: '5555555554', relationship: 'Husband' },
      assignedDoctor: 'dr.patel@hospital.com',
      insuranceProvider: 'lifecare@insurance.com'
    }
  },
  {
    email: 'vikram.singh@email.com',
    password: 'password123',
    profile: {
      fullName: 'Vikram Singh',
      aabhaId: '10000000000006',
      aadharNo: '111122223338',
      phone: '4444444444',
      dateOfBirth: '1995-02-28',
      gender: 'Male',
      address: '987 Hyderabad Heights, Hyderabad, TS 500001',
      bloodGroup: 'A-',
      height: 185,
      weight: 85,
      emergencyContact: { name: 'Kavita Singh', phone: '4444444443', relationship: 'Sister' },
      assignedDoctor: 'dr.singh@hospital.com',
      insuranceProvider: 'securemed@insurance.com'
    }
  },
  {
    email: 'anjali.rao@email.com',
    password: 'password123',
    profile: {
      fullName: 'Anjali Rao',
      aabhaId: '10000000000007',
      aadharNo: '111122223339',
      phone: '3333333333',
      dateOfBirth: '1994-09-09',
      gender: 'Female',
      address: '159 Kolkata Corner, Kolkata, WB 700001',
      bloodGroup: 'B-',
      height: 162,
      weight: 58,
      emergencyContact: { name: 'Suresh Rao', phone: '3333333332', relationship: 'Father' },
      assignedDoctor: 'dr.sharma@hospital.com',
      insuranceProvider: 'healthplus@insurance.com'
    }
  },
  {
    email: 'karan.patel@email.com',
    password: 'password123',
    profile: {
      fullName: 'Karan Patel',
      aabhaId: '10000000000008',
      aadharNo: '111122223340',
      phone: '2222222222',
      dateOfBirth: '1993-12-01',
      gender: 'Male',
      address: '753 Ahmedabad Arcade, Ahmedabad, GJ 380001',
      bloodGroup: 'AB-',
      height: 172,
      weight: 68,
      emergencyContact: { name: 'Ritu Patel', phone: '2222222221', relationship: 'Mother' },
      assignedDoctor: 'dr.patel@hospital.com',
      insuranceProvider: 'lifecare@insurance.com'
    }
  },
  {
    email: 'simran.kaur@email.com',
    password: 'password123',
    profile: {
      fullName: 'Simran Kaur',
      aabhaId: '10000000000009',
      aadharNo: '111122223341',
      phone: '1111111111',
      dateOfBirth: '1992-06-15',
      gender: 'Female',
      address: '852 Chandigarh Circle, Chandigarh, CH 160001',
      bloodGroup: 'O+',
      height: 168,
      weight: 62,
      emergencyContact: { name: 'Harpreet Kaur', phone: '1111111110', relationship: 'Sister' },
      assignedDoctor: 'dr.singh@hospital.com',
      insuranceProvider: 'securemed@insurance.com'
    }
  },
  {
    email: 'rahul.desai@email.com',
    password: 'password123',
    profile: {
      fullName: 'Rahul Desai',
      aabhaId: '10000000000010',
      aadharNo: '111122223342',
      phone: '0000000000',
      dateOfBirth: '1991-04-30',
      gender: 'Male',
      address: '741 Jaipur Junction, Jaipur, RJ 302001',
      bloodGroup: 'A+',
      height: 176,
      weight: 72,
      emergencyContact: { name: 'Pooja Desai', phone: '0000000001', relationship: 'Wife' },
      assignedDoctor: 'dr.sharma@hospital.com',
      insuranceProvider: 'healthplus@insurance.com'
    }
  }
];

// 3 Doctors Data
const doctorsData = [
  {
    email: 'dr.sharma@hospital.com',
    password: 'doctor123',
    profile: {
      fullName: 'Dr. Rajesh Sharma',
      phone: '9876543210',
      aadharNo: '987654321012',
      aabhaId: '20000000000001',
      dob: '1980-05-15',
      gender: 'Male',
      nmcRegNo: 'DOC001234567',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'
    }
  },
  {
    email: 'dr.patel@hospital.com',
    password: 'doctor123',
    profile: {
      fullName: 'Dr. Sneha Patel',
      phone: '9876543211',
      aadharNo: '987654321013',
      aabhaId: '20000000000002',
      dob: '1978-08-22',
      gender: 'Female',
      nmcRegNo: 'DOC001234568',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'
    }
  },
  {
    email: 'dr.singh@hospital.com',
    password: 'doctor123',
    profile: {
      fullName: 'Dr. Arvind Singh',
      phone: '9876543212',
      aadharNo: '987654321014',
      aabhaId: '20000000000003',
      dob: '1975-12-10',
      gender: 'Male',
      nmcRegNo: 'DOC001234569',
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400'
    }
  }
];

// 3 Insurers Data
const insurersData = [
  {
    email: 'healthplus@insurance.com',
    password: 'insurer123',
    profile: {
      companyName: 'HealthPlus Insurance Ltd.',
      phone: '1800123456',
      licenseNumber: 'INS001234567',
      contactPerson: 'Sarah Williams',
      address: '123 Insurance Tower, Mumbai, MH 400003'
    }
  },
  {
    email: 'lifecare@insurance.com',
    password: 'insurer123',
    profile: {
      companyName: 'LifeCare Health Insurance',
      phone: '1800123457',
      licenseNumber: 'INS001234568',
      contactPerson: 'Rajesh Kumar',
      address: '456 Care Complex, Delhi, DL 110003'
    }
  },
  {
    email: 'securemed@insurance.com',
    password: 'insurer123',
    profile: {
      companyName: 'SecureMed Insurance Co.',
      phone: '1800123458',
      licenseNumber: 'INS001234569',
      contactPerson: 'Priya Reddy',
      address: '789 Security Plaza, Bangalore, KA 560003'
    }
  }
];

async function seedCompleteData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/EHR360');
    console.log('📡 Connected to MongoDB');

    // Add master records for doctors
    const doctorMasterRecords = [
      { aabhaId: '20000000000001', name: 'Dr. Rajesh Sharma', dob: new Date('1980-05-15'), gender: 'male', aadharNo: '987654321012', mob: '9876543210' },
      { aabhaId: '20000000000002', name: 'Dr. Sneha Patel', dob: new Date('1978-08-22'), gender: 'female', aadharNo: '987654321013', mob: '9876543211' },
      { aabhaId: '20000000000003', name: 'Dr. Arvind Singh', dob: new Date('1975-12-10'), gender: 'male', aadharNo: '987654321014', mob: '9876543212' }
    ];

    for (const record of doctorMasterRecords) {
      await MasterRecord.findOneAndUpdate(
        { aabhaId: record.aabhaId },
        record,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Added master records for doctors');

    // Clear existing data
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Insurer.deleteMany({});
    console.log('🗑️  Cleared existing user data');

    console.log('\n👥 Creating Patients...');
    for (const patientData of patientsData) {
      const hashedPassword = await bcrypt.hash(patientData.password, 10);
      
      const user = new User({
        email: patientData.email,
        passwordHash: hashedPassword,
        role: 'patient',
        aabhaId: patientData.profile.aabhaId,
        aadharNo: patientData.profile.aadharNo
      });
      await user.save();

      const patient = new Patient({
        userId: user._id,
        email: patientData.email,
        ...patientData.profile
      });
      await patient.save();
      
      console.log(`✅ Created patient: ${patientData.profile.fullName} (${patientData.email})`);
    }

    console.log('\n👨‍⚕️ Creating Doctors...');
    for (const doctorData of doctorsData) {
      const hashedPassword = await bcrypt.hash(doctorData.password, 10);
      
      const user = new User({
        email: doctorData.email,
        passwordHash: hashedPassword,
        role: 'doctor',
        aabhaId: doctorData.profile.aabhaId,
        aadharNo: doctorData.profile.aadharNo
      });
      await user.save();

      const doctor = new Doctor({
        userId: user._id,
        email: doctorData.email,
        ...doctorData.profile
      });
      await doctor.save();
      
      console.log(`✅ Created doctor: ${doctorData.profile.fullName} (${doctorData.email})`);
    }

    console.log('\n🏢 Creating Insurers...');
    for (const insurerData of insurersData) {
      const hashedPassword = await bcrypt.hash(insurerData.password, 10);
      
      const user = new User({
        email: insurerData.email,
        passwordHash: hashedPassword,
        role: 'insurer',
        aabhaId: insurerData.profile.aabhaId,
        aadharNo: insurerData.profile.aadharNo
      });
      await user.save();

      const insurer = new Insurer({
        userId: user._id,
        email: insurerData.email,
        ...insurerData.profile
      });
      await insurer.save();
      
      console.log(`✅ Created insurer: ${insurerData.profile.companyName} (${insurerData.email})`);
    }

    console.log('\n🎉 Complete data seeding finished!');
    console.log('\n📋 REGISTRATION SUMMARY:');
    
    console.log('\n👥 PATIENTS (10):');
    patientsData.forEach((p, i) => {
      console.log(`${i+1}. ${p.profile.fullName} - ${p.email} - password123`);
    });
    
    console.log('\n👨‍⚕️ DOCTORS (3):');
    doctorsData.forEach((d, i) => {
      console.log(`${i+1}. ${d.profile.fullName} - ${d.email} - doctor123`);
    });
    
    console.log('\n🏢 INSURERS (3):');
    insurersData.forEach((ins, i) => {
      console.log(`${i+1}. ${ins.profile.companyName} - ${ins.email} - insurer123`);
    });

    console.log('\n🔗 RELATIONSHIPS:');
    console.log('Dr. Rajesh Sharma → 4 patients (Sahil, Rohit, Anjali, Rahul)');
    console.log('Dr. Sneha Patel → 3 patients (Aman, Neha, Karan)');
    console.log('Dr. Arvind Singh → 3 patients (Priya, Vikram, Simran)');
    console.log('HealthPlus Insurance → 4 clients (Sahil, Rohit, Anjali, Rahul)');
    console.log('LifeCare Insurance → 3 clients (Aman, Neha, Karan)');
    console.log('SecureMed Insurance → 3 clients (Priya, Vikram, Simran)');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedCompleteData();