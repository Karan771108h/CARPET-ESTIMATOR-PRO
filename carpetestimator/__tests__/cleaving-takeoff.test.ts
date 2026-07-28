import assert from 'node:assert';
import { FlooringTakeoffEngine } from '../lib/math/FlooringTakeoffEngine';
import { RawSection } from '../lib/types/estimation';

function runCleavingTests() {
  console.log('Running FlooringTakeoffEngine Verification Tests...');

  const engine = new FlooringTakeoffEngine(15.0, 0.25);

  // Test 1: Stage 1 Pre-Slicing (Cleaving)
  // Section 1: 35 ft wide x 20 ft long on 15 ft roll
  // Expected:
  // Part A: 15 ft x 20.5 ft
  // Part B: 15 ft x 20.5 ft
  // Part C: 5 ft x 20.5 ft
  const section35ft: RawSection[] = [
    { id: 'Section 1', width: 35, length: 20 }
  ];

  engine.prepareSections(section35ft);
  const pieces = engine.getPieces();

  assert.strictEqual(pieces.length, 3, 'Should produce 3 cleaved parts for 35 ft width');
  assert.strictEqual(pieces[0].id, 'Section 1 Part A', 'Part A naming check');
  assert.strictEqual(pieces[0].width, 15, 'Part A width check');
  assert.strictEqual(pieces[0].length, 20.5, 'Part A length check');

  assert.strictEqual(pieces[1].id, 'Section 1 Part B', 'Part B naming check');
  assert.strictEqual(pieces[1].width, 15, 'Part B width check');

  assert.strictEqual(pieces[2].id, 'Section 1 Part C', 'Part C naming check');
  assert.strictEqual(pieces[2].width, 5, 'Part C width check (5 ft remainder)');
  assert.strictEqual(pieces[2].length, 20.5, 'Part C length check');

  console.log('✓ PASS: Stage 1 Cleaving successfully decomposed 35 ft section into Part A (15ft), Part B (15ft), Part C (5ft)');

  // Test 2: Stage 2 Length-Descending Sorting Heuristic (Area Trap Proof)
  // Section 1: 15 x 20 (Area 300) -> Cut size: 15 x 20.5
  // Section 2: 10 x 10 (Area 100) -> Cut size: 10 x 10.5
  // Section 3: 5 x 20  (Area 100) -> Cut size: 5 x 20.5
  // Sorted by length: Section 1 (20.5), Section 3 (20.5), Section 2 (10.5).
  // Section 1 placed on roll [0, 20.5].
  // Section 3 packed alongside Section 1 on roll [0, 20.5], generating 10 x 20.5 remnant.
  // Section 2 (10 x 10.5) fits into 10 x 20.5 remnant!
  // Total Linear Length: ONLY 41.0 linear feet!
  const areaTrapSections: RawSection[] = [
    { id: 'Section 1', width: 15, length: 20 },
    { id: 'Section 2', width: 10, length: 10 },
    { id: 'Section 3', width: 5, length: 20 }
  ];

  engine.prepareSections(areaTrapSections);
  const result = engine.solve();

  assert.strictEqual(result.totalLinearLength, 41.0, 'Length-Descending total linear should be 41.0 ft');

  const sec2Cut = result.placedCuts.find(c => c.pieceId === 'Section 2');
  assert.notStrictEqual(sec2Cut, undefined, 'Section 2 cut should exist');
  assert.strictEqual(sec2Cut?.placedInRemnant, true, 'Section 2 should be placed in remnant created by Section 3');

  console.log('✓ PASS: Length-Descending Sorting Heuristic avoided Area Trap and achieved 41.0 linear feet (Saving 10.5 lin ft over area sorting)!');
}

runCleavingTests();
