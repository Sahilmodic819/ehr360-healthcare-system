
// backend/scripts/seedMasterRecords.js
const mongoose = require('mongoose');
const Master = require('../models/MasterRecord');
require('dotenv').config();

const sample = [
  { aabhaId: '10000000000001', name: 'Sahil Modi', dob: new Date('2000-01-10'), gender: 'male', aadharNo: '111122223333', mob: '9999999999', photo: 'https://drive.google.com/uc?export=view&id=DRIVE_ID_1' },
  { aabhaId: '10000000000002', name: 'Aman Kumar', dob: new Date('1999-05-12'), gender: 'male', aadharNo: '111122223334', mob: '8888888888', photo: 'https://drive.google.com/uc?export=view&id=DRIVE_ID_2' },
  { aabhaId: '10000000000003', name: 'Priya Sharma', dob: new Date('1998-03-22'), gender: 'female', aadharNo: '111122223335', mob: '7777777777', photo: 'https://drive.google.com/uc?export=view&id=DRIVE_ID_3' },
  { aabhaId: '10000000000004', name: 'Rohit Verma', dob: new Date('1997-07-04'), gender: 'male', aadharNo: '111122223336', mob: '6666666666', photo: 'https://drive.google.com/uc?export=view&id=DRIVE_ID_4' },
  { aabhaId: '10000000000005', name: 'Neha Gupta', dob: new Date('1996-11-11'), gender: 'female', aadharNo: '111122223337', mob: '5555555555', photo: 'https://drive.google.com/uc?export=view&id=DRIVE_ID_5' },
  { aabhaId: '10000000000006', name: 'Vikram Singh', dob: new Date('1995-02-28'), gender: 'male', aadharNo: '111122223338', mob: '4444444444', photo: 'https://drive.google.com/uc?export=view&id=DRIVE_ID_6' },
  { aabhaId: '10000000000007', name: 'Anjali Rao', dob: new Date('1994-09-09'), gender: 'female', aadharNo: '111122223339', mob: '3333333333', photo: 'https://drive.google.com/uc?export=view&id=DRIVE_ID_7' },
  { aabhaId: '10000000000008', name: 'Karan Patel', dob: new Date('1993-12-01'), gender: 'male', aadharNo: '111122223340', mob: '2222222222', photo: 'https://drive.google.com/uc?export=view&id=DRIVE_ID_8' },
  { aabhaId: '10000000000009', name: 'Simran Kaur', dob: new Date('1992-06-15'), gender: 'female', aadharNo: '111122223341', mob: '1111111111', photo: 'https://drive.google.com/uc?export=view&id=DRIVE_ID_9' },
  { aabhaId: '10000000000010', name: 'Rahul Desai', dob: new Date('1991-04-30'), gender: 'male', aadharNo: '111122223342', mob: '0000000000', photo: 'https://drive.google.com/uc?export=view&id=DRIVE_ID_10' }
];

async function main(){
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/EHR360');
  try { await mongoose.connection.db.dropCollection('masterrecords'); } catch(e){}
  await Master.insertMany(sample);
  console.log('Inserted sample master records');
  process.exit(0);
}
main().catch(err=>{ console.error(err); process.exit(1); });
