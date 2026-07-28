# Feature Specification: UI, UX, Business Model, and Design Updates

**Feature Branch**: `003-ui-pricing-estimator-updates`

**Created**: 2026-07-22

**Status**: Draft

**Input**: User description: "Please execute the following UI, UX, business model, and design updates for the Carpet Estimator Pro app using Stitch for UI/UX design: 0. UI Design Framework (Stitch Integration), 1. Landing Page & Pricing, 2. Form Defaults & Multi-Section Layout, 3. Pattern Matching Logic & Reference SVGs, 4. Calculation Flow & Freemium Gating, 5. Client-Side PDF Proposal Update"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Marketing Landing Page & $19 Lifetime Pricing (Priority: P1)

As a potential customer visiting the root route (`/`), I want to view a clean marketing landing page highlighting the $19 One-Time Lifetime Access offer with a 'Launch App' button, so that I understand the value proposition and can navigate directly to the estimator.

**Why this priority**: Drives user acquisition, establishes product branding, and updates the core pricing model from $29 to $19.

**Independent Test**: Visit `/`, verify $19 lifetime offer messaging and click 'Launch App' to navigate to the estimator dashboard.

**Acceptance Scenarios**:

1. **Given** a user navigates to `/`, **When** the page loads, **Then** a landing page displays with Slate 50 (`#F8FAFC`) background, Blue 600 (`#2563EB`) CTA, $19 Lifetime Access text, and no subscription badges.
2. **Given** a user is on the landing page, **When** they click 'Launch App', **Then** they are redirected to the estimator dashboard.

---

### User Story 2 - Multi-Section Room Layout & Form Defaults (Priority: P2)

As an estimator, I want sensible form defaults (Roll Width: 12/4, Waste: 10%, Pattern Match: None) and the ability to add multiple room sections dynamically, so that I can calculate complex room geometries without manual pre-math.

**Why this priority**: Core usability improvement enabling handling of L-shaped and multi-part rooms.

**Independent Test**: Load the estimator, verify default values, click 'Add Room Section', enter dimensions for Section 1 and Section 2, and see both included in room state.

**Acceptance Scenarios**:

1. **Given** the estimator opens, **When** initialized, **Then** Roll Width defaults to 12 (US) or 4 (UK), Waste Factor to 10%, and Pattern Match to 'None'.
2. **Given** the Room Details form, **When** the user clicks 'Add Room Section', **Then** a new section ('Section 2') is appended with independent Length and Width inputs.
3. **Given** any input field in Room Details or Carpet Specs, **When** hovering or clicking the adjacent info icon (`lucide-react`), **Then** a descriptive tooltip opens explaining the field logic.

---

### User Story 3 - Pattern Matching Inputs & Visual SVG Icons (Priority: P3)

As a user selecting patterned carpets, I want visual representations of pattern types and conditional repeat length inputs, so that I can accurately account for carpet repeat waste.

**Why this priority**: Prevents user entry errors for pattern waste calculations through inline visual aids.

**Independent Test**: Select 'Straight Match' or 'Half-Drop Match', verify 'Vertical Repeat Length' field appears, and check inline SVG diagrams.

**Acceptance Scenarios**:

1. **Given** Pattern Match dropdown, **When** set to 'Straight Match' or 'Half-Drop Match', **Then** the 'Vertical Repeat Length' input field dynamically appears.
2. **Given** Pattern Match options, **When** viewed, **Then** inline hardcoded SVG icons visually represent Plain, Straight Match, and Half-Drop Match patterns.

---

### User Story 4 - Explicit Calculation & Freemium Paywall Gating (Priority: P4)

As a free tier user, I want to click 'Calculate' to see Net Area while premium cut schedule and order details remain gated behind a Gumroad license key, so that I can evaluate the tool before purchasing.

**Why this priority**: Establishes the freemium monetization funnel.

**Independent Test**: Enter dimensions, click 'Calculate', verify Net Area is visible and exact cut schedule/PDF export are blurred behind a paywall card. Enter valid license key to unlock full features.

**Acceptance Scenarios**:

