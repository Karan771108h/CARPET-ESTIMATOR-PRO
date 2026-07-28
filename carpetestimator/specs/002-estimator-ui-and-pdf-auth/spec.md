# Feature Specification: Units 2 & 3 - Estimator UI, PDF Generation, and Stateless Auth

## Feature Summary
Deliver the mobile-first Estimator Dashboard UI with real-time math wiring (Unit 2) and the Gumroad stateless license verification API + client-side PDF proposal generator (Unit 3).

---

## Unit 2 Requirements: Estimator UI & Real-Time Wiring

### 1. Mobile-First Layout & Theme
- Single-column step-by-step layout.
- High-contrast technical theme: Slate 50 background (`#F8FAFC`), Slate 900 primary text, Blue 600 action buttons.
- Responsive breakpoints (`sm:`, `md:`) for tablet/desktop viewports.

### 2. "Room Details" Input Card
- Unit System Selector: Toggle between `US Imperial (ft/yd)` and `UK Metric (m/sqm)`.
- Room Rectangles Builder:
  - Default: Single rectangle (Length, Width).
  - Multi-rectangle decomposition: Button to "+ Add Rectangle (L-Shape / Bay)" with custom names (e.g. "Main Area", "Extension").
  - Doorway counter & doorway width input (for perimeter deduction).

### 3. "Carpet Specs" Input Card
- Roll Width: Quick-selector chips (US: 12ft, 15ft; UK: 4m, 5m) or custom input.
- Pattern Match Type: Radios for `None`, `Straight Match`, `Half-Drop Match`.
- Vertical Repeat Length: Numeric input (in ft or m, disabled if `None`).
- Waste Factor %: Numeric input or quick slider/chips (5%, 10%, 15%, 20%).
- Trim Allowance: Default 0.5 ft (US) / 0.1 m (UK).

### 4. Real-Time "Results" Display Card
- Instantly updates on form input change by passing state to `calculateEstimate(room, spec)` in `lib/math/`.
- Summary Grid:
  - Net Room Area (sq yd / sqm + sq ft).
  - Broadloom Strips Required (count).
  - Matched Cut Length per Strip (ft / m).
  - Total Ordered Material (sq yd / sqm + linear ft/m).
- Seam Locations Diagram: Visual strip placement list showing cut lengths and seam positions.
- Accessories Summary:
  - Carpet Pad / Underlay Area (sq ft / sqm).
  - Tackless Strips / Gripper Rods (linear ft / m).
  - Hot-Melt Seam Tape (linear ft / m).

### 5. Sticky Mobile Bottom Bar
- Fixed at viewport bottom on mobile (`sticky bottom-0 z-50`).
- Left side: Prominent "Total Carpet Required" (e.g., `61.6 sq yd` or `35.84 m²`).
- Right side: Primary "Generate PDF Proposal" button.

---

## Unit 3 Requirements: Stateless Auth & PDF Proposal Generator

### 1. Stateless Gumroad License Verification API (`/api/verify-license`)
- Next.js Edge API Route (`app/api/verify-license/route.ts`).
- Method: `POST` `{ licenseKey: string }`.
- Verifies key against `https://api.gumroad.com/v2/licenses/verify` with product permalink check.
- On Success:
  - Signs a JWT using `jose` with payload `{ licenseKey, email, validUntil }`.
  - Sets HTTP-only, Secure, SameSite=Strict cookie named `estimating_session` valid for 30 days.
  - Returns `{ success: true, message: 'License verified successfully' }`.

### 2. Middleware Protection & License Key Modal
- `middleware.ts` intercepts requests/actions requiring premium PDF export.
- If `estimating_session` cookie is missing or invalid:
  - Clicking "Generate PDF Proposal" opens a centered License Key Entry Modal with backdrop blur.
  - Submitting key triggers `/api/verify-license`. On verification, automatically unlocks PDF generation.

### 3. Client-Side PDF Proposal Generation (`components/pdf/ProposalPDF.tsx`)
- Pure client-side PDF compilation using `html2canvas` and `jspdf`.
- Layout & Styling:
  - Professional header with logo placeholder, date, and quote reference #.
  - Customer / Job Details section.
  - Itemized Breakdown Table:
    - Broadloom Carpet Order (Quantity, Unit, Roll Width, Pattern Type).
    - Underlayment Pad.
    - Tackless Gripper Rods.
    - Hot-Melt Seam Tape.
  - Seam Placement Diagram / Strip Cut Schedule.
  - Terms & Sign-off block.
- Generates downloadable PDF named `Carpet_Proposal_[JobName].pdf`.
