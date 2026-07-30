import { Polygon, Point, CarpetSpec, StripCut, Remnant, SeamLine, OptimizationResult, AccessoryResult } from '../types/estimation';
import { calculateAccessories } from './accessories';

export class TakeoffOptimizer {
  private polygon: Polygon;
  private rollWidth: number;
  private verticalRepeat: number;
  private horizontalRepeat: number;
  private bleed: number;
  private matchType: 'none' | 'straight' | 'half-drop';
  private seamTrim: number;
  private lightSourceVector?: Point;
  private avoidPivotPoints: boolean;
  private wasteMultiplier: number;

  constructor(
    polygon: Polygon,
    rollWidth: number,
    verticalRepeat: number = 0,
    horizontalRepeat: number = 0,
    bleed: number = 0.25,
    matchType: 'none' | 'straight' | 'half-drop' = 'none',
    seamTrim: number = 0.1,
    lightSourceVector?: Point,
    avoidPivotPoints: boolean = false,
    wasteMultiplier: number = 0
  ) {
    this.polygon = polygon;
    this.rollWidth = rollWidth;
    this.verticalRepeat = verticalRepeat;
    this.horizontalRepeat = horizontalRepeat;
    this.bleed = bleed;
    this.matchType = matchType;
    this.seamTrim = seamTrim;
    this.lightSourceVector = lightSourceVector;
    this.avoidPivotPoints = avoidPivotPoints;
    this.wasteMultiplier = wasteMultiplier;
  }

  // T003: Polygon Bounding Box
  public getBoundingBox(poly: Polygon = this.polygon): { minX: number; maxX: number; minY: number; maxY: number } {
    const xs = poly.vertices.map(v => v.x);
    const ys = poly.vertices.map(v => v.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }

  // Polygon area calculation
  public calculatePolygonArea(poly: Polygon = this.polygon): number {
    let area = 0;
    const n = poly.vertices.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += poly.vertices[i].x * poly.vertices[j].y;
      area -= poly.vertices[j].x * poly.vertices[i].y;
    }
    return Math.abs(area / 2.0);
  }

