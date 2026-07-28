# Phase 0: Research & Technical Decisions

**Feature**: UI, UX, Business Model, and Design Updates
**Branch**: `003-ui-pricing-estimator-updates`

## Technical Decisions

### 1. Multi-Section Room Geometry Model
- **Decision**: Represent room geometry as an array of `RoomSection` objects (`id`, `name`, `length`, `width`).
- **Rationale**: Replaces single L-Shape hardcoding with an extensible array in React state. Allows users to add 2, 3, or N rectangular sections to approximate complex rooms.
- **Alternatives Considered**: Polygon coordinate entry (rejected: too complex for standard carpet estimators).

### 2. Pattern Matching Repeat Logic & SVGs
- **Decision**: Conditionally render `verticalRepeat` input when pattern match is `'straight'` or `'half-drop'`. Use hardcoded inline React SVG components for pattern icons (`Plain`, `Straight Match`, `Half-Drop Match`).
- **Rationale**: Hardcoded SVGs avoid external image dependencies, ensure fast client rendering, and work offline or in serverless builds without AI image generation latency.
- **Alternatives Considered**: PNG/JPG image assets (rejected: adds static file overhead and scaling artifacts).

### 3. Explicit Calculation Flow & Freemium Paywall Gating
- **Decision**: Add a boolean state `hasCalculated` triggered by clicking 'Calculate'. Render free Net Area results immediately; render full Cut Schedule / PDF export only if `isLicensed` state is true (validated via Gumroad license API or JWT session). Obscure full results with Tailwind `backdrop-blur-md` overlay card.
- **Rationale**: Prevents accidental recalculations while typing and cleanly separates free vs locked tier functionality.
- **Alternatives Considered**: Hiding locked results completely (rejected: blurred overlay with lock icon generates higher conversion rate).

### 4. Pure Client-Side Scaled SVG Room Visualizer for PDF
- **Decision**: Implement a helper function `renderRoomSVG(sections, rollWidth)` inside `ProposalPDF.tsx` returning a raw SVG string or React SVG node with scaled `<rect>` elements and dashed `<line>` seam markers.
- **Rationale**: SVG renders crisp vector graphics inside `html2canvas` / `jspdf` without external canvas libraries like Fabric.js or Konva.
- **Alternatives Considered**: Canvas 2D API context drawing (rejected: harder to reactively re-render than declarative SVG string/JSX).
