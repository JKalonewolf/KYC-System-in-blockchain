const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Serve uploaded images from '/uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middlewares
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Import routes
const authRoutes = require('./routes/auth');
const kycRoutes = require('./routes/kyc');
const blockchainRoutes = require('./routes/blockchain');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/blockchain', blockchainRoutes); // ✅ Blockchain API routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/kyc', require('./routes/kyc'));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
