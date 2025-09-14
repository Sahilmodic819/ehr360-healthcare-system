
// backend/models/Patient.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  fullName: String,
  aadharNo: String,
  aabhaId: String,
  email: String,
  dob: Date,
  gender: String,
  phone: String,
  photo: String,
  emergencyContacts: [{ name: String, phone: String, relationship: String }],
  symptoms: [{ date: Date, note: String }],
  labReports: [{ date: Date, reportName: String, fileLink: String, reportType: String }],
  immunizations: [{ date: Date, vaccine: String, documentLink: String }],
  medications: [{ name: String, prescribedBy: String, startDate: Date, current: Boolean }],
  allergies: [String],
  ongoingTreatments: [{ name: String, doctor: String, notes: String, startDate: Date }],
  insuranceStatus: [{ treatment: String, diagnosis: String, claimStatus: String, claimDate: Date, claimDocs: [String] }]
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
