import React, { useState } from 'react';
import { Zap, X, Copy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function TopBanner() {
  const [visible, setVisible] = useState(true);
  const { showToast } = useToast();

  if (!visible) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('IRON2026');
    showToast('Promo code IRON2026 copied to clipboard! 20% off annual plans.', 'success', 'Promo Code Copied');
  };

  return (
    <aside aria-label="Special Offer" className="bg-gradient-to-r from-zinc-950 via-[#182305] to-zinc-950 border-b border-[#ccff00]/25 text-xs text-zinc-200 py-2.5 px-4 relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 justify-center sm:justify-start">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00]"></span>
          </span>
          <span className="font-semibold text-[#ccff00] uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-[#ccff00]" /> Limited Offer:
          </span>
          <span className="hidden sm:inline text-zinc-300">
            Get 2 months free + $0 initiation fee on all annual plans.
          </span>
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1 bg-black/60 hover:bg-[#ccff00] hover:text-black border border-[#ccff00]/40 text-[#ccff00] px-2 py-0.5 rounded font-mono font-bold tracking-wider transition-all duration-200"
            title="Click to copy promo code"
          >
            IRON2026 <Copy className="w-3 h-3 ml-0.5" />
          </button>
          <Link
            to="/membership"
            className="hidden md:inline-flex items-center gap-1 font-semibold text-[#ccff00] hover:underline ml-2"
          >
            Claim Deal <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-zinc-400 hover:text-white p-1 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
