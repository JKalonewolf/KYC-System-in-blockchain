const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ✅ IMPORTANT: Must match the User model name
    required: true,
  },
  fullName: String,
  address: String,
  documentType: String,
  documentNumber: String,
  selfieUrl: String,
  consentGiven: Boolean,
  customerWalletAddress: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  blockchainTxHash: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('KYC', kycSchema);
