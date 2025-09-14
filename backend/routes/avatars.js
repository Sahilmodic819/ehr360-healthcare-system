// backend/routes/avatars.js
const express = require('express');
const router = express.Router();
const { upload, avatarsDir } = require('../utils/multerConfig');
const User = require('../models/User');
const verifyJwt = require('../middleware/verifyJwt');
const path = require('path');
const fs = require('fs');

// Upload avatar for current user (requires JWT middleware to set req.auth)
router.post('/me', verifyJwt, upload.single('avatar'), async (req,res)=>{
  try {
    const userId = req.auth && req.auth.userId;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // delete old avatar if exists and is local file
    if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
      try { fs.unlinkSync(path.join(__dirname, '..', user.avatar)); } catch(e){}
    }
    const relPath = '/uploads/avatars/' + req.file.filename;
    user.avatar = relPath;
    await user.save();
    res.json({ message: 'Avatar uploaded', avatar: relPath });
  } catch (err){ console.error(err); res.status(500).json({ error: 'Server error' }); }
});

// Upload policy document for user
router.post('/policy-document', verifyJwt, upload.single('policyDocument'), async (req,res)=>{
  try {
    const userId = req.auth && req.auth.userId;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const relPath = '/uploads/avatars/' + req.file.filename; // Reusing avatars directory for simplicity
    res.json({ 
      message: 'Policy document uploaded successfully', 
      filePath: relPath,
      fileName: req.file.originalname
    });
  } catch (err){ 
    console.error(err); 
    res.status(500).json({ error: 'Server error' }); 
  }
});

module.exports = router;
