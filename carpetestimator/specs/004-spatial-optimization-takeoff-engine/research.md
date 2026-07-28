# Phase 0: Research & Technical Rationale

## Decision 1: 2D Polygon Intersection Algorithm
- **Decision**: Use vertical slab clipping $[x_{i-1}, x_i] \times [-\infty, \infty]$ against 2D room polygon $P$ using exact bounding coordinate sampling along vertical grid lines.
- **Rationale**: Keeps implementation light, native, zero-dependency, and deterministic. Non-uniform geometries (L-shape, T-shape, stepped) break into precise Y-extents per vertical slab.
- **Alternatives Considered**: Full BSP tree / Clipper lib. Rejected due to unnecessary dependency bloat when vertical axis slicing provides exact localized min/max Y bounds.

## Decision 2: Continuous Master Roll Pattern Alignment Strategy
- **Decision**: Model cumulative roll usage $v_{\text{end}}$ and enforce pattern phase alignment $v_{\text{start}, i} \equiv \theta_i \pmod{R_y}$ with pattern alignment penalty $\Delta L_{\text{pattern}, i} = (\theta_i - v_{\text{end}}) \bmod R_y$.
- **Rationale**: Accurately reflects physical installer cutting sequence off a continuous carpet roll. Eliminates pattern mismatches across seams and eliminates material ordering shortfalls.
- **Alternatives Considered**: Independent strip rounding $\lceil L / R_y \rceil \times R_y$. Rejected because it fails to account for phase shifts between adjacent strips on a single master roll.

## Decision 3: Vertical Coordinate Offset Registration for Stepped Rooms
- **Decision**: Calculate absolute pattern phase $\Phi_i = (y_{\text{start}, i} - L_{\text{bleed}}) \bmod R_y$ and set target phase for strip $i+1$ as $\Phi_{i+1} = (y_{\text{start}, i+1} - L_{\text{bleed}}) \bmod R_y$ (straight match) or $\left( (y_{\text{start}, i+1} - L_{\text{bleed}}) + \frac{R_y}{2} \right) \bmod R_y$ (half-drop).
- **Rationale**: Ensures pattern continuity across vertical steps when room sections start at different baseline Y-coordinates.

## Decision 4: Dual-Orientation ($0^\circ$ vs $90^\circ$) & Structural Rules
- **Decision**: Evaluate layout in both $0^\circ$ (longitudinal) and $90^\circ$ (transverse). Choose minimal total linear roll length, penalized if perpendicular to primary natural light source or crossing high-traffic pivot points.
- **Rationale**: Complies with Carpet and Rug Institute (CRI 104/105) professional installation guidelines while minimizing cost.
