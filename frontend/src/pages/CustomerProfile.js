import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CustomerProfile.css";

function CustomerProfile() {
  const [userData, setUserData] = useState(null);
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndKYC = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        // Fetch user profile
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            console.warn("Unauthorized. Redirecting to login.");
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          const errData = await res.json();
          setError(errData.message || "⚠️ Failed to fetch profile");
          return;
        }

        const data = await res.json();
        setUserData(data);

        // Fetch KYC info
        const kycRes = await fetch("http://localhost:5000/api/kyc/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (kycRes.ok) {
          const kycJson = await kycRes.json();
          setKycData(kycJson);
        } else if (kycRes.status !== 404) {
          const errJson = await kycRes.json();
          setError(errJson.message || "❌ Failed to fetch KYC data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("❌ Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndKYC();
    const interval = setInterval(fetchProfileAndKYC, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (loading) return <div className="profile-container">Loading...</div>;
  if (error) return <div className="profile-container error">{error}</div>;
  if (!userData) return <div className="profile-container">No user data found. Please re-login.</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 Customer Profile</h2>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Role:</strong> {userData.role}</p>

        <h3>📂 KYC Status</h3>
        {kycData ? (
          <>
            <table className="kyc-table">
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Document Number</th>
                  <th>Status</th>
                  <th>Consent</th>
                  <th>Submitted On</th>
                  <th>Selfie</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{kycData.documentType}</td>
                  <td>{kycData.documentNumber}</td>
                  <td className={`status-${kycData.status?.toLowerCase()}`}>
                    {kycData.status}
                  </td>
                  <td>{kycData.consentGiven ? "✅ Yes" : "❌ No"}</td>
                  <td>{kycData.createdAt ? new Date(kycData.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td>
                    {kycData.selfieUrl ? (
                      <a
                        href={`http://localhost:5000/${kycData.selfieUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Selfie
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {kycData.selfieUrl && (
              <div className="selfie-preview">
                <h4>📸 Uploaded Selfie</h4>
                <img
                  src={`http://localhost:5000/${kycData.selfieUrl}`}
                  alt="Uploaded Selfie"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginTop: "10px"
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <p>📭 No KYC submitted yet.</p>
        )}
      </div>
    </div>
  );
}

export default CustomerProfile;
