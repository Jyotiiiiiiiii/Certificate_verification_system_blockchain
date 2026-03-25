# Certify

Tamper-proof digital certificate issuance and verification powered by Ethereum smart contracts.

## Architecture

This project has two parts:

1. `contracts/`, `scripts/`, `test/`
   Hardhat project for compiling, testing, and deploying the `CertificateRegistry` smart contract.
2. `frontend/`
   Next.js 14 app that lets an admin issue certificates through MetaMask and lets anyone verify a certificate by ID.

## What The Contract Does

`contracts/CertificateRegistry.sol` stores certificates on-chain by `certificateId`.

- `issueCertificate(...)`
  Only the contract owner can issue a certificate.
- `verifyCertificate(certificateId)`
  Anyone can read the full certificate data.
- `revokeCertificate(certificateId)`
  Only the owner can mark a certificate as invalid.
- `certificateExists(certificateId)`
  Quick existence check used by the frontend.

Each certificate stores:

- certificate ID
- recipient name
- course name
- issuer
- issue timestamp
- certificate hash
- validity flag

## What The Frontend Does

The frontend uses `ethers.js` and MetaMask:

- `/issue`
  Connects a wallet and sends `issueCertificate(...)` transactions.
- `/verify`
  Reads contract data from a public RPC endpoint without requiring a wallet.
- `/how-it-works`
  Explains the flow and architecture.

The frontend is now environment-driven:

- local development defaults to Hardhat localhost
- production defaults to Sepolia-friendly network settings
- deployed contract address must be provided through `NEXT_PUBLIC_CONTRACT_ADDRESS`

## Local Development

From the project root:

```powershell
cmd /c npm install
cmd /c npm test
```

Run a local chain:

```powershell
cmd /c npm run node
```

In a second terminal, deploy locally:

```powershell
cmd /c npm run deploy:local
```

Then run the frontend:

```powershell
cd frontend
cmd /c npm install
cmd /c npm run dev
```

## Deploy Contract To Sepolia

### 1. Create root environment file

Copy `.env.example` to `.env` in the repo root and fill in real values:

```env
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=0xyour_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key_optional
```

Notes:

- `PRIVATE_KEY` must be the wallet that will own the contract.
- Fund that wallet with Sepolia ETH before deploying.
- `ETHERSCAN_API_KEY` is optional unless you want contract verification.

### 2. Deploy

```powershell
cmd /c npm run deploy:sepolia
```

The script prints:

- deployed contract address
- Sepolia explorer link
- exact `NEXT_PUBLIC_*` values for the frontend

### 3. Optional: verify on Etherscan

```powershell
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

## Deploy Frontend To Vercel

### 1. Create frontend environment values

Copy `frontend/.env.example` to `frontend/.env.local` for local testing, or add the same variables in Vercel:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xyour_deployed_contract_address
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=Sepolia
NEXT_PUBLIC_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_BLOCK_EXPLORER_URL=https://sepolia.etherscan.io
NEXT_PUBLIC_CURRENCY_SYMBOL=ETH
```

### 2. Test the production build locally

```powershell
cd frontend
cmd /c npm run build
```

### 3. Import into Vercel

When creating the Vercel project:

- set the Root Directory to `frontend`
- framework preset should be detected as Next.js
- add all `NEXT_PUBLIC_*` environment variables from above

### 4. Deploy

After deployment:

- open the Vercel URL
- connect MetaMask on Sepolia
- issue a test certificate from the owner wallet
- verify that certificate from `/verify`

## Current Verification Status

These checks passed locally:

- `cmd /c npm test`
- `cmd /c npm run build` inside `frontend/`

## Useful Files

- `hardhat.config.js`
  Hardhat networks and `.env` loading
- `scripts/deploy.js`
  Deployment script for localhost and Sepolia
- `frontend/lib/contractConfig.ts`
  Frontend network and contract settings
- `frontend/lib/useWallet.ts`
  MetaMask connection and network switching logic
- `frontend/lib/contract.ts`
  Read/write contract helpers
