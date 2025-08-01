const { ethers } = require("ethers");
const KYC_ABI = require("../../smart-contracts/artifacts/contracts/KYC.sol/KYC.json");

const CONTRACT_ADDRESS = process.env.KYC_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.GANACHE_PRIVATE_KEY;

// 🟢 Connect to Ganache local RPC
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const kycContract = new ethers.Contract(CONTRACT_ADDRESS, KYC_ABI.abi, wallet);

module.exports = {
  // 🔐 Submit KYC hash (document hash) to blockchain
  async submitKycHash(documentHash) {
    try {
      const tx = await kycContract.submitKYC(documentHash);
      await tx.wait();
      console.log("✅ KYC hash submitted:", tx.hash);
      return tx.hash;
    } catch (error) {
      console.error("❌ Error submitting KYC hash:", error.message || error);
      throw new Error("Blockchain error: submitKycHash failed");
    }
  },

  // ✅ Approve KYC
  async approveKyc(customerAddress) {
    try {
      console.log("🔍 Calling approveKYC with address:", customerAddress);
      console.log("👤 Backend signer address:", wallet.address);

      const tx = await kycContract.approveKYC(customerAddress);
      await tx.wait();
      console.log("✅ KYC approved for:", customerAddress);
      return tx.hash;
    } catch (error) {
      console.error("❌ Error approving KYC:", error.reason || error.message || error);
      if (error.transaction) console.error("📍 TX error:", error.transaction);
      throw new Error("Blockchain error: approveKYC failed");
    }
  },

  // ❌ Reject KYC
  async rejectKyc(customerAddress) {
    try {
      console.log("🔍 Calling rejectKYC with address:", customerAddress);
      console.log("👤 Backend signer address:", wallet.address);

      const tx = await kycContract.rejectKYC(customerAddress);
      await tx.wait();
      console.log("✅ KYC rejected for:", customerAddress);
      return tx.hash;
    } catch (error) {
      console.error("❌ Error rejecting KYC:", error.reason || error.message || error);
      if (error.transaction) console.error("📍 TX error:", error.transaction);
      throw new Error("Blockchain error: rejectKYC failed");
    }
  },

  // 🔄 Consent update
  async updateConsent(consentGiven) {
    try {
      const tx = await kycContract.updateConsent(consentGiven);
      await tx.wait();
      console.log("✅ Consent updated to:", consentGiven);
      return tx.hash;
    } catch (error) {
      console.error("❌ Error updating consent:", error.message || error);
      throw new Error("Blockchain error: updateConsent failed");
    }
  },

  // 📥 Fetch KYC
  async getKycData(customerAddress) {
    try {
      const kycData = await kycContract.getKYC(customerAddress);
      console.log("📥 Fetched KYC data for:", customerAddress);
      return kycData;
    } catch (error) {
      console.error("❌ Error fetching KYC data:", error.message || error);
      throw new Error("Blockchain error: getKycData failed");
    }
  }
};