  // Polygon perimeter calculation
  public calculatePolygonPerimeter(poly: Polygon = this.polygon): number {
    let perimeter = 0;
    const n = poly.vertices.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const dx = poly.vertices[j].x - poly.vertices[i].x;
      const dy = poly.vertices[j].y - poly.vertices[i].y;
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }
    return perimeter;
  }

  // T004 & T005: Vertical slab intersection and localized physical length & raw length calculation
  private getSlabYExtents(minX: number, maxX: number, poly: Polygon): { minY: number; maxY: number; minXInSlab: number; maxXInSlab: number } {
    const pointsInside: Point[] = [];
    const n = poly.vertices.length;
    const eps = 1e-4;

    // Sample interior vertical rays across slab [minX + eps, maxX - eps]
    const sampleXs = [
      minX + eps,
      (minX + maxX) / 2.0,
      maxX - eps
    ];

    for (const sx of sampleXs) {
      for (let i = 0; i < n; i++) {
        const p1 = poly.vertices[i];
        const p2 = poly.vertices[(i + 1) % n];

        if ((p1.x <= sx && p2.x >= sx) || (p1.x >= sx && p2.x <= sx)) {
          if (Math.abs(p2.x - p1.x) > 1e-7) {
            const t = (sx - p1.x) / (p2.x - p1.x);
            if (t >= 0 && t <= 1) {
              const y = p1.y + t * (p2.y - p1.y);
              pointsInside.push({ x: sx, y });
            }
          }
        }
      }
    }

    // Include poly vertices strictly inside (minX, maxX)
    for (let i = 0; i < n; i++) {
      const p = poly.vertices[i];
      if (p.x > minX + 1e-7 && p.x < maxX - 1e-7) {
        pointsInside.push(p);
      }
    }

    if (pointsInside.length === 0) {
      const bbox = this.getBoundingBox(poly);
      return { minY: bbox.minY, maxY: bbox.maxY, minXInSlab: minX, maxXInSlab: maxX };
    }

    const ys = pointsInside.map(p => p.y);
    return {
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
      minXInSlab: minX,
      maxXInSlab: maxX,
    };
  }

  // Rotate polygon vertices by 90 degrees
  private rotatePolygon90(poly: Polygon): Polygon {
    return {
      vertices: poly.vertices.map(v => ({ x: v.y, y: -v.x }))
    };
  }

  // T006, T007, T008, T009, T011, T012: Main layout evaluator
  public evaluateLayout(runAngle: 0 | 90): OptimizationResult {
    const targetPoly = runAngle === 90 ? this.rotatePolygon90(this.polygon) : this.polygon;
    const bbox = this.getBoundingBox(targetPoly);

    const widthDim = bbox.maxX - bbox.minX;
    const numStrips = Math.max(1, Math.ceil((widthDim - 1e-7) / this.rollWidth));

    let currentRollEnd = 0.0;
    const strips: StripCut[] = [];
    const remnants: Remnant[] = [];
    const seams: SeamLine[] = [];
    let totalSeamLength = 0;

    for (let i = 0; i < numStrips; i++) {
      const segmentMinX = bbox.minX + i * this.rollWidth;
      const segmentMaxX = Math.min(segmentMinX + this.rollWidth, bbox.maxX);

      const extents = this.getSlabYExtents(segmentMinX, segmentMaxX, targetPoly);
      const physicalStart = extents.minY;
      const physicalEnd = extents.maxY;
      const physicalLength = physicalEnd - physicalStart;
      const rawLen = physicalLength + 2 * this.bleed;

      // T008: Vertical Coordinate Offset Registration (Phase Target)
      let phaseTarget = 0.0;
      if (this.verticalRepeat > 0 && this.matchType !== 'none') {
        const roomYStart = physicalStart;
        if (this.matchType === 'straight') {
          phaseTarget = ((roomYStart - this.bleed) % this.verticalRepeat + this.verticalRepeat) % this.verticalRepeat;
        } else if (this.matchType === 'half-drop') {
          const dropShift = (i % 2) * (this.verticalRepeat / 2.0);
          phaseTarget = ((roomYStart - this.bleed + dropShift) % this.verticalRepeat + this.verticalRepeat) % this.verticalRepeat;
        }
      }

      // T006 & T007: Pattern penalty and continuous roll placement
      let patternPenalty = 0.0;
      if (this.matchType !== 'none' && this.verticalRepeat > 0) {
        patternPenalty = (phaseTarget - (currentRollEnd % this.verticalRepeat)) % this.verticalRepeat;
        if (patternPenalty < -1e-7) {
          patternPenalty += this.verticalRepeat;
        }
      }

      const rollStart = currentRollEnd + patternPenalty;
      const rollEnd = rollStart + rawLen;

      strips.push({
        cutIndex: i,
        associatedSection: `Section_${i + 1}`,
        width: this.rollWidth,
        physicalLength,
        rawLength: rawLen,
        rollStartPosition: rollStart,
        rollEndPosition: rollEnd,
        patternPenalty,
        yStart: physicalStart,
        yEnd: physicalEnd,
      });

      currentRollEnd = rollEnd;

      // T009: Side-cut remnant calculations
      const activeWidth = extents.maxXInSlab - extents.minXInSlab;
      const remnantWidth = this.rollWidth - activeWidth - this.seamTrim;
      if (remnantWidth > 0.5) { // Only track meaningful remnants > 0.5 ft
        remnants.push({
          remnantId: `remnant_strip_${i + 1}`,
          width: Number(remnantWidth.toFixed(2)),
          length: Number(rawLen.toFixed(2)),
          pileAngle: runAngle,
          patternOffset: { u: 0, v: phaseTarget }
        });
      }

      // Track seams and CRI compliance
      if (i > 0) {
        const seamX = segmentMinX;
        const seamLen = physicalLength;
        totalSeamLength += seamLen;

        let isCRICompliant = true;
        if (this.lightSourceVector) {
          const lightDx = this.lightSourceVector.x;
          const lightDy = this.lightSourceVector.y;
          const seamDy = runAngle === 0 ? 1 : 0;
          const seamDx = runAngle === 0 ? 0 : 1;
          const dot = Math.abs(seamDx * lightDx + seamDy * lightDy);
          const magLight = Math.sqrt(lightDx * lightDx + lightDy * lightDy);
          if (magLight > 0) {
            const cosAngle = dot / magLight;
            if (cosAngle < 0.707) { // Angle > 45 deg from parallel
              isCRICompliant = false;
            }
          }
        }

        seams.push({
          seamId: `seam_${i}`,
          startPoint: runAngle === 0 ? { x: seamX, y: physicalStart } : { x: physicalStart, y: -seamX },
          endPoint: runAngle === 0 ? { x: seamX, y: physicalEnd } : { x: physicalEnd, y: -seamX },
          isCRICompliant,
        });
      }
    }

    const netArea = this.calculatePolygonArea(this.polygon);
    const grossPerimeter = this.calculatePolygonPerimeter(this.polygon);
    const totalRollArea = currentRollEnd * this.rollWidth;
    const wastePercent = netArea > 0 ? ((totalRollArea - netArea) / totalRollArea) * 100 : 0;

    const accessories: AccessoryResult = calculateAccessories(
      netArea,
      grossPerimeter,
      currentRollEnd,
      numStrips
    );

    return {
      orientation: runAngle,
      totalLinearLength: Number(currentRollEnd.toFixed(2)),
      wastePercentage: Number(wastePercent.toFixed(2)),
      strips,
      seamLength: Number(totalSeamLength.toFixed(2)),
      seams,
      remnants,
      accessories,
    };
  }

  // T010: Remnant Nesting Validator
  public validateRemnantNesting(
    remnant: Remnant,
    targetWidth: number,
    targetLength: number,
    targetPileAngle: number
  ): { approved: boolean; reason?: string } {
    if (remnant.pileAngle !== targetPileAngle) {
      return { approved: false, reason: "Pile direction mismatch. Rotating remnants is strictly prohibited for directional carpet." };
    }

    const requiredWidth = targetWidth + 2 * this.bleed;
    const requiredLength = targetLength + 2 * this.bleed;

    if (requiredWidth > remnant.width || requiredLength > remnant.length) {
      return { approved: false, reason: `Target bounds (${requiredWidth.toFixed(2)}x${requiredLength.toFixed(2)}) exceed remnant usable size (${remnant.width}x${remnant.length}).` };
    }

    return { approved: true };
  }

  // T011: Dual Orientation Optimization (0 deg vs 90 deg)
  public optimize(): OptimizationResult {
    const result0 = this.evaluateLayout(0);
    const result90 = this.evaluateLayout(90);

    if (result0.totalLinearLength <= result90.totalLinearLength) {
      return result0;
    }
    return result90;
  }
}
