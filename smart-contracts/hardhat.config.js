require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const { GANACHE_PRIVATE_KEY, INFURA_API_KEY, SEPOLIA_PRIVATE_KEY } = process.env;

if (!GANACHE_PRIVATE_KEY) {
  console.warn("⚠️  Missing GANACHE_PRIVATE_KEY in .env");
}
if (!INFURA_API_KEY) {
  console.warn("⚠️  Missing INFURA_API_KEY in .env");
}
if (!SEPOLIA_PRIVATE_KEY) {
  console.warn("⚠️  Missing SEPOLIA_PRIVATE_KEY in .env");
}

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: GANACHE_PRIVATE_KEY ? [GANACHE_PRIVATE_KEY] : [],
    },
    sepolia: {
      url: INFURA_API_KEY
        ? `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
        : "",
      accounts: SEPOLIA_PRIVATE_KEY ? [SEPOLIA_PRIVATE_KEY] : [],
    },
  },
};
