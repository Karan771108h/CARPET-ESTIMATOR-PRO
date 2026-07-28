import { Rectangle, UnitSystem } from '../types/estimation';

export interface AreaResult {
  netAreaSqFt: number;
  netAreaSqYd: number;
  netAreaSqM: number;
  grossPerimeterFt: number;
  grossPerimeterM: number;
  maxLengthFt: number;
  maxWidthFt: number;
  maxLengthM: number;
  maxWidthM: number;
}

const SQFT_PER_SQYD = 9;
const SQFT_PER_SQM = 10.7639104;
const METERS_PER_FOOT = 0.3048;

/**
 * Calculates net area and perimeter metrics for room rectangles.
 */
export function calculateArea(
  rectangles: Rectangle[],
  unit: UnitSystem,
  doorwaysCount = 0,
  doorwayWidth = 0
): AreaResult {
  if (!rectangles || rectangles.length === 0) {
    return {
      netAreaSqFt: 0,
      netAreaSqYd: 0,
      netAreaSqM: 0,
      grossPerimeterFt: 0,
      grossPerimeterM: 0,
      maxLengthFt: 0,
      maxWidthFt: 0,
      maxLengthM: 0,
      maxWidthM: 0,
    };
  }

  let totalNetArea = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let grossPerimeter = 0;

  if (rectangles.length === 1) {
    const r = rectangles[0];
    totalNetArea = r.length * r.width;
    maxLength = r.length;
    maxWidth = r.width;
    grossPerimeter = 2 * (r.length + r.width);
  } else {
    // For decomposed layout (e.g. L-shape)
    for (const r of rectangles) {
      totalNetArea += r.length * r.width;
      maxLength = Math.max(maxLength, r.length);
      maxWidth = Math.max(maxWidth, r.width);
    }
    // Perimeter of bounding envelope for L-shape layout
    grossPerimeter = 2 * (maxLength + maxWidth);
  }

  // Deduct doorways from gross perimeter
  const totalDoorwayWidth = doorwaysCount * doorwayWidth;
  const netPerimeter = Math.max(0, grossPerimeter - totalDoorwayWidth);

  let netAreaSqFt = 0;
  let netAreaSqYd = 0;
  let netAreaSqM = 0;
  let grossPerimeterFt = 0;
  let grossPerimeterM = 0;
  let maxLengthFt = 0;
  let maxWidthFt = 0;
  let maxLengthM = 0;
  let maxWidthM = 0;

  if (unit === 'imperial') {
    netAreaSqFt = totalNetArea;
    netAreaSqYd = totalNetArea / SQFT_PER_SQYD;
    netAreaSqM = totalNetArea / SQFT_PER_SQM;
    grossPerimeterFt = netPerimeter;
    grossPerimeterM = netPerimeter * METERS_PER_FOOT;
    maxLengthFt = maxLength;
    maxWidthFt = maxWidth;
    maxLengthM = maxLength * METERS_PER_FOOT;
    maxWidthM = maxWidth * METERS_PER_FOOT;
  } else {
    netAreaSqM = totalNetArea;
    netAreaSqFt = totalNetArea * SQFT_PER_SQM;
    netAreaSqYd = netAreaSqFt / SQFT_PER_SQYD;
    grossPerimeterM = netPerimeter;
    grossPerimeterFt = netPerimeter / METERS_PER_FOOT;
    maxLengthM = maxLength;
    maxWidthM = maxWidth;
    maxLengthFt = maxLength / METERS_PER_FOOT;
    maxWidthFt = maxWidth / METERS_PER_FOOT;
  }

  return {
    netAreaSqFt,
    netAreaSqYd,
    netAreaSqM,
    grossPerimeterFt,
    grossPerimeterM,
    maxLengthFt,
    maxWidthFt,
    maxLengthM,
    maxWidthM,
  };
}
