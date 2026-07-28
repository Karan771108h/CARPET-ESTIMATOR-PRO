'use client';

import React from 'react';
import Link from 'next/link';
import { PRICING_TIERS } from '../../lib/constants';
import { Check, Sparkles, ShieldCheck } from 'lucide-react';

export const PricingCard: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Flexible Plans for Modern Carpet Contractors</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
          Flexible Pricing Built for Flooring Pros
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto mb-12">
          Choose a low-cost subscription for casual jobs or a one-time lifetime license to own the utility forever with zero recurring fees.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left items-stretch">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`bg-white rounded-2xl p-6 sm:p-7 border flex flex-col justify-between relative transition-all ${
                tier.popular
                  ? 'border-2 border-blue-600 shadow-xl shadow-blue-500/10'
                  : 'border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              {tier.badge && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                  {tier.badge}
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{tier.title}</h3>
                <p className="text-xs text-slate-500 min-h-[32px]">{tier.target}</p>

                <div className="my-6 flex items-baseline gap-1.5 border-y border-slate-100 py-4">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">
                    {tier.priceDisplay}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{tier.billingPeriod}</span>
                  {tier.savings && (
                    <span className="ml-auto text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {tier.savings}
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 font-medium mb-8">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/checkout"
                className={`w-full py-3 px-4 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  tier.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <span>Select {tier.title}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
