# Carpet Estimator Pro Constitution

## Core Principles

### I. Pure Client-Side Math Engine
All mathematical calculation logic (area, broadloom strip allocation, pattern matching, accessories) MUST reside entirely in pure, side-effect-free TypeScript functions within `lib/math/`. No UI rendering or API call logic may be mixed into math functions. Math functions must be 100% unit-testable.

### II. ZERO Database Serverless Architecture
The application MUST run 100% serverless with ZERO database connections (NO Prisma, NO PostgreSQL). Session state and license authentication are strictly managed via stateless JWTs stored in HTTP-only cookies (`estimating_session`) signed using the `jose` library via Next.js Edge API routes (`app/api/verify-license/`).

### III. Client-Side PDF Proposal Generation
PDF proposal generation MUST be compiled entirely on the client side using `jspdf` and `html2canvas` to eliminate serverless memory overhead, cold starts, and Puppeteer server dependencies.

### IV. Mobile-First Technical Design & Stitch MCP
The UI MUST be mobile-first, single-column layout, Light Mode only, styled with Tailwind CSS, `shadcn/ui`, and Slate color tokens (`#F8FAFC` background, Slate 900 text, Blue 600 accent). Component designs leverage Stitch MCP generation standards.

### V. Incremental Spec-Driven Development
Features must be implemented unit by unit. Each unit must be verified with automated unit tests (enforcing US Imperial 20x15ft & UK Metric L-shape benchmarks) before proceeding.

## Non-Negotiable System Boundaries & Rules

1. `lib/math/` - Pure mathematical functions (area, strip allocation, pattern matching, accessories).
2. `app/api/verify-license/` - Next.js Edge API route checking Gumroad license keys and minting stateless JWT cookies (`jose`).
3. `app/(dashboard)/` - Mobile-first single-column estimator UI forms & state.
4. `components/pdf/` - Client-side PDF template & compilation via `jspdf` + `html2canvas`.
5. `middleware.ts` - JWT verification route protection for premium features.
6. **UI Component Generation**: Use Stitch MCP for all UI component generation.

**Version**: 1.1.0 | **Ratified**: 2026-07-20 | **Last Amended**: 2026-07-20
