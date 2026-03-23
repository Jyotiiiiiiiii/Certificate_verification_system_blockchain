"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useWallet } from "@/lib/useWallet";
import { issueCertificateOnChain, generateCertificateHash } from "@/lib/contract";

interface FormData {
  certificateId: string;
  recipientName: string;
  courseName: string;
  issuer: string;
}

const emptyForm: FormData = {
  certificateId: "",
  recipientName: "",
  courseName: "",
  issuer: "",
};

export default function IssuePage() {
  const { isConnected, isCorrectNetwork, signer, connect, address } = useWallet();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [txResult, setTxResult] = useState<{
    txHash: string;
    certHash: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer) return;

    // Validate
    for (const [key, val] of Object.entries(form)) {
      if (!val.trim()) {
        toast.error(`Please fill in: ${key}`);
        return;
      }
    }

    setIsLoading(true);
    const toastId = toast.loading("Sending transaction…");

    try {
      const certHash = generateCertificateHash({
        certificateId: form.certificateId,
        recipientName: form.recipientName,
        courseName: form.courseName,
        issuer: form.issuer,
        timestamp: Date.now(),
      });

      const receipt = await issueCertificateOnChain(signer, {
        ...form,
        certificateHash: certHash,
      });

      toast.success("Certificate issued on-chain! 🎉", { id: toastId });
      setTxResult({ txHash: receipt.hash, certHash });
      setForm(emptyForm);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Transaction failed";
      const isReverted = message.includes("CertificateAlreadyExists");
      toast.error(
        isReverted
          ? "A certificate with this ID already exists on-chain."
          : `Error: ${message.slice(0, 100)}`,
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Not connected ─────────────────────────────────────────────
  if (!isConnected) {
    return (
      <section className="section-container py-24">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-3">Connect your wallet</h1>
          <p className="text-stone-400 text-sm mb-8">
            You need to connect MetaMask to issue certificates. Only the contract
            owner can issue certificates.
          </p>
          <button onClick={connect} className="btn-primary">
            Connect MetaMask
          </button>
        </div>
      </section>
    );
  }

  // ── Wrong network ─────────────────────────────────────────────
  if (!isCorrectNetwork) {
    return (
      <section className="section-container py-24">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-3">Wrong Network</h1>
          <p className="text-stone-400 text-sm mb-2">
            Please switch MetaMask to the{" "}
            <strong>Hardhat Local</strong> network.
          </p>
          <code className="block text-xs bg-stone-100 rounded-lg px-4 py-3 text-stone-600 mt-4">
            Network: Hardhat Local<br />
            RPC: http://127.0.0.1:8545<br />
            Chain ID: 31337
          </code>
        </div>
      </section>
    );
  }

  return (
    <section className="section-container py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Admin Panel
          </p>
          <h1 className="text-3xl font-black text-stone-900 mb-2">
            Issue a Certificate
          </h1>
          <p className="text-stone-500 text-sm">
            Fill in the certificate details below. The data will be hashed and
            stored immutably on the Hardhat blockchain.
          </p>
          <p className="mt-3 text-xs text-stone-400 font-mono">
            Connected as:{" "}
            <span className="text-stone-700">{address}</span>
          </p>
        </motion.div>

        {/* Success state */}
        {txResult && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-8 border-accent-200 bg-accent-50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-accent-800 text-sm">Certificate issued successfully!</p>
                <p className="text-xs text-accent-600">The certificate is now permanently recorded on-chain.</p>
              </div>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <p className="text-stone-500"><span className="font-semibold text-stone-700">Tx Hash:</span> {txResult.txHash}</p>
              <p className="text-stone-500 break-all"><span className="font-semibold text-stone-700">Cert Hash:</span> {txResult.certHash}</p>
            </div>
            <button onClick={() => setTxResult(null)} className="mt-4 text-xs text-accent-700 font-semibold hover:underline">
              Issue another →
            </button>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          onSubmit={handleSubmit}
          className="card p-6 sm:p-8 space-y-5"
        >
          {/* Certificate ID */}
          <div>
            <label htmlFor="certificateId" className="label">
              Certificate ID <span className="text-red-400">*</span>
            </label>
            <input
              id="certificateId"
              name="certificateId"
              type="text"
              required
              value={form.certificateId}
              onChange={handleChange}
              placeholder="e.g. CERT-2024-001"
              className="input-field"
            />
            <p className="text-xs text-stone-400 mt-1">
              Must be unique. This ID is used for verification.
            </p>
          </div>

          {/* Recipient Name */}
          <div>
            <label htmlFor="recipientName" className="label">
              Recipient Name <span className="text-red-400">*</span>
            </label>
            <input
              id="recipientName"
              name="recipientName"
              type="text"
              required
              value={form.recipientName}
              onChange={handleChange}
              placeholder="e.g. Alice Johnson"
              className="input-field"
            />
          </div>

          {/* Course Name */}
          <div>
            <label htmlFor="courseName" className="label">
              Course / Program <span className="text-red-400">*</span>
            </label>
            <input
              id="courseName"
              name="courseName"
              type="text"
              required
              value={form.courseName}
              onChange={handleChange}
              placeholder="e.g. Blockchain Fundamentals"
              className="input-field"
            />
          </div>

          {/* Issuer */}
          <div>
            <label htmlFor="issuer" className="label">
              Issuing Organization <span className="text-red-400">*</span>
            </label>
            <input
              id="issuer"
              name="issuer"
              type="text"
              required
              value={form.issuer}
              onChange={handleChange}
              placeholder="e.g. Certify Institute"
              className="input-field"
            />
          </div>

          {/* Info box */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs text-stone-500 leading-relaxed">
            <strong className="text-stone-700">ℹ️ Note:</strong> A SHA-3 hash of
            all fields will be generated automatically and stored on-chain as the
            tamper-proof certificate fingerprint.
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-accent w-full py-3.5 text-sm justify-center"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending to blockchain…
              </>
            ) : (
              "Issue Certificate"
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