1. **Given** dimensions entered in form, **When** typing, **Then** calculation results do not render automatically until 'Calculate' is clicked.
2. **Given** an unauthenticated/free user clicks 'Calculate', **When** results are rendered, **Then** Net Area is displayed, while Cut Schedule, Order Quantity, Accessory Counts, and PDF Export are locked behind a blurred overlay card.
3. **Given** a locked paywall card, **When** a valid Gumroad License key is submitted, **Then** full calculation details unlock and the paywall disappears.

---

### User Story 5 - Scaled Proposal PDF SVG Visualizer (Priority: P5)

As a licensed user exporting a proposal PDF, I want a visual room diagram with scaled dimensions and seam placement lines embedded in the PDF, so that clients can visualize the carpet layout.

**Why this priority**: Enhances client proposal quality without introducing heavy external drawing library dependencies.

**Independent Test**: Generate a proposal PDF in `ProposalPDF.tsx`, check that the embedded SVG element renders scaled room bounds and dashed seam placement lines.

**Acceptance Scenarios**:

1. **Given** proposal export triggered, **When** `ProposalPDF.tsx` renders, **Then** a pure SVG diagram displays scaled room dimensions and dashed lines indicating carpet roll seam locations.

---

### Edge Cases

- What happens when a user adds and deletes room sections leaving 0 sections? Form defaults back to 1 minimum mandatory section.
- What happens when 'Straight Match' is selected but vertical repeat length is set to 0 or left blank? Form displays validation warning requiring positive repeat value.
- What happens when an invalid Gumroad license key is entered? Paywall displays an inline error message and remains locked.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST feature a marketing landing page at root route `/` using Slate 50 (`#F8FAFC`) background and Blue 600 (`#2563EB`) accent styling in alignment with Stitch UI context.
- **FR-002**: System MUST display $19 One-Time Lifetime Access pricing across all marketing and lock screen components, removing any mention of $29 or subscriptions.
- **FR-003**: System MUST initialize Roll Width to 12 (US) or 4 (UK), Waste Factor to 10%, and Pattern Match to 'None'.
- **FR-004**: System MUST allow users to dynamically add multiple room sections ('Section 1', 'Section 2', etc.) via an 'Add Room Section' button, maintaining an array of section length and width inputs in React state.
- **FR-005**: System MUST render `lucide-react` info icons with tooltips next to all Room Details and Carpet Specs inputs.
- **FR-006**: System MUST dynamically display a 'Vertical Repeat Length' input when Pattern Match is set to 'Straight Match' or 'Half-Drop Match'.
- **FR-007**: System MUST render hardcoded inline SVGs for 'Plain', 'Straight Match', and 'Half-Drop Match' pattern choices.
- **FR-008**: System MUST require an explicit click on the 'Calculate' button to perform and display calculation results (disabling auto-calculate on input change).
- **FR-009**: System MUST restrict Free Tier users to viewing ONLY Net Area upon calculation.
- **FR-010**: System MUST obscure Cut Schedule, Total Order Quantity, Accessory Counts, and PDF Export behind a blurred paywall card featuring a lock icon and upgrade callout.
- **FR-011**: System MUST unlock full calculation results and PDF export upon entry of a valid Gumroad License key.
- **FR-012**: `components/pdf/ProposalPDF.tsx` MUST include a lightweight, pure SVG diagram generator outputting scaled room geometry and dashed carpet seam placement lines.

### Key Entities

- **RoomSection**: Represents a single section of a room (`id`, `name`, `length`, `width`).
- **CarpetSpecs**: Holds carpet configuration (`rollWidth`, `wasteFactor`, `patternMatch`, `verticalRepeat`).
- **LicenseState**: Manages freemium access (`isLicensed`, `licenseKey`, `status`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Landing page at `/` loads in under 1 second and provides immediate navigation to the app.
- **SC-002**: Users can add up to 10 room sections dynamically without UI lag.
- **SC-003**: 100% of free tier users are prevented from seeing cut schedules or exporting PDFs without a valid license key.
- **SC-004**: PDF proposal export generates in client side under 1.5 seconds without external canvas/image libraries.

## Assumptions

- Gumroad license validation function exists or can be simulated via API/local key check logic.
- Light mode technical workspace theme tokens (Slate 50 / Blue 600) are standard across the project CSS configuration.
- Standard roll width defaults to 12 feet for imperial units and 4 meters for metric units.
