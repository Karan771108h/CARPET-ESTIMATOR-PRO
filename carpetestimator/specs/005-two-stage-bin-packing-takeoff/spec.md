# Feature Specification: Two-Stage Takeoff Optimization & Guillotine Bin-Packing Engine

## Executive Summary
This specification defines a generalizable Two-Stage Takeoff Optimization Engine utilizing a 2D guillotine bin-packing heuristic (First-Fit / Best-Fit Decreasing) with dynamic remnant splitting and nesting for multi-section room geometries.

Additionally, this specification includes UI fixes for `ProposalPDF.tsx` to resolve section overlapping in the room visualizer and introduce a dedicated Master Roll Cut-Plan Visualizer displaying exact cut positions, piece names, dimensions, and remnant off-cut locations.

---

## 1. Two-Stage Takeoff Optimization Algorithm

### Stage 1: Geometric Piece Decomposition
1. Take an arbitrary rectilinear room polygon $P$ (or list of room sections).
2. Decompose $P$ into distinct rectangular floor pieces $P_i$.
3. For each piece $i$, compute physical width $W_{\text{piece}, i}$ and physical length $L_{\text{piece}, i}$.
4. Apply localized trim allowance ($L_{\text{bleed}}$):
   $$W_{\text{cut}, i} = W_{\text{piece}, i}$$
   $$L_{\text{cut}, i} = L_{\text{piece}, i} + 2 \cdot L_{\text{bleed}}$$

### Stage 2: 2D Guillotine Remnant-Nesting Bin Packing Heuristic
1. **Sort Items**: Sort all cut items $C_i$ by area descending ($W_{\text{cut}, i} \times L_{\text{cut}, i}$) to prioritize nesting larger pieces first.
2. **Track Remnants**: Maintain an active remnant array $R = \{R_1, R_2, \dots\}$. Each remnant tracks:
   - `remnantId`: unique string identifier
   - `width`: $W_{\text{rem}}$
   - `length`: $L_{\text{rem}}$
   - `originX`, `originY`: relative coordinate offset
   - `parentCutId`: cut ID from which this remnant originated
3. **Evaluation Loop for Item $C_i$**:
   - **Nesting Check**: Search active remnants for candidates where $W_{\text{cut}, i} \le W_{\text{rem}}$ and $L_{\text{cut}, i} \le L_{\text{rem}}$ (with pile direction matching).
   - **Place in Remnant (Best-Fit)**: Select candidate minimizing residual waste $(W_{\text{rem}} \cdot L_{\text{rem}} - W_{\text{cut}, i} \cdot L_{\text{cut}, i})$.
     - Remove selected parent remnant $R_k$.
     - Mark $C_i$ as `"nested"` inside $R_k$.
     - **Guillotine Split**: Split remaining space into two rectangular sub-remnants:
       - Sub-remnant 1 (Right): width = $W_{\text{rem}} - W_{\text{cut}, i}$, length = $L_{\text{cut}, i}$ (if width $> 0.1$ ft)
       - Sub-remnant 2 (Top): width = $W_{\text{rem}}$, length = $L_{\text{rem}} - L_{\text{cut}, i}$ (if length $> 0.1$ ft)
       - Add non-trivial sub-remnants back to active remnant inventory.
   - **Place on Main Roll (Fresh Cut)**: If no remnant fits $C_i$:
     - Pull fresh cut on master roll of length $L_{\text{cut}, i}$ spanning full roll width $W_{\text{roll}}$.
     - Set roll start position $v_{\text{start}} = v_{\text{end}}$, roll end position $v_{\text{end, new}} = v_{\text{start}} + L_{\text{cut}, i}$.
     - Mark $C_i$ as `"placed_on_roll"`.
     - Calculate side off-cut remnant:
       $$W_{\text{new\_rem}} = W_{\text{roll}} - W_{\text{cut}, i}$$
       $$L_{\text{new\_rem}} = L_{\text{cut}, i}$$
     - If $W_{\text{new\_rem}} > 0.1$ ft, add to active remnant inventory.

---

## 2. Visualizer Fixes & Master Roll Diagram in `ProposalPDF.tsx`

1. **Fix Section Overlapping**: Render room sections side-by-side using accurate X-offsets ($X_{\text{offset}} = \sum_{k=0}^{i-1} W_{\text{piece}, k}$) so rectangles never overlap in SVG visualizer.
2. **Master Roll Diagram**: Add a visual 2D Master Roll Cut-Plan showing:
   - Full master roll timeline ($0$ to total linear length $v_{\text{end}}$).
   - Color-coded cut blocks with section names and exact dimensions ($W \times L$).
   - Green/Blue shaded areas for nested items.
   - Gray dashed regions for side off-cuts and unused remnants with labels.
