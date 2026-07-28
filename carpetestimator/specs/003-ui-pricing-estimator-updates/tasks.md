# Tasks: UI, UX, Business Model, and Design Updates

**Input**: Design documents from `/specs/003-ui-pricing-estimator-updates/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Configure workspace theme Slate 50 (`#F8FAFC`) background and Blue 600 (`#2563EB`) accent tokens in `tailwind.config.ts` and `app/globals.css`
- [X] T002 [P] Update price constant references across application to $19 lifetime access in `lib/constants.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T003 Update `lib/math/index.ts` calculation functions to accept `RoomSection[]` multi-section arrays and handle `verticalRepeat` pattern math
- [X] T004 Create unit tests for multi-section room math and pattern repeat waste in `__tests__/math.test.ts`

---

## Phase 3: User Story 1 - Marketing Landing Page & $19 Lifetime Pricing (Priority: P1) 🎯 MVP

**Goal**: Deliver root marketing landing page (`/`) highlighting $19 One-Time Lifetime offer with 'Launch App' CTA button.

**Independent Test**: Navigate to `/`, verify Slate 50 design, $19 offer, and click 'Launch App' to navigate to dashboard.

- [X] T005 [P] [US1] Create marketing hero component in `components/landing/Hero.tsx`
- [X] T006 [P] [US1] Create $19 lifetime pricing card in `components/landing/PricingCard.tsx`
- [X] T007 [US1] Assemble root landing page at `app/page.tsx` with 'Launch App' CTA button

---

## Phase 4: User Story 2 - Multi-Section Room Layout & Form Defaults (Priority: P2)

**Goal**: Support sensible form defaults (12/4 roll width, 10% waste, 'None' pattern match) and dynamic multi-section room addition.

**Independent Test**: Verify initial form values, click 'Add Room Section', add Section 2, and test info icon tooltips.

- [X] T008 [P] [US2] Implement section input row with `lucide-react` info tooltips in `components/estimator/RoomSectionInput.tsx`
- [X] T009 [US2] Implement dynamic room section array state and default values in `components/estimator/EstimatorForm.tsx`

---

## Phase 5: User Story 3 - Pattern Matching Inputs & Visual SVG Icons (Priority: P3)

**Goal**: Dynamically reveal vertical repeat input field for Straight/Half-Drop matches and render inline SVG pattern diagrams.

**Independent Test**: Select 'Straight Match' or 'Half-Drop Match', verify repeat input field appears along with hardcoded SVG diagrams.

- [X] T010 [P] [US3] Create hardcoded inline React SVG icons for Plain, Straight Match, and Half-Drop Match in `components/estimator/PatternSVGs.tsx`
- [X] T011 [US3] Integrate conditional 'Vertical Repeat Length' field and inline SVGs in `components/estimator/CarpetSpecsForm.tsx`

---

## Phase 6: User Story 4 - Explicit Calculation & Freemium Paywall Gating (Priority: P4)

**Goal**: Require 'Calculate' click, show Net Area on free tier, and obscure cut schedule / PDF behind blurred paywall card.

**Independent Test**: Click 'Calculate', verify Net Area is shown while cut schedule is locked behind blurred card; enter license key to unlock.

- [X] T012 [P] [US4] Create blurred paywall card component with lock icon and $19 CTA in `components/estimator/PaywallCard.tsx`
- [X] T013 [US4] Update calculation workflow and freemium gating in `components/estimator/EstimatorDashboard.tsx`

---

## Phase 7: User Story 5 - Scaled Proposal PDF SVG Visualizer (Priority: P5)

**Goal**: Render scaled room geometry diagram with dashed seam placement lines inside client-side PDF proposal.

**Independent Test**: Generate proposal PDF and verify embedded SVG room section outlines and dashed seam placement lines.

- [X] T014 [US5] Implement pure client-side scaled SVG room visualizer function in `components/pdf/ProposalPDF.tsx`

---

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T015 Run automated test suite (`npm run test`) for math and component validity
- [X] T016 Execute full quickstart validation guide (`specs/003-ui-pricing-estimator-updates/quickstart.md`)

---

## Dependencies & Execution Order

1. Phase 1 (Setup) -> Phase 2 (Foundational)
2. Phase 2 (Foundational) -> Phase 3 (US1) -> Phase 4 (US2) -> Phase 5 (US3) -> Phase 6 (US4) -> Phase 7 (US5) -> Phase 8 (Polish)

## Implementation Strategy

### MVP Scope
Complete Phase 1, Phase 2, and Phase 3 (User Story 1 - Marketing Landing Page & $19 Lifetime Pricing). Validate landing page independently before adding estimator form updates.
