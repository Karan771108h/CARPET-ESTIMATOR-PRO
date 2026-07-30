'use client';

import React from 'react';

export const PlainPatternSVG: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="6" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
    <path d="M0 10H40M0 20H40M0 30H40" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

export const StraightMatchSVG: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3.5" fill="#2563EB" />
    <circle cx="28" cy="12" r="3.5" fill="#2563EB" />
    <circle cx="12" cy="28" r="3.5" fill="#2563EB" />
    <circle cx="28" cy="28" r="3.5" fill="#2563EB" />
    <line x1="0" y1="20" x2="40" y2="20" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 2" />
  </svg>
);

export const HalfDropMatchSVG: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="6" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3.5" fill="#2563EB" />
    <circle cx="28" cy="20" r="3.5" fill="#2563EB" />
    <circle cx="12" cy="28" r="3.5" fill="#2563EB" />
    <line x1="20" y1="0" x2="20" y2="40" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 2" />
  </svg>
);
