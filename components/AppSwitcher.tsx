import React, { useState, useRef, useEffect } from 'react';
import { useAppColors, useDarkMode } from '../hooks/useDarkMode';
import { Check, ArrowRight } from 'lucide-react';
import { CanopyLogo } from './CanopyLogo';

interface AppDef {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const APPS: AppDef[] = [
  {
    id: 'metrc',
    label: 'Metrc',
    icon: null,
  },
  {
    id: 'retail-id',
    label: 'Retail ID',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="7" y="7" width="4" height="4" rx="0.5" fill="currentColor"/>
        <rect x="13" y="7" width="4" height="4" rx="0.5" fill="currentColor"/>
        <rect x="7" y="13" width="4" height="4" rx="0.5" fill="currentColor"/>
        <rect x="13" y="13" width="4" height="4" rx="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'global-registry',
    label: 'Global registry',
    icon: (
      <img src="/logo.png" alt="GCR" className="w-6 h-6 object-contain" />
    ),
  },
  {
    id: 'cano-pay',
    label: 'Cano Pay',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const CURRENT_APP = 'global-registry';

interface AppSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

export function AppSwitcher({ isOpen, onClose, anchorRef }: AppSwitcherProps) {
  const colors = useAppColors();
  const { isDark } = useDarkMode();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute z-[100] rounded-2xl overflow-hidden shadow-xl"
      style={{
        top: '100%',
        left: 0,
        marginTop: 8,
        width: 220,
        maxWidth: 'calc(100vw - 16px)',
        backgroundColor: colors.surface.light,
        border: `1px solid ${colors.border.lowEmphasis.onLight}`,
      }}
    >
      {/* Home row */}
      <button
        className="flex items-center gap-3 w-full px-4 py-3 transition-colors hover-surface"
      >
        <CanopyLogo size="sm" />
        <span className="text-sm font-semibold" style={{ color: colors.text.highEmphasis.onLight }}>
          Canopy
        </span>
        <ArrowRight size={14} style={{ color: colors.text.lowEmphasis.onLight }} />
        <span className="text-sm font-semibold" style={{ color: colors.text.highEmphasis.onLight }}>
          Home
        </span>
      </button>

      {/* App list */}
      <div className="py-1">
        {APPS.map(app => {
          const isActive = app.id === CURRENT_APP;
          return (
            <button
              key={app.id}
              className="flex items-center gap-3 w-full px-4 py-3 transition-colors hover-surface"
              style={{
                color: colors.text.highEmphasis.onLight,
              }}
            >
              <span className="shrink-0 w-6 h-6 flex items-center justify-center" style={{ opacity: isActive ? 1 : 0.7 }}>
                {app.id === 'metrc'
                  ? <img src={isDark ? '/metrc-logo-dark.png' : '/metrc-logo.png'} alt="Metrc" className="w-6 h-6 object-contain" />
                  : app.icon}
              </span>
              <span className="text-sm" style={{ fontWeight: 400 }}>
                {app.label}
              </span>
              {isActive && (
                <Check size={16} className="ml-auto" style={{ color: colors.text.lowEmphasis.onLight }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
