# Phase 1: Data Model & Schemas

## Flooring Takeoff Engine Entities

### 1. `RawSection`
```typescript
export interface RawSection {
  id: string;
  name?: string;
  width: number;
  length: number;
}
```

### 2. `Piece`
```typescript
export interface Piece {
  id: string;
  width: number;
  length: number; // Includes trim allowance: length + 2 * bleed
  isPlaced: boolean;
}
```

### 3. `Remnant`
```typescript
export interface Remnant {
  id: string;
  width: number;
  length: number;
  parentCutId: string;
}
```

### 4. `PlacedCut`
```typescript
export interface PlacedCut {
  pieceId: string;
  width: number;
  length: number;
  placedInRemnant: boolean;
  remnantId?: string;
  rollStart?: number;
  rollEnd?: number;
}
```

### 5. `NestingResult`
```typescript
export interface NestingResult {
  totalLinearLength: number;
  totalSquareYards: number;
  placedCuts: PlacedCut[];
  activeRemnants: Remnant[];
}
```
