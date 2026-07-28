# Implementation Plan: Unit 1 - Project Setup & Pure Math Engine

## Architecture & System Boundaries
- `lib/types/estimation.ts`: TypeScript interfaces for `Room`, `CarpetSpec`, `CalculationResult`, `AccessoryResult`, `UnitSystem`.
- `lib/math/area.ts`: Pure functions for net floor area and perimeter calculation.
- `lib/math/strips.ts`: Pure functions for broadloom strip allocation, cut lengths, straight & half-drop pattern alignment, and waste factor.
- `lib/math/accessories.ts`: Pure functions for pad/underlay, tackless strips, and seam tape.
- `lib/math/index.ts`: Unified estimator calculation facade.
- `__tests__/math.test.ts`: Jest / Vitest test suite enforcing US and UK case study verification.

## Technology Decisions
- Framework: Next.js App Router (already configured).
- Testing: Vitest + `@vitest/ui` for high-speed pure function testing.
- UI Theme Tokens: Tailwind CSS custom property tokens for Slate palette.

## Proposed File Changes
- `[NEW]` `lib/types/estimation.ts`
- `[NEW]` `lib/math/area.ts`
- `[NEW]` `lib/math/strips.ts`
- `[NEW]` `lib/math/accessories.ts`
- `[NEW]` `lib/math/index.ts`
- `[NEW]` `__tests__/math.test.ts`

## Verification Strategy
- Run unit test suite to verify math formulas against US Imperial (20x15ft -> 61.6 sq yd) and UK Metric (L-shape -> 35.84 sqm) benchmarks.
- Verify `npm run build` succeeds without TypeScript errors.
