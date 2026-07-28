# Feature Specification: Pre-Slicing (Cleaving) & Length-Descending 2D Takeoff Engine

## Executive Summary
This specification documents the implementation of the `FlooringTakeoffEngine` featuring Stage 1 Pre-Slicing (Cleaving) for sections wider than the roll width, and Stage 2 Length-Descending Sorting Heuristic to prevent the "Area-Sorting Trap" in 2D continuous-roll broadloom carpet estimation.

---

## 1. Stage 1: Pre-Slicing (Cleaving) Phase

When a physical room section's width $W_{\text{section}} > W_{\text{roll}}$:
1. **Full-Width Strip Count**: $N = \lfloor W_{\text{section}} / W_{\text{roll}} \rfloor$
2. **Remainder Width**: $W_{\text{remainder}} = W_{\text{section}} \bmod W_{\text{roll}}$
3. **Cut List**:
   - $N$ full-width strips of width $W_{\text{roll}}$ and raw length $L_{\text{cut}} = L_{\text{section}} + 2 \cdot L_{\text{bleed}}$.
   - 1 remainder strip of width $W_{\text{remainder}}$ (if $W_{\text{remainder}} > 0.1$ ft) and raw length $L_{\text{cut}}$.
4. **Structural Naming Convention**:
   - `[Section_Name] Part A`, `[Section_Name] Part B`, `[Section_Name] Part C`, etc.
   - Example: 35 ft × 20 ft section on 15 ft roll with 0.25 ft bleed:
     - Part A: 15 ft × 20.5 ft
     - Part B: 15 ft × 20.5 ft
     - Part C: 5 ft × 20.5 ft

---

## 2. Stage 2: Length-Descending Sorting Heuristic

### The "Area-Sorting Trap" vs Length-Descending Solution
- **Area-Sorting Failure Scenario**:
  - Section 1 (15×20, Area 300), Section 2 (10×10, Area 100), Section 3 (5×20, Area 100).
  - Sorting by Area processes Section 2 (10×10) before Section 3 (5×20). Section 2 generates a short 5×10 remnant. Section 3 (length 20 ft) cannot fit into the 10 ft remnant, forcing a fresh 20 ft roll cut. Total = **50 linear feet**.
- **Length-Descending Optimization**:
  - Sorting strictly by **Length Descending** ($L_{\text{cut}}$) processes Section 1 (20 ft) and Section 3 (20 ft) first.
  - Section 3 packs alongside Section 1 on the 15 ft roll, generating a long $10\text{ ft} \times 20\text{ ft}$ side remnant.
  - Section 2 (10×10) fits into the $10\text{ ft} \times 20\text{ ft}$ remnant.
  - Total = **40 linear feet** (Saving 10 linear feet / 20% waste reduction).

---

## 3. TypeScript Engine Schema

```typescript
export interface RawSection {
  id: string;
  name?: string;
  width: number;
  length: number;
}

export interface Piece {
  id: string;
  sectionId: string;
  width: number;
  length: number; // Raw cut length including bleed
  isPlaced: boolean;
}

export interface Remnant {
  id: string;
  width: number;
  length: number;
  parentCutId: string;
  originX?: number;
  originY?: number;
}

export interface PlacedCut {
  pieceId: string;
  width: number;
  length: number;
  placedInRemnant: boolean;
  remnantId?: string;
  rollStart?: number;
  rollEnd?: number;
  originX?: number;
  originY?: number;
}

export interface NestingResult {
  totalLinearLength: number;
  totalSquareYards: number;
  placedCuts: PlacedCut[];
  activeRemnants: Remnant[];
}
```
