import React from 'react';
import { CarpetSpec, CalculationResult, Room } from '../../lib/types/estimation';

interface ProposalPDFProps {
  id: string;
  room: Room;
  carpetSpec: CarpetSpec;
  result: CalculationResult;
}

/**
 * Renders room geometry visualizer with side-by-side non-overlapping section layout.
 */
const ROOM_SECTIONS_PER_ROW = 4;
const CUTS_PER_SVG = 5;

/**
 * Renders room geometry — one SVG per group of ROOM_SECTIONS_PER_ROW sections.
 * Width AND height are proportional. Displays full section names and seam cut lines.
 */
const renderRoomSVG = (room: Room, rollWidth: number): React.ReactNode => {
  if (!room.rectangles || room.rectangles.length === 0) return null;

  const SVG_W    = 736;
  const H_PAD    = 28;
  const GAP      = 24;   // px gap between section rects
  const MAX_H    = 160;  // max px height for the tallest section in a chunk
  const TITLE_Y  = 13;
  const RECT_Y   = 68;   // top of all rects (leaves space for name + leader above)
  const NAME_Y   = RECT_Y - 16; // name text baseline

  const unitLabel  = room.unit === 'imperial' ? 'ft' : 'm';
  const totalAllW  = room.rectangles.reduce((s, r) => s + r.width, 0);
  const rWidth     = rollWidth || (room.unit === 'imperial' ? 15 : 4);

  const chunks: Array<typeof room.rectangles> = [];
  for (let i = 0; i < room.rectangles.length; i += ROOM_SECTIONS_PER_ROW)
    chunks.push(room.rectangles.slice(i, i + ROOM_SECTIONS_PER_ROW));

  return (
    <>
      {chunks.map((chunk, ci) => {
        // Unified scale: proportional in BOTH width and height
        const chunkTotalW = chunk.reduce((s, r) => s + r.width, 0);
        const chunkMaxL   = Math.max(...chunk.map(r => r.length));
        const n           = chunk.length;
        const totalGapPx  = GAP * (n - 1);
        const availW      = SVG_W - H_PAD * 2 - totalGapPx;
        const scaleX      = chunkTotalW > 0 ? availW / chunkTotalW : 1;
        const scaleY      = chunkMaxL  > 0 ? MAX_H  / chunkMaxL   : 1;
        const scale       = Math.min(scaleX, scaleY); // single scale keeps aspect ratio

        const maxHPx  = chunkMaxL * scale;
        // DIM_Y is fixed for this chunk so all dim labels sit on the same baseline
        const DIM_Y   = RECT_Y + maxHPx + 30;
        const SVG_H   = Math.ceil(DIM_Y + 14);

        let xCur = H_PAD;
        const patId = `rg${ci}`;

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

            <text x={H_PAD} y={TITLE_Y} fill="#64748b" fontSize="10" fontWeight="700" fontFamily="sans-serif">
              {chunks.length > 1
                ? `ROOM GEOMETRY — PART ${ci + 1}/${chunks.length}  ·  Sections ${ci * ROOM_SECTIONS_PER_ROW + 1}–${Math.min((ci + 1) * ROOM_SECTIONS_PER_ROW, room.rectangles.length)} of ${room.rectangles.length}`
                : `MULTI-SECTION ROOM GEOMETRY  (${totalAllW} ${unitLabel} total width  ·  Roll Width = ${rWidth} ${unitLabel})`}
            </text>

            {chunk.map((rect, idx) => {
              const wPx      = rect.width  * scale; // proportional width
              const hPx      = rect.length * scale; // proportional height
              const x0       = xCur;
              xCur          += wPx + GAP;
              const cx       = x0 + wPx / 2;
              const rectBot  = RECT_Y + hPx;
              const nameLabel = rect.name || `Section ${ci * ROOM_SECTIONS_PER_ROW + idx + 1}`;
              const dimLabel  = `${rect.width}${unitLabel} × ${rect.length}${unitLabel}`;

              // Determine seam cuts if section width exceeds roll width
              const fullStripsCount = rWidth > 0 ? Math.floor(rect.width / rWidth) : 0;
              const remainderWidth  = rWidth > 0 ? Number((rect.width % rWidth).toFixed(2)) : 0;
              const hasSeams        = rect.width > rWidth + 1e-7 && fullStripsCount > 0;

              const seamCuts: Array<{ xPx: number; cutDist: number }> = [];
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
                  if (curW < rect.width - 0.05) {
                    seamCuts.push({
                      xPx: x0 + curW * scale,
                      cutDist: curW,
                    });
                  }
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
                  {/* Proportional rect background */}
                  <rect x={x0} y={RECT_Y} width={wPx} height={hPx}
                    fill="#eff6ff" stroke="#2563eb" strokeWidth="2" rx="4" />

                  {/* Render strip shading & sub-part titles if section is sliced */}
                  {partStrips.map((p, pIdx) => {
                    const pxCenter = p.xStart + p.wPx / 2;
                    const showPartText = p.wPx >= 30 && hPx >= 24;
                    return (
                      <g key={`part-${pIdx}`}>
                        {pIdx % 2 === 1 && (
                          <rect
                            x={p.xStart}
                            y={RECT_Y}
                            width={p.wPx}
                            height={hPx}
                            fill="#dbeafe"
                            opacity="0.4"
                            rx="2"
                          />
                        )}
                        {showPartText && (
                          <text
                            x={pxCenter}
                            y={RECT_Y + hPx / 2 + 3}
                            textAnchor="middle"
                            fill="#1e40af"
                            fontSize={p.wPx < 50 ? "8" : "9"}
                            fontWeight="700"
                            fontFamily="sans-serif"
                          >
                            {p.name} ({p.width}{unitLabel})
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Render clean, professional red seam cut lines & cut badges */}
                  {seamCuts.map((seam, sIdx) => (
                    <g key={`seam-${sIdx}`}>
                      <line
                        x1={seam.xPx}
                        y1={RECT_Y}
                        x2={seam.xPx}
                        y2={RECT_Y + hPx}
                        stroke="#dc2626"
                        strokeWidth="1.5"
                        strokeDasharray="5,3"
                      />
                      {hPx >= 36 && (
                        <g>
                          <rect
                            x={seam.xPx - 30}
                            y={RECT_Y + 4}
                            width="60"
                            height="15"
                            rx="3"
                            fill="#fef2f2"
                            stroke="#ef4444"
                            strokeWidth="1"
                          />
                          <text
                            x={seam.xPx}
                            y={RECT_Y + 15}
                            textAnchor="middle"
                            fill="#b91c1c"
                            fontSize="8"
                            fontWeight="700"
                            fontFamily="sans-serif"
                          >
                            ✂ Cut @ {seam.cutDist}{unitLabel}
                          </text>
                        </g>
                      )}
                    </g>
                  ))}

                  {/* ── Full Name ABOVE rect (NO truncation!) ── */}
                  <text x={cx} y={NAME_Y} textAnchor="middle"
                    fill="#1e3a8a" fontSize="11" fontWeight="700" fontFamily="sans-serif">
                    {nameLabel}
                  </text>
                  <line x1={cx} y1={NAME_Y + 3} x2={cx} y2={RECT_Y - 9}
                    stroke="#2563eb" strokeWidth="1" strokeDasharray="3,2" />
                  <polygon points={`${cx-4},${RECT_Y-8} ${cx+4},${RECT_Y-8} ${cx},${RECT_Y-1}`}
                    fill="#2563eb" />

                  {/* ── Dims BELOW rect at shared DIM_Y baseline ── */}
                  <polygon points={`${cx-4},${rectBot+8} ${cx+4},${rectBot+8} ${cx},${rectBot+1}`}
                    fill="#3b82f6" />
                  <line x1={cx} y1={rectBot + 10} x2={cx} y2={DIM_Y - 14}
                    stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,2" />
                  <text x={cx} y={DIM_Y} textAnchor="middle"
                    fill="#3b82f6" fontSize="10" fontWeight="600" fontFamily="monospace">
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
  const H_PAD       = 40;
  const rollWidthFt  = carpetSpec.rollWidth || 15.0;
  const totalLinear  = result.totalLinearFt || 20.5;
  const twoStage     = result.twoStageResult;

  if (totalLinear <= 0) return null;

  // ── Fallback ──
  if (!twoStage || !twoStage.masterRollCuts || twoStage.masterRollCuts.length === 0) {
    const ROLL_Y = 50; const ROLL_H = 80; const SVG_H = 170;
    const scaleX = (SVG_W - H_PAD * 2) / totalLinear;
    return (
      <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', marginBottom: '10px', display: 'block' }}>
        <text x={H_PAD} y={20} fill="#94a3b8" fontSize="11" fontWeight="700" fontFamily="sans-serif">
          MASTER ROLL CONTINUOUS CUT (ROLL WIDTH = {rollWidthFt} FT, TOTAL = {totalLinear} LIN FT)
        </text>
        <rect x={H_PAD} y={ROLL_Y} width={totalLinear * scaleX} height={ROLL_H} fill="#2563eb" stroke="#60a5fa" strokeWidth="1.5" rx="2" />
        <text x={H_PAD + (totalLinear * scaleX) / 2} y={ROLL_Y + ROLL_H / 2 + 4} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700" fontFamily="sans-serif">
          Continuous Roll ({totalLinear} lin ft)
        </text>
        <line x1={H_PAD} y1={ROLL_Y + ROLL_H + 12} x2={H_PAD + totalLinear * scaleX} y2={ROLL_Y + ROLL_H + 12} stroke="#94a3b8" strokeWidth="1.5" />
        <text x={H_PAD} y={ROLL_Y + ROLL_H + 26} fill="#94a3b8" fontSize="9" fontFamily="monospace">0 ft</text>
        <text x={H_PAD + totalLinear * scaleX} y={ROLL_Y + ROLL_H + 26} textAnchor="end" fill="#38bdf8" fontSize="9" fontWeight="700" fontFamily="monospace">{totalLinear} ft</text>
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
              color: '#60a5fa', textColor: '#e2e8f0', dimTextColor: '#93c5fd',
            });
          } else {
            labelsBelow.push({
              cx, rectBot, nameLabel, dimLabel,
              color: '#60a5fa', textColor: '#e2e8f0', dimTextColor: '#93c5fd',
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
                color: '#34d399', textColor: '#a7f3d0', dimTextColor: '#6ee7b7',
              });
            } else {
              labelsBelow.push({
                cx: ncx, rectBot: nRectBot, nameLabel: nNameLabel, dimLabel: nDimLabel,
                color: '#34d399', textColor: '#a7f3d0', dimTextColor: '#6ee7b7',
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
            style={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', marginBottom: '10px', display: 'block' }}
          >
            {/* Title */}
            <text x={H_PAD} y={18} fill="#94a3b8" fontSize="10" fontWeight="700" fontFamily="sans-serif">
              {chunks.length > 1
                ? `MASTER ROLL — PART ${ci + 1}/${chunks.length}  ·  Cuts ${ci * CUTS_PER_SVG + 1}–${Math.min((ci + 1) * CUTS_PER_SVG, allCuts.length)} of ${allCuts.length}  ·  Roll ${rangeStart}–${rangeEnd} ft`
                : `MASTER ROLL CONTINUOUS CUT & NESTING DIAGRAM  (roll = ${rollWidthFt} ft wide, ${totalLinear} lin ft total)`}
            </text>

            {/* Roll background */}
            <rect x={H_PAD} y={ROLL_Y} width={rangeFt * scaleX} height={ROLL_H}
              fill="#1e293b" stroke="#475569" strokeWidth="2" rx="4" />

            {chunk.map((cut) => {
              const cutX = H_PAD + (cut.rollStartPosition - rangeStart) * scaleX;
              const cutW = cut.length * scaleX;
              const cutH = cut.width * rollScaleY;
              const cx   = cutX + cutW / 2;

              return (
                <g key={cut.cutIndex}>
                  {/* Cut block */}
                  <rect x={cutX} y={ROLL_Y} width={cutW} height={cutH}
                    fill="#2563eb" stroke="#60a5fa" strokeWidth="1.5" rx="2" />

                  {/* Side-cut remnant block */}
                  {cut.sideCutRemnant && (() => {
                    const rh = cut.sideCutRemnant.width * rollScaleY;
                    const ry = ROLL_Y + cutH;
                    return (
                      <g>
                        <rect x={cutX} y={ry} width={cutW} height={rh}
                          fill="#334155" stroke="#64748b" strokeWidth="1" strokeDasharray="4,2" />
                        {rh >= 14 && (
                          <text x={cx} y={ry + rh / 2 + 4} textAnchor="middle"
                            fill="#94a3b8" fontSize="8" fontFamily="monospace">
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
                          fill="#059669" stroke="#34d399" strokeWidth="1.5" rx="2" />
                        {nh >= 14 && nw >= 28 && (
                          <text x={ncx} y={ncy + (nh >= 26 ? -3 : 4)} textAnchor="middle"
                            fill="#ffffff" fontSize={nested.sectionName.length > 12 ? "7" : "8"} fontWeight="700" fontFamily="sans-serif">
                            {nested.sectionName}
                          </text>
                        )}
                        {nh >= 26 && nw >= 28 && (
                          <text x={ncx} y={ncy + 9} textAnchor="middle"
                            fill="#a7f3d0" fontSize="7" fontFamily="monospace">
                            {nested.placedWidth}×{nested.placedLength}ft
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* ── Labels ABOVE roll (staggered tiers) ── */}
            {labelsAbove.map((lbl, ai) => {
              const isTier1     = ai % 2 === 0;
              const nameY       = isTier1 ? ROLL_Y - 60 : ROLL_Y - 36;
              const dimY        = isTier1 ? ROLL_Y - 47 : ROLL_Y - 23;
              const leaderStart = isTier1 ? ROLL_Y - 44 : ROLL_Y - 20;
              const leaderEnd   = Math.max(lbl.rectTop - 8, leaderStart);

              return (
                <g key={`la-${ai}`}>
                  <text x={lbl.cx} y={nameY} textAnchor="middle" fill={lbl.textColor} fontSize="10" fontWeight="700" fontFamily="sans-serif">
                    {lbl.nameLabel}
                  </text>
                  <text x={lbl.cx} y={dimY} textAnchor="middle" fill={lbl.dimTextColor} fontSize="9" fontFamily="monospace">
                    {lbl.dimLabel}
                  </text>
                  <line x1={lbl.cx} y1={leaderStart} x2={lbl.cx} y2={leaderEnd} stroke={lbl.color} strokeWidth="1" strokeDasharray="3,2" />
                  <polygon points={`${lbl.cx - 3},${lbl.rectTop - 8} ${lbl.cx + 3},${lbl.rectTop - 8} ${lbl.cx},${lbl.rectTop - 1}`} fill={lbl.color} />
                </g>
              );
            })}

            {/* ── Labels BELOW roll (staggered tiers) ── */}
            {labelsBelow.map((lbl, bi) => {
              const isTier1     = bi % 2 === 0;
              const nameY       = isTier1 ? ROLL_Y + ROLL_H + 32 : ROLL_Y + ROLL_H + 58;
              const dimY        = isTier1 ? ROLL_Y + ROLL_H + 45 : ROLL_Y + ROLL_H + 71;
              const leaderStart = isTier1 ? ROLL_Y + ROLL_H + 26 : ROLL_Y + ROLL_H + 52;
              const leaderEnd   = Math.min(lbl.rectBot + 8, leaderStart);

              return (
                <g key={`lb-${bi}`}>
                  <text x={lbl.cx} y={nameY} textAnchor="middle" fill={lbl.textColor} fontSize="10" fontWeight="700" fontFamily="sans-serif">
                    {lbl.nameLabel}
                  </text>
                  <text x={lbl.cx} y={dimY} textAnchor="middle" fill={lbl.dimTextColor} fontSize="9" fontFamily="monospace">
                    {lbl.dimLabel}
                  </text>
                  <line x1={lbl.cx} y1={leaderStart} x2={lbl.cx} y2={leaderEnd} stroke={lbl.color} strokeWidth="1" strokeDasharray="3,2" />
                  <polygon points={`${lbl.cx - 3},${lbl.rectBot + 8} ${lbl.cx + 3},${lbl.rectBot + 8} ${lbl.cx},${lbl.rectBot + 1}`} fill={lbl.color} />
                </g>
              );
            })}

            {/* Ruler */}
            <line x1={H_PAD} y1={RULER_Y} x2={H_PAD + rangeFt * scaleX} y2={RULER_Y}
              stroke="#94a3b8" strokeWidth="1.5" />
            <text x={H_PAD} y={RULER_Y + 14} fill="#94a3b8" fontSize="9" fontFamily="monospace">{rangeStart} ft</text>
            <text x={H_PAD + rangeFt * scaleX} y={RULER_Y + 14} textAnchor="end"
              fill="#38bdf8" fontSize="9" fontWeight="700" fontFamily="monospace">{rangeEnd} ft</text>
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
            src="/thumbnail.png"
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
              Carpet Estimator Pro
            </h1>
            <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500, marginTop: '4px', margin: 0 }}>
              Professional Carpet Estimation & Installation Plan
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Quote #{quoteNumber}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{currentDate}</div>
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
          <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: 700 }}>✓ Compliant</span>
        </div>
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
                  textAlign: 'center',
                  lineHeight: '16px',
                  fontSize: '13px',
                  color: '#15803d',
                  fontWeight: 700,
                  verticalAlign: 'middle',
                }}
              >
                &#10003;
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
            </tr>
          </thead>
          <tbody style={{ fontFamily: 'monospace' }}>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontFamily: 'sans-serif', fontWeight: 500 }}>Broadloom Carpet Order</td>
              <td style={{ padding: '10px', color: '#475569' }}>
                {carpetSpec.rollWidth} {isImperial ? 'ft' : 'm'} Roll | {carpetSpec.patternType} pattern
              </td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                {totalAmount} {mainUnitLabel} ({result.totalLinearFt} lin ft)
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontFamily: 'sans-serif', fontWeight: 500 }}>Underlayment / Carpet Pad</td>
              <td style={{ padding: '10px', color: '#475569' }}>5% safety buffer included</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>
                {result.accessories.padAreaRequired} {isImperial ? 'sq ft' : 'm²'} ({result.accessories.padRollsNeeded || 1} rolls)
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontFamily: 'sans-serif', fontWeight: 500 }}>Tackless Strips / Gripper Rods</td>
              <td style={{ padding: '10px', color: '#475569' }}>Perimeter minus doorways</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>
                {result.accessories.tacklessStripsLinear} {isImperial ? 'lin ft' : 'm'} ({result.accessories.tacklessPiecesNeeded || 1} battens)
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '10px', fontFamily: 'sans-serif', fontWeight: 500 }}>Hot-Melt Seam Tape</td>
              <td style={{ padding: '10px', color: '#475569' }}>10% splice overlap included</td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>
                {result.accessories.seamTapeLinear} {isImperial ? 'lin ft' : 'm'} ({result.accessories.seamTapeRollsNeeded || 1} rolls)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Master Roll Cut Schedule & Side-Cut Remnant Schedule */}
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
          Cut Sheet & Remnant Nesting Mapping
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
                  {p.placementType === 'nested_in_remnant' ? `Nested in ${p.parentRemnantId}` : `Main Roll [${p.rollStartPosition}ft – ${p.rollEndPosition}ft]`}
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
          {renderRoomSVG(room, carpetSpec.rollWidth)}
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
