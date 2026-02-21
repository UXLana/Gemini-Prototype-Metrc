import React from 'react';
import { useAppColors, useDarkMode } from '../hooks/useDarkMode';
import { Puzzle, Zap } from 'lucide-react';

export function IntegrationsPage() {
  const colors = useAppColors();
  const { isDark } = useDarkMode();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
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
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: colors.brand.default,
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,81,81,0.15)',
              }}
            >
              <Puzzle size={40} color="#fff" strokeWidth={1.5} />
            </div>

            {/* Floating Badge */}
            <div
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-sm border-2"
              style={{
                backgroundColor: colors.surface.light,
                borderColor: colors.surface.light,
              }}
            >
              <Zap size={16} style={{ color: '#F59E0B' }} fill="#F59E0B" />
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
        <p className="text-sm leading-relaxed text-balance" style={{ color: colors.text.lowEmphasis.onLight }}>
          Connect your registry with third-party platforms, compliance systems,
          and supply chain tools — all in one place.
        </p>
      </div>
    </div>
  );
}
