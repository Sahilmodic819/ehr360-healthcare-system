const jwt = require('jsonwebtoken');

// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const Master = require('../models/MasterRecord');
const User = require('../models/User');
const Patient = require('../models/Patient');
const bcrypt = require('bcrypt');

function isDigits(str,len){ return /^\d+$/.test(str) && str.length===len; }

// Patient registration
router.post('/register/patient', async (req,res)=>{
  try {
    const { fullName, email, aabhaId, aadharNo, phone, password, confirmPassword } = req.body;
    if (!isDigits(aabhaId,14)) return res.status(400).json({ error: 'Aabha id must be 14 digits' });
    if (!isDigits(aadharNo,12)) return res.status(400).json({ error: 'Aadhar no must be 12 digits' });
    if (!isDigits(phone,10)) return res.status(400).json({ error: 'Phone must be 10 digits' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

    const master = await Master.findOne({ aabhaId, aadharNo });
    if (!master) return res.status(400).json({ error: 'Aadhaar/AABHA not found in records - please verify or check ABHA website' });

    const existing = await User.findOne({ $or: [{ email }, { aabhaId }] });
    if (existing) return res.status(400).json({ error: 'User already registered with this email or AABHA' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash: hash, role: 'patient', aabhaId, aadharNo });

    const patient = await Patient.create({
      userId: user._id,
      fullName: fullName || master.name,
      aadharNo,
      aabhaId,
      phone,
      email,
      dob: master.dob,
      gender: master.gender,
      photo: master.photo,
      emergencyContacts: []
    });

    res.status(201).json({ message: 'Registered', userId: user._id, role: 'patient' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req,res)=>{
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'replace_this_secret', { expiresIn: '7d' });
    res.json({ message: 'Logged in', token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;


// Doctor registration
router.post('/register/doctor', async (req,res)=>{
  try {
    const { fullName, email, aabhaId, aadharNo, phone, nmcRegNo, password, confirmPassword } = req.body;
    function isDigits(str,len){ return /^\d+$/.test(str) && str.length===len; }
    if (!isDigits(aabhaId,14)) return res.status(400).json({ error: 'Aabha id must be 14 digits' });
    if (!isDigits(aadharNo,12)) return res.status(400).json({ error: 'Aadhar no must be 12 digits' });
    if (!isDigits(phone,10)) return res.status(400).json({ error: 'Phone must be 10 digits' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });
    const Master = require('../models/MasterRecord');
    const Doctor = require('../models/Doctor');
    const existing = await require('../models/User').findOne({ $or: [{ email }, { aabhaId }] });
    if (existing) return res.status(400).json({ error: 'User already registered' });
    const master = await Master.findOne({ aabhaId, aadharNo });
    if (!master) return res.status(400).json({ error: 'Aadhaar/AABHA not found in records' });
    const hash = await bcrypt.hash(password,10);
    const user = await require('../models/User').create({ email, passwordHash: hash, role: 'doctor', aabhaId, aadharNo });
    const doc = await Doctor.create({
      userId: user._id, fullName: fullName || master.name, aadharNo, aabhaId, phone, email, dob: master.dob, gender: master.gender, photo: master.photo, nmcRegNo
    });
    const token = jwt.sign({ userId: user._id, role: 'doctor', email }, process.env.JWT_SECRET || 'replace_this_secret', { expiresIn: '7d' });
    res.status(201).json({ message: 'Doctor registered', token, role: 'doctor' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});


// Insurer registration
router.post('/register/insurer', async (req,res)=>{
  try {
    const { fullName, email, aabhaId, aadharNo, phone, irdaiNo, agencyCode, password, confirmPassword } = req.body;
    function isDigits(str,len){ return /^\d+$/.test(str) && str.length===len; }
    if (!isDigits(aabhaId,14)) return res.status(400).json({ error: 'Aabha id must be 14 digits' });
    if (!isDigits(aadharNo,12)) return res.status(400).json({ error: 'Aadhar no must be 12 digits' });
    if (!isDigits(phone,10)) return res.status(400).json({ error: 'Phone must be 10 digits' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });
    const Master = require('../models/MasterRecord');
    const Insurer = require('../models/Insurer');
    const existing = await require('../models/User').findOne({ $or: [{ email }, { aabhaId }] });
    if (existing) return res.status(400).json({ error: 'User already registered' });
    const master = await Master.findOne({ aabhaId, aadharNo });
    if (!master) return res.status(400).json({ error: 'Aadhaar/AABHA not found in records' });
    const hash = await bcrypt.hash(password,10);
    const user = await require('../models/User').create({ email, passwordHash: hash, role: 'insurer', aabhaId, aadharNo });
    const ins = await Insurer.create({
      userId: user._id, fullName: fullName || master.name, aadharNo, aabhaId, phone, email, dob: master.dob, gender: master.gender, photo: master.photo, irdaiNo, agencyCode
    });
    const token = jwt.sign({ userId: user._id, role: 'insurer', email }, process.env.JWT_SECRET || 'replace_this_secret', { expiresIn: '7d' });
    res.status(201).json({ message: 'Insurer registered', token, role: 'insurer' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});
