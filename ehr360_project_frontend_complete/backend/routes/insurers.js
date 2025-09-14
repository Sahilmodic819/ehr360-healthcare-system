
// backend/routes/insurers.js
const express = require('express');
const router = express.Router();
const Insurer = require('../models/Insurer');
const Patient = require('../models/Patient');
const Claim = require('../models/Claim');
const verifyJwt = require('../middleware/verifyJwt');

// Insurer profile
router.get('/me', verifyJwt, async (req,res)=>{
  try {
    if (req.auth.role !== 'insurer') return res.status(403).json({ error: 'Not authorized' });
    const ins = await Insurer.findOne({ userId: req.auth.userId }).populate('clients');
    res.json(ins);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// Add client (insurer adds a patient to clients)
router.post('/add-client', verifyJwt, async (req,res)=>{
  try {
    if (req.auth.role !== 'insurer') return res.status(403).json({ error: 'Not authorized' });
    const { patientId } = req.body;
    const ins = await Insurer.findOne({ userId: req.auth.userId });
    if (!ins) return res.status(404).json({ error: 'Insurer not found' });
    if (!ins.clients.includes(patientId)) {
      ins.clients.push(patientId);
      await ins.save();
    }
    res.json({ message: 'Client added' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// Get claims for insurer
router.get('/claims', verifyJwt, async (req,res)=>{
  try {
    if (req.auth.role !== 'insurer') return res.status(403).json({ error: 'Not authorized' });
    const ins = await Insurer.findOne({ userId: req.auth.userId });
    const claims = await Claim.find({ insurerId: ins._id }).populate('patientId');
    res.json(claims);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// Resolve claim (approve/reject or request more docs)
router.post('/claims/:id/resolve', verifyJwt, async (req,res)=>{
  try {
    if (req.auth.role !== 'insurer') return res.status(403).json({ error: 'Not authorized' });
    const { action, message } = req.body; // action: approve|reject|more_docs
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ error: 'Claim not found' });
    if (action === 'approve') claim.status = 'approved';
    else if (action === 'reject') claim.status = 'rejected';
    else if (action === 'more_docs') claim.status = 'more_docs_required';
    claim.history.push({ by: 'insurer', action, at: new Date(), message });
    await claim.save();
    res.json({ message: 'Claim updated' });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
