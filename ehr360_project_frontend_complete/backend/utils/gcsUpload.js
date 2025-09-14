
// backend/utils/gcsUpload.js
// Optional: upload file to Google Cloud Storage if GOOGLE_CLOUD_BUCKET is configured.
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

const bucketName = process.env.GOOGLE_CLOUD_BUCKET;
let storage, bucket;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH && bucketName) {
  storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH });
  bucket = storage.bucket(bucketName);
}

async function uploadFileToGCS(localFilePath, destFileName){
  if (!bucket) throw new Error('GCS not configured (set GOOGLE_CLOUD_BUCKET and service account)');
  await bucket.upload(localFilePath, { destination: destFileName, public: true });
  // make public
  await bucket.file(destFileName).makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destFileName}`;
  try { fs.unlinkSync(localFilePath); } catch(e){}
  return publicUrl;
}

module.exports = { uploadFileToGCS };
