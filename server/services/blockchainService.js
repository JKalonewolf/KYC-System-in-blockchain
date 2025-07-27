const { ethers } = require("ethers");
const KYC_ABI = require("../../smart-contracts/artifacts/contracts/KYC.sol/KYC.json");

// 🔐 Load secrets from environment variables
const CONTRACT_ADDRESS = process.env.KYC_CONTRACT_ADDRESS;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.GANACHE_PRIVATE_KEY;

// 🪢 Setup blockchain connection
//const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545'); // Ganache RPC
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const kycContract = new ethers.Contract(CONTRACT_ADDRESS, KYC_ABI.abi, wallet);

module.exports = {
  // Store KYC hash on blockchain
  async submitKycHash(kycHash) {
    try {
      const tx = await kycContract.submitKYC(kycHash); // 🆕
      await tx.wait();
      console.log("✅ KYC hash submitted:", tx.hash);
      return tx.hash;
    } catch (error) {
      console.error("❌ Error submitting KYC hash:", error);
      throw error;
    }
  },

  // Approve KYC for customer
  async approveKyc(customerAddress) {
    try {
      const tx = await kycContract.approveKYC(customerAddress);
      await tx.wait();
      console.log("✅ KYC approved for:", customerAddress);
      return tx.hash;
    } catch (error) {
      console.error("❌ Error approving KYC:", error);
      throw error;
    }
  },

  // Reject KYC for customer
  async rejectKyc(customerAddress) {
    try {
      const tx = await kycContract.rejectKYC(customerAddress);
      await tx.wait();
      console.log("✅ KYC rejected for:", customerAddress);
      return tx.hash;
    } catch (error) {
      console.error("❌ Error rejecting KYC:", error);
      throw error;
    }
  },

  // Update consent for customer
  async updateConsent(consentGiven) {
    try {
      const tx = await kycContract.updateConsent(consentGiven);
      await tx.wait();
      console.log("✅ Consent updated to:", consentGiven);
      return tx.hash;
    } catch (error) {
      console.error("❌ Error updating consent:", error);
      throw error;
    }
  },

  // Get KYC data for customer
  async getKycData(customerAddress) {
    try {
      const kycData = await kycContract.getKYC(customerAddress);
      console.log("📥 Fetched KYC data for:", customerAddress);
      return kycData;
    } catch (error) {
      console.error("❌ Error fetching KYC data:", error);
      throw error;
    }
  }
};
