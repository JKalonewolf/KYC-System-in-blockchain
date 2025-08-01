const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const KYC = require('../models/KYC');
const User = require('../models/User');
const blockchainService = require('../services/blockchainService');
const authenticateUser = require('../middleware/authenticateUser'); // ✅ ADD THIS LINE
const KYCModel = require("../models/KYC"); 
// ✅ Your new working route:
router.get('/my', authenticateUser, async (req, res) => {
    try {
        const walletAddress = req.user.walletAddress;
        const kyc = await KYCModel.findOne({ walletAddress });
        if (!kyc) return res.status(404).json({ error: 'No KYC record found' });
        res.json(kyc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching KYC' });
    }
});
// 📥 Customer submits KYC request
router.post('/submit', authMiddleware, async (req, res) => {
    const {
        fullName,
        address,
        documentType,
        documentNumber,
        selfieUrl,
        consentGiven,
        walletAddress
    } = req.body;

    try {
        // Check if this user has already submitted KYC
        const existingKYC = await KYC.findOne({ user: req.user.userId });
        if (existingKYC) {
            return res.status(400).json({ message: 'KYC request already submitted.' });
        }

        const newKyc = new KYC({
            user: req.user.userId,
            fullName,
            address,
            documentType,
            documentNumber,
            selfieUrl,
            consentGiven,
            walletAddress
        });

        await newKyc.save();
        res.status(201).json({ message: 'KYC request submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 🏦 Bank fetches all KYC requests
router.get('/all', authMiddleware, async (req, res) => {
    try {
        // Ensure only bank role can view all KYC requests
        if (req.user.role !== 'bank') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const kycs = await KYC.find().populate('user', 'name email');
        res.status(200).json(kycs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Bank approves or rejects KYC request
router.put('/update/:id', authMiddleware, async (req, res) => {
    const { status } = req.body;

    try {
        // Ensure only bank role can approve/reject KYC
        if (req.user.role !== 'bank') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const kyc = await KYC.findById(req.params.id);
        if (!kyc) {
            return res.status(404).json({ message: 'KYC request not found' });
        }

        kyc.status = status; // e.g., Approved or Rejected
        await kyc.save();

        res.status(200).json({ message: `KYC ${status} successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 🧪 Test Route
router.get('/test', authMiddleware, (req, res) => {
    res.json({
        message: '✅ KYC API is working!',
        user: req.user, // Send back user info from token
    });
});

// ✅ Backend route for customer to get their own KYC
router.get('/my', authenticateUser, async (req, res) => {
    try {
        const walletAddress = req.user.walletAddress;  // or however your user is stored
        const kyc = await KYCModel.findOne({ walletAddress });
        if (!kyc) return res.status(404).json({ error: 'No KYC record found' });
        res.json(kyc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching KYC' });
    }
});

router.get("/my", authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const kyc = await KYCModel.findOne({ user: userId });
  if (!kyc) return res.status(404).json({ message: "No KYC data found" });
  res.json(kyc);
});

module.exports = router;
