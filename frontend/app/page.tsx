"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: "easeOut" },
});

const steps = [
  {
    number: "01",
    title: "Admin Issues Certificate",
    description:
      "An authorised admin fills in recipient details and submits them to the smart contract. The data is hashed and stored permanently on-chain.",
  },
  {
    number: "02",
    title: "Blockchain Records It",
    description:
      "The Ethereum smart contract emits an event and stores the certificate's unique ID, recipient info, and tamper-proof hash in its state.",
  },
  {
    number: "03",
    title: "Anyone Can Verify",
    description:
      "Enter the certificate ID (or scan a QR code) to instantly fetch the on-chain record and confirm authenticity — no third party needed.",
  },
];

const stats = [
  { value: "100%", label: "Tamper-Proof" },
  { value: "0", label: "Central Authority" },
  { value: "∞", label: "Availability" },
  { value: "<1s", label: "Verification Time" },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero ────────────────────────────────────────────────── */}
      <section className="section-container pt-24 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <span className="inline-block mb-5 text-xs font-semibold uppercase tracking-widest text-accent-600 bg-accent-50 border border-accent-200 px-4 py-1.5 rounded-full">
              Powered by Ethereum &amp; Hardhat
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="text-5xl sm:text-6xl font-black text-stone-900 leading-[1.1] tracking-tight mb-6"
          >
            Certificates that{" "}
            <span className="text-accent-600">can&apos;t be faked.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="text-lg text-stone-500 leading-relaxed mb-10 max-w-xl mx-auto"
          >
            Certify issues tamper-proof digital certificates secured by
            blockchain technology. No central authority. No forgery. Just
            immutable truth.
          </motion.p>

          <motion.div
            {...fadeUp(0.24)}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/issue" className="btn-primary px-8 py-3.5 text-sm">
              Issue a Certificate
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/verify" className="btn-secondary px-8 py-3.5 text-sm">
              Verify a Certificate
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats bar ───────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-stone-900 text-white py-10"
      >
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-white mb-1">{s.value}</p>
                <p className="text-xs font-medium text-stone-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── How it works (preview) ──────────────────────────────── */}
      <section className="section-container py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
            The Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900">
            How it works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="card-hover p-7"
            >
              <span className="text-4xl font-black text-stone-100 mb-4 block">
                {step.number}
              </span>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-900 transition-colors"
          >
            Learn more
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── CTA banner ──────────────────────────────────────────── */}
      <section className="section-container pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-stone-900 rounded-3xl px-8 py-14 sm:py-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-stone-400 text-sm mb-8 max-w-md mx-auto">
            Connect your MetaMask wallet and start issuing or verifying
            certificates in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/issue"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm bg-white text-stone-900 hover:bg-stone-100 transition-all duration-200"
            >
              Issue Certificate
            </Link>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm border border-stone-600 text-stone-300 hover:text-white hover:border-stone-400 transition-all duration-200"
            >
              Verify Certificate
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
