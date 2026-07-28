# Implementation Plan: UI, UX, Business Model, and Design Updates

**Branch**: `003-ui-pricing-estimator-updates` | **Date**: 2026-07-22 | **Spec**: [spec.md](file:///c:/work/app%20making%20%20basic%20files/app%201%20carpet/carpetestimator/specs/003-ui-pricing-estimator-updates/spec.md)

**Input**: Feature specification from `/specs/003-ui-pricing-estimator-updates/spec.md`

## Summary

Implement UI/UX design updates via Stitch alignment, root marketing landing page at `/` with $19 One-Time Lifetime pricing, dynamic multi-section room array form state with tooltips and pattern match repeat logic, explicit calculation flow with freemium paywall card, and pure SVG room visualization in client-side proposal PDF.

## Technical Context

**Language/Version**: TypeScript 5 / Next.js 16 (App Router)
**Primary Dependencies**: React 19, Tailwind CSS, `shadcn/ui`, `lucide-react`, `jose`, `jspdf`, `html2canvas`
**Storage**: Stateless JWT cookies (`estimating_session`), React local component state
**Testing**: Jest / `@testing-library/react` (`npm run test`)
**Target Platform**: Web Browsers (Mobile-first responsive)
**Project Type**: Next.js Web Application
**Performance Goals**: Client calculation < 50ms, PDF SVG render < 1.5s, Landing page load < 1s
**Constraints**: Light Mode workspace theme (`#F8FAFC` background, Slate 900 text, Blue 600 accent), Zero database, Pure client-side PDF generation
**Scale/Scope**: Single landing page route `/`, Estimator UI dashboard, PDF proposal component

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Principle I: Pure Client-Side Math Engine**: Multi-section area math and pattern repeat math extended in `lib/math/` without UI side effects.
- [x] **Principle II: ZERO Database Serverless Architecture**: License verification uses `app/api/verify-license/` with `jose` JWT cookies. Zero DB.
- [x] **Principle III: Client-Side PDF Proposal Generation**: Scaled SVG visualizer added directly into `components/pdf/ProposalPDF.tsx` without server dependencies.
- [x] **Principle IV: Mobile-First Technical Design & Stitch MCP**: Light mode theme (`#F8FAFC`, Blue 600) strictly enforced.
- [x] **Principle V: Incremental Spec-Driven Development**: Spec-driven workflow with automated testing.

## Project Structure

### Documentation (this feature)

```text
specs/003-ui-pricing-estimator-updates/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/
    └── api-contracts.md # Interface & Component Contracts
```

### Source Code (repository root)

```text
carpetestimator/
├── app/
│   ├── page.tsx                           # Landing page with $19 lifetime offer
│   ├── (dashboard)/
│   │   └── page.tsx                       # Estimator dashboard with freemium paywall
│   └── api/
│       └── verify-license/
│           └── route.tsx                  # Gumroad license verification API
├── components/
│   ├── landing/                           # Hero, Pricing, and CTA components
│   ├── estimator/                         # Multi-section form, Pattern inputs, Paywall card
│   └── pdf/
│       └── ProposalPDF.tsx                # Proposal PDF component with SVG visualizer
├── lib/
│   └── math/                              # Multi-section area calculation functions
└── __tests__/                             # Math engine & component unit tests
```

**Structure Decision**: Next.js App Router workspace structure with separate landing page, dashboard estimator UI, pure math engine, and client PDF generator.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
