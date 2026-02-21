import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { useColors } from 'mtr-design-system/styles/themes';
import type { ThemeColors } from 'mtr-design-system/styles/themes';

const fallbackTheme: ThemeColors = {
  brand: { default: '#17978E', lighter: '#5EEAD4', darker: '#134E4A' },
  surface: {
    light: '#ffffff',
    lightDarker: '#F9FAFB',
    dark: '#1e1e1e',
    darkDarker: '#181818',
    disabled: { onLight: '#f3f4f6', onDark: '#374151' }
  },
  text: {
    highEmphasis: { onLight: '#111827', onDark: '#f9fafb' },
    lowEmphasis: { onLight: '#6b7280', onDark: '#9ca3af' },
    disabled: { onLight: '#9ca3af', onDark: '#6b7280' },
    important: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981'
  },
  border: {
    lowEmphasis: { onLight: '#e5e7eb', onDark: '#374151', hover: { onLight: '#d1d5db', onDark: '#4b5563' } },
    midEmphasis: { onLight: '#d1d5db', onDark: '#4b5563' },
    highEmphasis: { onLight: '#9ca3af', onDark: '#6b7280' }
  },
  icon: {
    enabled: { onLight: '#4b5563', onDark: '#9ca3af' },
    hover: { onLight: '#111827' },
    active: { onLight: '#000000' },
    selected: { onLight: '#17978E' },
    disabled: { onLight: '#d1d5db', onDark: '#4b5563' },
    lowEmphasis: { enabled: { onLight: '#9ca3af', onDark: '#6b7280' } }
  },
  hover: { onLight: '#f3f4f6', onDark: '#374151' },
  selected: { onLight: '#e5e7eb' },
  scrim: 'rgba(0, 0, 0, 0.5)',
  action: {
    monochrome: {
      onLight: {
        enabled: '#4b5563',
        hover: '#111827',
        active: '#000000',
        selected: '#17978E',
        disabled: '#d1d5db',
        bg: 'transparent'
      }
    }
  },
  scrollbar: {
    enabled: { onLight: '#d1d5db', onDark: '#4b5563' },
    hover: { onLight: '#9ca3af', onDark: '#6b7280' },
    active: { onLight: '#6b7280', onDark: '#9ca3af' }
  },
  navItemText: {
    enabled: { onLight: '#4b5563', onDark: '#9ca3af' }
  },
  focusBorder: { onLight: '#17978E', onDark: '#5EEAD4' }
} as ThemeColors;

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
  if (!base) return fallbackTheme;
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
  const base = useColors() || fallbackTheme;
  const { isDark } = useDarkMode();
  return useMemo(() => isDark ? buildDarkOverrides(base) : base, [base, isDark]);
}
