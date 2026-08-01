import { CalculationResult } from '../types/estimation';
import { PricingInputs } from '../types/branding';

export interface PricingLineItem {
  label: string;
  qty: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface PricingResult {
  lines: PricingLineItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
}

export function calculatePricing(
  result: CalculationResult,
  pricing: PricingInputs
): PricingResult {
  const isImperial = result.unit === 'imperial';

  const lines: PricingLineItem[] = [];

  // Carpet
  if (pricing.carpetPerSqYd > 0) {
    const qty = isImperial ? result.totalOrderedSqYd : result.totalOrderedSqM;
    const unit = isImperial ? 'sq yd' : 'm²';
    lines.push({ label: 'Broadloom Carpet', qty, unit, unitPrice: pricing.carpetPerSqYd, total: qty * pricing.carpetPerSqYd });
  }

  // Pad
  if (pricing.padPerSqFt > 0) {
    const qty = result.accessories.padAreaRequired;
    const unit = isImperial ? 'sq ft' : 'm²';
    lines.push({ label: 'Underlayment / Pad', qty, unit, unitPrice: pricing.padPerSqFt, total: qty * pricing.padPerSqFt });
  }

  // Tackless
  if (pricing.tacklessPerLinFt > 0) {
    const qty = result.accessories.tacklessStripsLinear;
    const unit = isImperial ? 'lin ft' : 'm';
    lines.push({ label: 'Tackless Strips', qty, unit, unitPrice: pricing.tacklessPerLinFt, total: qty * pricing.tacklessPerLinFt });
  }

  // Seam tape
  if (pricing.seamTapePerLinFt > 0) {
    const qty = result.accessories.seamTapeLinear;
    const unit = isImperial ? 'lin ft' : 'm';
    lines.push({ label: 'Hot-Melt Seam Tape', qty, unit, unitPrice: pricing.seamTapePerLinFt, total: qty * pricing.seamTapePerLinFt });
  }

  // Labor
  if (pricing.laborPerSqYd > 0) {
    const qty = isImperial ? result.totalOrderedSqYd : result.totalOrderedSqM;
    const unit = isImperial ? 'sq yd' : 'm²';
    lines.push({ label: 'Installation Labor', qty, unit, unitPrice: pricing.laborPerSqYd, total: qty * pricing.laborPerSqYd });
  }

  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const taxAmount = pricing.calculateTax ? subtotal * (pricing.taxRatePercent / 100) : 0;
  const grandTotal = subtotal + taxAmount;

  return { lines, subtotal, taxAmount, grandTotal };
}
