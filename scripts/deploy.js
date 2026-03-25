const hre = require("hardhat");

async function main() {
  console.log("Deploying CertificateRegistry...\n");

  if (hre.network.name === "sepolia" && !process.env.PRIVATE_KEY) {
    throw new Error(
      "Missing PRIVATE_KEY. Add it to .env or your shell before deploying to Sepolia."
    );
  }

  const [deployer] = await hre.ethers.getSigners();
  const network = await hre.ethers.provider.getNetwork();

  console.log(`Network          : ${hre.network.name}`);
  console.log(`Chain ID         : ${network.chainId}`);
  console.log(`Deployer address : ${deployer.address}`);
  console.log(
    `Deployer balance : ${hre.ethers.formatEther(
      await hre.ethers.provider.getBalance(deployer.address)
    )} ETH\n`
  );

  const CertificateRegistry = await hre.ethers.getContractFactory(
    "CertificateRegistry"
  );
  const registry = await CertificateRegistry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  const explorerBaseUrl =
    hre.network.name === "sepolia" ? "https://sepolia.etherscan.io" : "";
  const rpcUrl =
    hre.network.name === "sepolia"
      ? hre.network.config.url
      : "http://127.0.0.1:8545";

  console.log(`CertificateRegistry deployed to: ${address}`);
  if (explorerBaseUrl) {
    console.log(`Explorer         : ${explorerBaseUrl}/address/${address}`);
  }

  console.log("\nFrontend environment values:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  console.log(`NEXT_PUBLIC_CHAIN_ID=${network.chainId}`);
  console.log(
    `NEXT_PUBLIC_NETWORK_NAME=${
      hre.network.name === "sepolia" ? "Sepolia" : "Hardhat Local"
    }`
  );
  console.log(`NEXT_PUBLIC_RPC_URL=${rpcUrl}`);
  if (explorerBaseUrl) {
    console.log(`NEXT_PUBLIC_BLOCK_EXPLORER_URL=${explorerBaseUrl}`);
  }
  console.log("NEXT_PUBLIC_CURRENCY_SYMBOL=ETH");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
