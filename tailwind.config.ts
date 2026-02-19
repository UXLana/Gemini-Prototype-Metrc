import type { Config } from 'tailwindcss';

/**
 * GCR Prototype — Tailwind Configuration
 *
 * Color tokens sourced from MTR Design System (~/Desktop/code/styles/design-tokens.ts)
 * Follows mtr_sys_color_* taxonomy from Trace Design System v2.0 (Figma).
 *
 * Semantic status colors: important, warning, success, info
 * Each has: DEFAULT (status), surface, border, text, icon-bg, and action variants.
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
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#E8F5F1',
          100: '#DCFCE7',
          200: '#D1EBE5',
          300: '#a7f3d0',
          400: '#34d399',
          500: '#2D7A65',
          600: '#236351',
          700: '#1B4D3E',
          800: '#166534',
          850: '#065f46',
          900: '#064e3b',
          950: '#133D32',
        },

        // — MTR Semantic Status Tokens —

        important: {
          DEFAULT:        '#DC0C22',   // mtr_sys_color_important
          surface:        '#FDF2F3',   // mtr_sys_color_surface_important
          border:         '#F8CFD3',   // mtr_sys_color_surfaceBorder_important
          text:           '#C10B1E',   // mtr_sys_color_text_important
          'icon-bg':      '#FBE4E7',   // mtr_sys_color_iconBg_important
          action:         '#C10B1E',   // mtr_sys_color_action_important_enabled
          'action-hover': '#A20919',   // mtr_sys_color_action_important_hover
          'action-active':'#850715',   // mtr_sys_color_action_important_active
          badge:          '#E80D24',   // mtr_sys_color_badge_important
          'badge-light':  '#FFE3E7',   // mtr_sys_color_badge_importantLight
        },

        warning: {
          DEFAULT:        '#CC7300',   // mtr_sys_color_warning
          surface:        '#FCF6ED',   // mtr_sys_color_surface_warning
          border:         '#F2DABA',   // mtr_sys_color_surfaceBorder_warning
          text:           '#A35C00',   // mtr_sys_color_text_warning
          'icon-bg':      '#F9ECDC',   // mtr_sys_color_iconBg_warning
          light:          '#F3DCBD',   // mtr_sys_color_warningLight
          badge:          '#AD6200',   // mtr_sys_color_badge_warning
        },

        success: {
          DEFAULT:        '#1B7F66',   // mtr_sys_color_success
          surface:        '#EDF6F4',   // mtr_sys_color_surface_success
          border:         '#C5E2DB',   // mtr_sys_color_surfaceBorder_success
          text:           '#006B50',   // mtr_sys_color_text_success
          'icon-bg':      '#DEEDE9',   // mtr_sys_color_iconBg_success
          badge:          '#19856B',   // mtr_sys_color_badge_success
          'badge-light':  '#D9EDE6',   // mtr_sys_color_badge_successLight
        },

        info: {
          DEFAULT:        '#617BFF',   // mtr_sys_color_info
          surface:        '#F4F6FF',   // mtr_sys_color_surface_info
          border:         '#D1D9FF',   // mtr_sys_color_surfaceBorder_info
          'icon-bg':      '#EBEFFF',   // mtr_sys_color_iconBg_info
          badge:          '#4766FF',   // mtr_sys_color_badge_info
          'badge-light':  '#DBE2FF',   // mtr_sys_color_badge_infoLight
        },

        gray: {
          750: '#2d3748',
          850: '#1a202c',
          950: '#0d1117',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
