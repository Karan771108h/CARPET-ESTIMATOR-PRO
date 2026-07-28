import { CarpetSpec, CalculationResult, Room, Polygon, Point } from '../types/estimation';
import { calculateArea } from './area';
import { calculateStrips } from './strips';
import { calculateAccessories } from './accessories';
import { TakeoffOptimizer } from './TakeoffOptimizer';
import { FlooringTakeoffEngine } from './FlooringTakeoffEngine';

export * from './area';
export * from './strips';
export * from './accessories';
export * from './TakeoffOptimizer';
export * from './TwoStageTakeoffOptimizer';
export * from './FlooringTakeoffEngine';

/**
 * Builds a 2D polygon representation from a room structure.
 */
export function buildPolygonFromRoom(room: Room): Polygon {
  if (room.vertices && room.vertices.length >= 3) {
    return { vertices: room.vertices };
  }

  if (!room.rectangles || room.rectangles.length === 0) {
    return { vertices: [] };
  }

  if (room.rectangles.length === 1) {
    const rect = room.rectangles[0];
    return {
      vertices: [
        { x: 0, y: 0 },
        { x: rect.width, y: 0 },
        { x: rect.width, y: rect.length },
        { x: 0, y: rect.length },
      ],
    };
  }

  // Multi-section stepped rectangles
  let currentX = 0;
  const vertices: Point[] = [{ x: 0, y: 0 }];

  for (const rect of room.rectangles) {
    currentX += rect.width;
    vertices.push({ x: currentX, y: 0 });
  }

  const lastRect = room.rectangles[room.rectangles.length - 1];
  vertices.push({ x: currentX, y: lastRect.length });

  for (let i = room.rectangles.length - 1; i >= 0; i--) {
    const rect = room.rectangles[i];
    const prevRect = i > 0 ? room.rectangles[i - 1] : null;

    vertices.push({ x: currentX - rect.width, y: rect.length });

    if (prevRect && prevRect.length !== rect.length) {
      vertices.push({ x: currentX - rect.width, y: prevRect.length });
    }

    currentX -= rect.width;
  }

  return { vertices };
}

/**
 * Unified calculation facade for Carpet Estimator Pro.
 *
 * Primary nesting engine: FlooringTakeoffEngine
 *   - Stage 1: Pre-Slicing (Cleaving) — decomposes sections wider than roll into Part A/B/C strips
 *   - Stage 2: Length-Descending 2D nesting — prevents Area-Sorting Trap
 *
 * The engine result drives: totalLinearFt, totalOrderedSqYd, accessories, twoStageResult
 * (twoStageResult is populated from FlooringTakeoffEngine output for PDF compatibility)
 */
