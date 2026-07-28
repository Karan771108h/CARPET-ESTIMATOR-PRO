'use client';

import React from 'react';
import { PRICING } from '../../lib/constants';
import { Lock, Sparkles, KeyRound } from 'lucide-react';

interface PaywallCardProps {
  onUnlockClick: () => void;
}

export const PaywallCard: React.FC<PaywallCardProps> = ({ onUnlockClick }) => {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-blue-500 bg-white p-6 shadow-xl text-center">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-blue-50/30 pointer-events-none" />

      <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center">
        {/* Lock Icon */}
        <div className="bg-blue-600 text-white p-3.5 rounded-2xl shadow-md mb-3 animate-bounce-short">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Unlock Exact Cuts & Save Money on Waste
        </h3>

        <p className="text-xs text-slate-600 mb-4">
          Get exact broadloom strip cut schedule, roll order quantity with pattern match waste, accessories count, and client PDF proposal export.
        </p>

        <div className="bg-blue-100/80 border border-blue-200 rounded-xl px-4 py-2 mb-5 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="text-xs font-bold text-blue-900">
            {PRICING.PRICE_DISPLAY} {PRICING.OFFER_TITLE}
          </span>
        </div>

        <button
          type="button"
          onClick={onUnlockClick}
          className="w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <KeyRound className="w-4 h-4" />
          <span>Enter License Key / Unlock ({PRICING.PRICE_DISPLAY})</span>
        </button>
      </div>
    </div>
  );
};
