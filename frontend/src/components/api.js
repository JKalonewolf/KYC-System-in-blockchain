import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/blockchain/kyc';

export const submitKycHash = (customerAddress, kycHash) =>
  axios.post(`${API_BASE}/store`, { customerAddress, kycHash });

export const approveKyc = (customerAddress) =>
  axios.post(`${API_BASE}/approve`, { customerAddress });

export const rejectKyc = (customerAddress) =>
  axios.post(`${API_BASE}/reject`, { customerAddress });

export const updateConsent = (customerAddress, consentGiven) =>
  axios.post(`${API_BASE}/consent`, { customerAddress, consentGiven });

export const fetchKyc = (customerAddress) =>
  axios.get(`${API_BASE}/${customerAddress}`);
