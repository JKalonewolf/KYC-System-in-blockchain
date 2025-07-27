import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ ADD THIS IMPORT
import "../styles/BankDashboard.css";

function BankDashboard() {
  const [kycRequests, setKycRequests] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // ✅ Protect route: only bank role allowed
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const decoded = jwtDecode(token);
    if (decoded.role !== "bank") {
      navigate("/kyc");
    }
  }, [navigate]);

  // ✅ Existing logic to fetch KYC requests
  useEffect(() => {
    const fetchKYCRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/kyc/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          navigate("/login");
        }

        const data = await response.json();
        setKycRequests(data);
      } catch (err) {
        console.error("Failed to fetch KYC requests:", err);
      }
    };

    fetchKYCRequests();
  }, [navigate]);

  // ... rest of your existing code remains unchanged ...


  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/kyc/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        setKycRequests((prev) =>
          prev.map((req) => (req._id === id ? { ...req, status } : req))
        );
        alert(`✅ KYC ${status} successfully`);
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Failed to update KYC:", err);
    }
  };

  const handleViewSelfie = (selfieUrl) => {
    window.open(selfieUrl, "_blank", "width=600,height=600");
  };

  // Filter and search logic
  const filteredAndSearchedRequests = kycRequests
    .filter((req) =>
      filteredStatus === "all" ? true : req.status === filteredStatus
    )
    .filter((req) =>
      req.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSearchedRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAndSearchedRequests.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Bank Dashboard - KYC Requests</h2>

      {/* Filter and Search */}
      <div className="dashboard-controls">
        <select
          value={filteredStatus}
          onChange={(e) => setFilteredStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Document</th>
            <th>Document Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((kyc) => (
            <tr key={kyc._id}>
              <td>{kyc.fullName}</td>
              <td>{kyc.address}</td>
              <td>{kyc.documentType}</td>
              <td>{kyc.documentNumber}</td>
              <td>
                <span
                  className={`status-tag ${kyc.status.toLowerCase()}`}
                >
                  {kyc.status}
                </span>
              </td>
              <td>
                <button
                  className="action-button approve"
                  onClick={() => handleStatusChange(kyc._id, "approved")}
                  disabled={kyc.status === "approved"}
                >
                  Approve
                </button>
                <button
                  className="action-button reject"
                  onClick={() => handleStatusChange(kyc._id, "rejected")}
                  disabled={kyc.status === "rejected"}
                >
                  Reject
                </button>
                <button
                  className="action-button view"
                  onClick={() => handleViewSelfie(kyc.selfieUrl)}
                >
                  View Selfie
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default BankDashboard;
