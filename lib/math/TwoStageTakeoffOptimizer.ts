import {
  Rectangle,
  DecomposedCutItem,
  RemnantBlock,
  ItemPlacement,
  MasterRollCut,
  TwoStageOptimizationResult,
  AccessoryResult
} from '../types/estimation';
import { calculateAccessories } from './accessories';

export class TwoStageTakeoffOptimizer {
  private rollWidth: number;
  private bleed: number;
  private wasteMultiplier: number;

  constructor(rollWidth: number = 15.0, bleed: number = 0.25, wasteMultiplier: number = 0) {
    this.rollWidth = rollWidth;
    this.bleed = bleed;
    this.wasteMultiplier = wasteMultiplier;
  }

  /**
   * Stage 1: Geometric Piece Decomposition
   * Converts room rectangles into rectangular cut items with localized trim allowance.
   */
  public decomposeRectangles(rectangles: Rectangle[]): DecomposedCutItem[] {
    return rectangles.map((rect, idx) => {
      const cutW = rect.width;
      const cutL = rect.length + 2 * this.bleed;
      return {
        id: rect.id || `piece_${idx + 1}`,
        sectionName: rect.name || `Section ${idx + 1}`,
        pieceWidth: rect.width,
        pieceLength: rect.length,
        cutWidth: cutW,
        cutLength: cutL,
        area: cutW * cutL,
      };
    });
  }

