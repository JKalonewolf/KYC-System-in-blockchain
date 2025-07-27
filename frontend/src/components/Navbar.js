import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const linkStyle = {
    textDecoration: "none",
    color: "#ecf0f1",
    fontWeight: "500",
    transition: "color 0.3s, transform 0.2s ease-in-out",
  };

  const handleMouseEnter = (e) => {
    e.target.style.color = "#f1c40f";
    e.target.style.transform = "scale(1.1)";
  };

  const handleMouseLeave = (e) => {
    e.target.style.color = "#ecf0f1";
    e.target.style.transform = "scale(1)";
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "linear-gradient(145deg, #3498db, #2c3e50)",
        color: "#fff",
        padding: "15px 30px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
        borderRadius: "12px",
        margin: "10px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: "1.6rem",
          fontWeight: "bold",
          textShadow: "2px 2px #1f2d3d",
        }}
      >
        BLOCKCHAIN KYC SYSTEM
      </div>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link
          to="/"
          style={linkStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Home
        </Link>
        <Link
          to="/register"
          style={linkStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Register
        </Link>
        <Link
          to="/login"
          style={linkStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Login
        </Link>
        <Link
          to="/kyc"
          style={linkStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          KYC
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
