// ============================================================
// BUILDCORE ERP - LOGO COMPONENT
// ============================================================

import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon';
  theme?: 'light' | 'dark';
  className?: string;
}

export function Logo({ variant = 'full', theme = 'light', className = '' }: LogoProps) {
  const textColor = theme === 'dark' ? '#ffffff' : '#111827';
  const subColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

  if (variant === 'icon') {
    return (
      <svg viewBox="0 0 40 40" className={`w-10 h-10 ${className}`} fill="none">
        <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />
        <path d="M10 28L20 12L30 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 28L20 18L26 28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        <rect x="18" y="24" width="4" height="4" fill="white" opacity="0.8" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#2563eb" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
          <rect width="40" height="40" rx="10" fill="url(#logoGradC)" />
          <path d="M10 28L20 12L30 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 28L20 18L26 28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          <rect x="18" y="24" width="4" height="4" fill="white" opacity="0.8" />
          <defs>
            <linearGradient id="logoGradC" x1="0" y1="0" x2="40" y2="40">
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight" style={{ color: textColor }}>BuildCore</span>
          <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: subColor }}>ERP</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 44 44" className="w-11 h-11" fill="none">
        <rect width="44" height="44" rx="12" fill="url(#logoGradF)" />
        <path d="M11 30L22 12L33 30" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 30L22 18L29 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        <rect x="19.5" y="25.5" width="5" height="4.5" fill="white" opacity="0.8" rx="0.5" />
        <defs>
          <linearGradient id="logoGradF" x1="0" y1="0" x2="44" y2="44">
            <stop stopColor="#3b82f6" />
            <stop offset="0.5" stopColor="#2563eb" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col">
        <span className="text-xl font-bold leading-tight tracking-tight" style={{ color: textColor }}>
          Build<span style={{ color: '#2563eb' }}>Core</span>
        </span>
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: subColor }}>
          Enterprise ERP
        </span>
      </div>
    </div>
  );
}
