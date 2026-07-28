# Implementation Plan: Two-Stage Takeoff Optimization Algorithm & Guillotine Bin Packing

**Branch**: `005-two-stage-bin-packing-takeoff` | **Date**: 2026-07-22 | **Spec**: [spec.md](file:///c:/work/app%20making%20%20basic%20files/app%201%20carpet/carpetestimator/specs/005-two-stage-bin-packing-takeoff/spec.md)

**Input**: Feature specification from `/specs/005-two-stage-bin-packing-takeoff/spec.md`

## Summary

Implement a generalizable Two-Stage Takeoff Optimization Algorithm that solves broadloom carpet roll allocation for ANY multi-section room geometry. Stage 1 decomposes rectilinear polygons into independent cut items with trim allowances. Stage 2 executes a 2D Best-Fit Decreasing guillotine bin-packing solver that nests smaller cuts inside active side off-cut remnants, splits remaining space into sub-remnants, and pulls fresh cuts from the continuous master roll when no remnant fits. Also fixes overlapping SVG room visualizers and introduces a visual Master Roll Cut & Placement Diagram in `ProposalPDF.tsx`.

## Technical Context

**Language/Version**: TypeScript / Node.js (Next.js 15 App Router)
**Primary Dependencies**: React 19, Lucide React, TailwindCSS, @react-pdf/renderer
**Storage**: Client-side state & JSON export schemas
**Testing**: Node test script / Vitest / Jest (`__tests__/`)
**Target Platform**: Web Browsers & PDF Export Engine
**Project Type**: Estimator Engine & Web Application
**Performance Goals**: < 10ms for 2D guillotine bin packing across 50+ room sections
**Constraints**: Zero overlapping, exact physical containment, guillotine remnant splitting

## Constitution Check

- **Rule 1 (No Bloat / Minimal Code)**: Clean, strongly-typed TypeScript algorithm.
- **Rule 2 (Exact Math & Geometry Compliance)**: Guillotine split logic strictly preserves rectangular geometry and prevents overlaps.
- **Status**: PASSED

## Project Structure

### Documentation (this feature)

```text
specs/005-two-stage-bin-packing-takeoff/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    └── two-stage-takeoff-api.json
```

### Source Code (repository root)

```text
lib/
├── math/
│   ├── TwoStageTakeoffOptimizer.ts  # Two-stage 2D bin packing & guillotine split engine
│   ├── TakeoffOptimizer.ts          # Polygon spatial takeoff engine
│   └── index.ts                     # Unified calculation facade
└── types/
    └── estimation.ts                # Two-Stage item, remnant, and placement types

components/
└── pdf/
    └── ProposalPDF.tsx              # Fixed room visualizer & Master Roll diagram
```
