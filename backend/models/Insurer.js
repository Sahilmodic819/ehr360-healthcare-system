
// backend/models/Insurer.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const InsurerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  fullName: String,
  aadharNo: String,
  aabhaId: String,
  dob: Date,
  gender: String,
  phone: String,
  email: String,
  photo: String,
  irdaiNo: String,
  agencyCode: String,
  clients: [{ type: Schema.Types.ObjectId, ref: 'Patient' }]
},{ timestamps: true });
module.exports = mongoose.model('Insurer', InsurerSchema);
