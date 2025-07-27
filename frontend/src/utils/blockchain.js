// src/utils/blockchain.js
import { ethers } from "ethers";
import contractABI from "./KYCContractABI.json"; // 👈 Place ABI JSON in same folder

const CONTRACT_ADDRESS = "0xYourSmartContractAddressHere"; // 👈 Replace this

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found. Install MetaMask.");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  return contract;
};
