# Phase 0: Research & Technical Rationale

## Decision 1: 2D Bin-Packing Strategy (Best-Fit Decreasing)
- **Decision**: Sort all cut items by area descending ($W_{\text{cut}} \times L_{\text{cut}}$) and evaluate existing active remnants before pulling fresh cuts from the continuous roll.
- **Rationale**: Prioritizing larger pieces ensures the hardest-to-fit items claim master roll space first, maximizing the chance that smaller pieces (closets, alcoves, small sections) nest cleanly into leftover side off-cuts.
- **Alternatives Considered**: First-Fit (unsorted) or Random. Rejected because unsorted placement leaves fragmented remnants that fail to accommodate medium-to-large cuts.

## Decision 2: Guillotine Remnant Split Heuristic
- **Decision**: When placing a cut item $C_i$ inside a larger remnant $R_k$, split the remaining space into two orthogonal sub-remnants:
  1. Sub-remnant 1 (Right): width = $W_{\text{rem}} - W_{\text{cut}}$, length = $L_{\text{cut}}$
  2. Sub-remnant 2 (Top): width = $W_{\text{rem}}$, length = $L_{\text{rem}} - L_{\text{cut}}$
- **Rationale**: Guillotine splitting keeps all sub-remnants as pure rectangles, facilitating straightforward 2D containment checks without complex non-convex polygon algebra.
- **Alternatives Considered**: Non-guillotine shelf packing. Rejected due to unnecessary computational overhead and potential overlapping.

## Decision 3: PDF Room Visualizer Overlap Fix
- **Decision**: Calculate explicit cumulative X-offsets ($X_{\text{offset}} = \sum_{k=0}^{i-1} W_{\text{piece}, k}$) for multi-section room rectangles.
- **Rationale**: Prevents SVG `<rect>` elements from rendering at identical $(x=0)$ origins, fixing visual overlap completely.

## Decision 4: Visual Master Roll Diagram
- **Decision**: Render a dedicated SVG timeline representing the master roll ($0$ to total linear length) showing cut blocks, piece names, exact measurements ($W \times L$), and color-coded remnant off-cuts.
- **Rationale**: Provides clear cut sheet instructions for field installers, specifying exact roll cutting coordinates and remnant reuse locations.
