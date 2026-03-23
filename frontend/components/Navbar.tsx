"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/lib/useWallet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/issue", label: "Issue" },
  { href: "/verify", label: "Verify" },
  { href: "/how-it-works", label: "How It Works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : null;

  return (
    <header className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-sm border-b border-stone-200">
      <div className="section-container">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-stone-900">
            <span className="w-7 h-7 bg-stone-900 text-white rounded-lg flex items-center justify-center text-xs font-black">
              C
            </span>
            Certify
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-stone-900"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Wallet button */}
          <div className="hidden md:flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-accent-700 bg-accent-50 border border-accent-200 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full inline-block animate-pulse" />
                  {shortAddress}
                </span>
                <button
                  onClick={disconnect}
                  className="text-xs text-stone-500 hover:text-stone-900 font-medium transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn-primary text-xs py-2 px-4"
              >
                {isConnecting ? "Connecting…" : "Connect Wallet"}
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1">
              <span
                className={`block h-0.5 bg-stone-700 transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
              />
              <span
                className={`block h-0.5 bg-stone-700 transition-opacity ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-stone-700 transition-transform ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              />
            </div>
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-stone-100 bg-white overflow-hidden"
          >
            <ul className="section-container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block text-sm font-medium py-1 transition-colors ${
                      pathname === link.href
                        ? "text-stone-900"
                        : "text-stone-500"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                {isConnected ? (
                  <span className="text-xs font-semibold text-accent-700">
                    {shortAddress}
                  </span>
                ) : (
                  <button
                    onClick={() => { connect(); setMenuOpen(false); }}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    Connect Wallet
                  </button>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
