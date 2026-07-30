import { RawSection, Piece, EngineRemnant, PlacedCut, NestingResult, MasterRollCut, RemnantBlock, ItemPlacement, TwoStageOptimizationResult, AccessoryResult } from '../types/estimation';
import { calculateAccessories } from './accessories';

export class FlooringTakeoffEngine {
  private rollWidth: number;
  private bleed: number;
  private wasteFactorPercent: number;
  private pieces: Piece[] = [];
  private remnants: EngineRemnant[] = [];
  private placedCuts: PlacedCut[] = [];
  private currentRollLength: number = 0;

  constructor(rollWidth: number = 15.0, bleed: number = 0.25, wasteFactorPercent: number = 0) {
    this.rollWidth = rollWidth;
    this.bleed = bleed;
    this.wasteFactorPercent = wasteFactorPercent;
  }

  /**
   * STAGE 1: Pre-Slicing (Cleaving) & Trim Calculations
   * Splits sections wider than roll width into labeled parallel strips.
   * Applies bleed/trim allowance: L_cut = L_section + 2 * bleed
   */
  public prepareSections(sections: RawSection[]): void {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.pieces = [];

    for (const section of sections) {
      const rawLengthWithTrim = section.length + 2 * this.bleed;

      if (section.width > this.rollWidth + 1e-7) {
        // Section wider than roll — cleave into parallel strips
        const fullStripsCount = Math.floor(section.width / this.rollWidth);
        const remainderWidth = section.width % this.rollWidth;
        let partIndex = 0;

        for (let i = 0; i < fullStripsCount; i++) {
          const partLabel = alphabet[partIndex] ?? `${partIndex + 1}`;
          this.pieces.push({
            id: `${section.id} Part ${partLabel}`,
            width: this.rollWidth,
            length: Number(rawLengthWithTrim.toFixed(4)),
            isPlaced: false,
          });
          partIndex++;
        }

        if (remainderWidth > 0.1) {
          const partLabel = alphabet[partIndex] ?? `${partIndex + 1}`;
          this.pieces.push({
            id: `${section.id} Part ${partLabel}`,
            width: Number(remainderWidth.toFixed(4)),
            length: Number(rawLengthWithTrim.toFixed(4)),
            isPlaced: false,
          });
        }
      } else {
        // Section fits within roll width — single piece
        this.pieces.push({
          id: section.id,
          width: section.width,
          length: Number(rawLengthWithTrim.toFixed(4)),
          isPlaced: false,
        });
      }
    }
  }

  /**
   * STAGE 2: 2D Nesting Solver (Length-Descending Heuristic)
   * Prevents the Area-Sorting Trap by sorting strictly by L_cut descending.
   * Longer cuts processed first generate maximum-length side remnants that
   * can accommodate shorter pieces, eliminating unnecessary fresh roll cuts.
   */
  public solve(): NestingResult {
    this.remnants = [];
    this.placedCuts = [];
    this.currentRollLength = 0;

    // CRITICAL: Sort strictly by length descending — NOT area descending
    const sortedPieces = [...this.pieces].sort((a, b) => b.length - a.length);

    for (const piece of sortedPieces) {
      // Search active remnants for best-fit (minimum waste area)
      let bestRemnantIndex = -1;
      let minWasteArea = Infinity;

      for (let i = 0; i < this.remnants.length; i++) {
        const rem = this.remnants[i];
        if (piece.width <= rem.width + 1e-7 && piece.length <= rem.length + 1e-7) {
          const waste = rem.width * rem.length - piece.width * piece.length;
          if (waste < minWasteArea) {
            minWasteArea = waste;
            bestRemnantIndex = i;
          }
        }
      }

      if (bestRemnantIndex !== -1) {
        // Nest into existing remnant
        const rem = this.remnants[bestRemnantIndex];
        const placementOriginX = rem.originX ?? 0;
        const placementOriginY = rem.originY ?? 0;
        this.placedCuts.push({
          pieceId: piece.id,
          width: piece.width,
          length: piece.length,
          placedInRemnant: true,
          remnantId: rem.id,
          originX: placementOriginX,
          originY: placementOriginY,
        });
        this.splitRemnant(bestRemnantIndex, piece);
        piece.isPlaced = true;
      } else {
        // Fresh cut from master roll
        const rollStart = this.currentRollLength;
        const rollEnd = rollStart + piece.length;
        this.currentRollLength = rollEnd;

        this.placedCuts.push({
          pieceId: piece.id,
          width: piece.width,
          length: piece.length,
          placedInRemnant: false,
          rollStart: Number(rollStart.toFixed(4)),
          rollEnd: Number(rollEnd.toFixed(4)),
          originX: 0,
          originY: rollStart,
        });

        // Side off-cut remnant: W_rem = W_roll - W_piece
        const remWidth = this.rollWidth - piece.width;
        if (remWidth > 0.1) {
          this.remnants.push({
            id: `rem-from-${piece.id}`,
            width: Number(remWidth.toFixed(4)),
            length: piece.length,
            parentCutId: piece.id,
            originX: Number(piece.width.toFixed(4)),
            originY: rollStart,
          });
        }
        piece.isPlaced = true;
      }
    }

    const totalSqFt = this.currentRollLength * this.rollWidth;
    const totalSquareYards = totalSqFt / 9;

    return {
      totalLinearLength: Number(this.currentRollLength.toFixed(2)),
      totalSquareYards: Number(totalSquareYards.toFixed(2)),
      placedCuts: this.placedCuts,
      activeRemnants: this.remnants,
    };
  }

