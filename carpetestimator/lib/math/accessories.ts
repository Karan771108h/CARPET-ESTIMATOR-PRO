import { AccessoryResult } from '../types/estimation';

/**
 * Calculates accessory requirements (underlay pad, tackless gripper strips, seam tape)
 * using the PDF formula specifications.
 */
export function calculateAccessories(
  netArea: number,
  netPerimeter: number,
  roomLength: number,
  stripsRequired: number
): AccessoryResult {
  // 1. Pad / Underlay Area: Net area + 5% safety buffer
  const padAreaRequired = netArea * 1.05;
  const padRollsNeeded = Math.ceil(padAreaRequired / 270.0); // 6ft x 45ft = 270 sq ft roll

  // 2. Tackless Strips / Gripper Rods: Perimeter minus doorways
  const tacklessStripsLinear = Math.max(0, netPerimeter);
  const tacklessPiecesNeeded = Math.ceil(tacklessStripsLinear / 4.0); // 4-ft wooden battens

  // 3. Hot-Melt Seam Tape: Total seam length + 10% overlap factor
  const totalSeamLength = Math.max(0, (stripsRequired - 1) * roomLength);
  const seamTapeLinear = totalSeamLength * 1.10;
  const seamTapeRollsNeeded = Math.ceil(seamTapeLinear / 66.0); // 66-ft standard roll

  return {
    padAreaRequired,
    padRollsNeeded,
    tacklessStripsLinear,
    tacklessPiecesNeeded,
    seamTapeLinear,
    seamTapeRollsNeeded,
  };
}
