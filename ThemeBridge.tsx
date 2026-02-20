/**
 * ThemeBridge — Injects MTR Design System color tokens as CSS custom properties.
 *
 * This lets CSS pseudo-states (hover, focus, placeholder) reference theme colors
 * without hardcoded Tailwind color utilities. Static colors should still be applied
 * inline via useAppColors() for best type-safety.
 *
 * Usage: Wrap your app inside ThemeBridge (must be inside ThemeProvider).
 */
import { useEffect } from 'react';
import { useAppColors } from './hooks/useDarkMode';
import type { ReactNode } from 'react';

export function ThemeBridge({ children }: { children: ReactNode }) {
  const colors = useAppColors();

  useEffect(() => {
    const root = document.documentElement;

    // Brand
    root.style.setProperty('--mtr-brand-default', colors.brand.default);
    root.style.setProperty('--mtr-brand-darker', colors.brand.darker);
    root.style.setProperty('--mtr-brand-lighter', colors.brand.lighter);

    // Surfaces
    root.style.setProperty('--mtr-surface-light', colors.surface.light);
    root.style.setProperty('--mtr-surface-lightDarker', colors.surface.lightDarker);
    root.style.setProperty('--mtr-surface-dark', colors.surface.dark);
    root.style.setProperty('--mtr-surface-darkDarker', colors.surface.darkDarker);

    // Text
    root.style.setProperty('--mtr-text-highEmphasis-onLight', colors.text.highEmphasis.onLight);
    root.style.setProperty('--mtr-text-highEmphasis-onDark', colors.text.highEmphasis.onDark);
    root.style.setProperty('--mtr-text-lowEmphasis-onLight', colors.text.lowEmphasis.onLight);
    root.style.setProperty('--mtr-text-lowEmphasis-onDark', colors.text.lowEmphasis.onDark);
    root.style.setProperty('--mtr-text-disabled-onLight', colors.text.disabled.onLight);
    root.style.setProperty('--mtr-text-disabled-onDark', colors.text.disabled.onDark);

    // Borders
    root.style.setProperty('--mtr-border-lowEmphasis-onLight', colors.border.lowEmphasis.onLight);
    root.style.setProperty('--mtr-border-midEmphasis-onLight', colors.border.midEmphasis.onLight);
    root.style.setProperty('--mtr-border-highEmphasis-onLight', colors.border.highEmphasis.onLight);

    // Interactive states
    root.style.setProperty('--mtr-hover-onLight', colors.hover.onLight);
    root.style.setProperty('--mtr-hover-onDark', colors.hover.onDark);
    root.style.setProperty('--mtr-focusBorder-onLight', colors.focusBorder.onLight);

    // Scrim
    root.style.setProperty('--mtr-scrim', colors.scrim);
  }, [colors]);

  return <>{children}</>;
}
