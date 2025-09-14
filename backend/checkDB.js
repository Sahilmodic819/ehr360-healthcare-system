const mongoose = require('mongoose');
const Master = require('./models/MasterRecord');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Insurer = require('./models/Insurer');
require('dotenv').config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/EHR360');
  
  console.log('=== MASTER RECORDS (Available for Registration) ===');
  const masters = await Master.find({});
  masters.forEach((r, i) => {
    console.log(`${i+1}. Name: ${r.name}`);
    console.log(`   AABHA ID: ${r.aabhaId}`);
    console.log(`   Aadhar No: ${r.aadharNo}`);
    console.log(`   Phone: ${r.mob}`);
    console.log(`   DOB: ${r.dob?.toDateString()}`);
    console.log(`   Gender: ${r.gender}`);
    console.log('');
  });

  console.log('\n=== ALREADY REGISTERED USERS ===');
  const users = await User.find({});
  const patients = await Patient.find({});
  const doctors = await Doctor.find({});
  const insurers = await Insurer.find({});
  
  console.log(`Total Users: ${users.length}`);
  console.log(`Patients: ${patients.length}`);
  console.log(`Doctors: ${doctors.length}`);
  console.log(`Insurers: ${insurers.length}`);
  
  if (users.length > 0) {
    console.log('\nRegistered Users:');
    users.forEach(u => console.log(`- ${u.email} (${u.role}) - AABHA: ${u.aabhaId}`));
  }
  
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });