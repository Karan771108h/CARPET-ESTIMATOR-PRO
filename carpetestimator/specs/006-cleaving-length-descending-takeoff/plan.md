# Implementation Plan: Pre-Slicing (Cleaving) & Length-Descending 2D Takeoff Engine

**Branch**: `006-cleaving-length-descending-takeoff` | **Date**: 2026-07-22 | **Spec**: [spec.md](file:///c:/work/app%20making%20%20basic%20files/app%201%20carpet/carpetestimator/specs/006-cleaving-length-descending-takeoff/spec.md)

**Input**: Feature specification from `/specs/006-cleaving-length-descending-takeoff/spec.md`

## Summary

Implement the production-ready `FlooringTakeoffEngine` featuring Stage 1 Pre-Slicing (Cleaving) to decompose sections wider than the master roll into parallel labeled strips (`[Section_Name] Part A`, `[Section_Name] Part B`, etc.) and Stage 2 Length-Descending Sorting Heuristic to prevent the "Area-Sorting Trap".

## Technical Context

**Language/Version**: TypeScript / Node.js (Next.js 15 App Router)
**Primary Dependencies**: React 19, Lucide React, TailwindCSS, @react-pdf/renderer
**Storage**: Client-side state & JSON export
**Testing**: Node test script / Vitest / Jest (`__tests__/`)
**Target Platform**: Commercial & Residential Flooring Takeoff System
**Project Type**: Estimator Core Engine
**Performance Goals**: < 5ms for 100+ room pieces
**Constraints**: Pure TypeScript, strict length-descending sorting, guillotine remnant splitting

## Constitution Check

- **Rule 1 (No Bloat / Minimal Code)**: Production-ready TypeScript solver class.
- **Rule 2 (Exact Math & Proof)**: Proves 40 linear feet vs 50 linear feet savings on Length-Descending vs Area-Sorting.
- **Status**: PASSED

## Project Structure

### Documentation (this feature)

```text
specs/006-cleaving-length-descending-takeoff/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    └── flooring-takeoff-api.json
```

### Source Code (repository root)

```text
lib/
├── math/
│   ├── FlooringTakeoffEngine.ts    # Production Stage 1 cleaving & Stage 2 Length-Descending solver
│   ├── TwoStageTakeoffOptimizer.ts # 2D bin packing solver
│   ├── TakeoffOptimizer.ts         # Polygon spatial takeoff engine
│   └── index.ts                    # Unified calculation facade
└── types/
    └── estimation.ts               # RawSection, Piece, Remnant, PlacedCut, NestingResult schemas
```
