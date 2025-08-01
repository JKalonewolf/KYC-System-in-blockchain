import { BrowserProvider, Contract } from "ethers";
import KYCContractABI from "./KYCContractABI.json";

// Replace with your real deployed address
const contractAddress = " 0x9Ba2a740509Af50BDDf5F2324357f572e0B8d568";

export const connectContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected");
  }

  // Prompt MetaMask
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new BrowserProvider(window.ethereum); // ✅ For ethers v6+
  const signer = await provider.getSigner();

  const contract = new Contract(contractAddress, KYCContractABI, signer);
  return contract;
};
