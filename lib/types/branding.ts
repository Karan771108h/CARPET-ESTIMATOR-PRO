export interface ContractorBranding {
  businessName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  logoDataUrl?: string; // base64 from FileReader
}

export interface ClientDetails {
  clientName: string;
  jobSiteAddress: string;
  quoteExpiryDate: string;
}

export interface PricingInputs {
  carpetPerSqYd: number;
  padPerSqFt: number;
  tacklessPerLinFt: number;
  seamTapePerLinFt: number;
  laborPerSqYd: number;
  taxRatePercent: number;
  includePricingOnPDF: boolean;
  calculateTax: boolean;
}

const LS_BRANDING_KEY = 'cep_branding';
const LS_CLIENT_KEY   = 'cep_client';
const LS_PRICING_KEY  = 'cep_pricing';

export const DEFAULT_BRANDING: ContractorBranding = {
  businessName: '',
  phone: '',
  email: '',
  licenseNumber: '',
  logoDataUrl: undefined,
};

export const DEFAULT_CLIENT: ClientDetails = {
  clientName: '',
  jobSiteAddress: '',
  quoteExpiryDate: '',
};

export const DEFAULT_PRICING: PricingInputs = {
  carpetPerSqYd: 0,
  padPerSqFt: 0,
  tacklessPerLinFt: 0,
  seamTapePerLinFt: 0,
  laborPerSqYd: 0,
  taxRatePercent: 0,
  includePricingOnPDF: false,
  calculateTax: false,
};

export function loadBranding(): ContractorBranding {
  if (typeof window === 'undefined') return DEFAULT_BRANDING;
  try {
    const raw = localStorage.getItem(LS_BRANDING_KEY);
    return raw ? { ...DEFAULT_BRANDING, ...JSON.parse(raw) } : DEFAULT_BRANDING;
  } catch { return DEFAULT_BRANDING; }
}

export function saveBranding(b: ContractorBranding): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_BRANDING_KEY, JSON.stringify(b));
}

export function loadClient(): ClientDetails {
  if (typeof window === 'undefined') return DEFAULT_CLIENT;
  try {
    const raw = localStorage.getItem(LS_CLIENT_KEY);
    return raw ? { ...DEFAULT_CLIENT, ...JSON.parse(raw) } : DEFAULT_CLIENT;
  } catch { return DEFAULT_CLIENT; }
}

export function saveClient(c: ClientDetails): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_CLIENT_KEY, JSON.stringify(c));
}

export function loadPricing(): PricingInputs {
  if (typeof window === 'undefined') return DEFAULT_PRICING;
  try {
    const raw = localStorage.getItem(LS_PRICING_KEY);
    return raw ? { ...DEFAULT_PRICING, ...JSON.parse(raw) } : DEFAULT_PRICING;
  } catch { return DEFAULT_PRICING; }
}

export function savePricing(p: PricingInputs): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_PRICING_KEY, JSON.stringify(p));
}
