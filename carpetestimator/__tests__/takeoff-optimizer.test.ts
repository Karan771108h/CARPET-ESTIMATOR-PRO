import assert from 'node:assert';
import { TakeoffOptimizer } from '../lib/math/TakeoffOptimizer';
import { Polygon } from '../lib/types/estimation';

// Stepped room polygon from PDF Paper (page 12-14)
// Section 1: 15 ft wide x 20 ft long [0, 15] x [0, 20]
// Section 2: 15 ft wide x 25 ft long [15, 30] x [0, 25]
const pdfSteppedPolygon: Polygon = {
  vertices: [
    { x: 0, y: 0 },
    { x: 15, y: 0 },
    { x: 30, y: 0 },
    { x: 30, y: 25 },
    { x: 15, y: 25 },
    { x: 15, y: 20 },
    { x: 0, y: 20 },
  ],
};

function runTests() {
  console.log('Running TakeoffOptimizer PDF Benchmark Verification...');

  const optimizer = new TakeoffOptimizer(
    pdfSteppedPolygon,
    15.0, // Roll width = 15 ft
    3.0,  // Vertical pattern repeat R_y = 3 ft
    3.0,  // Horizontal repeat R_x = 3 ft
    0.25, // Bleed = 0.25 ft per end (0.5 ft total)
    'straight', // Match type = straight
    0.1   // Seam trim = 0.1 ft
  );

  const result = optimizer.evaluateLayout(0);

  // Verify 2 strips required across 30 ft width
  assert.strictEqual(result.strips.length, 2, 'Should require 2 strips');

  // Strip 1 (Section 1: y in [0, 20])
  const cut0 = result.strips[0];
  assert.strictEqual(cut0.physicalLength, 20.0, 'Cut 0 physical length should be 20.0 ft');
  assert.strictEqual(cut0.rawLength, 20.5, 'Cut 0 raw length should be 20.5 ft');
  assert.strictEqual(cut0.rollStartPosition, 2.75, 'Cut 0 start position should be 2.75 ft');
  assert.strictEqual(cut0.rollEndPosition, 23.25, 'Cut 0 end position should be 23.25 ft');

  // Strip 2 (Section 2: y in [0, 25])
  const cut1 = result.strips[1];
  assert.strictEqual(cut1.physicalLength, 25.0, 'Cut 1 physical length should be 25.0 ft');
  assert.strictEqual(cut1.rawLength, 25.5, 'Cut 1 raw length should be 25.5 ft');
  assert.strictEqual(cut1.rollStartPosition, 23.75, 'Cut 1 start position should be 23.75 ft');
  assert.strictEqual(cut1.rollEndPosition, 49.25, 'Cut 1 end position should be 49.25 ft');

  // Verify total linear roll length is EXACTLY 49.25 linear feet
  assert.strictEqual(result.totalLinearLength, 49.25, 'Total linear length should be 49.25 ft');

  console.log('✓ PASS: PDF Stepped L-Shape Benchmark matches 49.25 linear feet exactly!');

  // Remnant Nesting Verification
  const remnant = result.remnants[0];
  if (remnant) {
    const validCheck = optimizer.validateRemnantNesting(remnant, 5.0, 10.0, 0);
    assert.strictEqual(validCheck.approved, true, 'Valid remnant nesting should be approved');

    const invalidPile = optimizer.validateRemnantNesting(remnant, 5.0, 10.0, 90);
    assert.strictEqual(invalidPile.approved, false, 'Invalid pile angle should be rejected');
  }

  console.log('✓ PASS: Remnant Nesting Validator passed all checks!');
}

runTests();
