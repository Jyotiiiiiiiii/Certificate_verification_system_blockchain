const isProductionBuild = process.env.NODE_ENV === "production";

const defaultChainId = isProductionBuild ? 11155111 : 31337;
const defaultNetworkName = isProductionBuild ? "Sepolia" : "Hardhat Local";
const defaultRpcUrl = isProductionBuild
  ? "https://ethereum-sepolia-rpc.publicnode.com"
  : "http://127.0.0.1:8545";
const defaultBlockExplorerUrl = isProductionBuild
  ? "https://sepolia.etherscan.io"
  : "";

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  (isProductionBuild
    ? ""
    : "0x5FbDB2315678afecb367f032d93F642f64180aa3");

export const CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID || String(defaultChainId)
);
export const CHAIN_ID_HEX = `0x${CHAIN_ID.toString(16)}`;
export const NETWORK_NAME =
  process.env.NEXT_PUBLIC_NETWORK_NAME || defaultNetworkName;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || defaultRpcUrl;
export const BLOCK_EXPLORER_URL =
  process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || defaultBlockExplorerUrl;
export const CURRENCY_SYMBOL =
  process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "ETH";

export const CONTRACT_CONFIG_ERROR = CONTRACT_ADDRESS
  ? null
  : "NEXT_PUBLIC_CONTRACT_ADDRESS is missing. Deploy the contract first, then add the deployed address to the frontend environment.";
