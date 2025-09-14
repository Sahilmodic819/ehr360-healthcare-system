// backend/scripts/seedNotifications.js
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const User = require('../models/User');

async function run(){
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/EHR360');
  const users = await User.find().limit(5);
  for (const u of users){
    await Notification.create({ userId: u._id, message: 'Welcome to EHR360 — verify your profile', type: 'info' });
  }
  console.log('Seeded notifications');
  process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
