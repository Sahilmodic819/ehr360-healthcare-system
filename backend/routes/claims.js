
// backend/routes/claims.js
const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');

// Patient creates claim
router.post('/', async (req,res)=>{
  try {
    const { patientId, treatment, diagnosis, claimDate, claimDocs } = req.body;
    const now = new Date();
    const d = new Date(claimDate);
    const diffDays = (now - d)/(1000*60*60*24);
    if (diffDays > 30 || d > now) return res.status(400).json({ error: 'Claim date must be within past 30 days' });
    const claim = await Claim.create({ patientId, treatment, diagnosis, claimDate: d, claimDocs, status: 'pending' });
    res.json({ message: 'Claim created', claimId: claim._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Insurer fetch claims (simple)
router.get('/insurer/:insurerId', async (req,res)=>{
  try {
    const claims = await Claim.find({ insurerId: req.params.insurerId });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
