import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Import useNavigate
import "../styles/CustomerProfile.css";

function CustomerProfile() {
  const [userData, setUserData] = useState(null);
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // 👈 Initialize navigate

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      // 🔒 Redirect to login if no token
      if (!token) {
        console.warn("No token found, redirecting to login");
        navigate("/login"); // 👈 send user to login page
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          // 🔑 Token expired or invalid → redirect to login
          console.warn("Token expired or invalid, redirecting to login");
          localStorage.removeItem("token"); // clean up token
          navigate("/login");
          return;
        }

        const data = await res.json();
        console.log("Fetched profile data:", data); // 👈 Debug

        if (res.ok && data) {
          setUserData(data.user || data); // fallback for API response shape
          setKycList(data.kycs || []);
        } else {
          setError(data.message || "⚠️ Failed to fetch profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("❌ Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]); // 👈 add navigate to deps

  // 🕑 Loading state
  if (loading) return <div className="profile-container">Loading...</div>;

  // ❌ Error state
  if (error) return <div className="profile-container error">{error}</div>;

  // 🕵️‍♂️ No user data fallback
  if (!userData) return (
    <div className="profile-container">
      <p>No user data found. Please try re-logging in.</p>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 Customer Profile</h2>
        <p><strong>Name:</strong> {userData?.name}</p>
        <p><strong>Email:</strong> {userData?.email}</p>
        <p><strong>Role:</strong> {userData?.role}</p>

        <h3>📂 KYC Submissions</h3>
        {kycList.length > 0 ? (
          <table className="kyc-table">
            <thead>
              <tr>
                <th>Document Type</th>
                <th>Status</th>
                <th>Submitted On</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {kycList.map((kyc) => (
                <tr key={kyc._id}>
                  <td>{kyc.documentType}</td>
                  <td className={`status-${kyc.status?.toLowerCase()}`}>
                    {kyc.status}
                  </td>
                  <td>{kyc.createdAt ? new Date(kyc.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td>
                    {kyc.selfieUrl ? (
                      <a
                        href={kyc.selfieUrl}
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
              ))}
            </tbody>
          </table>
        ) : (
          <p>No KYC submissions found.</p>
        )}
      </div>
    </div>
  );
}

export default CustomerProfile;
