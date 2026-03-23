"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "What is Blockchain Certificate Verification?",
    content: `Traditional certificates are stored in centralized databases or
issued on paper — both are vulnerable to forgery, data loss, or
institutional failure. Blockchain certificate verification records
a unique fingerprint of each certificate on a decentralized ledger
that nobody can alter.`,
  },
  {
    title: "How Certify Uses Smart Contracts",
    content: `Certify deploys a Solidity smart contract called
CertificateRegistry on an Ethereum-compatible network (Hardhat
locally). When an admin issues a certificate, the contract stores
the recipient's details and a cryptographic hash on-chain. No one
— not even the admin — can edit or delete that record.`,
  },
  {
    title: "The Cryptographic Hash",
    content: `Every certificate has a unique SHA-3 (keccak256) hash generated
from its fields. Think of it as the certificate's DNA. If even one
character changes, the hash changes completely — instantly
revealing tampering when you re-compute and compare it.`,
  },
  {
    title: "Gas & Network",
    content: `Issuing a certificate costs a small gas fee (payable in ETH).
Verifying is completely free because it only reads data — no
transaction needed. In production you would connect to a public
testnet or mainnet; locally we use Hardhat's built-in accounts.`,
  },
];

const steps = [
  {
    step: "Step 1",
    title: "Admin issues a certificate",
    desc: "Connect MetaMask → Fill the form → Submit. The smart contract stores the data and emits a CertificateIssued event.",
    icon: "📝",
  },
  {
    step: "Step 2",
    title: "Blockchain records it permanently",
    desc: "The Ethereum node mines a block containing the state change. The certificate becomes immutable.",
    icon: "⛓️",
  },
  {
    step: "Step 3",
    title: "Anyone verifies in seconds",
    desc: "Paste the certificate ID (or scan the QR code). The app reads directly from the chain — no intermediaries.",
    icon: "✅",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="section-container py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
          Documentation
        </p>
        <h1 className="text-4xl font-black text-stone-900 mb-4">
          How It Works
        </h1>
        <p className="text-stone-500 text-base leading-relaxed">
          A plain-language explanation of blockchain certificate
          verification — how Certify works under the hood.
        </p>
      </motion.div>

      {/* Step-by-step flow */}
      <div className="mt-14 grid md:grid-cols-3 gap-5 mb-16">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="card-hover p-6"
          >
            <span className="text-3xl mb-4 block">{s.icon}</span>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">
              {s.step}
            </p>
            <h3 className="font-bold text-stone-900 mb-2">{s.title}</h3>
            <p className="text-sm text-stone-500 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Deep-dive sections */}
      <div className="max-w-2xl space-y-10">
        {sections.map((sec, i) => (
          <motion.div
            key={sec.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <h2 className="text-xl font-bold text-stone-900 mb-3">
              {sec.title}
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed whitespace-pre-line">
              {sec.content}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tech stack */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mt-14 card p-6 sm:p-8 max-w-2xl"
      >
        <h2 className="text-xl font-bold text-stone-900 mb-5">
          Technology Stack
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            ["Smart Contract", "Solidity 0.8.24"],
            ["Access Control", "OpenZeppelin Ownable"],
            ["Local Blockchain", "Hardhat + ethers.js v6"],
            ["Frontend", "Next.js 14 (App Router)"],
            ["Styling", "Tailwind CSS"],
            ["Animations", "Framer Motion"],
            ["Wallet", "MetaMask"],
            ["QR Code", "qrcode.react"],
          ].map(([label, tech]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-accent-500 rounded-full flex-shrink-0" />
              <span className="text-stone-400">{label}:</span>
              <span className="font-semibold text-stone-800">{tech}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
