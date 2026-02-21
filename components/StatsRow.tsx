import React, { useState, useEffect } from 'react';
import { useAppColors } from '../hooks/useDarkMode';
import { ChevronDown } from 'lucide-react';

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
  const [expanded, setExpanded] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsSmall(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsSmall(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const showCards = !isSmall || expanded;

  return (
    <div style={{ marginBottom: bottomMargin }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 8, paddingLeft: 2 }}>
        <h2 style={{ color: colors.text.lowEmphasis.onLight, fontSize: 12, fontWeight: 500, lineHeight: '16px', letterSpacing: '0.2px' }}>{title}</h2>
        {isSmall && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: colors.brand.default }}
          >
            {expanded ? 'Collapse' : `View all (${stats.length})`}
            <ChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }} />
          </button>
        )}
      </div>
      {showCards && (
        <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {stats.map(stat => (
            <div
              key={stat.label}
              className="card p-4 flex items-start gap-4 shrink-0 flex-1 min-w-[180px]"
              style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
            >
              <div className="p-2 rounded-lg" style={{ backgroundColor: colors.surface.lightDarker, color: colors.text.disabled.onLight }}>{stat.icon}</div>
              <div>
                <p className="text-sm mb-1" style={{ color: colors.text.lowEmphasis.onLight }}>{stat.label}</p>
                <p className="text-2xl font-bold" style={{ color: colors.text.highEmphasis.onLight }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
