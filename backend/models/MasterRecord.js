
// backend/models/MasterRecord.js
const mongoose = require('mongoose');
const MasterSchema = new mongoose.Schema({
  aabhaId: { type: String, required: true },
  aadharNo: { type: String, required: true },
  name: String,
  dob: Date,
  gender: String,
  mob: String,
  photo: String
});
module.exports = mongoose.model('MasterRecord', MasterSchema);
