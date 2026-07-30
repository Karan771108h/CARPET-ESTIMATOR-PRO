'use client';

import React from 'react';
import Link from 'next/link';
import { PRICING } from '../../lib/constants';
import { HardHat, ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-16 sm:py-24">
      {/* Subtle grid background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Professional Grade Carpet Estimation Engine</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
          Instant Carpet Estimates.{' '}
          <span className="text-blue-600">Zero Waste.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Accurately calculate broadloom roll widths, pattern repeat waste, and tackless accessories in seconds. Save money on every roll.
        </p>

        {/* Pricing Offer Banner leading to payment page */}
        <Link
          href="/checkout"
          className="inline-flex flex-col sm:flex-row items-center gap-3 p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all mb-8 text-left max-w-lg mx-auto cursor-pointer group"
        >
          <img
            src="/thumbnail.png"
            alt="Carpet Estimator Pro Logo"
            className="w-12 h-12 rounded-xl shadow-xs shrink-0 object-cover border border-slate-200 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="text-blue-600 text-lg">From $19 / mo</span>
              <span>• $199 Lifetime License</span>
            </div>
            <p className="text-xs text-slate-500">Flexible Monthly, Annual, or Lifetime Key Options</p>
          </div>
        </Link>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#tool"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer"
          >
            <span>Use Free Estimator Below</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-600 pt-8 border-t border-slate-200/80">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>US & UK Units</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Multi-Section Rooms</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Pattern Match Repeat</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Client PDF Exports</span>
          </div>
        </div>
      </div>
    </div>
  );
};
