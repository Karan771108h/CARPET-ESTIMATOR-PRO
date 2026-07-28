'use client';

import React from 'react';
import { Room } from '../../lib/types/estimation';
import { Lock, Eye, Download } from 'lucide-react';

interface SeamDiagramVisualizerProps {
  room: Room;
  rollWidth: number;
  isLicensed?: boolean;
  onExportClick?: () => void;
}

export const SeamDiagramVisualizer: React.FC<SeamDiagramVisualizerProps> = ({
  room,
  rollWidth,
  isLicensed = false,
  onExportClick,
}) => {
  if (!room.rectangles || room.rectangles.length === 0) return null;

  const unitLabel = room.unit === 'imperial' ? 'ft' : 'm';
  const rWidth = rollWidth || (room.unit === 'imperial' ? 12 : 3.66);
  const totalAllW = room.rectangles.reduce((s, r) => s + r.width, 0);

  const SVG_W = 680;
  const H_PAD = 24;
  const GAP = 20;
  const MAX_H = 150;
  const TITLE_Y = 14;
  const RECT_Y = 64;

  const chunkTotalW = room.rectangles.reduce((s, r) => s + r.width, 0);
  const chunkMaxL = Math.max(...room.rectangles.map((r) => r.length));
  const n = room.rectangles.length;
  const totalGapPx = GAP * (n - 1);
  const availW = SVG_W - H_PAD * 2 - totalGapPx;
  const scaleX = chunkTotalW > 0 ? availW / chunkTotalW : 1;
  const scaleY = chunkMaxL > 0 ? MAX_H / chunkMaxL : 1;
  const scale = Math.min(scaleX, scaleY);

  const maxHPx = chunkMaxL * scale;
  const DIM_Y = RECT_Y + maxHPx + 28;
  const SVG_H = Math.ceil(DIM_Y + 12);

  let xCur = H_PAD;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs relative overflow-hidden space-y-3">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg border border-blue-100">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Interactive Broadloom Seam Layout Visualizer
            </h3>
            <p className="text-[11px] text-slate-500">
              Live room geometry & roll seam placement ({totalAllW} {unitLabel} total width · {rWidth} {unitLabel} roll width)
            </p>
          </div>
        </div>

        {!isLicensed ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-full shrink-0">
            <Lock className="w-3 h-3 text-amber-600" />
            Free Takeoff Preview
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
            Pro Printable Blueprint
          </span>
        )}
      </div>

      {/* SVG Canvas Container */}
      <div className="relative overflow-x-auto bg-slate-900/95 rounded-xl p-3 border border-slate-800 flex justify-center">
        {/* On-Screen Watermark overlay when in Free Tier */}
        {!isLicensed && (
          <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center bg-slate-950/20 backdrop-blur-[0.5px]">
            <div className="bg-slate-900/90 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold font-mono px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              On-Screen Takeoff • Upgrade to Print & Export PDF
            </div>
          </div>
        )}

        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="max-w-full h-auto select-none"
        >
          <defs>
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" />
            </pattern>
          </defs>

          <rect width={SVG_W} height={SVG_H} fill="url(#gridPattern)" rx="6" />

          {room.rectangles.map((rect, idx) => {
            const wPx = rect.width * scale;
            const hPx = rect.length * scale;
            const x0 = xCur;
            xCur += wPx + GAP;
            const cx = x0 + wPx / 2;
            const rectBot = RECT_Y + hPx;
            const nameLabel = rect.name || `Section ${idx + 1}`;
            const dimLabel = `${rect.width}${unitLabel} × ${rect.length}${unitLabel}`;

            const fullStripsCount = rWidth > 0 ? Math.floor(rect.width / rWidth) : 0;
            const remainderWidth = rWidth > 0 ? Number((rect.width % rWidth).toFixed(2)) : 0;
            const hasSeams = rect.width > rWidth + 1e-7 && fullStripsCount > 0;

            const partStrips: Array<{ name: string; width: number; xStart: number; wPx: number }> = [];

            if (hasSeams) {
              const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
              let curW = 0;
              for (let k = 0; k < fullStripsCount; k++) {
                const pW = rWidth;
                partStrips.push({
                  name: `Part ${alphabet[k] || k + 1}`,
                  width: pW,
                  xStart: x0 + curW * scale,
                  wPx: pW * scale,
                });
                curW += pW;
              }
              if (remainderWidth > 0.05) {
                partStrips.push({
                  name: `Part ${alphabet[fullStripsCount] || fullStripsCount + 1}`,
                  width: remainderWidth,
                  xStart: x0 + curW * scale,
                  wPx: remainderWidth * scale,
                });
              }
            }

            return (
              <g key={rect.id || idx}>
                {/* Section Rect */}
                <rect
                  x={x0}
                  y={RECT_Y}
                  width={wPx}
                  height={hPx}
                  fill="#1e293b"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  rx="4"
                />

                {/* Sliced Strips Shading */}
                {partStrips.map((p, pIdx) => (
                  <g key={`part-${pIdx}`}>
                    {pIdx % 2 === 1 && (
                      <rect
                        x={p.xStart}
                        y={RECT_Y}
                        width={p.wPx}
                        height={hPx}
                        fill="#3b82f6"
                        opacity="0.15"
                        rx="2"
                      />
                    )}
                  </g>
                ))}

                {/* Seam Cut Lines */}
                {hasSeams &&
                  partStrips.slice(0, -1).map((p, pIdx) => {
                    const seamX = p.xStart + p.wPx;
                    return (
                      <g key={`seam-${pIdx}`}>
                        <line
                          x1={seamX}
                          y1={RECT_Y - 4}
                          x2={seamX}
                          y2={rectBot + 4}
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />
                        <rect
                          x={seamX - 18}
                          y={RECT_Y - 14}
                          width="36"
                          height="12"
                          fill="#ef4444"
                          rx="3"
                        />
                        <text
                          x={seamX}
                          y={RECT_Y - 5}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="8"
                          fontWeight="800"
                          fontFamily="sans-serif"
                        >
                          SEAM #{pIdx + 1}
                        </text>
                      </g>
                    );
                  })}

                {/* Section Name Above */}
                <text
                  x={cx}
                  y={RECT_Y - 18}
                  textAnchor="middle"
                  fill="#60a5fa"
                  fontSize="11"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  {nameLabel}
                </text>

                {/* Dimensions Below */}
                <text
                  x={cx}
                  y={DIM_Y}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  {dimLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Export / Upgrade CTA trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <p className="text-xs text-slate-500 font-medium">
          {isLicensed
            ? '✓ Visual seam layout verified for field installation.'
            : '💡 Installers need printed seam diagrams to prevent doorway miscuts.'}
        </p>

        {!isLicensed && (
          <button
            type="button"
            onClick={onExportClick}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Seam Diagram to Crew PDF</span>
          </button>
        )}
      </div>
    </div>
  );
};
