const express = require('express');
const router = express.Router();
const blockchain = require('../services/blockchainService'); // blockchain logic

// 🔐 Store KYC Hash on blockchain
router.post('/kyc/store', async (req, res) => {
    const { customerAddress, kycHash } = req.body;
    try {
        const tx = await blockchain.submitKycHash(customerAddress, kycHash);
        res.json({ success: true, txHash: tx });
    } catch (err) {
        console.error("❌ Error in /kyc/store:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ✅ Approve KYC for a customer
router.post('/kyc/approve', async (req, res) => {
    const { customerAddress } = req.body;
    try {
        const tx = await blockchain.approveKyc(customerAddress);
        res.json({ success: true, txHash: tx });
    } catch (err) {
        console.error("❌ Error in /kyc/approve:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ❌ Reject KYC for a customer
router.post('/kyc/reject', async (req, res) => {
    const { customerAddress } = req.body;
    try {
        const tx = await blockchain.rejectKyc(customerAddress);
        res.json({ success: true, txHash: tx });
    } catch (err) {
        console.error("❌ Error in /kyc/reject:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 🔄 Update consent for a customer
router.post('/kyc/consent', async (req, res) => {
    const { customerAddress, consentGiven } = req.body;
    try {
        const tx = await blockchain.updateConsent(customerAddress, consentGiven);
        res.json({ success: true, txHash: tx });
    } catch (err) {
        console.error("❌ Error in /kyc/consent:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 📥 Get KYC data for a customer
router.get('/kyc/:customerAddress', async (req, res) => {
    const { customerAddress } = req.params;
    try {
        const kycData = await blockchain.getKycData(customerAddress);
        res.json({ success: true, kycData });
    } catch (err) {
        console.error("❌ Error in GET /kyc/:customerAddress:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
