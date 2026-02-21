import React from 'react';
import { useAppColors, useDarkMode } from '../hooks/useDarkMode';
import { Puzzle, Zap } from 'lucide-react';

export function IntegrationsPage() {
  const colors = useAppColors();
  const { isDark } = useDarkMode();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        {/* Illustration */}
        <div className="relative mx-auto mb-8 flex items-center justify-center" style={{ width: 160, height: 160 }}>
          {/* Main soft background */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,81,81,0.04)',
            }}
          />
          
          {/* Decorative dots */}
          <div className="absolute top-8 left-10 w-2 h-2 rounded-full" style={{ backgroundColor: colors.brand.default, opacity: 0.4 }} />
          <div className="absolute bottom-10 right-8 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.brand.default, opacity: 0.3 }} />
          <div className="absolute top-1/2 left-4 w-1 h-1 rounded-full" style={{ backgroundColor: colors.brand.default, opacity: 0.2 }} />

          {/* Central Element */}
          <div className="relative">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: isDark ? `${colors.brand.default}20` : colors.brand.default,
                border: `1.5px solid ${colors.brand.default}30`,
              }}
            >
              <Puzzle size={40} style={{ color: isDark ? colors.brand.default : '#fff', opacity: 0.6 }} strokeWidth={1.5} />
            </div>

            {/* Floating Badge */}
            <div
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center border"
              style={{
                backgroundColor: colors.surface.light,
                borderColor: colors.border.lowEmphasis.onLight,
              }}
            >
              <Zap size={14} style={{ color: colors.brand.default, opacity: 0.5 }} />
            </div>
          </div>
        </div>

        {/* Text content */}
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text.highEmphasis.onLight }}>
          Integrations
        </h1>
        <p className="text-sm font-medium mb-3 uppercase tracking-wider" style={{ color: colors.brand.default }}>
          Coming soon
        </p>
        <p className="text-sm leading-relaxed" style={{ color: colors.text.lowEmphasis.onLight, maxWidth: 480, margin: '0 auto' }}>
          Connect your registry with third-party platforms, compliance systems, and supply chain tools — all in one place.
        </p>
      </div>
    </div>
  );
}
