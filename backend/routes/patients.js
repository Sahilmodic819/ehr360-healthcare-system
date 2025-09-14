
// backend/routes/patients.js
const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Get patient by userId (simple)
router.get('/:userId', async (req,res)=>{
  try {
    const p = await Patient.findOne({ userId: req.params.userId });
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add symptom (date must be recent - frontend should enforce too)
router.post('/:userId/symptoms', async (req,res)=>{
  try {
    const { date, note } = req.body;
    const patient = await Patient.findOne({ userId: req.params.userId });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    const d = new Date(date);
    const now = new Date();
    const diffDays = (now - d)/(1000*60*60*24);
    if (diffDays > 30 || d > now) return res.status(400).json({ error: 'Date must be within past 30 days' });
    patient.symptoms.push({ date: d, note });
    await patient.save();
    res.json({ message: 'Added symptom' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

// Add immunization
router.post('/:userId/immunizations', async (req,res)=>{
  try {
    const { date, vaccine, documentLink } = req.body;
    const p = await Patient.findOne({ userId: req.params.userId });
    if (!p) return res.status(404).json({ error: 'Patient not found' });
    const d = new Date(date);
    const now = new Date();
    if (d > now) return res.status(400).json({ error: 'Date cannot be in the future' });
    p.immunizations.push({ date, vaccine, documentLink });
    await p.save();
    res.json({ message: 'Added' });
  } catch (err){ res.status(500).json({ error: 'Server error' }); }
});

// Add medication
router.post('/:userId/medications', async (req,res)=>{
  try {
    const { name, prescribedBy, startDate, current } = req.body;
    const p = await Patient.findOne({ userId: req.params.userId });
    if (!p) return res.status(404).json({ error: 'Patient not found' });
    p.medications.push({ name, prescribedBy, startDate, current });
    await p.save();
    res.json({ message: 'Added' });
  } catch (err){ res.status(500).json({ error: 'Server error' }); }
});

// Update patient information (including emergency contacts)
router.put('/:userId', async (req,res)=>{
  try {
    const p = await Patient.findOne({ userId: req.params.userId });
    if (!p) return res.status(404).json({ error: 'Patient not found' });
    
    // Update patient fields
    if (req.body.emergencyContacts) {
      p.emergencyContacts = req.body.emergencyContacts;
    }
    
    await p.save();
    res.json(p);
  } catch (err){ 
    console.error(err);
    res.status(500).json({ error: 'Server error' }); 
  }
});

// Update medication
router.put('/:userId/medications/:index', async (req,res)=>{
  try {
    const { index } = req.params;
    const p = await Patient.findOne({ userId: req.params.userId });
    if (!p) return res.status(404).json({ error: 'Patient not found' });
    if (!p.medications[index]) return res.status(404).json({ error: 'Medication not found' });
    p.medications[index] = {...p.medications[index].toObject(), ...req.body};
    await p.save();
    res.json({ message: 'Updated' });
  } catch (err){ res.status(500).json({ error: 'Server error' }); }
});

// Add allergy
router.post('/:userId/allergies', async (req,res)=>{
  try {
    const { allergy } = req.body;
    const p = await Patient.findOne({ userId: req.params.userId });
    if (!p) return res.status(404).json({ error: 'Patient not found' });
    p.allergies.push(allergy);
    await p.save();
    res.json({ message: 'Added' });
  } catch (err){ res.status(500).json({ error: 'Server error' }); }
});

// Add treatment
router.post('/:userId/treatments', async (req,res)=>{
  try {
    const { name, doctor, notes, startDate } = req.body;
    const p = await Patient.findOne({ userId: req.params.userId });
    if (!p) return res.status(404).json({ error: 'Patient not found' });
    const d = startDate ? new Date(startDate) : new Date();
    if ((new Date() - d)/(1000*60*60*24) > 30) return res.status(400).json({ error: 'StartDate must be within past 30 days' });
    p.ongoingTreatments.push({ name, doctor, notes, startDate: d });
    await p.save();
    res.json({ message: 'Added' });
  } catch (err){ res.status(500).json({ error: 'Server error' }); }
});
