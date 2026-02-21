import React, { useState, useRef, useEffect } from 'react';
import { useAppColors, useDarkMode } from '../hooks/useDarkMode';
import {
  Home, Box, Puzzle, Settings, ChevronDown, X, Check
} from 'lucide-react';
import { UseCase, AppView, DotAnimation } from '../types';

interface RegistryLeftNavProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  useCase: UseCase;
  onUseCaseChange: (useCase: UseCase) => void;
  dotAnimation: DotAnimation;
  onDotAnimationChange: (v: DotAnimation) => void;
  logo?: React.ReactNode;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

export const RegistryLeftNav: React.FC<RegistryLeftNavProps> = ({
  isOpen,
  onClose,
  onToggle,
  useCase,
  onUseCaseChange,
  dotAnimation,
  onDotAnimationChange,
  logo,
  currentView,
  onViewChange,
}) => {
  const colors = useAppColors();

  return (
    <aside
      className={`
        flex flex-col z-50
        fixed inset-y-0 left-0
        transition-all duration-300 ease-in-out
        h-[100dvh] md:h-full overflow-hidden

        w-[85vw] sm:w-[50vw]
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}

        md:relative md:translate-x-0 md:shadow-none md:z-auto
        ${isOpen ? 'md:w-56' : 'md:w-[68px]'}
      `}
      style={{
        backgroundColor: colors.surface.light,
        borderRight: `1px solid ${colors.border.lowEmphasis.onLight}`
      }}
    >
      {/* Brand header */}
      <div className={`h-16 flex items-center shrink-0 ${isOpen ? 'px-4 justify-between md:justify-start gap-3' : 'justify-center'} mb-2`}>
        <div className="flex items-center gap-3">
          {logo ?? (
            <div
              className="w-8 h-8 rounded flex items-center justify-center font-bold text-lg shadow-sm shrink-0"
              style={{ backgroundColor: colors.brand.default, color: colors.text.highEmphasis.onDark }}
            >
              G
            </div>
          )}
          <div className={`overflow-hidden transition-all duration-300 flex flex-col justify-center ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden md:hidden'}`}>
            <h2 className="text-sm font-bold leading-none whitespace-nowrap" style={{ color: colors.text.highEmphasis.onLight }}>GCR</h2>
            <p className="text-[10px] mt-0.5 whitespace-nowrap" style={{ color: colors.text.lowEmphasis.onLight }}>Global Cannabis Registry</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 hover-surface rounded-lg md:hidden"
          style={{ color: colors.text.disabled.onLight }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        <NavItem icon={<Home size={20} />} label="Home" active={currentView === 'home'} collapsed={!isOpen} onClick={() => onViewChange('home')} />
        <NavItem icon={<Box size={20} />} label="Products" active={currentView === 'products'} collapsed={!isOpen} onClick={() => onViewChange('products')} />
        <NavItem icon={<Puzzle size={20} />} label="Integrations" active={currentView === 'integrations'} collapsed={!isOpen} onClick={() => onViewChange('integrations')} />
      </nav>

      {/* Footer */}
      <div
        className={`p-4 transition-all space-y-3 shrink-0 ${!isOpen ? 'flex flex-col items-center justify-center' : ''}`}
      >
        {isOpen ? (
          <ModeMenu useCase={useCase} onUseCaseChange={onUseCaseChange} />
        ) : (
          <button
            className="p-2 hover-surface rounded-lg"
            title="Settings"
            style={{ color: colors.text.lowEmphasis.onLight }}
          >
            <Settings size={20} />
          </button>
        )}
      </div>
    </aside>
  );
};

const MODE_OPTIONS: { value: UseCase; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'empty-search', label: 'Empty Search' },
  { value: 'market-selection', label: 'Market Select' },
];

