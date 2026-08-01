'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Building2, DollarSign } from 'lucide-react';
import { ContractorBranding, ClientDetails, PricingInputs, saveBranding, saveClient, savePricing } from '../../lib/types/branding';

interface BrandingFormProps {
  branding: ContractorBranding;
  clientDetails: ClientDetails;
  pricing: PricingInputs;
  onBrandingChange: (b: ContractorBranding) => void;
  onClientChange: (c: ClientDetails) => void;
  onPricingChange: (p: PricingInputs) => void;
  unit: 'imperial' | 'metric';
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500';

export const BrandingForm: React.FC<BrandingFormProps> = ({
  branding,
  clientDetails,
  pricing,
  onBrandingChange,
  onClientChange,
  onPricingChange,
  unit,
}) => {
  const [open, setOpen] = useState(false);
  const isImperial = unit === 'imperial';

  const setB = (patch: Partial<ContractorBranding>) => {
    const next = { ...branding, ...patch };
    onBrandingChange(next);
    saveBranding(next);
  };
  const setC = (patch: Partial<ClientDetails>) => {
    const next = { ...clientDetails, ...patch };
    onClientChange(next);
    saveClient(next);
  };
  const setP = (patch: Partial<PricingInputs>) => {
    const next = { ...pricing, ...patch };
    onPricingChange(next);
    savePricing(next);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setB({ logoDataUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-slate-900">Proposal & Company Settings</span>
          {branding.businessName && (
            <span className="text-xs text-slate-500 font-mono truncate max-w-[120px]">{branding.businessName}</span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-100 space-y-5 pt-4">

          {/* Company Branding */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Your Company</div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Business Name">
                <input className={inputCls} type="text" value={branding.businessName} onChange={e => setB({ businessName: e.target.value })} placeholder="Acme Carpet Co." />
              </Field>
              <Field label="License Number">
                <input className={inputCls} type="text" value={branding.licenseNumber} onChange={e => setB({ licenseNumber: e.target.value })} placeholder="LIC-12345" />
              </Field>
              <Field label="Phone">
                <input className={inputCls} type="tel" value={branding.phone} onChange={e => setB({ phone: e.target.value })} placeholder="(555) 000-0000" />
              </Field>
              <Field label="Email">
                <input className={inputCls} type="email" value={branding.email} onChange={e => setB({ email: e.target.value })} placeholder="info@company.com" />
              </Field>
            </div>
            <div className="mt-3">
              <Field label="Company Logo">
                <div className="flex items-center gap-3">
                  {branding.logoDataUrl && (
                    <img src={branding.logoDataUrl} alt="Logo" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                  )}
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                    {branding.logoDataUrl ? 'Change Logo' : 'Upload Logo'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                  {branding.logoDataUrl && (
                    <button type="button" onClick={() => setB({ logoDataUrl: undefined })} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  )}
                </div>
              </Field>
            </div>
          </div>

          {/* Client Details */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Client & Job Details</div>
            <div className="grid grid-cols-1 gap-3">
              <Field label="Client Name">
                <input className={inputCls} type="text" value={clientDetails.clientName} onChange={e => setC({ clientName: e.target.value })} placeholder="John Smith" />
              </Field>
              <Field label="Job-Site Address">
                <input className={inputCls} type="text" value={clientDetails.jobSiteAddress} onChange={e => setC({ jobSiteAddress: e.target.value })} placeholder="123 Main St, City, State" />
              </Field>
              <Field label="Quote Expiry Date">
                <input className={inputCls} type="date" value={clientDetails.quoteExpiryDate} onChange={e => setC({ quoteExpiryDate: e.target.value })} />
              </Field>
            </div>
          </div>

          {/* Pricing Inputs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing Rates</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label={`Carpet (${isImperial ? '$/sq yd' : '$/m²'})`}>
                <input className={inputCls} type="number" min="0" step="0.01" value={pricing.carpetPerSqYd || ''} onChange={e => setP({ carpetPerSqYd: parseFloat(e.target.value) || 0 })} placeholder="0.00" />
              </Field>
              <Field label={`Pad (${isImperial ? '$/sq ft' : '$/m²'})`}>
                <input className={inputCls} type="number" min="0" step="0.01" value={pricing.padPerSqFt || ''} onChange={e => setP({ padPerSqFt: parseFloat(e.target.value) || 0 })} placeholder="0.00" />
              </Field>
              <Field label={`Tackless (${isImperial ? '$/lin ft' : '$/m'})`}>
                <input className={inputCls} type="number" min="0" step="0.01" value={pricing.tacklessPerLinFt || ''} onChange={e => setP({ tacklessPerLinFt: parseFloat(e.target.value) || 0 })} placeholder="0.00" />
              </Field>
              <Field label={`Seam Tape (${isImperial ? '$/lin ft' : '$/m'})`}>
                <input className={inputCls} type="number" min="0" step="0.01" value={pricing.seamTapePerLinFt || ''} onChange={e => setP({ seamTapePerLinFt: parseFloat(e.target.value) || 0 })} placeholder="0.00" />
              </Field>
              <Field label={`Labor (${isImperial ? '$/sq yd' : '$/m²'})`}>
                <input className={inputCls} type="number" min="0" step="0.01" value={pricing.laborPerSqYd || ''} onChange={e => setP({ laborPerSqYd: parseFloat(e.target.value) || 0 })} placeholder="0.00" />
              </Field>
              <Field label="Tax Rate %">
                <input className={inputCls} type="number" min="0" max="30" step="0.1" value={pricing.taxRatePercent || ''} onChange={e => setP({ taxRatePercent: parseFloat(e.target.value) || 0 })} placeholder="0" />
              </Field>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setP({ calculateTax: !pricing.calculateTax })}
                  className={`relative w-9 h-5 rounded-full transition-colors ${pricing.calculateTax ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${pricing.calculateTax ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-xs font-medium text-slate-700">Calculate Sales Tax</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setP({ includePricingOnPDF: !pricing.includePricingOnPDF })}
                  className={`relative w-9 h-5 rounded-full transition-colors ${pricing.includePricingOnPDF ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${pricing.includePricingOnPDF ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-xs font-medium text-slate-700">Include Pricing on PDF Export</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
