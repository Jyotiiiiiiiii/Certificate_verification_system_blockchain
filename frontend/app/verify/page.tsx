"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { verifyCertificateOnChain } from "@/lib/contract";
import type { CertificateData } from "@/lib/contract";
import CertificateCard from "@/components/CertificateCard";
import { RPC_URL } from "@/lib/contractConfig";

function VerifyContent() {
  const searchParams = useSearchParams();
  const [certId, setCertId] = useState(searchParams.get("id") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CertificateData | null | "not-found">(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search if URL has ?id=...
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl && !hasSearched) {
      setCertId(idFromUrl);
      handleVerify(idFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async (idOverride?: string) => {
    const id = (idOverride ?? certId).trim();
    if (!id) {
      toast.error("Please enter a Certificate ID");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setResult(null);

    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const cert = await verifyCertificateOnChain(provider, id);
      setResult(cert ?? "not-found");
      if (!cert) {
        toast.error("Certificate not found on-chain.");
      }
    } catch {
      toast.error("Failed to connect to local Hardhat node. Is it running?");
      setResult("not-found");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify();
  };

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
            Public Verification
          </p>
          <h1 className="text-3xl font-black text-stone-900 mb-2">
            Verify a Certificate
          </h1>
          <p className="text-stone-500 text-sm">
            Enter a certificate ID to instantly check its authenticity against
            the blockchain record.
          </p>
        </motion.div>

        {/* Search form */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          onSubmit={handleSubmit}
          className="card p-6 sm:p-8 mb-8"
        >
          <label htmlFor="certId" className="label">
            Certificate ID
          </label>
          <div className="flex gap-3">
            <input
              id="certId"
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="e.g. CERT-2024-001"
              className="input-field flex-1"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary px-6 flex-shrink-0"
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Verify"
              )}
            </button>
          </div>
          <p className="text-xs text-stone-400 mt-2">
            No wallet required — verification is a free read operation.
          </p>
        </motion.form>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="card p-8 animate-pulse space-y-4">
            <div className="flex justify-between">
              <div className="h-4 bg-stone-100 rounded w-40" />
              <div className="h-6 bg-stone-100 rounded-full w-28" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-2 bg-stone-100 rounded w-16" />
                  <div className="h-4 bg-stone-100 rounded w-28" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && hasSearched && result === "not-found" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 text-center"
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="font-bold text-stone-900 mb-1">Certificate Not Found</h3>
            <p className="text-sm text-stone-400">
              No certificate with ID{" "}
              <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs font-mono">
                {certId}
              </code>{" "}
              was found on the blockchain.
            </p>
            <span className="badge-invalid mt-4 inline-flex">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              Invalid / Not Issued
            </span>
          </motion.div>
        )}

        {!isLoading && result && result !== "not-found" && (
          <CertificateCard cert={result} showQR={false} />
        )}
      </div>
    </section>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="section-container py-16 text-center text-stone-400">Loading…</div>}>
      <VerifyContent />
    </Suspense>
  );
}
