// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KYC {
    address public admin;

    enum KYCStatus { Pending, Approved, Rejected }

    struct KYCRecord {
        address user;
        string documentHash;
        KYCStatus status;
        bool consentGiven;
    }

    mapping(address => KYCRecord) public kycRecords;

    event KYCSubmitted(address indexed user, string documentHash);
    event KYCApproved(address indexed user);
    event KYCRejected(address indexed user);
    event ConsentUpdated(address indexed user, bool consentGiven);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        // Optional: Emit admin for debugging
        emit AdminSet(admin);
    }

    event AdminSet(address indexed newAdmin);

    // 🔐 User submits hashed KYC document
    function submitKYC(string memory _documentHash) external {
        require(bytes(_documentHash).length > 0, "Document hash cannot be empty");

        kycRecords[msg.sender] = KYCRecord({
            user: msg.sender,
            documentHash: _documentHash,
            status: KYCStatus.Pending,
            consentGiven: false
        });

        emit KYCSubmitted(msg.sender, _documentHash);
    }

    // ✅ Admin approves a submitted KYC
    function approveKYC(address _user) external onlyAdmin {
        require(kycRecords[_user].user != address(0), "KYC record not found");
        require(kycRecords[_user].status == KYCStatus.Pending, "KYC already processed");

        kycRecords[_user].status = KYCStatus.Approved;
        emit KYCApproved(_user);
    }

    // ❌ Admin rejects a submitted KYC
    function rejectKYC(address _user) external onlyAdmin {
        require(kycRecords[_user].user != address(0), "KYC record not found");
        require(kycRecords[_user].status == KYCStatus.Pending, "KYC already processed");

        kycRecords[_user].status = KYCStatus.Rejected;
        emit KYCRejected(_user);
    }

    // 🔄 User updates consent
    function updateConsent(bool _consentGiven) external {
        require(kycRecords[msg.sender].user != address(0), "KYC record not found");

        kycRecords[msg.sender].consentGiven = _consentGiven;
        emit ConsentUpdated(msg.sender, _consentGiven);
    }

    // 📥 Admin or user can fetch KYC data
    function getKYC(address _user) external view returns (
        string memory documentHash,
        KYCStatus status,
        bool consentGiven
    ) {
        require(kycRecords[_user].user != address(0), "No KYC record found for this address");

        KYCRecord memory record = kycRecords[_user];
        return (record.documentHash, record.status, record.consentGiven);
    }
}
