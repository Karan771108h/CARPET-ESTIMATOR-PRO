import { CarpetSpec, PatternMatchType, StripAllocation, UnitSystem } from '../types/estimation';

export interface StripAllocationResult {
  stripsRequired: number;
  cutLengthPerStrip: number;
  totalLinear: number;
  totalOrderedArea: number;
  totalOrderedSqYd: number;
  totalOrderedSqM: number;
  seamLocations: number[];
  strips: StripAllocation[];
}

const SQFT_PER_SQYD = 9;
const SQFT_PER_SQM = 10.7639104;

/**
 * Calculates broadloom strip allocation, pattern matching cuts, and total ordered carpet.
 */
export function calculateStrips(
  roomLength: number,
  roomWidth: number,
  carpetSpec: CarpetSpec,
  unit: UnitSystem
): StripAllocationResult {
  const { rollWidth, patternType, verticalRepeat, wasteFactorPercent, trimAllowance } = carpetSpec;

  if (roomLength <= 0 || roomWidth <= 0 || rollWidth <= 0) {
    return {
      stripsRequired: 0,
      cutLengthPerStrip: 0,
      totalLinear: 0,
      totalOrderedArea: 0,
      totalOrderedSqYd: 0,
      totalOrderedSqM: 0,
      seamLocations: [],
      strips: [],
    };
  }

  // Number of strips required across room width
  const stripsRequired = Math.ceil(roomWidth / rollWidth);

  // Raw cut length needed per strip (room length + trim allowance)
  const rawCutLength = roomLength + (trimAllowance || 0);

  // Calculate matched cut length per strip
  let matchedCutLength = rawCutLength;

  if (verticalRepeat > 0 && patternType !== 'none') {
    if (patternType === 'straight') {
      // Ceiling function to nearest full pattern repeat
      const repeatsNeeded = Math.ceil(rawCutLength / verticalRepeat);
      matchedCutLength = repeatsNeeded * verticalRepeat;
    } else if (patternType === 'half-drop') {
      // Half-drop match alternates strips with half repeat offset
      const repeatsNeeded = Math.ceil(rawCutLength / verticalRepeat);
      matchedCutLength = repeatsNeeded * verticalRepeat + (0.5 * verticalRepeat);
    }
  }

  // Create individual strip allocations
  const strips: StripAllocation[] = [];
  const seamLocations: number[] = [];

  for (let i = 0; i < stripsRequired; i++) {
    const offset = patternType === 'half-drop' && i % 2 !== 0 ? 0.5 * verticalRepeat : 0;
    strips.push({
      stripIndex: i + 1,
      rawLength: rawCutLength,
      matchedLength: matchedCutLength,
      offset,
    });

    if (i > 0) {
      seamLocations.push(i * rollWidth);
    }
  }

  // Total linear footage / meters ordered
  const totalLinear = stripsRequired * matchedCutLength;

  // Base raw ordered area = total linear * roll width
  const baseOrderedArea = totalLinear * rollWidth;

  // Apply construction waste factor percentage
  const wasteMultiplier = 1 + (wasteFactorPercent || 0) / 100;
  const finalOrderedArea = baseOrderedArea * wasteMultiplier;

  let totalOrderedSqYd = 0;
  let totalOrderedSqM = 0;

  if (unit === 'imperial') {
    totalOrderedSqYd = finalOrderedArea / SQFT_PER_SQYD;
    totalOrderedSqM = finalOrderedArea / SQFT_PER_SQM;
  } else {
    totalOrderedSqM = finalOrderedArea;
    const sqFt = finalOrderedArea * SQFT_PER_SQM;
    totalOrderedSqYd = sqFt / SQFT_PER_SQYD;
  }

  return {
    stripsRequired,
    cutLengthPerStrip: matchedCutLength,
    totalLinear,
    totalOrderedArea: finalOrderedArea,
    totalOrderedSqYd,
    totalOrderedSqM,
    seamLocations,
    strips,
  };
}
