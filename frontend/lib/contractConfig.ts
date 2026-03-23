// Contract address — update this after deploying with Hardhat
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // default first Hardhat deploy address

// Hardhat local network
export const CHAIN_ID = 31337;
export const NETWORK_NAME = "Hardhat Local";
export const RPC_URL = "http://127.0.0.1:8545";
