import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { useColors } from 'mtr-design-system/styles/themes';
import type { ThemeColors } from 'mtr-design-system/styles/themes';

interface DarkModeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue>({ isDark: false, toggle: () => {} });

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

const tw = {
  gray50:  '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray850: '#1a202c',
  gray900: '#111827',
  gray950: '#0d1117',
  white:   '#ffffff',
};

function buildDarkOverrides(base: ThemeColors): ThemeColors {
  return {
    ...base,

    brand: { ...base.brand, default: base.brand.lighter },

    surface: {
      ...base.surface,
      light: tw.gray800,
      lightDarker: tw.gray900,
      disabled: {
        onLight: 'rgba(255, 255, 255, 0.05)',
        onDark: base.surface.disabled.onDark,
      },
    },

    text: {
      ...base.text,
      highEmphasis: { onLight: 'rgba(255, 255, 255, 0.95)', onDark: 'rgba(0, 0, 0, 0.95)' },
      lowEmphasis:  { onLight: tw.gray300, onDark: tw.gray600 },
      disabled:     { onLight: tw.gray400, onDark: tw.gray400 },
      important: '#F87171',
      warning: '#FBBF24',
      success: '#34D399',
    },

    border: {
      lowEmphasis: {
        onLight: tw.gray700,
        onDark: base.border.lowEmphasis.onDark,
        hover: { onLight: tw.gray600, onDark: base.border.lowEmphasis.hover.onDark },
      },
      midEmphasis: { onLight: tw.gray600, onDark: base.border.midEmphasis.onDark },
      highEmphasis: { onLight: tw.gray500, onDark: base.border.highEmphasis.onDark },
    },

    icon: {
      ...base.icon,
      enabled:  { onLight: tw.gray300, onDark: base.icon.enabled.onDark },
      hover:    { onLight: tw.gray200 },
      active:   { onLight: tw.gray100 },
      selected: { onLight: tw.white },
      disabled: { onLight: tw.gray600, onDark: base.icon.disabled.onDark },
      lowEmphasis: { enabled: { onLight: tw.gray500, onDark: base.icon.lowEmphasis.enabled.onDark } },
    },

    hover: { onLight: 'rgba(255, 255, 255, 0.12)', onDark: base.hover.onDark },
    selected: { onLight: 'rgba(255, 255, 255, 0.16)' },

    scrim: 'rgba(0, 0, 0, 0.7)',

    action: {
      ...base.action,
      monochrome: {
        ...base.action.monochrome,
        onLight: {
          ...base.action.monochrome.onLight,
          enabled: tw.gray300,
          hover: tw.gray200,
          active: tw.gray100,
          selected: tw.white,
          disabled: tw.gray600,
          bg: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },

    scrollbar: {
      enabled: { onLight: tw.gray600, onDark: base.scrollbar.enabled.onDark },
      hover:   { onLight: tw.gray500, onDark: base.scrollbar.hover.onDark },
      active:  { onLight: tw.gray400, onDark: base.scrollbar.active.onDark },
    },

    navItemText: {
      enabled: { onLight: tw.gray200, onDark: base.navItemText.enabled.onDark },
    },

    focusBorder: { onLight: base.brand.default, onDark: base.focusBorder.onDark },
  };
}

export function useAppColors(): ThemeColors {
  const base = useColors();
  const { isDark } = useDarkMode();
  return useMemo(() => isDark ? buildDarkOverrides(base) : base, [base, isDark]);
}
