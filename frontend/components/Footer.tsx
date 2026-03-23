import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white mt-20">
      <div className="section-container py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-bold text-stone-900 mb-2">
              <span className="w-6 h-6 bg-stone-900 text-white rounded-md flex items-center justify-center text-xs font-black">
                C
              </span>
              Certify
            </div>
            <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
              Tamper-proof certificate issuance and verification powered by
              blockchain technology.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 text-sm">
            <div>
              <p className="font-semibold text-stone-700 mb-2">Platform</p>
              <ul className="space-y-1">
                <li><Link href="/issue" className="text-stone-400 hover:text-stone-700 transition-colors">Issue Certificate</Link></li>
                <li><Link href="/verify" className="text-stone-400 hover:text-stone-700 transition-colors">Verify Certificate</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-stone-700 mb-2">Learn</p>
              <ul className="space-y-1">
                <li><Link href="/how-it-works" className="text-stone-400 hover:text-stone-700 transition-colors">How It Works</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} Certify. Built on Ethereum.
          </p>
          <p className="text-xs text-stone-400">
            Powered by Hardhat · ethers.js · Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
