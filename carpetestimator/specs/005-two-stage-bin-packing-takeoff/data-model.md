# Phase 1: Data Model & Schemas

## Two-Stage Optimization Entities

### 1. `DecomposedCutItem`
```typescript
export interface DecomposedCutItem {
  id: string;
  sectionName: string;
  pieceWidth: number;
  pieceLength: number;
  cutWidth: number;  // W_piece
  cutLength: number; // L_piece + 2 * L_bleed
  area: number;      // W_cut * L_cut
}
```

### 2. `RemnantBlock`
```typescript
export interface RemnantBlock {
  remnantId: string;
  width: number;
  length: number;
  originX: number;
  originY: number;
  parentCutId?: string;
  pileAngle: number;
}
```

### 3. `ItemPlacement`
```typescript
export interface ItemPlacement {
  itemId: string;
  sectionName: string;
  placementType: 'placed_on_roll' | 'nested_in_remnant';
  placedWidth: number;
  placedLength: number;
  rollStartPosition?: number;
  rollEndPosition?: number;
  parentRemnantId?: string;
  originX: number;
  originY: number;
}
```

### 4. `TwoStageOptimizationResult`
```typescript
export interface TwoStageOptimizationResult {
  totalLinearLength: number;
  totalOrderedArea: number;
  wastePercentage: number;
  placements: ItemPlacement[];
  activeRemnants: RemnantBlock[];
  masterRollCuts: {
    cutIndex: number;
    sectionName: string;
    rollStartPosition: number;
    rollEndPosition: number;
    length: number;
    width: number;
    sideCutRemnant?: RemnantBlock;
  }[];
}
```
