'use client';

import React from 'react';
import Link from 'next/link';
import { CalculationResult, Room, CarpetSpec } from '../../lib/types/estimation';
import { Calculator, Grid, Package, Ruler, ShieldCheck, FileText, CheckCircle2, Sparkles, KeyRound, ArrowRight } from 'lucide-react';
import { PRICING_TIERS } from '../../lib/constants';
import { SeamDiagramVisualizer } from './SeamDiagramVisualizer';

function fmt(n: number, decimals = 1): string {
  return Number(n.toFixed(decimals)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}
function plural(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? '' : 's'}`;
}

interface ResultsDisplayProps {
  room: Room;
  carpetSpec: CarpetSpec;
  result: CalculationResult;
  hasCalculated: boolean;
  isLicensed: boolean;
  onUnlockClick: () => void;
  onGeneratePDF?: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  room,
  carpetSpec,
  result,
  hasCalculated,
  isLicensed,
  onUnlockClick,
  onGeneratePDF,
}) => {
  const isImperial = result.unit === 'imperial';
  const areaUnitLabel = isImperial ? 'sq yds' : 'm²';
  const linearUnitLabel = isImperial ? 'lin ft' : 'm';

  const mainOrderedAmount = isImperial ? result.totalOrderedSqYd : result.totalOrderedSqM;
  const mainCutLength = isImperial ? result.cutLengthPerStripFt : result.cutLengthPerStripM;

  if (!hasCalculated) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-8 text-center space-y-4">
        <Calculator className="w-12 h-12 text-blue-600/40 mx-auto" />
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Ready for Instant Calculation
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Enter room dimensions and carpet specifications on the left, then click 'Calculate Installation Estimate'.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 space-y-6">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-extrabold text-slate-900">Takeoff & Installation Estimate</h2>
        </div>
        {isLicensed ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            Pro Licensed Access
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            Free On-Screen Takeoff
          </span>
        )}
      </div>

      {/* 3 Main Free Tier Results: Net Area, Total Carpet, Accessories */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Net Room Area */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            1. Net Room Area
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
              {isImperial ? fmt(result.netAreaSqFt) : fmt(result.netAreaSqM)}
            </span>
            <span className="text-xs font-bold text-slate-600">
              {isImperial ? 'sq ft' : 'm²'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            ({isImperial ? `${fmt(result.netAreaSqYd)} sq yd` : `${fmt(result.netAreaSqFt)} sq ft`})
          </div>
        </div>

        {/* 2. Total Carpet Required */}
        <div className="bg-blue-600 text-white rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">
            2. Total Carpet Required
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight">
              {fmt(mainOrderedAmount)}
            </span>
            <span className="text-sm font-semibold text-blue-100">{areaUnitLabel}</span>
          </div>
          <div className="text-[11px] text-blue-200 font-mono mt-1">
            Includes waste ({isImperial ? `${fmt(result.totalLinearFt)} lin ft` : `${fmt(result.totalLinearM)} m`})
          </div>
        </div>

        {/* 3. Accessories Required */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-slate-400" />
            3. Accessories
          </div>
          <div className="space-y-1 font-mono text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Pad:</span>
              <span className="font-bold text-slate-900">{fmt(result.accessories.padAreaRequired)} {isImperial ? 'sq ft' : 'm²'} ({plural(result.accessories.padRollsNeeded ?? 1, 'roll')})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Tackless:</span>
              <span className="font-bold text-slate-900">{fmt(result.accessories.tacklessStripsLinear)} {linearUnitLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Seam Tape:</span>
              <span className="font-bold text-slate-900">{fmt(result.accessories.seamTapeLinear)} {linearUnitLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Free Tier On-Screen Seam Alignment Layout Diagram Visualizer */}
      <SeamDiagramVisualizer
        room={room}
        rollWidth={carpetSpec.rollWidth}
        patternType={carpetSpec.patternType}
        verticalRepeat={carpetSpec.verticalRepeat}
        isLicensed={isLicensed}
        onExportClick={isLicensed && onGeneratePDF ? onGeneratePDF : onUnlockClick}
      />

      {/* Unlocked Detailed Cut Schedule vs Free Tier Upgrade Pitch */}
      {!isLicensed ? (
        <div className="space-y-6 pt-4 border-t border-slate-100">
          {/* Detailed Bullet Points Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* What you get in PDF */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3 text-blue-700">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>What You Get (Free Tier)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>On-Screen Interactive Takeoff: Visually inspect rolled carpet seam configurations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Itemized Material Calculations: Net Area & Total Carpet Required with standard waste</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Dynamic Accessory Estimates: Pad area, perimeter tackless strips & seam tape</span>
                </li>
              </ul>
            </div>

            {/* Why Upgrade / Why Pay */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3 text-emerald-700">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Why Upgrade to Pro</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Printable Seam Diagrams: Unwatermarked to-scale PDF layouts for field installation crews</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Professional Client Bids: Branded client-ready proposals to win more jobs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pattern-Repeat Offset Math: Exact material additions for pattern-matching rolls</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3 Flexible Pricing Tiers Bar */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center sm:text-left">
              Choose Your Pro Upgrade Plan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className={`bg-slate-50 border rounded-xl p-4 flex flex-col justify-between ${
                    tier.popular ? 'border-2 border-blue-600 bg-blue-50/30' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{tier.title}</span>
                      {tier.badge && (
                        <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                          {tier.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-2xl font-black text-slate-900">{tier.priceDisplay}</span>
                      <span className="text-[11px] font-bold text-slate-500">{tier.billingPeriod}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">{tier.target}</p>
                  </div>

                  <Link
                    href="/checkout"
                    className={`w-full py-2 px-3 text-center font-extrabold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-1 ${
                      tier.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <span>Select Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onUnlockClick}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Already have a key? Enter License Key</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Full Unlocked Pro Detailed View */
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                <Grid className="w-3.5 h-3.5 text-slate-400" />
                Strips Required
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {result.stripsRequired}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                {result.seamLocations.length} seam(s)
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-slate-400" />
                Matched Cut Length
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {fmt(mainCutLength)}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                per strip ({isImperial ? 'ft' : 'm'})
              </div>
            </div>
          </div>

          {/* Seams & Cut Schedule Breakdown */}
          {result.strips.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Broadloom Cut Schedule & Seam Placement
              </h3>
              <div className="space-y-1.5 font-mono text-xs">
                {result.strips.map((s) => (
                  <div
                    key={s.stripIndex}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <span className="font-semibold text-slate-900">
                      Strip #{s.stripIndex}
                    </span>
                    <span>
                      Cut: {isImperial ? `${fmt(s.matchedLength)} ft` : `${fmt(s.matchedLength)} m`}
                    </span>
                    {s.offset > 0 ? (
                      <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Offset: +{fmt(s.offset)}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Straight</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download PDF CTA Button */}
          {onGeneratePDF && (
            <button
              type="button"
              onClick={onGeneratePDF}
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <FileText className="w-4 h-4" />
              <span>Download Printable PDF Client Proposal</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
