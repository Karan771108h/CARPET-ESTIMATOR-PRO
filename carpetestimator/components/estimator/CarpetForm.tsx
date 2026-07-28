'use client';

import React, { useState } from 'react';
import { CarpetSpec, PatternMatchType, UnitSystem } from '../../lib/types/estimation';
import { Layers, Sliders, Info } from 'lucide-react';
import { PlainPatternSVG, StraightMatchSVG, HalfDropMatchSVG } from './PatternSVGs';

interface CarpetFormProps {
  carpetSpec: CarpetSpec;
  unit: UnitSystem;
  onChange: (updatedSpec: CarpetSpec) => void;
}

export const CarpetForm: React.FC<CarpetFormProps> = ({
  carpetSpec,
  unit,
  onChange,
}) => {
  const isImperial = unit === 'imperial';
  const unitLabel = isImperial ? 'ft' : 'm';
  const rollPresetWidths = isImperial ? [12, 15] : [4, 5];
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleRollWidthChange = (width: number) => {
    onChange({ ...carpetSpec, rollWidth: width });
  };

  const handlePatternChange = (type: PatternMatchType) => {
    onChange({
      ...carpetSpec,
      patternType: type,
      verticalRepeat: type === 'none' ? 0 : carpetSpec.verticalRepeat || (isImperial ? 1.5 : 0.4),
    });
  };

  const toggleTooltip = (field: string) => {
    setActiveTooltip(activeTooltip === field ? null : field);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <Layers className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">2. Carpet Specifications</h2>
      </div>

      {/* Roll Width Selection */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-slate-500 flex items-center gap-1">
            Roll Width ({unitLabel})
            <button
              type="button"
              onClick={() => toggleTooltip('rollWidth')}
              className="text-slate-400 hover:text-blue-600 focus:outline-none"
              title="Info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </label>
        </div>

        {activeTooltip === 'rollWidth' && (
          <div className="mb-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            Standard manufactured carpet roll width (12ft or 15ft for US imperial, 4m or 5m for UK metric).
          </div>
        )}

        <div className="flex items-center gap-2">
          {rollPresetWidths.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleRollWidthChange(preset)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                carpetSpec.rollWidth === preset
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {preset} {unitLabel} Standard
            </button>
          ))}
          <div className="relative flex-1">
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={carpetSpec.rollWidth || ''}
              onChange={(e) => handleRollWidthChange(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="Custom width"
            />
          </div>
        </div>
      </div>

      {/* Pattern Match Type with Inline SVGs */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-slate-500 flex items-center gap-1">
            Pattern Match Type
            <button
              type="button"
              onClick={() => toggleTooltip('patternType')}
              className="text-slate-400 hover:text-blue-600 focus:outline-none"
              title="Info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </label>
        </div>

        {activeTooltip === 'patternType' && (
          <div className="mb-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            Plain requires no repeat alignment. Straight or Half-drop matches require adding vertical repeat waste to cut lengths.
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handlePatternChange('none')}
            className={`py-3 px-2 text-xs font-semibold rounded-lg border flex flex-col items-center gap-1.5 transition-all ${
              carpetSpec.patternType === 'none'
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <PlainPatternSVG className="w-6 h-6" />
            <span>Plain / None</span>
          </button>

          <button
            type="button"
            onClick={() => handlePatternChange('straight')}
            className={`py-3 px-2 text-xs font-semibold rounded-lg border flex flex-col items-center gap-1.5 transition-all ${
              carpetSpec.patternType === 'straight'
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <StraightMatchSVG className="w-6 h-6" />
            <span>Straight Match</span>
          </button>

          <button
            type="button"
            onClick={() => handlePatternChange('half-drop')}
            className={`py-3 px-2 text-xs font-semibold rounded-lg border flex flex-col items-center gap-1.5 transition-all ${
              carpetSpec.patternType === 'half-drop'
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <HalfDropMatchSVG className="w-6 h-6" />
            <span>Half-Drop Match</span>
          </button>
        </div>
      </div>

      {/* Conditionally Revealed Vertical Repeat Length Input */}
      {carpetSpec.patternType !== 'none' && (
        <div className="mb-4 p-3 bg-blue-50/60 border border-blue-200 rounded-lg">
          <label className="block text-xs font-medium text-blue-900 mb-1 flex items-center gap-1">
            Vertical Repeat Length ({unitLabel})
            <button
              type="button"
              onClick={() => toggleTooltip('verticalRepeat')}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
              title="Info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </label>

          {activeTooltip === 'verticalRepeat' && (
            <div className="mb-2 p-2 bg-white border border-blue-200 rounded text-[11px] text-blue-800">
              The distance between identical pattern repeats along the length of the roll. Cut lengths round up to full repeats.
            </div>
          )}

          <input
            type="number"
            step="0.1"
            min="0.1"
            value={carpetSpec.verticalRepeat || ''}
            onChange={(e) =>
              onChange({
                ...carpetSpec,
                verticalRepeat: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder={isImperial ? 'e.g. 1.5 ft' : 'e.g. 0.4 m'}
          />
        </div>
      )}

      {/* Construction Waste Factor % & Trim Allowance */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            Waste Factor %
            <button
              type="button"
              onClick={() => toggleTooltip('wasteFactor')}
              className="text-slate-400 hover:text-blue-600 focus:outline-none"
              title="Info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </label>

          {activeTooltip === 'wasteFactor' && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-800">
              Standard buffer added for cutting, fitting, and irregular walls (default 10%).
            </div>
          )}

          <div className="flex items-center gap-1 mb-1.5">
            {[5, 10, 15, 20].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => onChange({ ...carpetSpec, wasteFactorPercent: pct })}
                className={`flex-1 py-1 text-[11px] font-semibold rounded border ${
                  carpetSpec.wasteFactorPercent === pct
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
          <input
            type="number"
            min="0"
            max="50"
            value={carpetSpec.wasteFactorPercent}
            onChange={(e) =>
              onChange({
                ...carpetSpec,
                wasteFactorPercent: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            Trim Allowance ({unitLabel})
            <button
              type="button"
              onClick={() => toggleTooltip('trimAllowance')}
              className="text-slate-400 hover:text-blue-600 focus:outline-none"
              title="Info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </label>

          {activeTooltip === 'trimAllowance' && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-800">
              Extra trimming length added to every strip end for wall fitting (typically 0.5ft or 0.1m).
            </div>
          )}

          <input
            type="number"
            step="0.05"
            min="0"
            value={carpetSpec.trimAllowance}
            onChange={(e) =>
              onChange({
                ...carpetSpec,
                trimAllowance: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder={isImperial ? '0.5 ft' : '0.1 m'}
          />
        </div>
      </div>
    </div>
  );
};
