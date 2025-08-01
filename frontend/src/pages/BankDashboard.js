import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BankDashboard.css";

function BankDashboard() {
  const [kycData, setKycData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  const fetchKycData = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/kyc/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setKycData(data);
        setFilteredData(data);
      } else {
        console.warn("Failed to fetch KYC data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching KYC data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycData();
  }, []);

  useEffect(() => {
    const filtered = kycData.filter((item) => {
      const matchSearch = item.fullName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
    setFilteredData(filtered);
  }, [search, statusFilter, kycData]);

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    const record = kycData.find((item) => item._id === id);

    if (!record?.customerWalletAddress) {
      alert("❌ Customer wallet address is missing");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/kyc/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          customerWalletAddress: record.customerWalletAddress,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ KYC ${newStatus}ed successfully`);
        fetchKycData();
      } else {
        alert(`❌ Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Update error:", err.message);
      alert("❌ Error updating KYC status");
    }
  };

  if (loading) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>🏦 Bank Dashboard</h2>

        <div className="dashboard-controls">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {filteredData.length > 0 ? (
          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Document</th>
                  <th>Wallet</th>
                  <th>Status</th>
                  <th>Selfie</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.fullName}</td>
                    <td>{item.documentType}: {item.documentNumber}</td>
                    <td className="wallet-cell">{item.customerWalletAddress || "—"}</td>
                    <td>
                      <span className={`status-tag ${item.status?.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.selfieUrl ? (
                        <a href={item.selfieUrl} target="_blank" rel="noopener noreferrer">View</a>
                      ) : "N/A"}
                    </td>
                    <td className="action-buttons">
                      <button className="btn approve" onClick={() => handleStatusUpdate(item._id, "Approved")}>✅ Approve</button>
                      <button className="btn reject" onClick={() => handleStatusUpdate(item._id, "Rejected")}>❌ Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No KYC records found.</p>
        )}
      </div>
    </div>
  );
}

export default BankDashboard;
