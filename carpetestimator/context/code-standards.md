# Code Standards

## General
- Keep all mathematical logic in pure functions inside `lib/math/`. Do not mix math logic with React components.
- Fix root causes, do not layer workarounds.
- Do not mix UI rendering with API request handling in the same function.

## TypeScript
- Strict mode is required throughout the project.
- Avoid `any` - use explicit interfaces for all inputs (`Room`, `CarpetSpec`, `CalculationResult`).
- Validate unknown external input (like Gumroad API responses) at system boundaries before trusting the data.

## Next.js (App Router)
- Default to Server Components for static pages (e.g., landing page, login page).
- Add `'use client'` only to dashboard components that require browser interactivity, React state, and client-side math processing.
- Keep route handlers in `app/api/` focused on a single responsibility (e.g., only license verification).

## Styling
- Use Tailwind CSS utility classes.
- Follow the mobile-first approach. Base styles target mobile; breakpoint modifiers (`sm:`, `md:`) target desktop.
- Use CSS custom property tokens for colors — no hardcoded hex values in components.

## API Routes
- Validate and parse request input before any logic runs.
- Return consistent, predictable response shapes (e.g., `{ success: boolean, message: string, data?: any }`).
- Never expose the `JWT_SECRET` to the client.

## File Organization
- `lib/math/` — Pure calculation functions (area, strips, patterns, accessories).
- `lib/types/` — TypeScript interfaces and types.
- `app/api/` — Next.js Route Handlers.
- `components/ui/` — shadcn/ui primitive components.
- `components/estimator/` — Specific UI components for estimation forms and results.
- `components/pdf/` — Components rendered specifically for PDF export.
