
// backend/routes/doctors.js
const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const verifyJwt = require('../middleware/verifyJwt');

// Get doctor's own profile
router.get('/me', verifyJwt, async (req,res)=>{
  try {
    if (req.auth.role !== 'doctor') return res.status(403).json({ error: 'Not authorized' });
    const doc = await Doctor.findOne({ userId: req.auth.userId }).populate('patients');
    res.json(doc);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// Search patients by name or aadhar (doctor only)
router.get('/search-patients', verifyJwt, async (req,res)=>{
  try {
    if (req.auth.role !== 'doctor') return res.status(403).json({ error: 'Not authorized' });
    const q = req.query.q || '';
    const regex = new RegExp(q,'i');
    const patients = await Patient.find({ $or: [{ fullName: regex }, { aadharNo: regex }] }).limit(50);
    res.json(patients);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// Add patient to doctor's list (assign)
router.post('/assign-patient', verifyJwt, async (req,res)=>{
  try {
    if (req.auth.role !== 'doctor') return res.status(403).json({ error: 'Not authorized' });
    const { patientId } = req.body;
    const doc = await Doctor.findOne({ userId: req.auth.userId });
    if (!doc) return res.status(404).json({ error: 'Doctor not found' });
    if (!doc.patients.includes(patientId)) {
      doc.patients.push(patientId);
      await doc.save();
    }
    res.json({ message: 'Patient assigned' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// Get patient details for doctor (read-only)
router.get('/patient/:id', verifyJwt, async (req,res)=>{
  try {
    if (req.auth.role !== 'doctor') return res.status(403).json({ error: 'Not authorized' });
    const p = await Patient.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Patient not found' });
    res.json(p);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
