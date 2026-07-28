# Feature Specification: Spatial Optimization and Geometrical Analysis for Soft Flooring Takeoff Engine

## Executive Summary
This specification documents the replacement of the naive global bounding-box carpet estimation method with the 2D spatial optimization engine specified in the technical paper *"Spatial Optimization and Geometrical Analysis for Software-Driven Soft Flooring Takeoff Systems"*.

The engine performs multi-section and non-uniform geometry strip allocation, dynamic localized strip-length calculation, side-cut remnant yield tracking & nesting, pattern-matching alignment (straight and half-drop) on continuous master rolls, vertical coordinate offset registration for stepped geometries, orientation optimization ($0^\circ$ vs $90^\circ$), CRI 104/105 structural compliance rules, and comprehensive accessory material mathematics.

---

## 1. Mathematical & Algorithmic Core Specifications

### 1.1 Spatial Coordinate System & Dynamic Strip Length Allocation
- **Coordinate Space**: Let the room be a polygon $P$ in a Cartesian system where $X$ represents the width axis perpendicular to the roll run, and $Y$ represents the length axis parallel to the roll run.
- **Roll Width**: $W_{\text{roll}}$ (e.g., 12 ft or 15 ft Imperial; 4 m or 5 m Metric).
- **Vertical Grid Lines**:
  $$x_k = X_{\text{min}} + k \cdot W_{\text{roll}} \quad \text{for } k \in \{0, 1, \dots, N_{\text{strips}}\}$$
- **Total Strips Required**:
  $$N_{\text{strips}} = \left\lceil \frac{X_{\text{max}} - X_{\text{min}}}{W_{\text{roll}}} \right\rceil$$
- **Strip Slabs & Polygon Intersections**:
  For each strip $i \in \{1, \dots, N_{\text{strips}}\}$, the vertical slab $S_i = [x_{i-1}, x_i] \times [-\infty, \infty]$.
  The intersection $P_i = P \cap S_i$ yields sub-polygons $P_{i, j}$.
- **Localized Physical Length**:
  $$L_{\text{section}, i} = \max_{(x,y) \in P_i} (y) - \min_{(x,y) \in P_i} (y)$$
- **Trim Allowance / Bleed**: $L_{\text{bleed}}$ (typically 0.25 ft / 3 inches per end).
- **Raw Cut Length per Strip**:
  $$L_{\text{raw}, i} = L_{\text{section}, i} + 2 \cdot L_{\text{bleed}}$$

### 1.2 Remnant & Side-Cut Yield Calculations
- **Active Strip Width**:
  $$W_{\text{active}, i} = \max_{(x,y) \in P_i} (x) - \min_{(x,y) \in P_i} (x)$$
- **Side Off-Cut Remnant Width**:
  $$W_{\text{rem}, i} = W_{\text{roll}} - W_{\text{active}, i} - W_{\text{seam\_trim}}$$
  where $W_{\text{seam\_trim}}$ is selvage edge trim (1.0–1.5 inches / 2.5–3.8 cm per seam edge).
- **Remnant Data Structure**: Rectangle $R = (W_{\text{rem}, i}, L_{\text{raw}, i})$ added to reusable active inventory.

### 1.3 Remnant Nesting and Reuse Analysis
Three conditions must be validated to nest a remnant into an auxiliary room/closet/alcove:
1. **Pile Direction Validation**: $\vec{d}_{\text{rem}} = \vec{d}_{\text{target}}$ (remnants cannot be rotated for directional/patterned products).
2. **Physical Containment Check**:
   $$W_{\text{target}} + 2 \cdot L_{\text{bleed}} \le W_{\text{rem}} \quad \text{and} \quad L_{\text{target}} + 2 \cdot L_{\text{bleed}} \le L_{\text{rem}}$$
3. **Pattern Phase Registration**: Horizontal and vertical pattern offsets $(u, v)$ must match the target area's pattern grid.

---

## 2. Pattern Matching Dynamics Across Variable-Length Drops

### 2.1 Straight Match (Set Match)
- Vertical repeat length $R_y$, horizontal repeat length $R_x$.
- Pattern-aligned single strip length:
  $$L_{\text{pattern}, i} = \left\lceil \frac{L_{\text{raw}, i}}{R_y} \right\rceil \times R_y$$

