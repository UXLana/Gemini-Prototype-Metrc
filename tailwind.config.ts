import type { Config } from 'tailwindcss';

/**
 * GCR Prototype — Tailwind Configuration
 *
 * All color tokens are now consumed from the MTR Design System via useColors()
 * and injected as CSS custom properties through ThemeBridge.
 *
 * Tailwind is used for layout, spacing, and typography utilities only.
 * Color is intentionally excluded to avoid drift with the design system.
 */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
