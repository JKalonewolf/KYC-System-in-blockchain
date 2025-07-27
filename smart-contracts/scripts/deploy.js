const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`🚀 Deploying contracts with account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`💰 Account balance: ${hre.ethers.utils.formatEther(balance)} ETH`);

  const KYC = await hre.ethers.getContractFactory("KYC");
  const kyc = await KYC.deploy();

  await kyc.deployed(); // ✅ Wait until deployed
  console.log(`✅ KYC contract deployed to: ${kyc.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error during deployment:", error);
    process.exit(1);
  });
