# Comprehensive Task Checklist: Unit 2 & Unit 3

## Group 1: Environment & Package Setup
- [ ] Task 1.1: Install dependencies (`jose`, `jspdf`, `html2canvas`, `lucide-react`)
- [ ] Task 1.2: Configure Tailwind CSS slate color tokens & typography in `app/globals.css` / `tailwind.config.ts`

## Group 2: Unit 2 - UI Components & Stitch MCP Generation
- [ ] Task 2.1: Design and generate `components/estimator/RoomForm.tsx` (Length, Width, Imperial/Metric toggle, L-shape rectangle list builder)
- [ ] Task 2.2: Design and generate `components/estimator/CarpetForm.tsx` (Roll width quick-chips, Pattern match radios, Vertical repeat, Waste factor %)
- [ ] Task 2.3: Design and generate `components/estimator/ResultsDisplay.tsx` (Summary cards, strip schedule, seam locations, accessory counts)
- [ ] Task 2.4: Design and generate `components/estimator/StickyBar.tsx` (Mobile sticky bottom bar displaying total material and PDF trigger)

## Group 3: Real-Time State & Math Wiring
- [ ] Task 3.1: Build `components/estimator/EstimatorDashboard.tsx` to manage `Room` and `CarpetSpec` React state
- [ ] Task 3.2: Wire state to pure functions in `lib/math/index.ts` via `useMemo` for instant calculation reactivity
- [ ] Task 3.3: Connect `EstimatorDashboard.tsx` into main `app/page.tsx` shell

## Group 4: Unit 3 - Stateless Auth & Edge API
- [ ] Task 4.1: Build Gumroad API verification route in `app/api/verify-license/route.ts` with `jose` JWT minting & HTTP-only cookie setting
- [ ] Task 4.2: Build `middleware.ts` to inspect and verify `estimating_session` JWT signature
- [ ] Task 4.3: Build `components/auth/LicenseModal.tsx` dialog for license entry and verification feedback

## Group 5: Client-Side PDF Proposal Generation
- [ ] Task 5.1: Create itemized proposal layout component in `components/pdf/ProposalPDF.tsx`
- [ ] Task 5.2: Create client-side PDF export utility in `lib/pdf/generate.ts` using `html2canvas` + `jspdf`
- [ ] Task 5.3: Attach PDF generator to StickyBar action button with license auth check fallback

## Group 6: Quality Gate & Verification
- [ ] Task 6.1: Test real-time UI calculation against US Imperial (20x15ft room -> 61.6 sq yd) and UK Metric (L-shape -> 35.84 sqm) case studies
- [ ] Task 6.2: Execute `npm run build` and ensure zero TypeScript or Next.js build errors
