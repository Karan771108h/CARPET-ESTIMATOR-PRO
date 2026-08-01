import React from 'react';
import { CarpetSpec, CalculationResult, Room } from '../../lib/types/estimation';
import { ContractorBranding, ClientDetails, PricingInputs } from '../../lib/types/branding';
import { calculatePricing } from '../../lib/math/pricing';

function fmt(n: number, d = 1): string {
  return Number(n.toFixed(d)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: d });
}
function plural(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? '' : 's'}`;
}

interface ProposalPDFProps {
  id: string;
  room: Room;
  carpetSpec: CarpetSpec;
  result: CalculationResult;
  branding?: ContractorBranding;
  clientDetails?: ClientDetails;
  pricing?: PricingInputs;
}

/**
 * Renders room geometry visualizer with side-by-side non-overlapping section layout.
 */
const ROOM_SECTIONS_PER_ROW = 4;
const CUTS_PER_SVG = 5;

/**
 * Renders room geometry — one SVG per group of ROOM_SECTIONS_PER_ROW sections.
 * Width AND height are proportional. Displays full section names, pattern repeat lines, and seam cut lines.
 */
// ──── SVG label collision helpers ─────────────────────────────────────────────
type BBox = { x: number; y: number; w: number; h: number };
function bbOverlaps(a: BBox, b: BBox, pad = 3): boolean {
  return (a.x - pad < b.x + b.w && a.x + a.w + pad > b.x &&
          a.y - pad < b.y + b.h && a.y + a.h + pad > b.y);
}
/** Estimate SVG text pixel width: fontSize × 0.62 × charCount */
function textW(s: string, fs: number): number { return Math.ceil(s.length * fs * 0.62); }
/**
 * Given ordered candidate bounding boxes, pick the first that has zero
 * overlaps with `placed`. Falls back to least-collision candidate.
 * Appends chosen bbox to `placed` and returns it.
 */
function pickSlot(candidates: BBox[], placed: BBox[]): BBox {
  let best = candidates[0], bestHits = Infinity;
  for (const c of candidates) {
    const hits = placed.filter(p => bbOverlaps(c, p)).length;
    if (hits === 0) { placed.push({ ...c }); return c; }
    if (hits < bestHits) { bestHits = hits; best = c; }
  }
  placed.push({ ...best });
  return best;
}
// ─────────────────────────────────────────────────────────────────────────────

const renderRoomSVG = (room: Room, carpetSpec: CarpetSpec): React.ReactNode => {
  if (!room.rectangles || room.rectangles.length === 0) return null;

  const { rollWidth, patternType = 'none', verticalRepeat = 0 } = carpetSpec;

  const SVG_W   = 736;
  const H_PAD   = 28;
  const GAP     = 24;   // px gap between section rects
  const MAX_H   = 160;  // max px height for the tallest section in a chunk
  const TITLE_Y = 13;
  const RECT_Y  = 68;   // top of all rects (leaves space for labels above)

  const unitLabel = room.unit === 'imperial' ? 'ft' : 'm';
  const totalAllW = room.rectangles.reduce((s, r) => s + r.width, 0);
  const rWidth    = rollWidth || (room.unit === 'imperial' ? 15 : 4);

  const chunks: Array<typeof room.rectangles> = [];
  for (let i = 0; i < room.rectangles.length; i += ROOM_SECTIONS_PER_ROW)
    chunks.push(room.rectangles.slice(i, i + ROOM_SECTIONS_PER_ROW));

  return (
    <>
      {chunks.map((chunk, ci) => {
        const chunkTotalW = chunk.reduce((s, r) => s + r.width, 0);
        const chunkMaxL   = Math.max(...chunk.map(r => r.length));
        const n           = chunk.length;
        const totalGapPx  = GAP * (n - 1);
        const availW      = SVG_W - H_PAD * 2 - totalGapPx;
        const scaleX      = chunkTotalW > 0 ? availW / chunkTotalW : 1;
        const scaleY      = chunkMaxL  > 0 ? MAX_H  / chunkMaxL   : 1;
        const scale       = Math.min(scaleX, scaleY);

        const maxHPx = chunkMaxL * scale;
        const DIM_Y  = RECT_Y + maxHPx + 30;
        const SVG_H  = Math.ceil(DIM_Y + 16);
        const patId  = `rg${ci}`;

        // ── Pass 1: compute geometry + pick label slots ──
        const placed: BBox[] = [];
        let xCur = H_PAD;

        const sectionData = chunk.map((rect, idx) => {
          const wPx     = rect.width  * scale;
          const hPx     = rect.length * scale;
          const x0      = xCur;
          xCur         += wPx + GAP;
          const cx      = x0 + wPx / 2;
          const rectBot = RECT_Y + hPx;

          const nameLabel = rect.name || `Section ${ci * ROOM_SECTIONS_PER_ROW + idx + 1}`;
          const dimLabel  = `${rect.width}${unitLabel} \u00d7 ${rect.length}${unitLabel}`;

          // Name label: above rect — candidates: center, shift-left, shift-right, higher tier ×2
          const nW = textW(nameLabel, 11);
          const nameSlot = pickSlot([
            { x: cx - nW / 2,      y: RECT_Y - 31, w: nW, h: 14 },
            { x: cx - nW / 2 - 20, y: RECT_Y - 31, w: nW, h: 14 },
            { x: cx - nW / 2 + 20, y: RECT_Y - 31, w: nW, h: 14 },
            { x: cx - nW / 2,      y: RECT_Y - 47, w: nW, h: 14 },
            { x: cx - nW / 2 - 20, y: RECT_Y - 47, w: nW, h: 14 },
            { x: cx - nW / 2 + 20, y: RECT_Y - 47, w: nW, h: 14 },
          ], placed);

          // Dim label: below rect — candidates: center, shift-left, shift-right, lower
          const dW = textW(dimLabel, 10);
          const dimSlot = pickSlot([
            { x: cx - dW / 2,      y: DIM_Y - 12, w: dW, h: 13 },
            { x: cx - dW / 2 - 20, y: DIM_Y - 12, w: dW, h: 13 },
            { x: cx - dW / 2 + 20, y: DIM_Y - 12, w: dW, h: 13 },
            { x: cx - dW / 2,      y: DIM_Y + 2,  w: dW, h: 13 },
          ], placed);

          // Seam cuts
          const fullStripsCount = rWidth > 0 ? Math.floor(rect.width / rWidth) : 0;
          const remainderWidth  = rWidth > 0 ? Number((rect.width % rWidth).toFixed(2)) : 0;
          const hasSeams        = rect.width > rWidth + 1e-7 && fullStripsCount > 0;

          const seamCuts: Array<{ xPx: number; cutDist: number; badgeSlot: BBox | null }> = [];
          const partStrips: Array<{ name: string; width: number; xStart: number; wPx: number }> = [];

          if (hasSeams) {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let curW = 0;
            for (let k = 0; k < fullStripsCount; k++) {
              const pW = rWidth;
              partStrips.push({ name: `Part ${alphabet[k] || k + 1}`, width: pW, xStart: x0 + curW * scale, wPx: pW * scale });
              curW += pW;
              if (curW < rect.width - 0.05) {
                const xPx = x0 + curW * scale;
                const badgeSlot = hPx >= 36 ? pickSlot([
                  { x: xPx - 30, y: RECT_Y + 4,           w: 60, h: 15 },
                  { x: xPx - 30, y: RECT_Y + hPx / 2 - 7, w: 60, h: 15 },
                  { x: xPx - 30, y: RECT_Y + hPx - 20,    w: 60, h: 15 },
                ], placed) : null;
                seamCuts.push({ xPx, cutDist: curW, badgeSlot });
              }
            }
            if (remainderWidth > 0.05)
              partStrips.push({ name: `Part ${alphabet[fullStripsCount] || fullStripsCount + 1}`, width: remainderWidth, xStart: x0 + curW * scale, wPx: remainderWidth * scale });
          }

          // Pattern repeat lines
          const repeatLinesPx: number[] = [];
          if (patternType !== 'none' && verticalRepeat > 0) {
            const pxPerUnit = hPx / rect.length;
            let ry = verticalRepeat * pxPerUnit;
            while (ry < hPx - 2) { repeatLinesPx.push(ry); ry += verticalRepeat * pxPerUnit; }
          }

          const fillBg      = patternType === 'half-drop' ? '#fffbeb' : patternType === 'straight' ? '#f0f9ff' : '#eff6ff';
          const strokeColor = patternType === 'half-drop' ? '#d97706' : patternType === 'straight' ? '#0284c7' : '#2563eb';

          return { rect, x0, wPx, hPx, cx, rectBot, nameLabel, dimLabel, nameSlot, dimSlot, seamCuts, partStrips, repeatLinesPx, fillBg, strokeColor };
        });

        // ── Pass 2: render ──
        return (
          <svg
            key={ci}
            data-no-break="true"
            width={SVG_W}
            height={SVG_H}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '10px', display: 'block' }}
          >
            <defs>
              <pattern id={patId} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width={SVG_W} height={SVG_H} fill={`url(#${patId})`} />

            <text x={H_PAD} y={TITLE_Y} fill="#475569" fontSize="10" fontWeight="700" fontFamily="sans-serif">
              {chunks.length > 1
                ? `ROOM GEOMETRY \u2014 PART ${ci + 1}/${chunks.length}  \u00b7  Sections ${ci * ROOM_SECTIONS_PER_ROW + 1}\u2013${Math.min((ci + 1) * ROOM_SECTIONS_PER_ROW, room.rectangles.length)} of ${room.rectangles.length}${patternType !== 'none' ? `  \u00b7  Pattern: ${patternType} (${verticalRepeat}${unitLabel} repeat)` : ''}`
                : `MULTI-SECTION ROOM GEOMETRY  (${totalAllW} ${unitLabel} total width  \u00b7  Roll = ${rWidth} ${unitLabel}${patternType !== 'none' ? `  \u00b7  Pattern: ${patternType} @ ${verticalRepeat}${unitLabel} repeat` : ''})`}
            </text>

            {sectionData.map((sd, idx) => {
              const { rect, x0, wPx, hPx, cx, rectBot, nameLabel, dimLabel, nameSlot, dimSlot, seamCuts, partStrips, repeatLinesPx, fillBg, strokeColor } = sd;
              const nameCx = nameSlot.x + nameSlot.w / 2;
              const nameY  = nameSlot.y + 11;   // SVG text y = baseline ≈ slot top + fontSize
              const dimCx  = dimSlot.x  + dimSlot.w  / 2;
              const dimY   = dimSlot.y  + 10;

              return (
                <g key={rect.id || idx}>
                  {/* Section rect */}
                  <rect x={x0} y={RECT_Y} width={wPx} height={hPx}
                    fill={fillBg} stroke={strokeColor} strokeWidth="2" rx="4" />

                  {/* Pattern repeat lines */}
                  {repeatLinesPx.map((ry, ri) => (
                    <line key={`repeat-${ri}`}
                      x1={x0 + 2} y1={RECT_Y + ry}
                      x2={x0 + wPx - 2} y2={RECT_Y + ry + (patternType === 'half-drop' && ri % 2 === 0 ? -3 : 0)}
                      stroke={patternType === 'half-drop' ? '#d97706' : '#0891b2'}
                      strokeWidth="1" strokeDasharray="4,2" opacity="0.75"
                    />
                  ))}

                  {/* Strip shading + part labels */}
                  {partStrips.map((p, pIdx) => {
                    const pxCenter  = p.xStart + p.wPx / 2;
                    const showLabel = p.wPx >= 30 && hPx >= 24;
                    return (
                      <g key={`part-${pIdx}`}>
                        {pIdx % 2 === 1 && (
                          <rect x={p.xStart} y={RECT_Y} width={p.wPx} height={hPx}
                            fill="#dbeafe" opacity="0.4" rx="2" />
                        )}
                        {showLabel && (
                          <text x={pxCenter} y={RECT_Y + hPx / 2 + 3}
                            textAnchor="middle" fill="#1e40af"
                            fontSize={p.wPx < 50 ? '8' : '9'} fontWeight="700" fontFamily="sans-serif">
                            {p.name} ({p.width}{unitLabel})
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Seam cut lines + collision-placed badges */}
                  {seamCuts.map((seam, sIdx) => (
                    <g key={`seam-${sIdx}`}>
                      <line x1={seam.xPx} y1={RECT_Y} x2={seam.xPx} y2={RECT_Y + hPx}
                        stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5,3" />
                      {seam.badgeSlot && (
                        <g>
                          <rect x={seam.badgeSlot.x} y={seam.badgeSlot.y}
                            width={seam.badgeSlot.w} height={seam.badgeSlot.h}
                            rx="3" fill="#fef2f2" stroke="#ef4444" strokeWidth="1" />
                          <text x={seam.badgeSlot.x + 30} y={seam.badgeSlot.y + 10}
                            textAnchor="middle" fill="#b91c1c" fontSize="8" fontWeight="700" fontFamily="sans-serif">
                            \u2702 Cut @ {seam.cutDist}{unitLabel}
                          </text>
                        </g>
                      )}
                    </g>
                  ))}

                  {/* Name label above rect with leader line + arrow */}
                  <text x={nameCx} y={nameY}
                    textAnchor="middle" fill="#1e3a8a" fontSize="11" fontWeight="700" fontFamily="sans-serif">
                    {nameLabel}
                  </text>
                  <line x1={cx} y1={nameY + 3} x2={cx} y2={RECT_Y - 9}
                    stroke="#2563eb" strokeWidth="1" strokeDasharray="3,2" />
                  <polygon points={`${cx - 4},${RECT_Y - 8} ${cx + 4},${RECT_Y - 8} ${cx},${RECT_Y - 1}`}
                    fill="#2563eb" />

                  {/* Dim label below rect with leader line + arrow */}
                  <polygon points={`${cx - 4},${rectBot + 8} ${cx + 4},${rectBot + 8} ${cx},${rectBot + 1}`}
                    fill="#3b82f6" />
                  <line x1={cx} y1={rectBot + 10} x2={cx} y2={dimSlot.y - 2}
                    stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,2" />
                  <text x={dimCx} y={dimY}
                    textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="600" fontFamily="monospace">
                    {dimLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      })}
    </>
  );
};


/**
 * Renders master roll cut diagram — one SVG per group of CUTS_PER_SVG cuts.
 * Name + dims combined in staggered tiers above roll. Nested items labeled inside.
 */
const renderMasterRollSVG = (result: CalculationResult, carpetSpec: CarpetSpec): React.ReactNode => {
  const SVG_W       = 736;
  const { rollWidth, patternType = 'none', verticalRepeat = 0 } = carpetSpec;
  const rollWidthFt = rollWidth || (result.unit === 'imperial' ? 12 : 4);
  const { totalLinearFt: totalLinear = 20.5 } = result;
  const twoStage = result.twoStageResult;

  if (totalLinear <= 0) return null;

  const H_PAD = 36;

  // ── No cuts (fallback) ──
  if (!twoStage || !twoStage.masterRollCuts || twoStage.masterRollCuts.length === 0) {
    const ROLL_Y = 30; const ROLL_H = 60; const SVG_H = 120;
    const scaleX = (SVG_W - H_PAD * 2) / totalLinear;
    return (
      <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '10px', display: 'block' }}>
        <text x={H_PAD} y={20} fill="#475569" fontSize="11" fontWeight="700" fontFamily="sans-serif">
          MASTER ROLL CONTINUOUS CUT (ROLL WIDTH = {rollWidthFt} FT, TOTAL = {totalLinear} LIN FT)
        </text>
        <rect x={H_PAD} y={ROLL_Y} width={totalLinear * scaleX} height={ROLL_H} fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" rx="2" />
        {patternType !== 'none' && verticalRepeat > 0 && Array.from({ length: Math.ceil(totalLinear / verticalRepeat) }).map((_, i) => {
          const x = H_PAD + (i * verticalRepeat) * scaleX;
          return <line key={i} x1={x} y1={ROLL_Y} x2={x} y2={ROLL_Y + ROLL_H} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />;
        })}
        <text x={H_PAD + (totalLinear * scaleX) / 2} y={ROLL_Y + ROLL_H / 2 + 4} textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="700" fontFamily="sans-serif">
          Continuous Roll ({totalLinear} lin ft)
        </text>
        <line x1={H_PAD} y1={ROLL_Y + ROLL_H + 12} x2={H_PAD + totalLinear * scaleX} y2={ROLL_Y + ROLL_H + 12} stroke="#94a3b8" strokeWidth="1.5" />
        <text x={H_PAD} y={ROLL_Y + ROLL_H + 26} fill="#64748b" fontSize="9" fontFamily="monospace">0 ft</text>
        <text x={H_PAD + totalLinear * scaleX} y={ROLL_Y + ROLL_H + 26} textAnchor="end" fill="#2563eb" fontSize="9" fontWeight="700" fontFamily="monospace">{totalLinear} ft</text>
      </svg>
    );
  }

  // ── Chunked rendering ──
  const allCuts = twoStage.masterRollCuts;
  const chunks: typeof allCuts[] = [];
  for (let i = 0; i < allCuts.length; i += CUTS_PER_SVG)
    chunks.push(allCuts.slice(i, i + CUTS_PER_SVG));

  // Fixed y-layout (ROLL_Y=95 leaves 77px for 2 label tiers above; 88px below for 2 tiers + ruler)
  const ROLL_Y    = 95;
  const ROLL_H    = 80;
  const RULER_Y   = ROLL_Y + ROLL_H + 88;
  const SVG_H     = RULER_Y + 22;

  return (
    <>
      {chunks.map((chunk, ci) => {
        const rangeStart  = chunk[0].rollStartPosition;
        const rangeEnd    = chunk[chunk.length - 1].rollEndPosition;
        const rangeFt     = rangeEnd - rangeStart || 1;
        const scaleX      = (SVG_W - H_PAD * 2) / rangeFt;
        const rollScaleY  = ROLL_H / rollWidthFt;

        // Collect labels for all items in chunk (main cuts + nested cuts)
        const labelsAbove: Array<{
          cx: number;
          rectTop: number;
          nameLabel: string;
          dimLabel: string;
          color: string;
          textColor: string;
          dimTextColor: string;
        }> = [];

        const labelsBelow: Array<{
          cx: number;
          rectBot: number;
          nameLabel: string;
          dimLabel: string;
          color: string;
          textColor: string;
          dimTextColor: string;
        }> = [];

        // Build labels with full section names (NO truncation)
        chunk.forEach((cut) => {
          const cutX = H_PAD + (cut.rollStartPosition - rangeStart) * scaleX;
          const cutW = cut.length * scaleX;
          const cutH = cut.width * rollScaleY;
          const cx   = cutX + cutW / 2;

          const nameLabel = cut.sectionName;
          const dimLabel  = `${cut.width}×${cut.length}ft`;

          const rectTop = ROLL_Y;
          const rectBot = ROLL_Y + cutH;
          const distTop = rectTop - ROLL_Y;
          const distBot = (ROLL_Y + ROLL_H) - rectBot;

          if (distTop <= distBot) {
            labelsAbove.push({
              cx, rectTop, nameLabel, dimLabel,
              color: '#2563eb', textColor: '#1e3a8a', dimTextColor: '#2563eb',
            });
          } else {
            labelsBelow.push({
              cx, rectBot, nameLabel, dimLabel,
              color: '#2563eb', textColor: '#1e3a8a', dimTextColor: '#2563eb',
            });
          }

          cut.nestedItems?.forEach((nested) => {
            const nx  = H_PAD + Math.max(0, nested.originY - rangeStart) * scaleX;
            const ny  = ROLL_Y + nested.originX * rollScaleY;
            const nw  = nested.placedLength * scaleX;
            const nh  = nested.placedWidth  * rollScaleY;
            const ncx = nx + nw / 2;

            const nNameLabel = nested.sectionName;
            const nDimLabel  = `${nested.placedWidth}×${nested.placedLength}ft`;

            const nRectTop = ny;
            const nRectBot = ny + nh;
            const nDistTop = nRectTop - ROLL_Y;
            const nDistBot = (ROLL_Y + ROLL_H) - nRectBot;

            if (nDistTop <= nDistBot) {
              labelsAbove.push({
                cx: ncx, rectTop: nRectTop, nameLabel: nNameLabel, dimLabel: nDimLabel,
                color: '#16a34a', textColor: '#14532d', dimTextColor: '#15803d',
              });
            } else {
              labelsBelow.push({
                cx: ncx, rectBot: nRectBot, nameLabel: nNameLabel, dimLabel: nDimLabel,
                color: '#16a34a', textColor: '#14532d', dimTextColor: '#15803d',
              });
            }
          });
        });

        return (
          <svg
            key={ci}
            data-no-break="true"
            width={SVG_W}
            height={SVG_H}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '10px', display: 'block' }}
          >
            {/* Title */}
            <text x={H_PAD} y={18} fill="#475569" fontSize="10" fontWeight="700" fontFamily="sans-serif">
              {chunks.length > 1
                ? `MASTER ROLL — PART ${ci + 1}/${chunks.length}  ·  Cuts ${ci * CUTS_PER_SVG + 1}–${Math.min((ci + 1) * CUTS_PER_SVG, allCuts.length)} of ${allCuts.length}  ·  Roll ${rangeStart}–${rangeEnd} ft${patternType !== 'none' ? `  ·  Pattern: ${patternType} @ ${verticalRepeat} repeat` : ''}`
                : `MASTER ROLL CONTINUOUS CUT & NESTING DIAGRAM  (roll = ${rollWidthFt} ft wide, ${totalLinear} lin ft total${patternType !== 'none' ? `  ·  Pattern: ${patternType} @ ${verticalRepeat} repeat` : ''})`}
            </text>

            {/* Roll background */}
            <rect x={H_PAD} y={ROLL_Y} width={rangeFt * scaleX} height={ROLL_H}
              fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" rx="4" />

            {/* Pattern match dashed lines along the roll */}
            {(patternType !== 'none' && verticalRepeat > 0) && (() => {
              const repeatLines: React.ReactNode[] = [];
              let currentRepeat = Math.floor(rangeStart / verticalRepeat) * verticalRepeat;
              while (currentRepeat <= rangeEnd) {
                if (currentRepeat >= rangeStart) {
                  const x = H_PAD + (currentRepeat - rangeStart) * scaleX;
                  repeatLines.push(
                    <line key={`pat-${currentRepeat}`} x1={x} y1={ROLL_Y} x2={x} y2={ROLL_Y + ROLL_H} 
                          stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
                  );
                }
                currentRepeat += verticalRepeat;
              }
              return repeatLines;
            })()}

            {chunk.map((cut) => {
              const cutX = H_PAD + (cut.rollStartPosition - rangeStart) * scaleX;
              const cutW = cut.length * scaleX;
              const cutH = cut.width * rollScaleY;
              const cx   = cutX + cutW / 2;

              return (
                <g key={cut.cutIndex}>
                  {/* Cut block */}
                  <rect x={cutX} y={ROLL_Y} width={cutW} height={cutH}
                    fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" rx="2" />

                  {/* Side-cut remnant block */}
                  {cut.sideCutRemnant && (() => {
                    const rh = cut.sideCutRemnant.width * rollScaleY;
                    const ry = ROLL_Y + cutH;
                    return (
                      <g>
                        <rect x={cutX} y={ry} width={cutW} height={rh}
                          fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,2" />
                        {rh >= 14 && (
                          <text x={cx} y={ry + rh / 2 + 4} textAnchor="middle"
                            fill="#64748b" fontSize="8" fontFamily="monospace">
                            Off-Cut {cut.sideCutRemnant.width}×{cut.sideCutRemnant.length}ft
                          </text>
                        )}
                      </g>
                    );
                  })()}

                  {/* Nested items */}
                  {cut.nestedItems?.map((nested, ni) => {
                    const nx  = H_PAD + Math.max(0, nested.originY - rangeStart) * scaleX;
                    const ny  = ROLL_Y + nested.originX * rollScaleY;
                    const nw  = nested.placedLength * scaleX;
                    const nh  = nested.placedWidth  * rollScaleY;
                    const ncx = nx + nw / 2;
                    const ncy = ny + nh / 2;
                    return (
                      <g key={ni}>
                        <rect x={nx} y={ny} width={nw} height={nh}
                          fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" rx="2" />
                        {nh >= 14 && nw >= 28 && (
                          <text x={ncx} y={ncy + (nh >= 26 ? -3 : 4)} textAnchor="middle"
                            fill="#15803d" fontSize={nested.sectionName.length > 12 ? "7" : "8"} fontWeight="700" fontFamily="sans-serif">
                            {nested.sectionName}
                          </text>
                        )}
                        {nh >= 26 && nw >= 28 && (
                          <text x={ncx} y={ncy + 9} textAnchor="middle"
                            fill="#166534" fontSize="7" fontFamily="monospace">
                            {nested.placedWidth}×{nested.placedLength}ft
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* ── Labels ABOVE roll (collision-aware tiers) ── */}
            {(() => {
              const placedA: BBox[] = [];
              return labelsAbove.map((lbl, ai) => {
                const lW = Math.max(textW(lbl.nameLabel, 10), textW(lbl.dimLabel, 9));
                const tiers = [
                  { nameY: ROLL_Y - 30, dimY: ROLL_Y - 18, leaderY: ROLL_Y - 15 },
                  { nameY: ROLL_Y - 52, dimY: ROLL_Y - 40, leaderY: ROLL_Y - 37 },
                  { nameY: ROLL_Y - 74, dimY: ROLL_Y - 62, leaderY: ROLL_Y - 59 },
                ];
                let chosen = tiers[0];
                for (const tier of tiers) {
                  const bb: BBox = { x: lbl.cx - lW / 2 - 2, y: tier.dimY - 10, w: lW + 4, h: 26 };
                  if (!placedA.some(p => bbOverlaps(bb, p))) {
                    placedA.push(bb);
                    chosen = tier;
                    break;
                  }
                  if (tier === tiers[tiers.length - 1])
                    placedA.push({ x: lbl.cx - lW / 2 - 2, y: tier.dimY - 10, w: lW + 4, h: 26 });
                }
                const leaderEnd = Math.max(lbl.rectTop - 8, chosen.leaderY + 2);
                return (
                  <g key={`la-${ai}`}>
                    <text x={lbl.cx} y={chosen.nameY} textAnchor="middle" fill={lbl.textColor} fontSize="10" fontWeight="700" fontFamily="sans-serif">
                      {lbl.nameLabel}
                    </text>
                    <text x={lbl.cx} y={chosen.dimY} textAnchor="middle" fill={lbl.dimTextColor} fontSize="9" fontFamily="monospace">
                      {lbl.dimLabel}
                    </text>
                    <line x1={lbl.cx} y1={chosen.leaderY} x2={lbl.cx} y2={leaderEnd} stroke={lbl.color} strokeWidth="1" strokeDasharray="3,2" />
                    <polygon points={`${lbl.cx - 3},${lbl.rectTop - 8} ${lbl.cx + 3},${lbl.rectTop - 8} ${lbl.cx},${lbl.rectTop - 1}`} fill={lbl.color} />
                  </g>
                );
              });
            })()}

            {/* ── Labels BELOW roll (collision-aware tiers) ── */}
            {(() => {
              const placedB: BBox[] = [];
              return labelsBelow.map((lbl, bi) => {
                const lW = Math.max(textW(lbl.nameLabel, 10), textW(lbl.dimLabel, 9));
                const tiers = [
                  { nameY: ROLL_Y + ROLL_H + 24, dimY: ROLL_Y + ROLL_H + 37, leaderY: ROLL_Y + ROLL_H + 20 },
                  { nameY: ROLL_Y + ROLL_H + 48, dimY: ROLL_Y + ROLL_H + 61, leaderY: ROLL_Y + ROLL_H + 44 },
                  { nameY: ROLL_Y + ROLL_H + 70, dimY: ROLL_Y + ROLL_H + 83, leaderY: ROLL_Y + ROLL_H + 66 },
                ];
                let chosen = tiers[0];
                for (const tier of tiers) {
                  const bb: BBox = { x: lbl.cx - lW / 2 - 2, y: tier.nameY - 2, w: lW + 4, h: 26 };
                  if (!placedB.some(p => bbOverlaps(bb, p))) {
                    placedB.push(bb);
                    chosen = tier;
                    break;
                  }
                  if (tier === tiers[tiers.length - 1])
                    placedB.push({ x: lbl.cx - lW / 2 - 2, y: tier.nameY - 2, w: lW + 4, h: 26 });
                }
                const leaderEnd = Math.min(lbl.rectBot + 8, chosen.leaderY - 2);
                return (
                  <g key={`lb-${bi}`}>
                    <text x={lbl.cx} y={chosen.nameY} textAnchor="middle" fill={lbl.textColor} fontSize="10" fontWeight="700" fontFamily="sans-serif">
                      {lbl.nameLabel}
                    </text>
                    <text x={lbl.cx} y={chosen.dimY} textAnchor="middle" fill={lbl.dimTextColor} fontSize="9" fontFamily="monospace">
                      {lbl.dimLabel}
                    </text>
                    <line x1={lbl.cx} y1={chosen.leaderY} x2={lbl.cx} y2={leaderEnd} stroke={lbl.color} strokeWidth="1" strokeDasharray="3,2" />
                    <polygon points={`${lbl.cx - 3},${lbl.rectBot + 8} ${lbl.cx + 3},${lbl.rectBot + 8} ${lbl.cx},${lbl.rectBot + 1}`} fill={lbl.color} />
                  </g>
                );
              });
            })()}

            {/* Ruler */}
            <line x1={H_PAD} y1={RULER_Y} x2={H_PAD + rangeFt * scaleX} y2={RULER_Y} stroke="#94a3b8" strokeWidth="1.5" />
            <text x={H_PAD} y={RULER_Y + 14} fill="#64748b" fontSize="9" fontFamily="monospace">{rangeStart} ft</text>
            <text x={H_PAD + rangeFt * scaleX} y={RULER_Y + 14} textAnchor="end"
              fill="#2563eb" fontSize="9" fontWeight="700" fontFamily="monospace">{rangeEnd} ft</text>
          </svg>
        );
      })}
    </>
  );
};

export const ProposalPDF: React.FC<ProposalPDFProps> = ({
  id,
  room,
  carpetSpec,
  result,
  branding,
  clientDetails,
  pricing,
}) => {
  const [quoteNumber, setQuoteNumber] = React.useState<number>(538721);
  const [currentDate, setCurrentDate] = React.useState<string>('July 22, 2026');

  React.useEffect(() => {
    setQuoteNumber(Math.floor(100000 + Math.random() * 900000));
    setCurrentDate(
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  const isImperial = result.unit === 'imperial';
  const mainUnitLabel = isImperial ? 'sq yds' : 'm²';
  const totalAmount = isImperial ? result.totalOrderedSqYd : result.totalOrderedSqM;
  const opt = result.optimizationResult;
  const twoStage = result.twoStageResult;
  const pricingResult = pricing?.includePricingOnPDF && pricing
    ? calculatePricing(result, pricing)
    : null;
  const businessName = branding?.businessName || 'Carpet Estimator Pro';
  const logoSrc = branding?.logoDataUrl || '/thumbnail.png';

  return (
    <div
      id={id}
      style={{
        width: '800px',
        minWidth: '800px',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: '32px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
        border: '1px solid #e2e8f0',
        pageBreakInside: 'auto',
        overflow: 'visible',
      }}
    >
      {/* Header */}
      <div
        data-no-break="true"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '2px solid #0f172a',
          paddingBottom: '20px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={logoSrc}
            alt="Logo"
            style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 900,
                letterSpacing: '-0.5px',
                color: '#0f172a',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              {businessName}
            </h1>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginTop: '4px', margin: 0 }}>
              {branding?.phone && <span>{branding.phone} &nbsp;|&nbsp; </span>}
              {branding?.email && <span>{branding.email}</span>}
              {branding?.licenseNumber && <span> &nbsp;|&nbsp; Lic# {branding.licenseNumber}</span>}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Quote #{quoteNumber}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{currentDate}</div>
          {clientDetails?.quoteExpiryDate && (
            <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, marginTop: '4px' }}>Expires: {clientDetails.quoteExpiryDate}</div>
          )}
        </div>
      </div>



      {/* Project Details */}
      <div
        data-no-break="true"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          fontSize: '12px',
        }}
      >
        <div>
          <span style={{ fontWeight: 700, color: '#334155', display: 'block' }}>Project / Room:</span>
          <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 600 }}>{room.name}</span>
        </div>
        <div>
          <span style={{ fontWeight: 700, color: '#334155', display: 'block' }}>CRI 104/105 Standard:</span>
          <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: 700 }}>&#10003; Compliant</span>
        </div>
        {clientDetails?.clientName && (
          <div>
            <span style={{ fontWeight: 700, color: '#334155', display: 'block' }}>Client:</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{clientDetails.clientName}</span>
          </div>
        )}
        {clientDetails?.jobSiteAddress && (
          <div>
            <span style={{ fontWeight: 700, color: '#334155', display: 'block' }}>Job-Site Address:</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>{clientDetails.jobSiteAddress}</span>
          </div>
        )}
      </div>

      {/* CRI 104/105 Checklist */}
      <div
        data-no-break="true"
        style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #86efac',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '12px', color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
          CRI 104/105 Checklist
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          {[
            'Consistent Pile Direction Across Cuts',
            'Seams Positioned Outside High-Traffic Pivots',
            'Seams Aligned Parallel to Primary Light Sources',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  minWidth: '18px',
                  border: '2px solid #16a34a',
                  borderRadius: '3px',
                  backgroundColor: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span style={{ color: '#166534', fontWeight: 500, lineHeight: '18px' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Materials Table */}
      <div data-no-break="true" style={{ marginBottom: '20px' }}>
        <h2
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#1e293b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
          }}
        >
          Itemized Material Schedule
        </h2>
        <table style={{ width: '100%', fontSize: '12px', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f172a', color: '#ffffff', fontWeight: 600 }}>
              <th style={{ padding: '10px' }}>Item Description</th>
              <th style={{ padding: '10px' }}>Specifications</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Required Quantity</th>
              {pricingResult && <th style={{ padding: '10px', textAlign: 'right' }}>Unit Price</th>}
              {pricingResult && <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>}
            </tr>
          </thead>
          <tbody style={{ fontFamily: 'monospace' }}>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontFamily: 'sans-serif', fontWeight: 500 }}>Broadloom Carpet Order</td>
              <td style={{ padding: '10px', color: '#475569' }}>
                {carpetSpec.rollWidth} {isImperial ? 'ft' : 'm'} Roll | {carpetSpec.patternType} pattern
                {carpetSpec.patternType !== 'none' && carpetSpec.verticalRepeat > 0 ? ` (${carpetSpec.verticalRepeat} ${isImperial ? 'ft' : 'm'} repeat)` : ''}
              </td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                {fmt(totalAmount)} {mainUnitLabel} ({fmt(result.totalLinearFt)} lin ft)
              </td>
              {pricingResult && <td style={{ padding: '10px', textAlign: 'right', color: '#475569' }}>${fmt(pricing!.carpetPerSqYd, 2)}/{isImperial ? 'sq yd' : 'm²'}</td>}
              {pricingResult && <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>${fmt(pricingResult.lines.find(l => l.label === 'Broadloom Carpet')?.total ?? 0, 2)}</td>}
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontFamily: 'sans-serif', fontWeight: 500 }}>Underlayment / Carpet Pad</td>
              <td style={{ padding: '10px', color: '#475569' }}>5% safety buffer included</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>
                {fmt(result.accessories.padAreaRequired)} {isImperial ? 'sq ft' : 'm²'} ({plural(result.accessories.padRollsNeeded ?? 1, 'roll')})
              </td>
              {pricingResult && <td style={{ padding: '10px', textAlign: 'right', color: '#475569' }}>${fmt(pricing!.padPerSqFt, 2)}/{isImperial ? 'sq ft' : 'm²'}</td>}
              {pricingResult && <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>${fmt(pricingResult.lines.find(l => l.label === 'Underlayment / Pad')?.total ?? 0, 2)}</td>}
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontFamily: 'sans-serif', fontWeight: 500 }}>Tackless Strips / Gripper Rods</td>
              <td style={{ padding: '10px', color: '#475569' }}>Perimeter minus doorways</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>
                {fmt(result.accessories.tacklessStripsLinear)} {isImperial ? 'lin ft' : 'm'} ({plural(result.accessories.tacklessPiecesNeeded ?? 1, 'batten')})
              </td>
              {pricingResult && <td style={{ padding: '10px', textAlign: 'right', color: '#475569' }}>${fmt(pricing!.tacklessPerLinFt, 2)}/ft</td>}
              {pricingResult && <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>${fmt(pricingResult.lines.find(l => l.label === 'Tackless Strips')?.total ?? 0, 2)}</td>}
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontFamily: 'sans-serif', fontWeight: 500 }}>Hot-Melt Seam Tape</td>
              <td style={{ padding: '10px', color: '#475569' }}>10% splice overlap included</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>
                {fmt(result.accessories.seamTapeLinear)} {isImperial ? 'lin ft' : 'm'} ({plural(result.accessories.seamTapeRollsNeeded ?? 1, 'roll')})
              </td>
              {pricingResult && <td style={{ padding: '10px', textAlign: 'right', color: '#475569' }}>${fmt(pricing!.seamTapePerLinFt, 2)}/ft</td>}
              {pricingResult && <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>${fmt(pricingResult.lines.find(l => l.label === 'Hot-Melt Seam Tape')?.total ?? 0, 2)}</td>}
            </tr>
            {pricingResult && pricingResult.lines.find(l => l.label === 'Installation Labor') && (
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px', fontFamily: 'sans-serif', fontWeight: 500 }}>Installation Labor</td>
                <td style={{ padding: '10px', color: '#475569' }}>Professional installation</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>
                  {fmt(isImperial ? result.totalOrderedSqYd : result.totalOrderedSqM)} {mainUnitLabel}
                </td>
                <td style={{ padding: '10px', textAlign: 'right', color: '#475569' }}>${fmt(pricing!.laborPerSqYd, 2)}/{isImperial ? 'sq yd' : 'm²'}</td>
                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>${fmt(pricingResult.lines.find(l => l.label === 'Installation Labor')!.total, 2)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pricing Totals Block */}
        {pricingResult && (
          <div style={{ marginTop: '12px', borderTop: '2px solid #0f172a', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '32px', fontSize: '13px', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px' }}>
                <span style={{ color: '#475569', fontWeight: 600 }}>Subtotal</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>${fmt(pricingResult.subtotal, 2)}</span>
              </div>
              {pricing?.calculateTax && (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>Tax ({fmt(pricing.taxRatePercent, 1)}%)</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>${fmt(pricingResult.taxAmount, 2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '240px', borderTop: '1px solid #cbd5e1', paddingTop: '8px' }}>
                <span style={{ color: '#0f172a', fontWeight: 800, fontSize: '15px' }}>Grand Total</span>
                <span style={{ fontWeight: 900, color: '#2563eb', fontSize: '15px' }}>${fmt(pricingResult.grandTotal, 2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Sign-off */}
      <div
        data-no-break="true"
        style={{
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: '2px solid #0f172a',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: '10px',
            color: '#64748b',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontWeight: 600, color: '#1e293b' }}>Generated by Carpet Estimator Pro</div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>{currentDate} • Quote #{quoteNumber}</div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            paddingTop: '12px',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Client Signature</div>
            <div style={{ borderBottom: '1px solid #0f172a', height: '32px' }} />
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>Signature / Date</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>Authorized by</div>
            <div style={{ borderBottom: '1px solid #0f172a', height: '32px' }} />
            <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>Installer / Company Representative</div>
          </div>
        </div>
      </div>

      {/* ── TECHNICAL APPENDIX ── always starts on a new page, easy to detach */}
      <div
        data-page-break="before"
        style={{
          paddingTop: '24px',
          borderTop: '2px dashed #cbd5e1',
          marginTop: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Technical Appendix
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
              For installer use only — detach before handing to client
            </div>
          </div>
          <div style={{ fontSize: '10px', color: '#cbd5e1', fontStyle: 'italic' }}>✂ tear here</div>
        </div>

        {/* Cut Sheet & Remnant Nesting Mapping */}
        <div
          style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        >
          <h3
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#1e293b',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: 0,
              marginBottom: '8px',
            }}
          >
            Cut Sheet &amp; Remnant Nesting Mapping
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', fontFamily: 'monospace' }}>
            {(twoStage?.placements || result.nestingResult?.placedCuts.map(c => ({ sectionName: c.pieceId, placedWidth: c.width, placedLength: c.length, placementType: c.placedInRemnant ? 'nested_in_remnant' as const : 'placed_on_roll' as const, parentRemnantId: c.remnantId, rollStartPosition: c.rollStart, rollEndPosition: c.rollEnd })) || []).map((p, pIdx) => (
              <div
                key={pIdx}
                data-no-break="true"
                style={{
                  padding: '8px',
                  backgroundColor: p.placementType === 'nested_in_remnant' ? '#ecfdf5' : '#ffffff',
                  border: `1px solid ${p.placementType === 'nested_in_remnant' ? '#6ee7b7' : '#cbd5e1'}`,
                  borderRadius: '4px',
                }}
              >
                <div style={{ fontWeight: 700, color: '#1e293b' }}>
                  {p.sectionName}
                </div>
                <div style={{ color: '#475569', marginTop: '2px' }}>
                  Dimensions: <span style={{ fontWeight: 700, color: '#0f172a' }}>{p.placedWidth}ft × {p.placedLength}ft</span>
                </div>
                <div style={{ marginTop: '2px' }}>
                  Status:{' '}
                  <span style={{ color: p.placementType === 'nested_in_remnant' ? '#059669' : '#2563eb', fontWeight: 700 }}>
                    {p.placementType === 'nested_in_remnant' ? `Nested in ${p.parentRemnantId}` : `Main Roll [${fmt(p.rollStartPosition ?? 0)} ft \u2013 ${fmt(p.rollEndPosition ?? 0)} ft]`}
                  </span>
                </div>
                {p.placementType === 'nested_in_remnant' && (
                  <div style={{ marginTop: '2px', color: '#64748b', fontSize: '10px' }}>
                    Remnant used: {p.placedWidth}ft × {p.placedLength}ft
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Remnant Parts Mapping */}
        {(() => {
          // Normalise remnants from either result source
          const remnants: Array<{ id: string; width: number; length: number; parentCutId?: string; originX?: number; originY?: number }> = (
            twoStage?.activeRemnants?.map((r) => ({
              id: r.remnantId,
              width: r.width,
              length: r.length,
              parentCutId: r.parentCutId,
              originX: r.originX,
              originY: r.originY,
            })) ||
            result.nestingResult?.activeRemnants?.map((r) => ({
              id: r.id,
              width: r.width,
              length: r.length,
              parentCutId: r.parentCutId,
            })) ||
            []
          );

          if (remnants.length === 0) return null;

          const isImp = result.unit === 'imperial';
          const unitLabel = isImp ? 'ft' : 'm';

          return (
            <div style={{ marginBottom: '24px' }}>
              {/* Section heading */}
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#1e293b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  paddingBottom: '6px',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                Remnant Parts Mapping
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '10px' }}>
                {remnants.length} active remnant piece{remnants.length !== 1 ? 's' : ''} available after nesting
              </div>

              {/* Grid of remnant cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '11px', fontFamily: 'monospace' }}>
                {remnants.map((r, idx) => {
                  const area = (r.width * r.length);
                  return (
                    <div
                      key={r.id}
                      data-no-break="true"
                      style={{
                        padding: '10px',
                        backgroundColor: '#fefce8',
                        border: '1px solid #fde047',
                        borderRadius: '4px',
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid',
                      }}
                    >
                      {/* Label */}
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '11px', marginBottom: '4px' }}>
                        Remnant Part {idx + 1}
                      </div>
                      {/* Dimensions */}
                      <div style={{ color: '#78350f', fontWeight: 700, fontSize: '12px', marginBottom: '3px' }}>
                        {r.width}{unitLabel} × {r.length}{unitLabel}
                      </div>
                      {/* Area */}
                      <div style={{ color: '#92400e', fontSize: '10px', marginBottom: '3px' }}>
                        Area: {area.toFixed(2)} {isImp ? 'sq ft' : 'm²'}
                      </div>
                      {/* Origin / parent */}
                      {(r.originX !== undefined || r.originY !== undefined) && (
                        <div style={{ color: '#a16207', fontSize: '9px', marginBottom: '2px' }}>
                          Origin: X={r.originX ?? '—'} Y={r.originY ?? '—'} {unitLabel}
                        </div>
                      )}
                      {r.parentCutId && (
                        <div style={{ color: '#a16207', fontSize: '9px' }}>
                          From cut: {r.parentCutId}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Room Geometry Diagram */}
        <div
          style={{
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#334155',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              paddingBottom: '6px',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            Multi-Section Room Geometry Diagram
          </div>
          {renderRoomSVG(room, carpetSpec)}
        </div>

        {/* Master Roll Cut Diagram */}
        <div
          style={{
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#334155',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              paddingBottom: '6px',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            Master Roll Continuous Cut &amp; Nesting Diagram
          </div>
          {renderMasterRollSVG(result, carpetSpec)}
        </div>
      </div>
    </div>
  );
};