  /**
   * Stage 2: 2D Remnant-Nesting Bin Packing Solver (Best-Fit Decreasing)
   */
  public optimize(rectangles: Rectangle[]): TwoStageOptimizationResult {
    const rawItems = this.decomposeRectangles(rectangles);

    // Sort items by area descending (Best-Fit Decreasing heuristic)
    const sortedItems = [...rawItems].sort((a, b) => b.area - a.area);

    const activeRemnants: RemnantBlock[] = [];
    const placements: ItemPlacement[] = [];
    const masterRollCuts: MasterRollCut[] = [];

    let currentRollEnd = 0.0;
    let netFloorArea = 0;
    let totalPerimeter = 0;

    rectangles.forEach(r => {
      netFloorArea += r.width * r.length;
      totalPerimeter += 2 * (r.width + r.length);
    });

    for (const item of sortedItems) {
      // a. Nesting Check: Search active remnants array for fitting candidates
      let bestRemnantIndex = -1;
      let minResidualWaste = Infinity;

      for (let rIdx = 0; rIdx < activeRemnants.length; rIdx++) {
        const rem = activeRemnants[rIdx];
        if (item.cutWidth <= rem.width + 1e-7 && item.cutLength <= rem.length + 1e-7) {
          const residualWaste = rem.width * rem.length - item.cutWidth * item.cutLength;
          if (residualWaste < minResidualWaste) {
            minResidualWaste = residualWaste;
            bestRemnantIndex = rIdx;
          }
        }
      }

      if (bestRemnantIndex !== -1) {
        // b. Place in Remnant (Best-Fit) & Guillotine Split
        const matchedRemnant = activeRemnants.splice(bestRemnantIndex, 1)[0];

        placements.push({
          itemId: item.id,
          sectionName: item.sectionName,
          placementType: 'nested_in_remnant',
          placedWidth: item.cutWidth,
          placedLength: item.cutLength,
          parentRemnantId: matchedRemnant.remnantId,
          originX: matchedRemnant.originX,
          originY: matchedRemnant.originY,
        });

        // Find parent master roll cut to track nested item
        if (matchedRemnant.parentCutId) {
          const parentCut = masterRollCuts.find(c => c.sectionName === matchedRemnant.parentCutId || `cut_${c.cutIndex + 1}` === matchedRemnant.parentCutId);
          if (parentCut) {
            if (!parentCut.nestedItems) parentCut.nestedItems = [];
            parentCut.nestedItems.push({
              itemId: item.id,
              sectionName: item.sectionName,
              placementType: 'nested_in_remnant',
              placedWidth: item.cutWidth,
              placedLength: item.cutLength,
              parentRemnantId: matchedRemnant.remnantId,
              originX: matchedRemnant.originX,
              originY: matchedRemnant.originY,
            });
          }
        }

        // Guillotine Split strategy:
        // Sub-remnant 1 (Right): width = W_rem - W_cut, length = L_cut
        const rightWidth = matchedRemnant.width - item.cutWidth;
        const rightLength = item.cutLength;
        if (rightWidth > 0.1) {
          activeRemnants.push({
            remnantId: `remnant_split_right_${matchedRemnant.remnantId}_${item.id}`,
            width: Number(rightWidth.toFixed(2)),
            length: Number(rightLength.toFixed(2)),
            originX: Number((matchedRemnant.originX + item.cutWidth).toFixed(2)),
            originY: matchedRemnant.originY,
            parentCutId: matchedRemnant.parentCutId,
            pileAngle: 0,
          });
        }

        // Sub-remnant 2 (Top): width = W_rem, length = L_rem - L_cut
        const topWidth = matchedRemnant.width;
        const topLength = matchedRemnant.length - item.cutLength;
        if (topLength > 0.1) {
          activeRemnants.push({
            remnantId: `remnant_split_top_${matchedRemnant.remnantId}_${item.id}`,
            width: Number(topWidth.toFixed(2)),
            length: Number(topLength.toFixed(2)),
            originX: matchedRemnant.originX,
            originY: Number((matchedRemnant.originY + item.cutLength).toFixed(2)),
            parentCutId: matchedRemnant.parentCutId,
            pileAngle: 0,
          });
        }

      } else {
        // c. Place on Main Roll (Fresh Cut)
        const vStart = currentRollEnd;
        const vEnd = vStart + item.cutLength;
        currentRollEnd = vEnd;

        const cutIndex = masterRollCuts.length;
        const parentCutId = `cut_${cutIndex + 1}`;

        placements.push({
          itemId: item.id,
          sectionName: item.sectionName,
          placementType: 'placed_on_roll',
          placedWidth: item.cutWidth,
          placedLength: item.cutLength,
          rollStartPosition: vStart,
          rollEndPosition: vEnd,
          originX: 0,
          originY: vStart,
        });

        // Calculate side off-cut remnant
        const newRemWidth = this.rollWidth - item.cutWidth;
        const newRemLength = item.cutLength;
        let sideCutRem: RemnantBlock | undefined;

        if (newRemWidth > 0.1) {
          sideCutRem = {
            remnantId: `remnant_${parentCutId}`,
            width: Number(newRemWidth.toFixed(2)),
            length: Number(newRemLength.toFixed(2)),
            originX: Number(item.cutWidth.toFixed(2)),
            originY: vStart,
            parentCutId,
            pileAngle: 0,
          };
          activeRemnants.push(sideCutRem);
        }

        masterRollCuts.push({
          cutIndex,
          sectionName: item.sectionName,
          rollStartPosition: vStart,
          rollEndPosition: vEnd,
          length: item.cutLength,
          width: item.cutWidth,
          sideCutRemnant: sideCutRem,
          nestedItems: [],
        });
      }
    }

    const totalOrderedArea = currentRollEnd * this.rollWidth;
    const wastePercent = netFloorArea > 0 ? ((totalOrderedArea - netFloorArea) / totalOrderedArea) * 100 : 0;

    const accessories: AccessoryResult = calculateAccessories(
      netFloorArea,
      totalPerimeter,
      currentRollEnd,
      masterRollCuts.length
    );

    return {
      totalLinearLength: Number(currentRollEnd.toFixed(2)),
      totalOrderedArea: Number(totalOrderedArea.toFixed(2)),
      wastePercentage: Number(wastePercent.toFixed(2)),
      placements,
      activeRemnants,
      masterRollCuts,
      accessories,
    };
  }
}
