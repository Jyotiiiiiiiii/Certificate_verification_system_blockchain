"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { verifyCertificateOnChain } from "@/lib/contract";
import type { CertificateData } from "@/lib/contract";
import CertificateCard from "@/components/CertificateCard";
import {
  CONTRACT_CONFIG_ERROR,
  NETWORK_NAME,
  RPC_URL,
} from "@/lib/contractConfig";

function VerifyContent() {
  const searchParams = useSearchParams();
  const [certId, setCertId] = useState(searchParams.get("id") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CertificateData | null | "not-found">(
    null
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl && !hasSearched) {
      setCertId(idFromUrl);
      void handleVerify(idFromUrl);
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
    setSearchError(null);

    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const cert = await verifyCertificateOnChain(provider, id);
      setResult(cert ?? "not-found");
      if (!cert) {
        toast.error("Certificate not found on-chain.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : `Failed to connect to the ${NETWORK_NAME} RPC endpoint.`;
      toast.error(message);
      setSearchError(message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleVerify();
  };

  if (CONTRACT_CONFIG_ERROR) {
    return (
      <section className="section-container py-24">
        <div className="max-w-xl mx-auto text-center card p-8">
          <h1 className="text-2xl font-black text-stone-900 mb-3">
            Contract Not Configured
          </h1>
          <p className="text-stone-500 text-sm mb-4">
            {CONTRACT_CONFIG_ERROR}
          </p>
          <code className="block text-xs bg-stone-100 rounded-lg px-4 py-3 text-stone-600 text-left">
            NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
          </code>
        </div>
      </section>
    );
  }

  return (
    <section className="section-container py-16">
      <div className="max-w-2xl mx-auto">
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
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                "Verify"
              )}
            </button>
          </div>
          <p className="text-xs text-stone-400 mt-2">
            No wallet required. Verification is a free read operation on{" "}
            {NETWORK_NAME}.
          </p>
        </motion.form>

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

        {!isLoading && searchError && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 text-center"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-stone-900 mb-1">
              RPC Connection Error
            </h3>
            <p className="text-sm text-stone-400">{searchError}</p>
          </motion.div>
        )}

        {!isLoading && !searchError && hasSearched && result === "not-found" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 text-center"
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="font-bold text-stone-900 mb-1">
              Certificate Not Found
            </h3>
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

        {!isLoading && !searchError && result && result !== "not-found" && (
          <CertificateCard cert={result} showQR={false} />
        )}
      </div>
    </section>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="section-container py-16 text-center text-stone-400">
          Loading...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