### 2.2 Half-Drop Match & Master Roll Sequential Cutting
- **Target Pattern Phase Offset**:
  $$\theta_i = (i \bmod 2) \cdot \frac{R_y}{2} \quad \text{for strip } i \in \{0, 1, 2, \dots\}$$
- **Continuous Master Roll Constraint**:
  Let $v_{\text{end}}$ be cumulative master roll length used before strip $i$.
  Cut start position $v_{\text{start}, i}$ on master roll:
  $$v_{\text{start}, i} \ge v_{\text{end}} \quad \text{and} \quad v_{\text{start}, i} \equiv \theta_i \pmod{R_y}$$
- **Pattern Alignment Penalty**:
  $$\Delta L_{\text{pattern}, i} = (\theta_i - v_{\text{end}}) \bmod R_y$$
  $$v_{\text{start}, i} = v_{\text{end}} + \Delta L_{\text{pattern}, i}$$
  $$v_{\text{end, new}} = v_{\text{start}, i} + L_{\text{raw}, i}$$

### 2.3 Vertical Coordinate Offset Registration (Stepped / Staggered Geometry)
When adjacent strips start at different baseline Y-coordinates ($y_{\text{start}, i}$ vs $y_{\text{start}, i+1}$):
- **Geometric Step Offset**: $\Delta Y_{\text{step}} = y_{\text{start}, i+1} - y_{\text{start}, i}$.
- **Absolute Pattern Phase**:
  $$\Phi_i = (y_{\text{start}, i} - L_{\text{bleed}}) \bmod R_y$$
- **Target Pattern Phase for Adjacent Strip $i+1$**:
  - Straight Match: $\Phi_{i+1} = (y_{\text{start}, i+1} - L_{\text{bleed}}) \bmod R_y$
  - Half-Drop Match: $\Phi_{i+1, \text{half-drop}} = \left( (y_{\text{start}, i+1} - L_{\text{bleed}}) + \frac{R_y}{2} \right) \bmod R_y$

---

## 3. Layout Orientation & CRI 104/105 Compliance Optimization

- **Dual Orientation Evaluation**: Compare $0^\circ$ (Y-run) vs $90^\circ$ (X-run).
- **Selection Criterion**: Minimal total linear roll length that satisfies structural constraints.
- **CRI 104/105 Compliance Rules**:
  1. **Light-Source Alignment**: Seams run parallel to primary natural light source vector to minimize shadow lines. Perpendicular seams incur optimization penalties.
  2. **Pivot-Point Avoidance**: Seams avoided in high-traffic corridors, doorways, and major pivot areas.
  3. **Pile Direction Consistency**: All joined sections face identical pile direction to prevent color/shading mismatch.

---

## 4. Accessory Material Formulas

### 4.1 Underlay / Padding
- Net area buffer: $A_{\text{pad}} = A_{\text{net}} \times (1 + k_{\text{pad\_waste}})$, with $k_{\text{pad\_waste}} = 0.05$ (5%).
- Standard roll size: 6 ft × 45 ft = 270 sq ft (25.08 m²).
- Roll count:
  $$N_{\text{pad\_rolls}} = \left\lceil \frac{A_{\text{pad}}}{270} \right\rceil$$

### 4.2 Tackless Gripper Rods
- Perimeter length excluding doorways:
  $$L_{\text{tackless}} = \sum P_{\text{perimeter}} - \sum W_{\text{doorways}}$$
- Batten count (4-ft / 1.22m pieces):
  $$N_{\text{tackless\_strips}} = \left\lceil \frac{L_{\text{tackless}}}{4.0} \right\rceil$$

### 4.3 Hot-Melt Seam Tape
- Tape length with 10% splice overlap:
  $$L_{\text{seam\_tape}} = \left( \sum L_{\text{seams}} \right) \times 1.10$$
- Roll count (66-ft / 20.1m rolls):
  $$N_{\text{tape\_rolls}} = \left\lceil \frac{L_{\text{seam\_tape}}}{66.0} \right\rceil$$

---

## 5. Comprehensive Real-World Edge Cases

