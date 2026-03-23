"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import type { CertificateData } from "@/lib/contract";
import { formatTimestamp } from "@/lib/contract";

interface Props {
  cert: CertificateData;
  showQR?: boolean;
}

export default function CertificateCard({ cert, showQR = false }: Props) {
  const [qrOpen, setQrOpen] = useState(showQR);
  const verifyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify?id=${encodeURIComponent(cert.certificateId)}`
      : `/verify?id=${encodeURIComponent(cert.certificateId)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    toast.success("Verification link copied!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-6 sm:p-8 space-y-6"
    >
      {/* Header — status badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">
            Certificate ID
          </p>
          <p className="font-mono text-sm font-semibold text-stone-800">
            {cert.certificateId}
          </p>
        </div>
        {cert.isValid ? (
          <span className="badge-valid">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Valid & Verified
          </span>
        ) : (
          <span className="badge-revoked">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Revoked
          </span>
        )}
      </div>

      {/* Details grid */}
      <div className="grid sm:grid-cols-2 gap-4 border-t border-stone-100 pt-5">
        <Detail label="Recipient" value={cert.recipientName} />
        <Detail label="Course" value={cert.courseName} />
        <Detail label="Issuer" value={cert.issuer} />
        <Detail label="Issue Date" value={formatTimestamp(cert.issueDate)} />
      </div>

      {/* Hash */}
      <div className="border-t border-stone-100 pt-4">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">
          Certificate Hash
        </p>
        <p className="font-mono text-xs text-stone-600 break-all leading-relaxed">
          {cert.certificateHash}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 border-t border-stone-100 pt-4">
        <button onClick={copyLink} className="btn-secondary text-xs py-2 px-4">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Link
        </button>
        <button
          onClick={() => setQrOpen((v) => !v)}
          className="btn-secondary text-xs py-2 px-4"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          {qrOpen ? "Hide QR" : "Show QR"}
        </button>
      </div>

      {/* QR Code */}
      {qrOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-col items-center gap-3 border-t border-stone-100 pt-5"
        >
          <p className="text-xs text-stone-400 font-medium">
            Scan to verify this certificate
          </p>
          <div className="p-3 bg-white border border-stone-200 rounded-xl">
            <QRCodeSVG value={verifyUrl} size={160} fgColor="#1c1917" bgColor="#ffffff" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-stone-800">{value}</p>
    </div>
  );
}
