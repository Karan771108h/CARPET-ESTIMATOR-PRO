'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { CarpetSpec, Room } from '../../lib/types/estimation';
import { calculateEstimate } from '../../lib/math';
import { RoomForm } from './RoomForm';
import { CarpetForm } from './CarpetForm';
import { ResultsDisplay } from './ResultsDisplay';
import { StickyBar } from './StickyBar';
import { LicenseModal } from '../auth/LicenseModal';
import { ProposalPDF } from '../pdf/ProposalPDF';
import { generatePDFFromDOM } from '../../lib/pdf/generate';
import { ShieldCheck, HardHat, Calculator, ArrowLeft, LogOut } from 'lucide-react';
import { BrandingForm } from './BrandingForm';
import {
  ContractorBranding, ClientDetails, PricingInputs,
  DEFAULT_BRANDING, DEFAULT_CLIENT, DEFAULT_PRICING,
  loadBranding, loadClient, loadPricing,
} from '../../lib/types/branding';

export const EstimatorDashboard: React.FC<{ serverIsLicensed: boolean }> = ({ serverIsLicensed }) => {
  // Default Initial Room State
  const [room, setRoom] = useState<Room>({
    name: 'Main Room',
    unit: 'imperial',
    rectangles: [{ id: 'rect_1', name: 'Section 1', length: 20, width: 15 }],
    doorwaysCount: 1,
    doorwayWidth: 3,
  });

  // Default Initial Carpet Spec State (Roll width: 12, Waste: 10%, Pattern Match: None)
  const [carpetSpec, setCarpetSpec] = useState<CarpetSpec>({
    rollWidth: 12,
    patternType: 'none',
    verticalRepeat: 0,
    wasteFactorPercent: 10,
    trimAllowance: 0.5,
  });

  // Calculation trigger & Auth State
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [calculatedRoom, setCalculatedRoom] = useState<Room>(room);
  const [calculatedSpec, setCalculatedSpec] = useState<CarpetSpec>(carpetSpec);

  // Auth state seeded from server-rendered prop (no client fetch needed).
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(serverIsLicensed);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  // Branding / client / pricing — loaded from localStorage on mount
  const [branding, setBranding] = useState<ContractorBranding>(DEFAULT_BRANDING);
  const [clientDetails, setClientDetails] = useState<ClientDetails>(DEFAULT_CLIENT);
  const [pricing, setPricing] = useState<PricingInputs>(DEFAULT_PRICING);

  React.useEffect(() => {
    setBranding(loadBranding());
    setClientDetails(loadClient());
    setPricing(loadPricing());
  }, []);

  // Pure Math Calculation derived only when Calculate button is clicked
  const result = useMemo(() => {
    return calculateEstimate(calculatedRoom, calculatedSpec);
  }, [calculatedRoom, calculatedSpec]);

  const handleCalculateClick = () => {
    setCalculatedRoom(room);
    setCalculatedSpec(carpetSpec);
    setHasCalculated(true);
  };

  const handleGeneratePDFClick = () => {
    if (!isAuthenticated) {
      setIsLicenseModalOpen(true);
    } else {
      triggerPDFDownload();
    }
  };

  const triggerPDFDownload = async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePDFFromDOM('pdf-proposal-template', `Carpet_Proposal_${room.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleLicenseSuccess = () => {
    // Cookie was set server-side by /api/verify-license — no localStorage write needed
    setIsAuthenticated(true);
    setIsLicenseModalOpen(false);
    triggerPDFDownload();
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/thumbnail.png"
              alt="Carpet Estimator Pro Logo"
              className="w-9 h-9 rounded-xl shadow-xs object-cover border border-slate-200"
            />
            <div>
              <h1 className="text-base font-extrabold text-slate-900 leading-tight">
                Carpet Estimator Pro
              </h1>
              <p className="text-[11px] font-medium text-slate-500">
                Serverless • Broadloom & Pattern Calculator
              </p>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-4 h-4" />
                Pro Licensed Access
              </span>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/checkout"
                className="text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
              >
                Buy Pro Pass ($19)
              </Link>
              <button
                onClick={() => setIsLicenseModalOpen(true)}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
              >
                Enter Key
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area - Dynamic 2-column layout on desktop/laptop */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Room & Carpet Forms */}
          <div className="lg:col-span-5 space-y-6">
            <RoomForm room={room} onChange={setRoom} />
            <CarpetForm carpetSpec={carpetSpec} unit={room.unit} onChange={setCarpetSpec} />
            <BrandingForm
              branding={branding}
              clientDetails={clientDetails}
              pricing={pricing}
              onBrandingChange={setBranding}
              onClientChange={setClientDetails}
              onPricingChange={setPricing}
              unit={room.unit}
            />

            {/* Prominent Calculate Button */}
            <button
              type="button"
              onClick={handleCalculateClick}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Installation Estimate</span>
            </button>
          </div>

          {/* Right Column: Calculations & Results */}
          <div className="lg:col-span-7 lg:sticky lg:top-20">
            <ResultsDisplay
              room={calculatedRoom}
              carpetSpec={calculatedSpec}
              result={result}
              hasCalculated={hasCalculated}
              isLicensed={isAuthenticated}
              onUnlockClick={() => setIsLicenseModalOpen(true)}
              onGeneratePDF={handleGeneratePDFClick}
            />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar */}
      {hasCalculated && (
        <StickyBar
          result={result}
          isAuthenticated={isAuthenticated}
          onGeneratePDF={handleGeneratePDFClick}
        />
      )}

      {/* License Modal Dialog */}
      {isLicenseModalOpen && (
        <LicenseModal
          onClose={() => setIsLicenseModalOpen(false)}
          onSuccess={handleLicenseSuccess}
        />
      )}

      {/* Off-screen PDF template — only rendered when licensed to avoid wasted render */}
      {isAuthenticated && (
        <div className="hidden">
          <ProposalPDF
            id="pdf-proposal-template"
            room={room}
            carpetSpec={carpetSpec}
            result={result}
            branding={branding}
            clientDetails={clientDetails}
            pricing={pricing}
          />
        </div>
      )}
    </div>
  );
};
