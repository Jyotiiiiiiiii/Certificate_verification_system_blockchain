const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CertificateRegistry...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer address : ${deployer.address}`);
  console.log(
    `Deployer balance : ${hre.ethers.formatEther(
      await hre.ethers.provider.getBalance(deployer.address)
    )} ETH\n`
  );

  // Deploy
  const CertificateRegistry = await hre.ethers.getContractFactory(
    "CertificateRegistry"
  );
  const registry = await CertificateRegistry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log(`✅ CertificateRegistry deployed to: ${address}`);
  console.log("\n📋 Next steps:");
  console.log(`   1. Copy the contract address above`);
  console.log(
    `   2. Paste it into frontend/lib/contractConfig.ts → CONTRACT_ADDRESS`
  );
  console.log(
    `   3. Copy artifacts/contracts/CertificateRegistry.sol/CertificateRegistry.json`
  );
  console.log(`      into frontend/lib/abi/CertificateRegistry.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
