
// backend/models/Claim.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClaimSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
  insurerId: { type: Schema.Types.ObjectId, ref: 'User' },
  treatment: String,
  diagnosis: String,
  claimDate: Date,
  claimDocs: [String],
  status: { type: String, enum: ['pending','more_docs_required','approved','rejected'], default: 'pending' },
  docRequests: [{ from: String, message: String, createdAt: Date }],
  history: [{ by: String, action: String, at: Date }]
},{ timestamps: true });

module.exports = mongoose.model('Claim', ClaimSchema);
