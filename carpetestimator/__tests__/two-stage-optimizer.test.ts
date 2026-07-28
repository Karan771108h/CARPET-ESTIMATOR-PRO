import assert from 'node:assert';
import { TwoStageTakeoffOptimizer } from '../lib/math/TwoStageTakeoffOptimizer';
import { Rectangle } from '../lib/types/estimation';

function runTwoStageTests() {
  console.log('Running TwoStageTakeoffOptimizer Verification Tests...');

  const optimizer = new TwoStageTakeoffOptimizer(15.0, 0.25, 0);

  // Test Case 1: Remnant Nesting Scenario
  // Section 1: 12 ft wide x 20 ft long (cut size: 12 x 20.5)
  // Section 2: 3 ft wide x 10 ft long (cut size: 3 x 10.5)
  // Section 1 is placed on main roll (width 15ft).
  // Side off-cut generated: W_rem = 15 - 12 = 3 ft, L_rem = 20.5 ft.
  // Section 2 (cut size 3 x 10.5) fits inside Section 1's side off-cut (3 x 20.5)!
  // Therefore, Section 2 is NESTED into Section 1's side off-cut.
  // Total master roll linear length pulled should be ONLY 20.5 linear feet!
  const testRects1: Rectangle[] = [
    { id: 'sec_1', name: 'Section 1', width: 12, length: 20 },
    { id: 'sec_2', name: 'Section 2 (Closet)', width: 3, length: 10 },
  ];

  const result1 = optimizer.optimize(testRects1);

  assert.strictEqual(result1.masterRollCuts.length, 1, 'Should require only 1 cut on master roll');
  assert.strictEqual(result1.totalLinearLength, 20.5, 'Total linear roll length should be 20.5 ft');

  const sec2Placement = result1.placements.find(p => p.itemId === 'sec_2');
  assert.notStrictEqual(sec2Placement, undefined, 'Section 2 placement should exist');
  assert.strictEqual(sec2Placement?.placementType, 'nested_in_remnant', 'Section 2 should be nested in remnant');

  console.log('✓ PASS: Section 2 successfully nested into Section 1 side off-cut (Total linear: 20.5 ft)');

  // Test Case 2: Multi-Section Rectilinear Room (Guillotine Split)
  const testRects2: Rectangle[] = [
    { id: 'r1', name: 'Main Hall', width: 10, length: 25 },
    { id: 'r2', name: 'Alcove A', width: 4, length: 12 },
    { id: 'r3', name: 'Alcove B', width: 4, length: 8 },
  ];

  const result2 = optimizer.optimize(testRects2);
  assert.strictEqual(result2.placements.length, 3, 'All 3 pieces should be placed');
  assert.ok(result2.totalLinearLength > 0, 'Total linear length should be positive');

  console.log('✓ PASS: Multi-section guillotine bin packing test passed!');
}

runTwoStageTests();
