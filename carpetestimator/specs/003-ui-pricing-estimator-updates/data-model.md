# Phase 1: Data Model & Schema Definitions

**Feature**: UI, UX, Business Model, and Design Updates
**Branch**: `003-ui-pricing-estimator-updates`

## Entities & Interfaces

### 1. RoomSection
Represents a single rectangular section within a multi-section room layout.

```typescript
export interface RoomSection {
  id: string;
  name: string;      // e.g. "Section 1", "Section 2"
  length: number;    // Feet (US) or Meters (UK)
  width: number;     // Feet (US) or Meters (UK)
}
```

### 2. CarpetSpecs
Configuration settings for carpet roll calculations.

```typescript
export type PatternMatch = 'none' | 'straight' | 'half-drop';

export interface CarpetSpecs {
  rollWidth: number;         // Default: 12 (US) or 4 (UK)
  wasteFactor: number;       // Percentage, Default: 10
  patternMatch: PatternMatch;// Default: 'none'
  verticalRepeat?: number;   // Required if patternMatch is 'straight' or 'half-drop'
}
```

### 3. EstimatorFormState
Consolidated state for the estimator page.

```typescript
export interface EstimatorFormState {
  unitSystem: 'us' | 'uk';
  sections: RoomSection[];
  carpetSpecs: CarpetSpecs;
  hasCalculated: boolean;
}
```

### 4. CalculationResult
Output of math calculations.

```typescript
export interface CalculationResult {
  netArea: number;             // Available on Free Tier
  totalOrderQuantity: number;  // Locked behind License
  cutSchedule: {               // Locked behind License
    stripNumber: number;
    length: number;
    width: number;
  }[];
  accessoryCounts: {           // Locked behind License
    tacklessRods: number;
    seamTapeLength: number;
    underlaymentArea: number;
  };
}
```

### 5. LicenseState
Freemium access status.

```typescript
export interface LicenseState {
  isLicensed: boolean;
  licenseKey?: string;
  isVerifying: boolean;
  error?: string;
}
```
