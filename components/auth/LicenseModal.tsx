'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyRound, X, CheckCircle2, AlertCircle, Loader2, ShoppingCart, Sparkles } from 'lucide-react';
import { PRICING } from '../../lib/constants';

interface LicenseModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ onClose, onSuccess }) => {
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/verify-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: licenseKey.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess();
      } else {
        setError(data.message || 'Verification failed. Please check your key.');
      }
    } catch {
      setError('Network error during verification. Try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Pro License Key</h3>
            <p className="text-xs text-slate-500">Unlock PDF Proposals & Full Broadloom Cut List</p>
          </div>
        </div>

        {/* Buy Key Promo Banner */}
        <div className="p-3.5 mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-extrabold text-blue-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Don't have a key yet?</span>
            </div>
            <div className="text-[11px] text-blue-700 font-medium">Buy Pro Pass ({PRICING.PRICE_DISPLAY} USD)</div>
          </div>
          <Link
            href="/checkout"
            onClick={onClose}
            className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 transition-all shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Buy Key Now</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Enter License Key (or use demo key)
            </label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="Paste your Gumroad license key here"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="submit"
              disabled={isLoading || !licenseKey.trim()}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Activate Key
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
