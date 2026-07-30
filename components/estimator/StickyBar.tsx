'use client';

import React from 'react';
import { CalculationResult } from '../../lib/types/estimation';
import { FileText, Lock } from 'lucide-react';

interface StickyBarProps {
  result: CalculationResult;
  isAuthenticated: boolean;
  onGeneratePDF: () => void;
}

export const StickyBar: React.FC<StickyBarProps> = ({
  result,
  isAuthenticated,
  onGeneratePDF,
}) => {
  const isImperial = result.unit === 'imperial';
  const unitLabel = isImperial ? 'sq yds' : 'm²';
  const displayAmount = isImperial ? result.totalOrderedSqYd : result.totalOrderedSqM;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-3 sm:px-6 shadow-2xl">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Total Required
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-900 leading-tight">
            {displayAmount} <span className="text-sm font-semibold text-slate-600">{unitLabel}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGeneratePDF}
          className="flex-1 sm:flex-initial py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          {isAuthenticated ? (
            <>
              <FileText className="w-4 h-4" />
              <span>Generate PDF Proposal</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-blue-200" />
              <span>Unlock PDF Proposal</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
