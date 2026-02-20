import React from 'react';
import { useAppColors, useDarkMode } from '../hooks/useDarkMode';
import {
  Home, Box, Layers, Settings, ArrowUpDown, X
} from 'lucide-react';
import { UseCase } from '../App';

interface RegistryLeftNavProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  useCase: UseCase;
  onUseCaseChange: (useCase: UseCase) => void;
  logo?: React.ReactNode;
}

export const RegistryLeftNav: React.FC<RegistryLeftNavProps> = ({
  isOpen,
  onClose,
  onToggle,
  useCase,
  onUseCaseChange,
  logo,
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
        ${isOpen ? 'md:w-64' : 'md:w-[68px]'}
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
        <NavItem icon={<Home size={20} />} label="Home" collapsed={!isOpen} />
        <NavItem icon={<Box size={20} />} label="Products" active collapsed={!isOpen} />
        <NavItem icon={<Layers size={20} />} label="Integrations" collapsed={!isOpen} />
      </nav>

      {/* Footer */}
      <div
        className={`p-4 transition-all space-y-3 shrink-0 ${!isOpen ? 'flex flex-col items-center justify-center' : ''}`}
        style={{
          borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`,
          backgroundColor: colors.surface.lightDarker
        }}
      >
        {isOpen ? (
          <div className="space-y-2">
            <label className="form-label px-2" style={{ color: colors.text.lowEmphasis.onLight }}>Prototype Mode</label>
            <div className="relative">
              <select
                value={useCase}
                onChange={(e) => onUseCaseChange(e.target.value as UseCase)}
                className="form-select py-2 pl-3 pr-8 text-xs font-medium shadow-sm"
                style={{
                  backgroundColor: colors.surface.light,
                  borderColor: colors.border.midEmphasis.onLight,
                  color: colors.text.highEmphasis.onLight
                }}
              >
                <option value="standard">Standard</option>
                <option value="empty-search">Empty Search</option>
                <option value="market-selection">Market Select</option>
              </select>
              <div className="absolute right-2 top-2.5 pointer-events-none" style={{ color: colors.text.disabled.onLight }}>
                <ArrowUpDown size={12} />
              </div>
            </div>
          </div>
        ) : (
          <button
            className="p-2 hover-surface rounded-lg"
            title="Settings"
            style={{ color: colors.text.disabled.onLight }}
          >
            <Settings size={20} />
          </button>
        )}
      </div>
    </aside>
  );
};

function NavItem({ icon, label, active, collapsed }: { icon: React.ReactNode; label: string; active?: boolean; collapsed?: boolean }) {
  const colors = useAppColors();
  const { isDark } = useDarkMode();

  const activeIconColor = isDark ? '#2EE5D9' : '#F5FFFB';
  const activeTextColor = isDark ? '#25D094' : '#F5FFFB';

  return (
    <a
      href="#"
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
