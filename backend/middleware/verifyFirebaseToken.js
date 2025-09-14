
// backend/middleware/verifyFirebaseToken.js
const admin = require('../config/firebaseAdmin');

module.exports = async function (req, res, next) {
  try {
    const header = req.header('Authorization') || '';
    const idToken = header.replace('Bearer ','').trim();
    if (!idToken) return res.status(401).json({ error: 'No token provided' });

    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verify error', err?.message || err);
    res.status(401).json({ error: 'Invalid token or Firebase Admin not configured' });
  }
};
