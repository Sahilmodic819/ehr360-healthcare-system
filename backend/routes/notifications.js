// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const verifyJwt = require('../middleware/verifyJwt');

// get notifications for current user
router.get('/', verifyJwt, async (req,res)=>{
  try {
    const userId = req.auth.userId;
    const list = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
    res.json(list);
  } catch (err){ res.status(500).json({ error: 'Server error' }); }
});

// mark read
router.post('/:id/mark-read', verifyJwt, async (req,res)=>{
  try {
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ error: 'Not found' });
    if (n.userId.toString() !== req.auth.userId) return res.status(403).json({ error: 'Forbidden' });
    n.read = true;
    await n.save();
    res.json({ message: 'Marked' });
  } catch (err){ res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
