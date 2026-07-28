# Quickstart & Validation Guide

## Runnable Verification Scenario 1: Pre-Slicing (Cleaving)
- **Input Section**: Section 1 (35 ft wide × 20 ft long), Roll width = 15 ft, Bleed = 0.25 ft per end.
- **Expected Decomposed Pieces**:
  - `Section 1 Part A`: Width = 15 ft, Length = 20.5 ft
  - `Section 1 Part B`: Width = 15 ft, Length = 20.5 ft
  - `Section 1 Part C`: Width = 5 ft, Length = 20.5 ft

## Runnable Verification Scenario 2: Avoiding the Area-Sorting Trap
- **Input Sections**:
  - Section 1: 15 ft × 20 ft
  - Section 2: 10 ft × 10 ft
  - Section 3: 5 ft × 20 ft
- **Expected Length-Descending Result**:
  - Pieces sorted by length: Section 1 (20.5 ft), Section 3 (20.5 ft), Section 2 (10.5 ft).
  - Section 1 placed on roll [0 - 20.5 ft].
  - Section 3 packed alongside Section 1 on roll [0 - 20.5 ft], leaving 10 ft × 20.5 ft remnant.
  - Section 2 (10 × 10.5 ft) fits inside the 10 ft × 20.5 ft remnant.
  - **Total Linear Roll Length**: **41 linear feet** (with bleed) vs 51.5 linear feet with Area sorting.

### Execution Command
```bash
npx tsx __tests__/cleaving-takeoff.test.ts
```
