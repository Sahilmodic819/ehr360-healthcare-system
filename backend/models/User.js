
// backend/models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['patient','doctor','insurer'], required: true },
  aabhaId: String,
  aadharNo: String
},{ timestamps: true });
module.exports = mongoose.model('User', UserSchema);