function ModeMenu({ useCase, onUseCaseChange }: { useCase: UseCase; onUseCaseChange: (v: UseCase) => void }) {
  const colors = useAppColors();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = MODE_OPTIONS.find(o => o.value === useCase)!;

  return (
    <div ref={ref} className="relative">
      <label className="block text-[10px] font-medium tracking-wide mb-1.5 px-1" style={{ color: colors.text.lowEmphasis.onLight }}>
        Prototype Mode
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors"
        style={{
          color: colors.text.highEmphasis.onLight,
          backgroundColor: colors.hover.onLight,
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surface.lightDarker}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.hover.onLight}
      >
        <span>{current.label}</span>
        <ChevronDown
          size={14}
          style={{
            color: colors.text.lowEmphasis.onLight,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
          }}
        />
      </button>
      {open && (
        <div
          className="absolute bottom-full left-0 right-0 mb-1 rounded-lg overflow-hidden shadow-lg z-50"
          style={{
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}
        >
          {MODE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onUseCaseChange(opt.value); setOpen(false); }}
              className="flex items-center justify-between w-full px-3 py-2 text-xs transition-colors hover-surface"
              style={{
                color: opt.value === useCase ? colors.brand.default : colors.text.highEmphasis.onLight,
                fontWeight: opt.value === useCase ? 600 : 400,
              }}
            >
              <span>{opt.label}</span>
              {opt.value === useCase && <Check size={14} style={{ color: colors.brand.default }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const ANIM_OPTIONS: { value: DotAnimation; label: string }[] = [
  { value: 'pulse', label: 'Pulse' },
  { value: 'wind', label: 'Wind Drift' },
];

function AnimationMenu({ dotAnimation, onDotAnimationChange }: { dotAnimation: DotAnimation; onDotAnimationChange: (v: DotAnimation) => void }) {
  const colors = useAppColors();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = ANIM_OPTIONS.find(o => o.value === dotAnimation)!;

  return (
    <div ref={ref} className="relative">
      <label className="block text-[10px] font-medium tracking-wide mb-1.5 px-1" style={{ color: colors.text.lowEmphasis.onLight }}>
        Chat Animation
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors"
        style={{
          color: colors.text.highEmphasis.onLight,
          backgroundColor: colors.hover.onLight,
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surface.lightDarker}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.hover.onLight}
      >
        <span>{current.label}</span>
        <ChevronDown
          size={14}
          style={{
            color: colors.text.lowEmphasis.onLight,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
          }}
        />
      </button>
      {open && (
        <div
          className="absolute bottom-full left-0 right-0 mb-1 rounded-lg overflow-hidden shadow-lg z-50"
          style={{
            backgroundColor: colors.surface.light,
            border: `1px solid ${colors.border.lowEmphasis.onLight}`,
          }}
        >
          {ANIM_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onDotAnimationChange(opt.value); setOpen(false); }}
              className="flex items-center justify-between w-full px-3 py-2 text-xs transition-colors hover-surface"
              style={{
                color: opt.value === dotAnimation ? colors.brand.default : colors.text.highEmphasis.onLight,
                fontWeight: opt.value === dotAnimation ? 600 : 400,
              }}
            >
              <span>{opt.label}</span>
              {opt.value === dotAnimation && <Check size={14} style={{ color: colors.brand.default }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, collapsed, onClick }: { icon: React.ReactNode; label: string; active?: boolean; collapsed?: boolean; onClick?: () => void }) {
  const colors = useAppColors();
  const { isDark } = useDarkMode();

  const activeIconColor = isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)';
  const activeTextColor = isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)';

  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick?.(); }}
      className={`
        flex items-center text-sm font-medium rounded-lg transition-all duration-200 group relative
        ${!active ? 'hover-surface-subtle' : ''}
        ${collapsed ? 'justify-center w-10 h-10 mx-auto gap-0' : 'px-2 py-2 w-full gap-3'}
      `}
      style={{
        color: active ? activeTextColor : colors.text.lowEmphasis.onLight,
        backgroundColor: active ? colors.hover.onLight : undefined
      }}
      title={collapsed ? label : undefined}
    >
      <span className="shrink-0" style={active ? { color: activeIconColor } : undefined}>{icon}</span>
      <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
        {label}
      </span>
      {collapsed && (
        <div
          className="absolute left-full ml-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
          style={{ backgroundColor: colors.surface.darkDarker, color: colors.text.highEmphasis.onDark }}
        >
          {label}
        </div>
      )}
    </a>
  );
}
