export type UnitSystem = 'imperial' | 'metric';

export type PatternMatchType = 'none' | 'straight' | 'half-drop';

export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  vertices: Point[];
}

export interface Rectangle {
  id: string;
  name?: string;
  length: number; // ft or m
  width: number;  // ft or m
}

export interface Room {
  name: string;
  unit: UnitSystem;
  rectangles: Rectangle[];
  doorwaysCount?: number;
  doorwayWidth?: number; // width per doorway in ft or m
  vertices?: Point[];
  lightSourceVector?: Point;
  avoidPivotPoints?: boolean;
}

export interface CarpetSpec {
  rollWidth: number;          // ft (12, 15) or m (4, 5)
  patternType: PatternMatchType;
  verticalRepeat: number;      // ft or m (0 if none)
  horizontalRepeat?: number;    // ft or m (0 if none)
  wasteFactorPercent: number;  // e.g. 5 for 5%
  trimAllowance: number;       // ft (e.g. 0.25-0.5 ft / 3-6 in) or m (0.10 m)
  pileDirectionAngle?: number; // 0 - 360 degrees
  seamTrim?: number;           // selvage edge trim in ft (default 0.1 ft / 1.2 in)
}

export interface StripCut {
  cutIndex: number;
  associatedSection?: string;
  width: number;
  physicalLength: number;      // L_section
  rawLength: number;           // L_raw = L_section + 2 * L_bleed
  rollStartPosition: number;   // v_start
  rollEndPosition: number;     // v_end
  patternPenalty: number;      // Delta L_pattern
  yStart: number;
  yEnd: number;
}

export interface Remnant {
  remnantId: string;
  width: number;               // W_rem = W_roll - W_active - W_seam_trim
  length: number;              // L_raw
  pileAngle: number;
  patternOffset: {
    u: number;
    v: number;
  };
}

export interface SeamLine {
  seamId: string;
  startPoint: Point;
  endPoint: Point;
  isCRICompliant: boolean;
}

export interface StripAllocation {
  stripIndex: number;
  rawLength: number;
  matchedLength: number;
  offset: number;
  rollStart?: number;
  rollEnd?: number;
}

export interface AccessoryResult {
  padAreaRequired: number;        // sq ft or sq m (Net area + 5% buffer)
  padRollsNeeded?: number;        // rolls of 270 sq ft
  tacklessStripsLinear: number;   // linear ft or m (Perimeter minus doorways)
  tacklessPiecesNeeded?: number;  // 4-ft battens
  seamTapeLinear: number;         // linear ft or m (Total seam length + 10%)
  seamTapeRollsNeeded?: number;   // 66-ft rolls
}

export interface OptimizationResult {
  orientation: 0 | 90;
  totalLinearLength: number;
  wastePercentage: number;
  strips: StripCut[];
  seamLength: number;
  seams: SeamLine[];
  remnants: Remnant[];
  accessories: AccessoryResult;
}

export interface DecomposedCutItem {
  id: string;
  sectionName: string;
  pieceWidth: number;
  pieceLength: number;
  cutWidth: number;
  cutLength: number;
  area: number;
}

export interface RemnantBlock {
  remnantId: string;
  width: number;
  length: number;
  originX: number;
  originY: number;
  parentCutId?: string;
  pileAngle: number;
}

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

export interface MasterRollCut {
  cutIndex: number;
  sectionName: string;
  rollStartPosition: number;
  rollEndPosition: number;
  length: number;
  width: number;
  sideCutRemnant?: RemnantBlock;
  nestedItems?: ItemPlacement[];
}

export interface TwoStageOptimizationResult {
  totalLinearLength: number;
  totalOrderedArea: number;
  wastePercentage: number;
  placements: ItemPlacement[];
  activeRemnants: RemnantBlock[];
  masterRollCuts: MasterRollCut[];
  accessories: AccessoryResult;
}

export interface RawSection {
  id: string;
  width: number;
  length: number;
}

export interface Piece {
  id: string;
  width: number;
  length: number; // Raw cut length (includes trim/bleed)
  isPlaced: boolean;
}

export interface EngineRemnant {
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
  activeRemnants: EngineRemnant[];
}

export interface CalculationResult {
  unit: UnitSystem;
  netAreaSqFt: number;
  netAreaSqYd: number;
  netAreaSqM: number;
  perimeterLinearFt: number;
  perimeterLinearM: number;
  stripsRequired: number;
  cutLengthPerStripFt: number;
  cutLengthPerStripM: number;
  totalLinearFt: number;
  totalLinearM: number;
  totalOrderedSqYd: number;
  totalOrderedSqM: number;
  seamLocations: number[];       // positions along width where seams occur
  strips: StripAllocation[];
  accessories: AccessoryResult;
  optimizationResult?: OptimizationResult;
  twoStageResult?: TwoStageOptimizationResult;
  nestingResult?: NestingResult;
}

export interface RoomTakeoffInput {
  projectId: string;
  roomId: string;
  roomName: string;
  geometry: {
    vertices: Point[];
  };
  constraints: {
    rollWidth: number;
    pileDirectionAngle: number;
    patternRepeat: {
      vertical: number;
      horizontal: number;
      matchType: PatternMatchType;
    };
    seamRules: {
      avoidPivotPoints: boolean;
      lightSourceVector: Point;
    };
  };
}
