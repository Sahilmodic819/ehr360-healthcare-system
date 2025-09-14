
// backend/routes/labReports.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Patient = require('../models/Patient');
const { uploadFileToGCS } = require('../utils/gcsUpload');

const storage = multer.diskStorage({
  destination: path.join(__dirname,'..','uploads','labs'),
  filename: (req,file,cb)=> cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

router.post('/:userId/upload', upload.single('reportPdf'), async (req,res)=>{
  try {
    const { reportName, date, reportType, driveLink } = req.body;
    const patient = await Patient.findOne({ userId: req.params.userId });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    let fileLink;
    if (driveLink && driveLink.startsWith('http')) {
      fileLink = driveLink; // user provided shareable drive link
    } else if (process.env.GOOGLE_CLOUD_BUCKET && req.query.storage === 'gcs') {
      try {
        const localPath = req.file.path;
        const destName = `labs/${Date.now()}_${req.file.originalname}`;
        fileLink = await uploadFileToGCS(localPath, destName);
      } catch (e) {
        console.error('GCS upload error', e);
        return res.status(500).json({ error: 'GCS upload failed' });
      }
    } else {
      fileLink = `${req.protocol}://${req.get('host')}/uploads/labs/${req.file.filename}`;
    }
    patient.labReports.push({ date, reportName, fileLink, reportType });
    await patient.save();
    res.json({ message: 'Uploaded', fileLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