export function calculateEstimate(
  room: Room,
  carpetSpec: CarpetSpec
): CalculationResult {
  const poly = buildPolygonFromRoom(room);

  const areaResult = calculateArea(
    room.rectangles || [],
    room.unit,
    room.doorwaysCount || 0,
    room.doorwayWidth || 0
  );

  const netFloorArea = room.unit === 'imperial' ? areaResult.netAreaSqFt : areaResult.netAreaSqM;
  const totalPerimeter = room.unit === 'imperial' ? areaResult.grossPerimeterFt : areaResult.grossPerimeterM;

  // -----------------------------------------------------------------------
  // FlooringTakeoffEngine: Single Source of Truth for nesting & linear length
  // -----------------------------------------------------------------------
  let nestingResult = undefined;
  let twoStageResult = undefined;

  if (room.rectangles && room.rectangles.length > 0) {
    const engine = new FlooringTakeoffEngine(
      carpetSpec.rollWidth,
      carpetSpec.trimAllowance ?? 0.25,
      carpetSpec.wasteFactorPercent ?? 0
    );

    engine.prepareSections(
      room.rectangles.map(r => ({
        id: r.name || r.id,
        width: r.width,
        length: r.length,
      }))
    );

    nestingResult = engine.solve();
    twoStageResult = engine.buildTwoStageResult(nestingResult, netFloorArea, totalPerimeter);
  }

  // -----------------------------------------------------------------------
  // Polygon Spatial Takeoff Engine (pattern matching & seam compliance)
  // -----------------------------------------------------------------------
  if (poly.vertices.length >= 3) {
    const optimizer = new TakeoffOptimizer(
      poly,
      carpetSpec.rollWidth,
      carpetSpec.verticalRepeat ?? 0,
      carpetSpec.horizontalRepeat ?? 0,
      carpetSpec.trimAllowance ?? 0.25,
      carpetSpec.patternType ?? 'none',
      carpetSpec.seamTrim ?? 0.1,
      room.lightSourceVector,
      room.avoidPivotPoints ?? false,
      carpetSpec.wasteFactorPercent ?? 0
    );

    const optResult = optimizer.evaluateLayout(0);

    // Use FlooringTakeoffEngine result if available, else fallback to polygon optimizer
    const totalLinear = nestingResult ? nestingResult.totalLinearLength : optResult.totalLinearLength;
    const accessories = twoStageResult ? twoStageResult.accessories : optResult.accessories;

    const baseOrderedArea = totalLinear * carpetSpec.rollWidth;
    const wasteMultiplier = 1 + (carpetSpec.wasteFactorPercent ?? 0) / 100;
    const finalOrderedArea = baseOrderedArea * wasteMultiplier;

    const SQFT_PER_SQYD = 9;
    const SQFT_PER_SQM = 10.7639104;

    const totalOrderedSqYd = room.unit === 'imperial'
      ? finalOrderedArea / SQFT_PER_SQYD
      : (finalOrderedArea * SQFT_PER_SQM) / SQFT_PER_SQYD;
    const totalOrderedSqM = room.unit === 'imperial'
      ? finalOrderedArea / SQFT_PER_SQM
      : finalOrderedArea;

    return {
      unit: room.unit,
      netAreaSqFt: Number(areaResult.netAreaSqFt.toFixed(2)),
      netAreaSqYd: Number(areaResult.netAreaSqYd.toFixed(2)),
      netAreaSqM: Number(areaResult.netAreaSqM.toFixed(2)),
      perimeterLinearFt: Number(areaResult.grossPerimeterFt.toFixed(2)),
      perimeterLinearM: Number(areaResult.grossPerimeterM.toFixed(2)),
      stripsRequired: optResult.strips.length,
      cutLengthPerStripFt: optResult.strips.length > 0 ? optResult.strips[0].rawLength : 0,
      cutLengthPerStripM: optResult.strips.length > 0 ? Number((optResult.strips[0].rawLength * 0.3048).toFixed(2)) : 0,
      totalLinearFt: totalLinear,
      totalLinearM: Number((totalLinear * 0.3048).toFixed(2)),
      totalOrderedSqYd: Number(totalOrderedSqYd.toFixed(2)),
      totalOrderedSqM: Number(totalOrderedSqM.toFixed(2)),
      seamLocations: optResult.strips.slice(1).map((_, idx) => (idx + 1) * carpetSpec.rollWidth),
      strips: optResult.strips.map(s => ({
        stripIndex: s.cutIndex + 1,
        rawLength: s.rawLength,
        matchedLength: s.rawLength + s.patternPenalty,
        offset: s.patternPenalty,
        rollStart: s.rollStartPosition,
        rollEnd: s.rollEndPosition,
      })),
      accessories,
      optimizationResult: optResult,
      twoStageResult,
      nestingResult,
    };
  }

  // -----------------------------------------------------------------------
  // Fallback: simple strip calculation (no polygon geometry)
  // -----------------------------------------------------------------------
  const roomLength = room.unit === 'imperial' ? areaResult.maxLengthFt : areaResult.maxLengthM;
  const roomWidth = room.unit === 'imperial' ? areaResult.maxWidthFt : areaResult.maxWidthM;

  const stripResult = calculateStrips(roomLength, roomWidth, carpetSpec, room.unit);

  const accessoryResult = calculateAccessories(
    netFloorArea,
    totalPerimeter,
    roomLength,
    stripResult.stripsRequired
  );

  const totalLinear = nestingResult
    ? nestingResult.totalLinearLength
    : room.unit === 'imperial'
      ? stripResult.totalLinear
      : stripResult.totalLinear / 0.3048;

  const baseOrderedArea = totalLinear * carpetSpec.rollWidth;
  const wasteMultiplier = 1 + (carpetSpec.wasteFactorPercent ?? 0) / 100;
  const finalOrderedArea = baseOrderedArea * wasteMultiplier;

  const SQFT_PER_SQYD = 9;
  const SQFT_PER_SQM = 10.7639104;
  const totalOrderedSqYd = room.unit === 'imperial' ? finalOrderedArea / SQFT_PER_SQYD : (finalOrderedArea * SQFT_PER_SQM) / SQFT_PER_SQYD;
  const totalOrderedSqM = room.unit === 'imperial' ? finalOrderedArea / SQFT_PER_SQM : finalOrderedArea;

  return {
    unit: room.unit,
    netAreaSqFt: Number(areaResult.netAreaSqFt.toFixed(2)),
    netAreaSqYd: Number(areaResult.netAreaSqYd.toFixed(2)),
    netAreaSqM: Number(areaResult.netAreaSqM.toFixed(2)),
    perimeterLinearFt: Number(areaResult.grossPerimeterFt.toFixed(2)),
    perimeterLinearM: Number(areaResult.grossPerimeterM.toFixed(2)),
    stripsRequired: stripResult.stripsRequired,
    cutLengthPerStripFt: room.unit === 'imperial' ? Number(stripResult.cutLengthPerStrip.toFixed(2)) : Number((stripResult.cutLengthPerStrip / 0.3048).toFixed(2)),
    cutLengthPerStripM: room.unit === 'metric' ? Number(stripResult.cutLengthPerStrip.toFixed(2)) : Number((stripResult.cutLengthPerStrip * 0.3048).toFixed(2)),
    totalLinearFt: Number(totalLinear.toFixed(2)),
    totalLinearM: Number((totalLinear * 0.3048).toFixed(2)),
    totalOrderedSqYd: Number(totalOrderedSqYd.toFixed(2)),
    totalOrderedSqM: Number(totalOrderedSqM.toFixed(2)),
    seamLocations: stripResult.seamLocations,
    strips: stripResult.strips,
    accessories: twoStageResult ? twoStageResult.accessories : accessoryResult,
    twoStageResult,
    nestingResult,
  };
}