| Scenario | Physical / Geometric Challenge | Algorithmic Solution |
| :--- | :--- | :--- |
| **Room Width Exceeds Roll Width** | Requires multiple parallel strips, creating long seams. | Decompose room width into multiple strips, inserting linear seam elements along shared boundaries. |
| **Angled / Diagonal Walls** | Non-orthogonal boundaries require variable strip lengths. | Sample polygon bounding points within each vertical slab to calculate exact maximum height for each individual strip. |
| **Stair Treads and Risers** | Wrapping carpet continuously over steps. | Compute continuous length: $L_{\text{stairs}} = N_{\text{steps}} \times (D_{\text{tread}} + H_{\text{riser}} + K_{\text{nose\_wrap}}) + 2 \cdot L_{\text{landing\_bleed}}$. |
| **Opposing Natural Light Sources** | Cross-lighting highlights seam variations. | Calculate window vectors relative to seams; choose orientation minimizing perpendicular seam exposure. |
| **High-Traffic Pivot Points** | Seams in main pathways wear prematurely. | Shift starting position of vertical layout grid to move seams away from mapped high-traffic pathways. |
| **Multi-Room Suites (Shared Pile)** | Coordinating pattern/pile across rooms. | Establish global coordinate system and pattern grid; propagate across all room polygons. |
| **Non-Orthogonal (Skewed) Boundaries** | Angled walls cause pattern drift. | Calculate skew angle of primary seam wall; adjust layout direction parallel to this boundary. |
| **Pattern Elongation / Tension Bowing** | Manufacturing tension varies repeat lengths. | Check repeat length across 20 repeats; sequence installation laying longest repeats first. |
| **Dye Lot Segregation** | Color variations between dye batches. | Group cuts by dye lot and assign to isolated self-contained rooms; never mix across seams. |
| **Closet & Alcove Nesting** | Small areas increase roll requirements. | Search active off-cut remnant inventory matching pile direction and dimensions before allocating master roll cuts. |

---

## 6. Input & Output JSON Schemas

