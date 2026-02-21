import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { useColors } from 'mtr-design-system/styles/themes';
import type { ThemeColors } from 'mtr-design-system/styles/themes';

interface DarkModeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue>({
  isDark: false,
  toggle: () => {},
});

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') return document.documentElement.classList.contains('dark');
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const value = useMemo(() => ({
    isDark,
    toggle: () => setIsDark(prev => !prev),
  }), [isDark]);

  return <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>;
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}

const dark = {
  bg:         '#1e1e1e',
  panelBg:    '#181818',
  inputBg:    '#3c3c3c',
  border:     '#3c3c3c',
  hoverBg:    '#2a2d2e',
  selectedBg: '#37373d',
  fg:         '#cccccc',
  fgMuted:    '#858585',
  fgDim:      '#5a5a5a',
  white:      '#ffffff',
};

function buildDarkOverrides(base: ThemeColors): ThemeColors {
  return {
    ...base,

    brand: { ...base.brand, default: base.brand.lighter },

    surface: {
      ...base.surface,
      light: dark.bg,
      lightDarker: dark.panelBg,
      disabled: {
        onLight: 'rgba(255, 255, 255, 0.05)',
        onDark: base.surface.disabled.onDark,
      },
    },

    text: {
      ...base.text,
      highEmphasis: { onLight: dark.fg, onDark: 'rgba(0, 0, 0, 0.95)' },
      lowEmphasis:  { onLight: dark.fgMuted, onDark: '#4b5563' },
      disabled:     { onLight: dark.fgDim, onDark: '#9ca3af' },
      important: '#F87171',
      warning: '#FBBF24',
      success: '#34D399',
    },

    border: {
      lowEmphasis: {
        onLight: dark.border,
        onDark: base.border.lowEmphasis.onDark,
        hover: { onLight: dark.fgDim, onDark: base.border.lowEmphasis.hover.onDark },
      },
      midEmphasis: { onLight: dark.fgDim, onDark: base.border.midEmphasis.onDark },
      highEmphasis: { onLight: dark.fgMuted, onDark: base.border.highEmphasis.onDark },
    },

    icon: {
      ...base.icon,
      enabled:  { onLight: dark.fg, onDark: base.icon.enabled.onDark },
      hover:    { onLight: '#e0e0e0' },
      active:   { onLight: '#f5f5f5' },
      selected: { onLight: dark.white },
      disabled: { onLight: dark.fgDim, onDark: base.icon.disabled.onDark },
      lowEmphasis: { enabled: { onLight: dark.fgMuted, onDark: base.icon.lowEmphasis.enabled.onDark } },
    },

    hover: { onLight: dark.hoverBg, onDark: base.hover.onDark },
    selected: { onLight: dark.selectedBg },

    scrim: 'rgba(0, 0, 0, 0.7)',

    action: {
      ...base.action,
      monochrome: {
        ...base.action.monochrome,
        onLight: {
          ...base.action.monochrome.onLight,
          enabled: dark.fg,
          hover: '#e0e0e0',
          active: '#f5f5f5',
          selected: dark.white,
          disabled: dark.fgDim,
          bg: 'rgba(255, 255, 255, 0.06)',
        },
      },
    },

    scrollbar: {
      enabled: { onLight: dark.fgDim, onDark: base.scrollbar.enabled.onDark },
      hover:   { onLight: dark.fgMuted, onDark: base.scrollbar.hover.onDark },
      active:  { onLight: dark.fg, onDark: base.scrollbar.active.onDark },
    },

    navItemText: {
      enabled: { onLight: dark.fg, onDark: base.navItemText.enabled.onDark },
    },

    focusBorder: { onLight: base.brand.default, onDark: base.focusBorder.onDark },
  };
}

export function useAppColors(): ThemeColors {
  const base = useColors();
  const { isDark } = useDarkMode();
  return useMemo(() => isDark ? buildDarkOverrides(base) : base, [base, isDark]);
}
