# Architecture Context

## Stack
- **Framework**: Next.js (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui (Mobile-first responsive)
- **Auth**: Gumroad API + `jose` (Stateless JWT)
- **Storage**: HTTP-only Cookies + Client React State (NO DATABASE)
- **PDF Gen**: `jspdf` + `html2canvas` (Client-side)
- **Hosting**: Vercel (Edge Network)

## System Boundaries
- `app/api/verify-license/` - Owns Gumroad API communication, license validation, and JWT signing.
- `app/(dashboard)/` - Owns estimator UI, forms, and client-side math logic.
- `lib/math/` - Owns all pure mathematical functions (area, strip allocation, pattern matching, accessories). No UI or DB logic.
- `components/pdf/` - Owns PDF layout template and `jspdf` compilation logic.
- `middleware.ts` - Owns route protection for premium features by intercepting and verifying JWT signatures.

## Storage Model
- **HTTP-only Cookies**: Stores `estimating_session` JWT token (valid for 30 days).
- **Client State (React)**: Stores room dimensions, carpet specs, and calculation results during session. No server persistence required.
- **No Database**: Entirely stateless backend. No user data, project data, or license keys are stored on the server.

## Auth and Access Model
1. Authentication is purely license-based. Users enter a Gumroad license key.
2. `/api/verify-license` route checks Gumroad's API. If valid, signs a JWT containing license key and email.
3. JWT stored in a secure, HTTP-only, SameSite cookie.
4. Next.js middleware intercepts requests to PDF generation routes/components, verifies JWT signature using `JWT_SECRET`, blocks access if invalid or expired.

## Invariants
1. Mathematical calculations MUST run entirely client-side.
2. Application MUST NEVER connect to a database. All session state managed via stateless JWTs.
3. PDF generation MUST occur client-side using `html2canvas` and `jspdf`.
4. All math functions in `lib/math/` MUST be pure functions (no side effects).
5. Pattern matching logic MUST account for Straight Match (ceiling function) and Half-Drop Match (offset by 0.5 * repeat).
