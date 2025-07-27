import React, { useState, useEffect } from 'react';
import '../styles/KYCForm.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function KYCForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    documentType: '',
    documentNumber: '',
    selfieUrl: '',
    consentGiven: false
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // 🔒 Protect route: only allow "customer" role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'customer') {
        navigate('/dashboard'); // or another appropriate page
      }
    } catch (err) {
      console.error("Invalid token");
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/kyc/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ KYC submitted successfully!');
        setTimeout(() => {
          navigate('/customerprofile');
        }, 1500);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Something went wrong. Try again.');
    }
  };

  return (
    <div className="kyc-container">
      <div className="kyc-card">
        <h2 className="kyc-title">KYC Submission</h2>
        <form onSubmit={handleSubmit}>
          <label className="kyc-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="kyc-input"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label className="kyc-label">Address</label>
          <input
            type="text"
            name="address"
            className="kyc-input"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <label className="kyc-label">Document Type</label>
          <select
            name="documentType"
            className="kyc-input"
            value={formData.documentType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              -- Select Document Type --
            </option>
            <option value="Aadhar">Aadhar</option>
            <option value="Passport">Passport</option>
            <option value="License">License</option>
          </select>

          <label className="kyc-label">Document Number</label>
          <input
            type="text"
            name="documentNumber"
            className="kyc-input"
            value={formData.documentNumber}
            onChange={handleChange}
            required
          />

          <label className="kyc-label">Selfie URL</label>
          <input
            type="url"
            name="selfieUrl"
            className="kyc-input"
            value={formData.selfieUrl}
            onChange={handleChange}
            required
          />

          <div className="kyc-consent">
            <input
              type="checkbox"
              name="consentGiven"
              checked={formData.consentGiven}
              onChange={handleChange}
              required
            />
            <label className="kyc-label">I consent to share my KYC data</label>
          </div>

          <button type="submit" className="kyc-button">
            Submit KYC
          </button>

          {message && <div className="kyc-message">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default KYCForm;
