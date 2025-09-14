
// backend/config/firebaseAdmin.js
const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH || path.join(__dirname,'..','serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
  });
} catch (err) {
  console.warn('Firebase admin init warning (service account missing). Some features may fail until service account is provided.');
}

module.exports = admin;
