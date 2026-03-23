# Certify — Blockchain Certificate Verification System

> Tamper-proof digital certificate issuance and verification powered by Ethereum smart contracts.

## 📁 Project Structure

```
Certify/
├── contracts/
│   └── CertificateRegistry.sol   # Solidity smart contract
├── scripts/
│   └── deploy.js                 # Hardhat deployment script
├── test/
│   └── CertificateRegistry.test.js
├── hardhat.config.js
├── package.json                  # Hardhat dependencies
└── frontend/
    ├── app/
    │   ├── page.tsx              # Landing page
    │   ├── issue/page.tsx        # Issue certificate (admin)
    │   ├── verify/page.tsx       # Verify certificate (public)
    │   └── how-it-works/page.tsx
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Footer.tsx
    │   └── CertificateCard.tsx
    ├── lib/
    │   ├── abi.ts                # Contract ABI
    │   ├── contract.ts           # Web3 helper functions
    │   ├── contractConfig.ts     # Address + chain config
    │   └── useWallet.ts          # MetaMask hook
    └── package.json              # Frontend dependencies
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **MetaMask** browser extension installed
- A terminal (PowerShell works fine on Windows)

---

## Step 1 — Install Hardhat dependencies

```powershell
cd "C:\Users\jyoti\OneDrive\Desktop\Certify"
npm install
```

---

## Step 2 — Compile the smart contract

```powershell
npx hardhat compile
```

You should see:
```
Compiled 1 Solidity file successfully
```

---

## Step 3 — Run tests

```powershell
npx hardhat test
```

Expected output: **4 passing** tests (issue, duplicate prevention, verification, revocation).

---

## Step 4 — Start local Hardhat node

Open a **new terminal window** and keep it running:

```powershell
npx hardhat node
```

This starts a local Ethereum node at `http://127.0.0.1:8545` and prints 20 funded test accounts.

---

## Step 5 — Deploy the contract

In your **original terminal**:

```powershell
npx hardhat run scripts/deploy.js --network localhost
```

You will see:
```
✅ CertificateRegistry deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

> **Important:** If the printed address differs from `0x5FbDB2315678afecb367f032d93F642f64180aa3`, update `frontend/lib/contractConfig.ts` → `CONTRACT_ADDRESS`.

---

## Step 6 — Add Hardhat network to MetaMask

In MetaMask → **Add a network manually**:

| Field | Value |
|---|---|
| Network Name | Hardhat Local |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency Symbol | `ETH` |

Then **import a Hardhat test account** using one of the private keys printed when you ran `npx hardhat node` (they each have 10,000 test ETH).

---

## Step 7 — Install & run the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 Using the App

| Page | URL | Who |
|---|---|---|
| Landing | `/` | Everyone |
| Issue Certificate | `/issue` | Admin (contract owner) |
| Verify Certificate | `/verify` | Everyone |
| How It Works | `/how-it-works` | Everyone |

### Issue a certificate
1. Go to `/issue`
2. Connect MetaMask (select the Hardhat account you imported — it must be the contract owner/deployer)
3. Fill in the form and click **Issue Certificate**
4. Approve the MetaMask transaction
5. Copy the Certificate ID or transaction hash

### Verify a certificate
1. Go to `/verify`
2. Paste the Certificate ID
3. Click **Verify** — no wallet needed, it's a free read

---

## 🔑 Environment Variables (Optional)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

This overrides the default in `contractConfig.ts`.

---

## 🧪 Test Summary

| Test | Description |
|---|---|
| Issue certificate | Emits event, increments counter |
| Non-owner blocked | Reverts with OwnableUnauthorizedAccount |
| Empty field | Reverts with EmptyField custom error |
| Duplicate prevention | Reverts with CertificateAlreadyExists |
| Data retrieval | Returns all fields correctly |
| Non-existent ID | Reverts with CertificateNotFound |
| Revocation | Sets isValid = false, emits event |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Solidity 0.8.24 |
| Access Control | OpenZeppelin Ownable v5 |
| Local Blockchain | Hardhat |
| Web3 | ethers.js v6 |
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion v11 |
| QR Code | qrcode.react |
| Notifications | react-hot-toast |
| Wallet | MetaMask |
