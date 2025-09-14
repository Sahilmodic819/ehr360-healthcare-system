
// backend/models/Doctor.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DoctorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  fullName: String,
  aadharNo: String,
  aabhaId: String,
  dob: Date,
  gender: String,
  phone: String,
  email: String,
  photo: String,
  nmcRegNo: String,
  patients: [{ type: Schema.Types.ObjectId, ref: 'Patient' }]
},{ timestamps: true });
module.exports = mongoose.model('Doctor', DoctorSchema);
