'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PRICING_TIERS } from '../../lib/constants';
import { ShieldCheck, CheckCircle2, KeyRound, ArrowLeft, Lock, CreditCard, Sparkles, Check } from 'lucide-react';
import { LicenseModal } from '../../components/auth/LicenseModal';

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('lifetime');
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);

  const selectedPlan = PRICING_TIERS.find((p) => p.id === selectedPlanId) || PRICING_TIERS[2];

  // Dynamic Gumroad checkout URL based on selected tier
  const GUMROAD_URL = selectedPlan.gumroadUrl;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Light Theme Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img
              src="/thumbnail.png"
              alt="Carpet Estimator Pro Logo"
              className="w-9 h-9 rounded-xl shadow-xs object-cover border border-slate-200"
            />
            <div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight block">
                Carpet Estimator Pro
              </span>
              <span className="text-[11px] text-blue-600 font-bold block">
                Official Checkout & Licensing
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Calculator</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        {/* Banner Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Flexible Plans for Modern Carpet Contractors</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Select Your Pro Access Plan
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Export unwatermarked printable seam diagrams, branded client proposals, and pattern-repeat calculations.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-stretch">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelectedPlanId(tier.id)}
              className={`bg-white rounded-2xl p-6 border-2 flex flex-col justify-between cursor-pointer transition-all relative ${
                selectedPlanId === tier.id
                  ? 'border-blue-600 shadow-xl ring-2 ring-blue-500/20'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {tier.badge && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl">
                  {tier.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-extrabold text-slate-900">{tier.title}</h3>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlanId === tier.id
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {selectedPlanId === tier.id && <span className="text-xs font-bold">✓</span>}
                  </div>
                </div>

                <p className="text-xs text-slate-500 min-h-[36px] mb-4">{tier.target}</p>

                <div className="flex items-baseline gap-1.5 border-y border-slate-100 py-4 mb-4">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">
                    {tier.priceDisplay}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{tier.billingPeriod}</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={`w-full mt-6 py-3 font-extrabold text-xs rounded-xl shadow-xs transition-all ${
                  selectedPlanId === tier.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {selectedPlanId === tier.id ? `Selected: ${tier.title}` : `Select ${tier.title}`}
              </button>
            </div>
          ))}
        </div>

        {/* Selected Plan Instant Checkout Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Checkout Summary</span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{selectedPlan.title}</h2>
              <p className="text-xs text-slate-500">{selectedPlan.target}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-slate-900">{selectedPlan.priceDisplay}</span>
              <span className="text-xs text-slate-500 block font-semibold">{selectedPlan.billingPeriod}</span>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={GUMROAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 active:scale-[0.99]"
            >
              <CreditCard className="w-5 h-5" />
              <span>Complete Order on Gumroad ({selectedPlan.priceDisplay})</span>
            </a>
          </div>

          <div className="flex items-center justify-center pt-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={() => setIsLicenseModalOpen(true)}
              className="font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Already have a key? Activate here</span>
            </button>
          </div>
        </div>
      </main>

      {/* License Activation Modal */}
      {isLicenseModalOpen && (
        <LicenseModal
          onClose={() => setIsLicenseModalOpen(false)}
          onSuccess={() => {
            setIsLicenseModalOpen(false);
            router.push('/');
          }}
        />
      )}
    </div>
  );
}
