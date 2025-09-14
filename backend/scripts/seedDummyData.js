// backend/scripts/seedDummyData.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Insurer = require('../models/Insurer');
const Notification = require('../models/Notification');
const Claim = require('../models/Claim'); // assumes you have Claim model
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/EHR360';

function generateAadhar(i, prefix) {
  // Always 12 digits
  return String(prefix + i).padStart(12, '0');
}

function generateAabha(i, prefix) {
  // Always 14 digits
  return String(prefix + i).padStart(14, '0');
}

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to', MONGO_URI);

  // Clear old data
  await Patient.deleteMany({});
  await Doctor.deleteMany({});
  await Insurer.deleteMany({});
  await Notification.deleteMany({});
  await Claim.deleteMany({});

  // Ensure uploads folder exists
  const labDir = path.join(__dirname, '..', 'uploads', 'labReports');
  fs.mkdirSync(labDir, { recursive: true });

  // Create a dummy PDF file
  const dummyPdfPath = path.join(labDir, 'dummy-lab-report.pdf');
  if (!fs.existsSync(dummyPdfPath)) {
    fs.writeFileSync(
      dummyPdfPath,
      '%PDF-1.4\n% Dummy PDF for Lab Report\n1 0 obj <<>> endobj\ntrailer <<>>\n%%EOF'
    );
  }

  // Create Patients (10)
  const patients = [];
  for (let i = 1; i <= 10; i++) {
    patients.push(
      new Patient({
        fullName: `Patient ${i}`,
        aabhaId: generateAabha(i, 10000000000000), // 14 digits
        aadharNo: generateAadhar(i, 100000000000), // 12 digits
        phone: `90000000${(10 + i).toString().slice(-2)}`,
        dob: new Date(1990, i % 12, i),
        gender: i % 2 === 0 ? 'Male' : 'Female',
        photo: `https://via.placeholder.com/150?text=Patient+${i}`,
        symptoms: [{ description: 'Cough', date: new Date() }],
        medicalRecords: [
          {
            title: 'General Checkup',
            type: 'record',
            date: new Date(),
            fileLink: '/uploads/labReports/dummy-lab-report.pdf',
          },
        ],
        ongoingTreatments: [
          { name: i % 2 === 0 ? 'Diabetes' : 'Hypertension', startDate: new Date() },
        ],
        allergies: i % 3 === 0 ? ['Penicillin (Severe)'] : [],
      })
    );
  }
  await Patient.insertMany(patients);
  console.log('✅ Seeded patients with lab report PDFs');

  // Create Doctors (5)
  const doctors = [];
  for (let i = 1; i <= 5; i++) {
    doctors.push(
      new Doctor({
        fullName: `Doctor ${i}`,
        aadharNo: generateAadhar(i, 200000000000), // 12 digits
        nmcRegNo: `NMC${1000 + i}`,
        specialization: i % 2 === 0 ? 'Cardiology' : 'General Medicine',
        patients: [],
      })
    );
  }
  await Doctor.insertMany(doctors);
  console.log('✅ Seeded doctors');

  // Create Insurers (3)
  const insurers = [];
  for (let i = 1; i <= 3; i++) {
    insurers.push(
      new Insurer({
        fullName: `Insurer ${i}`,
        aadharNo: generateAadhar(i, 300000000000), // 12 digits
        irdaiRegNo: `IRDAI${2000 + i}`,
        clients: [],
      })
    );
  }
  await Insurer.insertMany(insurers);
  console.log('✅ Seeded insurers');

  // Reload inserted docs
  const allPatients = await Patient.find();
  const allDoctors = await Doctor.find();
  const allInsurers = await Insurer.find();

  // Link patients → doctors + insurers
  for (const [idx, patient] of allPatients.entries()) {
    const doctor = allDoctors[idx % allDoctors.length];
    const insurer = allInsurers[idx % allInsurers.length];

    doctor.patients.push(patient._id);
    insurer.clients.push(patient._id);

    patient.assignedDoctor = doctor._id;
    patient.insurer = insurer._id;

    await patient.save();
    await doctor.save();
    await insurer.save();
  }
  console.log('🔗 Linked patients with doctors & insurers');

  // Create Claims (each patient makes one claim)
  const statuses = ['pending', 'approved', 'rejected', 'more_docs_required'];
  const claims = [];
  for (const patient of allPatients) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    claims.push(
      new Claim({
        patient: patient._id,
        insurer: patient.insurer,
        doctor: patient.assignedDoctor,
        status,
        description: `Claim for treatment of ${patient.ongoingTreatments[0].name}`,
        documents: ['/uploads/labReports/dummy-lab-report.pdf'],
        createdAt: new Date(),
      })
    );
  }
  await Claim.insertMany(claims);
  console.log('💰 Seeded claims with dummy PDFs');

  // Create Notifications
  for (const patient of allPatients) {
    await Notification.create({
      userId: patient._id,
      message: 'Your profile was created successfully.',
      type: 'info',
    });
    await Notification.create({
      userId: patient._id,
      message: 'Insurance claim submitted.',
      type: 'success',
    });
  }
  for (const doctor of allDoctors) {
    await Notification.create({
      userId: doctor._id,
      message: 'New patient assigned to you.',
      type: 'info',
    });
  }
  for (const insurer of allInsurers) {
    await Notification.create({
      userId: insurer._id,
      message: 'You have pending claims to review.',
      type: 'warning',
    });
  }
  console.log('🔔 Seeded notifications');

  console.log('🎉 Dummy data + relationships + claims + lab reports + notifications seeded successfully!');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
