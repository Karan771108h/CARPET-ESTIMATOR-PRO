import assert from 'node:assert';
import { calculateEstimate } from '../lib/math/index';
import { Room, CarpetSpec } from '../lib/types/estimation';

console.log('Running calculateEstimate integration tests...');

// Test: 3-section scenario — Area-Sorting Trap proof via facade
// Section 1: 15x20, Section 2: 10x10, Section 3: 5x20 on 15ft roll
// Length-Descending should yield 41.0 linear feet (not 50 ft from area-sort)
const room: Room = {
  name: 'Test Room',
  unit: 'imperial',
  rectangles: [
    { id: 'rect_1', name: 'Section 1', width: 15, length: 20 },
    { id: 'rect_2', name: 'Section 2', width: 10, length: 10 },
    { id: 'rect_3', name: 'Section 3', width: 5, length: 20 },
  ],
  doorwaysCount: 1,
  doorwayWidth: 3,
};

const spec: CarpetSpec = {
  rollWidth: 15,
  patternType: 'none',
  verticalRepeat: 0,
  wasteFactorPercent: 0,
  trimAllowance: 0.25,
};

const result = calculateEstimate(room, spec);

// Total linear from FlooringTakeoffEngine should be 41.0 ft
// Section 1 (20.5ft cut), Section 3 (20.5ft cut alongside S1), Section 2 nested in remnant
assert.strictEqual(result.totalLinearFt, 41.0, `Expected 41.0 lin ft, got ${result.totalLinearFt}`);

// twoStageResult must be populated (for PDF diagram)
assert.notStrictEqual(result.twoStageResult, undefined, 'twoStageResult must be populated');
assert.ok(result.twoStageResult!.placements.length > 0, 'placements must be non-empty');

// nestingResult also populated
assert.notStrictEqual(result.nestingResult, undefined, 'nestingResult must be populated');

// Section 2 must be nested in a remnant (not a fresh cut)
const nestedPiece = result.nestingResult!.placedCuts.find(c => c.pieceId === 'Section 2');
assert.notStrictEqual(nestedPiece, undefined, 'Section 2 cut must exist');
assert.strictEqual(nestedPiece!.placedInRemnant, true, 'Section 2 must be nested in remnant, not fresh cut');

console.log('✓ PASS: calculateEstimate facade uses FlooringTakeoffEngine and yields 41.0 linear feet');
console.log('✓ PASS: Section 2 correctly nested in side remnant (no fresh roll cut drawn)');
console.log('✓ PASS: twoStageResult populated for PDF compatibility');
