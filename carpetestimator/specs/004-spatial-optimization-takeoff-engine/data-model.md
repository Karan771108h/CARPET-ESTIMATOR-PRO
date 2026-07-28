# Phase 1: Data Model & Schemas

## Core Entities & Interfaces

### 1. `Point` & `Polygon`
```typescript
export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  vertices: Point[];
}
```

### 2. `StripCut`
```typescript
export interface StripCut {
  cutIndex: number;
  associatedSection?: string;
  width: number;
  physicalLength: number; // L_section
  rawLength: number;      // L_raw = L_section + 2 * L_bleed
  rollStartPosition: number; // v_start
  rollEndPosition: number;   // v_end
  patternPenalty: number;    // Delta L_pattern
  yStart: number;
  yEnd: number;
}
```

### 3. `Remnant`
```typescript
export interface Remnant {
  remnantId: string;
  width: number;       // W_rem = W_roll - W_active - W_seam_trim
  length: number;      // L_raw
  pileAngle: number;
  patternOffset: {
    u: number;
    v: number;
  };
}
```

### 4. `SeamLine`
```typescript
export interface SeamLine {
  seamId: string;
  startPoint: Point;
  endPoint: Point;
  isCRICompliant: boolean;
}
```

### 5. `TakeoffCalculationOutput`
```typescript
export interface TakeoffCalculationOutput {
  projectId: string;
  calculationId: string;
  timestamp: string;
  summary: {
    selectedOrientation: 0 | 90;
    totalLinearFeet: number;
    totalSquareYards: number;
    netArea: number;
    wasteArea: number;
    wastePercentage: number;
  };
  cuts: StripCut[];
  seams: SeamLine[];
  remnants: Remnant[];
  accessories: {
    padding: {
      totalSquareFeet: number;
      rollsNeeded: number;
    };
    tacklessStrips: {
      linearFeet: number;
      piecesNeeded: number;
    };
    seamTape: {
      linearFeet: number;
      rollsNeeded: number;
    };
  };
}
```