  /**
   * Build TwoStageOptimizationResult-compatible output from the nesting result.
   * Drives PDF master roll diagram and cut schedule with correct placements.
   */
  public buildTwoStageResult(
    nestingResult: NestingResult,
    netFloorArea: number,
    totalPerimeter: number
  ): TwoStageOptimizationResult {
    const placements: ItemPlacement[] = [];
    const masterRollCuts: MasterRollCut[] = [];

    // Build master roll cuts from fresh-cut placements
    const freshCuts = this.placedCuts.filter(c => !c.placedInRemnant);
    const freshCutMap = new Map<string, PlacedCut>();
    freshCuts.forEach(c => freshCutMap.set(c.pieceId, c));

    freshCuts.forEach((cut, idx) => {
      const vStart = cut.rollStart ?? 0;
      const vEnd = cut.rollEnd ?? 0;

      // Find if there's a side remnant from this cut
      const sideRem = this.remnants.find(r => r.parentCutId === cut.pieceId);

      let sideCutRemnant: RemnantBlock | undefined;
      if (sideRem) {
        sideCutRemnant = {
          remnantId: sideRem.id,
          width: Number(sideRem.width.toFixed(2)),
          length: Number(sideRem.length.toFixed(2)),
          originX: Number(cut.width.toFixed(2)),
          originY: vStart,
          parentCutId: cut.pieceId,
          pileAngle: 0,
        };
      }

      // Find nested items placed into remnants that came from this cut
      const nestedItems: ItemPlacement[] = this.placedCuts
        .filter(nc => nc.placedInRemnant && nc.remnantId?.includes(cut.pieceId))
        .map(nc => ({
          itemId: nc.pieceId,
          sectionName: nc.pieceId,
          placementType: 'nested_in_remnant' as const,
          placedWidth: Number(nc.width.toFixed(2)),
          placedLength: Number(nc.length.toFixed(2)),
          parentRemnantId: nc.remnantId,
          originX: Number((nc.originX ?? cut.width).toFixed(2)),
          originY: Number((nc.originY ?? vStart).toFixed(2)),
        }));

      masterRollCuts.push({
        cutIndex: idx,
        sectionName: cut.pieceId,
        rollStartPosition: Number(vStart.toFixed(2)),
        rollEndPosition: Number(vEnd.toFixed(2)),
        length: Number(cut.length.toFixed(2)),
        width: Number(cut.width.toFixed(2)),
        sideCutRemnant,
        nestedItems,
      });

      placements.push({
        itemId: cut.pieceId,
        sectionName: cut.pieceId,
        placementType: 'placed_on_roll',
        placedWidth: Number(cut.width.toFixed(2)),
        placedLength: Number(cut.length.toFixed(2)),
        rollStartPosition: Number(vStart.toFixed(2)),
        rollEndPosition: Number(vEnd.toFixed(2)),
        originX: 0,
        originY: vStart,
      });
    });

    // Add nested placements
    this.placedCuts
      .filter(c => c.placedInRemnant)
      .forEach(nc => {
        placements.push({
          itemId: nc.pieceId,
          sectionName: nc.pieceId,
          placementType: 'nested_in_remnant',
          placedWidth: Number(nc.width.toFixed(2)),
          placedLength: Number(nc.length.toFixed(2)),
          parentRemnantId: nc.remnantId,
          originX: 0,
          originY: 0,
        });
      });

    const totalLinear = nestingResult.totalLinearLength;
    const totalOrderedArea = totalLinear * this.rollWidth;
    const wastePercent = netFloorArea > 0 ? ((totalOrderedArea - netFloorArea) / totalOrderedArea) * 100 : 0;

    // Active remnants that are still unused after nesting
    const activeRemnants: RemnantBlock[] = this.remnants.map((r, i) => ({
      remnantId: r.id,
      width: Number(r.width.toFixed(2)),
      length: Number(r.length.toFixed(2)),
      originX: 0,
      originY: 0,
      parentCutId: r.parentCutId,
      pileAngle: 0,
    }));

    const accessories = calculateAccessories(
      netFloorArea,
      totalPerimeter,
      totalLinear,
      freshCuts.length
    );

    return {
      totalLinearLength: totalLinear,
      totalOrderedArea: Number(totalOrderedArea.toFixed(2)),
      wastePercentage: Number(wastePercent.toFixed(2)),
      placements,
      activeRemnants,
      masterRollCuts,
      accessories,
    };
  }

  /**
   * Guillotine split: removes the consumed remnant and replaces it with
   * right sub-remnant (W_rem - W_piece, L_piece) and bottom sub-remnant (W_rem, L_rem - L_piece).
   */
  private splitRemnant(remIndex: number, piece: Piece): void {
    const rem = this.remnants[remIndex];
    const parentOriginX = rem.originX ?? 0;
    const parentOriginY = rem.originY ?? 0;
    this.remnants.splice(remIndex, 1);

    const rightWidth = rem.width - piece.width;
    const bottomLength = rem.length - piece.length;

    if (rightWidth > 0.1) {
      this.remnants.push({
        id: `${rem.id}-right`,
        width: Number(rightWidth.toFixed(4)),
        length: piece.length,
        parentCutId: rem.parentCutId,
        originX: Number((parentOriginX + piece.width).toFixed(4)),
        originY: parentOriginY,
      });
    }

    if (bottomLength > 0.1) {
      this.remnants.push({
        id: `${rem.id}-bottom`,
        width: rem.width,
        length: Number(bottomLength.toFixed(4)),
        parentCutId: rem.parentCutId,
        originX: parentOriginX,
        originY: Number((parentOriginY + piece.length).toFixed(4)),
      });
    }
  }

  public getPieces(): Piece[] {
    return this.pieces;
  }
}
