import React, { useState, useEffect } from 'react';
import '../styles/KYCForm.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { connectContract } from "../utils/blockchain";

function KYCForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    documentType: '',
    documentNumber: '',
    selfieFile: null,
    consentGiven: false,
    customerWalletAddress: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'customer') {
        navigate('/dashboard');
      }
    } catch {
      navigate('/login');
    }

    const loadWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setFormData(prev => ({ ...prev, customerWalletAddress: accounts[0] }));
        } catch (err) {
          console.error("⚠️ MetaMask access denied:", err.message);
        }
      } else {
        console.warn("⚠️ MetaMask not detected.");
      }
    };

    loadWallet();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('fullName', formData.fullName);
    form.append('address', formData.address);
    form.append('documentType', formData.documentType);
    form.append('documentNumber', formData.documentNumber);
    form.append('selfie', formData.selfieFile);
    form.append('consentGiven', formData.consentGiven);
    form.append('customerWalletAddress', formData.customerWalletAddress);

    try {
      const response = await fetch('http://localhost:5000/api/kyc/submit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ KYC submitted successfully!');

        try {
          const contract = await connectContract();
          await contract.submitKYC(formData.fullName, formData.documentType);
          console.log("✅ KYC submitted on-chain");
        } catch (blockchainError) {
          console.error("⚠️ Blockchain submission failed:", blockchainError.message);
        }

        setTimeout(() => {
          navigate('/customerprofile');
        }, 1500);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Something went wrong. Try again.');
    }
  };

  return (
    <div className="kyc-container">
      <div className="kyc-card">
        <h2 className="kyc-title">KYC Submission</h2>
        <form onSubmit={handleSubmit}>
          <label className="kyc-label">Full Name</label>
          <input type="text" name="fullName" className="kyc-input" value={formData.fullName} onChange={handleChange} required />

          <label className="kyc-label">Address</label>
          <input type="text" name="address" className="kyc-input" value={formData.address} onChange={handleChange} required />

          <label className="kyc-label">Document Type</label>
          <select name="documentType" className="kyc-input" value={formData.documentType} onChange={handleChange} required>
            <option value="" disabled>-- Select Document Type --</option>
            <option value="Aadhar">Aadhar</option>
            <option value="Passport">Passport</option>
            <option value="License">License</option>
          </select>

          <label className="kyc-label">Document Number</label>
          <input type="text" name="documentNumber" className="kyc-input" value={formData.documentNumber} onChange={handleChange} required />

          <label className="kyc-label">Upload Selfie</label>
          <input type="file" name="selfieFile" className="kyc-input" accept="image/*" onChange={handleChange} required />

          <label className="kyc-label">Wallet Address</label>
          <input type="text" name="customerWalletAddress" className="kyc-input" value={formData.customerWalletAddress} readOnly />

          <div className="kyc-consent">
            <input type="checkbox" name="consentGiven" checked={formData.consentGiven} onChange={handleChange} required />
            <label className="kyc-label">I consent to share my KYC data</label>
          </div>

          <button type="submit" className="kyc-button">Submit KYC</button>
          {message && <div className="kyc-message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default KYCForm;
