# Feature Specification: Unit 1 - Project Setup & Pure Math Engine

## Feature Summary
Establish the foundational Next.js TypeScript project structure, Tailwind UI configuration, and the pure mathematical calculation engine inside `lib/math/` for Carpet Estimator Pro.

## User Scenarios & Acceptance Criteria

### Scenario 1: Net Floor Area & Layout Decomposition
- **Given**: A user inputs rectangular room dimensions or an L-shaped room split into rectangular components.
- **When**: Area calculation logic executes in `lib/math/area.ts`.
- **Then**: Returns exact net square footage / square meters and gross perimeter (minus doorway deductions).

### Scenario 2: Broadloom Strip Allocation & Cut Lengths
- **Given**: A room with length $L$, width $W$, roll width $R$, and trim allowance $T$.
- **When**: Strip allocation logic executes in `lib/math/strips.ts`.
- **Then**:
  - Calculates number of strips required: $N = \lceil W / R \rceil$.
  - Calculates raw cut length per strip: $C_{raw} = L + T$.
  - Applies pattern repeat penalties:
    - **Straight Match**: $C_{matched} = \lceil C_{raw} / P \rceil \times P$ (where $P$ is vertical repeat).
    - **Half-Drop Match**: Alternate strips offset by $0.5 \times P$.
  - Calculates total linear footage and ordered area in square yards / square meters.

### Scenario 3: Accessory Material Requirements
- **Given**: Net room area, room perimeter, and total seam length.
- **When**: Accessory logic executes in `lib/math/accessories.ts`.
- **Then**:
  - Underlay/Pad: Net area + 5% safety buffer.
  - Tackless Strips (Gripper Rods): Total room perimeter minus doorway widths.
  - Seam Tape: Total seam length + 10% overlap buffer.

### Scenario 4: Automated Verification via Test Suite
- **Given**: The US Imperial Case Study input (20x15ft room, 12ft roll, 1.5ft straight repeat).
- **Then**: Output MUST equal exactly 2 strips, 21ft matched cuts, and 61.6 sq yds total order.
- **Given**: The UK Metric Case Study input (L-shape room, 4m roll, 0.4m repeat).
- **Then**: Output MUST equal exactly 35.84 sqm.

## Non-Functional Requirements
- 100% pure functions in `lib/math/` with zero side effects or UI dependencies.
- Strict TypeScript interfaces with zero `any` usage.
- Automated unit test suite passing 100%.
