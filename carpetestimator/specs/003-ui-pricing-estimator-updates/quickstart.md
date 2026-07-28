# Quickstart Validation Guide

**Feature**: UI, UX, Business Model, and Design Updates
**Branch**: `003-ui-pricing-estimator-updates`

## Prerequisites
- Node.js 18+ installed
- Dependencies installed (`npm install`)

## Scenario 1: Verify Landing Page & $19 Pricing
1. Run local dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Verify landing page loads with Slate 50 background (`#F8FAFC`), $19 Lifetime Access messaging, and 'Launch App' CTA button.
4. Click 'Launch App' -> Navigates to `/estimator` or dashboard.

## Scenario 2: Multi-Section Room Layout & Pattern Repeat Inputs
1. On dashboard form, verify default values: Roll Width = 12, Waste Factor = 10%, Pattern Match = 'None'.
2. Click 'Add Room Section'. Verify 'Section 2' appears with independent Length and Width inputs.
3. Click info icon next to inputs; verify tooltip appears.
4. Change Pattern Match dropdown to 'Straight Match'. Verify 'Vertical Repeat Length' input field dynamically appears along with inline SVG diagram.

## Scenario 3: Explicit Calculate & Freemium Paywall Gating
1. Enter dimensions for Section 1 (20x15).
2. Verify results are not calculated automatically while typing.
3. Click 'Calculate' button.
4. Verify Net Area (300 sq ft) is displayed.
5. Verify Cut Schedule, Total Order Quantity, and PDF Export are hidden under blurred paywall card showing lock icon and $19 unlock CTA.
6. Click 'Unlock', enter valid license key, submit -> Paywall unlocks, full details and PDF export become accessible.

## Scenario 4: PDF SVG Visualizer
1. Click 'Export Proposal PDF'.
2. Open generated PDF or preview. Verify SVG diagram shows scaled room geometry with dashed seam lines.
