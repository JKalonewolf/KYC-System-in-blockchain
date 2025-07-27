import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import KYCForm from "./pages/KYCForm";
import Home from "./pages/Home"; // 👈 Import Home
import "./styles.css";
import BankDashboard from "./pages/BankDashboard";
import CustomerProfile from "./pages/CustomerProfile";
function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} /> {/* 👈 Use Home component */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/kyc" element={<KYCForm />} />
          <Route path="/dashboard" element={<BankDashboard />} />
          <Route path="/Customerprofile" element={<CustomerProfile />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
