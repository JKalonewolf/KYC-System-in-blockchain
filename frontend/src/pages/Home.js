import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Welcome to Blockchain KYC Platform</h1>
        <p className="home-subtitle">
          Secure, decentralized, and easy KYC verification for customers and banks.
        </p>
        <button className="home-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
