const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  documentType: { type: String, required: true }, // e.g., Passport, Aadhar
  documentNumber: { type: String, required: true },
  selfieUrl: { type: String }, // For uploaded selfie
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  consentGiven: { type: Boolean, default: false }, // 👈 NEW FIELD
  kycHash: { type: String },                       // 👈 NEW FIELD
  walletAddress: { type: String }                 // 👈 NEW FIELD
}, { timestamps: true });

module.exports = mongoose.model('KYC', kycSchema);