### 6.1 Input Schema (`RoomTakeoffInput`)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "RoomTakeoffInput",
  "type": "object",
  "properties": {
    "projectId": { "type": "string", "format": "uuid" },
    "roomId": { "type": "string", "format": "uuid" },
    "roomName": { "type": "string" },
    "geometry": {
      "type": "object",
      "properties": {
        "vertices": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "x": { "type": "number" },
              "y": { "type": "number" }
            },
            "required": ["x", "y"]
          },
          "minItems": 3
        }
      },
      "required": ["vertices"]
    },
    "constraints": {
      "type": "object",
      "properties": {
        "rollWidth": { "type": "number", "minimum": 0 },
        "pileDirectionAngle": { "type": "number", "minimum": 0, "maximum": 360 },
        "patternRepeat": {
          "type": "object",
          "properties": {
            "vertical": { "type": "number", "minimum": 0 },
            "horizontal": { "type": "number", "minimum": 0 },
            "matchType": { "type": "string", "enum": ["none", "straight", "half-drop"] }
          },
          "required": ["vertical", "horizontal", "matchType"]
        },
        "seamRules": {
          "type": "object",
          "properties": {
            "avoidPivotPoints": { "type": "boolean" },
            "lightSourceVector": {
              "type": "object",
              "properties": {
                "x": { "type": "number" },
                "y": { "type": "number" }
              },
              "required": ["x", "y"]
            }
          },
          "required": ["avoidPivotPoints", "lightSourceVector"]
        }
      },
      "required": ["rollWidth", "pileDirectionAngle", "patternRepeat", "seamRules"]
    }
  },
  "required": ["projectId", "roomId", "roomName", "geometry", "constraints"]
}
```

### 6.2 Output Schema (`TakeoffCalculationOutput`)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "TakeoffCalculationOutput",
  "type": "object",
  "properties": {
    "projectId": { "type": "string", "format": "uuid" },
    "calculationId": { "type": "string", "format": "uuid" },
    "timestamp": { "type": "string", "format": "date-time" },
    "summary": {
      "type": "object",
      "properties": {
        "selectedOrientation": { "type": "integer", "enum": [0, 90] },
        "totalLinearFeet": { "type": "number" },
        "totalSquareYards": { "type": "number" },
        "netArea": { "type": "number" },
        "wasteArea": { "type": "number" },
        "wastePercentage": { "type": "number" }
      },
      "required": ["selectedOrientation", "totalLinearFeet", "totalSquareYards", "netArea", "wastePercentage"]
    },
    "cuts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "cutIndex": { "type": "integer" },
          "associatedSection": { "type": "string" },
          "width": { "type": "number" },
          "physicalLength": { "type": "number" },
          "rawLength": { "type": "number" },
          "rollStartPosition": { "type": "number" },
          "rollEndPosition": { "type": "number" },
          "patternPenalty": { "type": "number" }
        },
        "required": ["cutIndex", "width", "physicalLength", "rawLength", "rollStartPosition", "rollEndPosition", "patternPenalty"]
      }
    },
    "seams": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "seamId": { "type": "string" },
          "startPoint": {
            "type": "object",
            "properties": { "x": { "type": "number" }, "y": { "type": "number" } },
            "required": ["x", "y"]
          },
          "endPoint": {
            "type": "object",
            "properties": { "x": { "type": "number" }, "y": { "type": "number" } },
            "required": ["x", "y"]
          },
          "isCRICompliant": { "type": "boolean" }
        },
        "required": ["seamId", "startPoint", "endPoint", "isCRICompliant"]
      }
    },
    "remnants": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "remnantId": { "type": "string" },
          "width": { "type": "number" },
          "length": { "type": "number" },
          "pileAngle": { "type": "number" },
          "patternOffset": {
            "type": "object",
            "properties": { "u": { "type": "number" }, "v": { "type": "number" } },
            "required": ["u", "v"]
          }
        },
        "required": ["remnantId", "width", "length", "pileAngle", "patternOffset"]
      }
    },
    "accessories": {
      "type": "object",
      "properties": {
        "padding": {
          "type": "object",
          "properties": {
            "totalSquareFeet": { "type": "number" },
            "rollsNeeded": { "type": "integer" }
          },
          "required": ["totalSquareFeet", "rollsNeeded"]
        },
        "tacklessStrips": {
          "type": "object",
          "properties": {
            "linearFeet": { "type": "number" },
            "piecesNeeded": { "type": "integer" }
          },
          "required": ["linearFeet", "piecesNeeded"]
        },
        "seamTape": {
          "type": "object",
          "properties": {
            "linearFeet": { "type": "number" },
            "rollsNeeded": { "type": "integer" }
          },
          "required": ["linearFeet", "rollsNeeded"]
        }
      },
      "required": ["padding", "tacklessStrips", "seamTape"]
    }
  },
  "required": ["projectId", "calculationId", "timestamp", "summary", "cuts", "seams", "remnants", "accessories"]
}
```

---

## 7. Worked Verification Example (PDF Reference benchmark)

- **Room**: L-shaped / Stepped layout.
  - Section 1: 15 ft wide × 20 ft long ($X \in [0, 15], Y \in [0, 20]$).
  - Section 2: 15 ft wide × 25 ft long ($X \in [15, 30], Y \in [0, 25]$).
  - Total width: 30 ft.
- **Carpet Specs**: Roll Width = 15 ft, $R_y = 3$ ft, $R_x = 3$ ft, Straight Match, Bleed Allowance $L_{\text{bleed}} = 0.25$ ft per end.
- **Naive Bounding Box Result**: 55.25 linear feet.
- **Dynamic Allocation Engine Result**:
  - Strip 1 ($X \in [0, 15]$): Physical length = 20.0 ft. Raw length = $20.0 + 2(0.25) = 20.5$ ft.
    - Cut 0: Target phase $\Phi_1 = (0.0 - 0.25) \bmod 3.0 = 2.75$ ft. Start = 2.75 ft. End = 23.25 ft.
  - Strip 2 ($X \in [15, 30]$): Physical length = 25.0 ft. Raw length = $25.0 + 2(0.25) = 25.5$ ft.
    - Cut 1: Target phase $\Phi_2 = 2.75$ ft. Start constraint $\ge 23.25$ ft matching phase 2.75 ft $\implies v_{\text{start}, 2} = 23.75$ ft. End = 49.25 ft.
  - **Total Roll Length Required**: **49.25 linear feet**.
  - **Savings**: 6.0 linear feet (90 sq ft / 10 sq yd = $450 savings at $45/sq yd, representing 10.86% cost reduction).
