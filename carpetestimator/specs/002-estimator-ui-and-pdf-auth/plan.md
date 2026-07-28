# Detailed Architecture & Implementation Plan: Units 2 & 3

## 1. Directory & File Structure

```
carpetestimator/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                           # Main Dashboard Page Shell
│   └── api/
│       └── verify-license/
│           └── route.ts                   # Gumroad Edge API Handler (Stateless Auth)
├── middleware.ts                          # Next.js Middleware (JWT Cookie Validation)
├── lib/
│   ├── math/                              # Pure Stateless Math Engine (Existing & Verified)
│   │   ├── area.ts
│   │   ├── strips.ts
│   │   ├── accessories.ts
│   │   └── index.ts
│   ├── types/
│   │   └── estimation.ts
│   └── pdf/
│       └── generate.ts                    # Client PDF compilation helper (html2canvas + jspdf)
├── components/
│   ├── estimator/
│   │   ├── RoomForm.tsx                   # Room Details Input Card (Length, Width, Unit, Rectangles)
│   │   ├── CarpetForm.tsx                 # Carpet Specs Input Card (Roll Width, Pattern, Repeat, Waste %)
│   │   ├── ResultsDisplay.tsx             # Real-Time Math Output Card (Strips, Cuts, Accessories)
│   │   ├── StickyBar.tsx                  # Mobile Bottom Bar (Total Material + PDF Action)
│   │   └── EstimatorDashboard.tsx         # State Manager Wiring UI to lib/math/
│   ├── pdf/
│   │   └── ProposalPDF.tsx                # Itemized PDF Proposal Document Layout
│   └── auth/
│       └── LicenseModal.tsx               # Gumroad License Key Entry Modal
└── __tests__/
    └── math.test.ts                       # US & UK Benchmark Math Verification
```

---

## 2. React State & Math Wiring

In `components/estimator/EstimatorDashboard.tsx`:
- Holds active state: `room` (`Room`), `carpetSpec` (`CarpetSpec`), `isAuthenticated` (`boolean`), `isLicenseModalOpen` (`boolean`), `jobInfo` (`JobDetails`).
- Derives calculation results in real-time via `useMemo` or direct render call:
  ```ts
  const calculationResult = useMemo(
    () => calculateEstimate(room, carpetSpec),
    [room, carpetSpec]
  );
  ```
- All calculations execute 100% client-side in browser memory with zero network requests or database access.

---

## 3. Gumroad API & Stateless Auth (`app/api/verify-license/route.ts`)

- Edge Function (`export const runtime = 'edge'`).
- Checks POST request body for `{ licenseKey: string }`.
- Sends POST to `https://api.gumroad.com/v2/licenses/verify` with payload `{ product_permalink: 'carpetestimator', license_key }`.
- If valid (`res.data.success === true`):
  - Uses `jose` (`SignJWT`) signed with `process.env.JWT_SECRET`.
  - Sets HTTP-only, Secure, SameSite=Strict cookie named `estimating_session` (maxAge = 30 days).
  - Returns `{ success: true, message: 'License verified' }`.

---

## 4. Next.js Route & Feature Middleware (`middleware.ts`)

- Checks incoming request cookies for `estimating_session`.
- Verifies JWT signature using `jose.jwtVerify(token, secret)`.
- Exposes authentication state to client header/response.

---

## 5. Client-Side PDF Proposal Generator (`components/pdf/ProposalPDF.tsx`)

- Hidden / off-screen printable wrapper element.
- Formats proposal into clean sections:
  - Header: Logo / Title ("Carpet Estimator Pro"), Proposal #, Date.
  - Room & Layout Specifications.
  - Itemized Cost & Material Schedule (Carpet Roll, Underlay Pad, Tackless Strips, Seam Tape).
  - Strip Cut Schedule (Cut length per strip, pattern offsets).
- `generatePDF(elementId)` in `lib/pdf/generate.ts`:
  - Uses `html2canvas` to render printable DOM container to high-res canvas.
  - Uses `jspdf` (`new jsPDF('p', 'mm', 'a4')`) to embed image and download `Carpet_Proposal_[JobName].pdf`.
