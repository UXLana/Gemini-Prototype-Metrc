import React from 'react';
import { useAppColors } from '../hooks/useDarkMode';

export interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface StatsRowProps {
  title: string;
  stats: StatItem[];
  bottomMargin?: number;
}

export function StatsRow({ title, stats, bottomMargin = 56 }: StatsRowProps) {
  const colors = useAppColors();

  return (
    <div style={{ marginBottom: bottomMargin }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 8, paddingLeft: 2 }}>
        <h2 style={{ color: colors.text.lowEmphasis.onLight, fontSize: 12, fontWeight: 500, lineHeight: '16px', letterSpacing: '0.2px' }}>{title}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {stats.map(stat => (
          <div
            key={stat.label}
            className="card p-4 flex items-start gap-4 shrink-0 flex-1 min-w-[180px]"
            style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
          >
            <div className="p-2 rounded-lg" style={{ backgroundColor: colors.surface.lightDarker, color: colors.brand.default }}>{stat.icon}</div>
            <div>
              <p className="text-sm mb-1" style={{ color: colors.text.lowEmphasis.onLight }}>{stat.label}</p>
              <p className="text-2xl font-bold" style={{ color: colors.text.highEmphasis.onLight }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
