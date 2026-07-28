# Implementation Plan: Spatial Optimization and Geometrical Analysis for Soft Flooring Takeoff Engine

**Branch**: `004-spatial-optimization-takeoff-engine` | **Date**: 2026-07-22 | **Spec**: [spec.md](file:///c:/work/app%20making%20%20basic%20files/app%201%20carpet/carpetestimator/specs/004-spatial-optimization-takeoff-engine/spec.md)

**Input**: Feature specification from `/specs/004-spatial-optimization-takeoff-engine/spec.md`

## Summary

Replace naive global bounding-box calculation logic (`calculateStrips`) with a discrete 2D spatial optimization engine for soft flooring takeoff operations. The engine handles non-uniform polygon decomposition into vertical roll slabs, dynamic localized strip length calculation ($L_{\text{raw}, i} = L_{\text{section}, i} + 2 \cdot L_{\text{bleed}}$), side-cut off-cut remnant tracking & nesting, pattern-matching alignment (straight and half-drop) across continuous master rolls, vertical coordinate offset registration ($\Phi_i$, $\theta_i$, $\Delta L_{\text{pattern}, i}$), orientation optimization ($0^\circ$ vs $90^\circ$), CRI 104/105 structural compliance rules, and comprehensive accessory material mathematics.

## Technical Context

**Language/Version**: TypeScript / Node.js (Next.js 15 App Router)
**Primary Dependencies**: React 19, Lucide React, TailwindCSS, @react-pdf/renderer
**Storage**: Client-side local storage / state + JSON schemas for export
**Testing**: Jest / Vitest test suite (`__tests__/`)
**Target Platform**: Web Browsers (Modern Chrome / Firefox / Safari) & Serverless API
**Project Type**: Web Application / Takeoff Estimator Library
**Performance Goals**: Takeoff calculation < 50ms for multi-section room polygons
**Constraints**: Pure TypeScript math engine without heavy external native geometric dependencies

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Rule 1 (No Bloat / Minimal Code)**: High-density TypeScript mathematical engine using native 2D geometry functions.
- **Rule 2 (Exact Math Compliance)**: Mathematical formulas match PDF paper precisely.
- **Status**: PASSED

## Project Structure

### Documentation (this feature)

```text
specs/004-spatial-optimization-takeoff-engine/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    └── takeoff-engine-api.json
```

### Source Code (repository root)

```text
lib/
├── math/
│   ├── TakeoffOptimizer.ts   # Core 2D spatial optimization engine
│   ├── area.ts               # Polygon area & perimeter utilities
│   ├── strips.ts             # Strip allocation facade wrapper
│   ├── accessories.ts        # Underlay, tackless, and seam tape math
│   └── index.ts              # Unified calculation entry point
└── types/
    └── estimation.ts         # Room, CarpetSpec, TakeoffCalculationOutput schemas

__tests__/
└── takeoff-optimizer.test.ts # Unit tests matching PDF worked example
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| None | N/A | Fully aligned with lightweight native TypeScript implementation |
