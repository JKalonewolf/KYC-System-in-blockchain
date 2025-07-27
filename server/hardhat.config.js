require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY; // your wallet private key
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID; // your Infura Project ID
const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;

module.exports = {
  solidity: "0.8.21", // Match your Solidity version
  networks: {
    hardhat: {}, // Local Hardhat network
    sepolia: {
      url: SEPOLIA_RPC_URL, // Replace with your preferred testnet
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  paths: {
    sources: "./smart-contracts/contracts", // Where KYC.sol lives
    artifacts: "./smart-contracts/artifacts",
  },
};
