import { calculateEstimate } from '../lib/math';
import { CarpetSpec, Room } from '../lib/types/estimation';

/**
 * US Imperial Case Study Verification
 * Room: 20ft x 15ft
 * Roll: 12ft
 * Repeat: 1.5ft straight match
 * Target: 2 strips, 21ft cut length, 61.6 sq yds total order
 */
export function testUSImperialCaseStudy() {
  const room: Room = {
    name: 'US Living Room',
    unit: 'imperial',
    rectangles: [{ id: 'r1', length: 20, width: 15 }],
    doorwaysCount: 1,
    doorwayWidth: 3,
  };

  const spec: CarpetSpec = {
    rollWidth: 12,
    patternType: 'straight',
    verticalRepeat: 1.5,
    wasteFactorPercent: 10,
    trimAllowance: 0,
  };

  const result = calculateEstimate(room, spec);

  console.log('--- US Imperial Case Study ---');
  console.log('Strips Required:', result.stripsRequired, '(Expected: 2)');
  console.log('Cut Length Per Strip:', result.cutLengthPerStripFt, 'ft (Expected: 21)');
  console.log('Total Ordered Sq Yd:', result.totalOrderedSqYd, 'sq yd (Expected: 61.6)');

  if (
    result.stripsRequired === 2 &&
    result.cutLengthPerStripFt === 21 &&
    result.totalOrderedSqYd === 61.6
  ) {
    console.log('✅ PASS: US Imperial Case Study');
    return true;
  } else {
    console.error('❌ FAIL: US Imperial Case Study');
    return false;
  }
}

/**
 * UK Metric Case Study Verification
 * L-shaped room: 5m x 4m + 3.96m x 4m = 35.84 sqm net area
 */
export function testUKMetricCaseStudy() {
  const room: Room = {
    name: 'UK Master Suite',
    unit: 'metric',
    rectangles: [
      { id: 'r1', length: 5, width: 4 },
      { id: 'r2', length: 3.96, width: 4 },
    ],
  };

  const spec: CarpetSpec = {
    rollWidth: 4,
    patternType: 'none',
    verticalRepeat: 0.4,
    wasteFactorPercent: 0,
    trimAllowance: 0.1,
  };

  const result = calculateEstimate(room, spec);

  console.log('--- UK Metric Case Study ---');
  console.log('Net Area Sq M:', result.netAreaSqM, '(Expected: 35.84)');

  if (result.netAreaSqM === 35.84) {
    console.log('✅ PASS: UK Metric Case Study');
    return true;
  } else {
    console.error('❌ FAIL: UK Metric Case Study');
    return false;
  }
}

// Execute tests if run directly via ts-node / npx
if (require.main === module) {
  const usPass = testUSImperialCaseStudy();
  const ukPass = testUKMetricCaseStudy();
  if (!usPass || !ukPass) {
    process.exit(1);
  }
}
