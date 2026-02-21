import React from 'react';
import { DotAnimation } from '../types';

interface DotGridProps {
  brandColor: string;
  animation?: DotAnimation;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { dot: 5, gap: 8, wind: 60, windDot: 4, windCenter: 6, windSpacing: 18, windDrift: 1 },
  md: { dot: 8, gap: 12, wind: 90, windDot: 6, windCenter: 9, windSpacing: 26, windDrift: 1.4 },
  lg: { dot: 10, gap: 14, wind: 120, windDot: 8, windCenter: 12, windSpacing: 34, windDrift: 1.8 },
};

export function DotGrid({ brandColor, animation = 'pulse', size = 'sm' }: DotGridProps) {
  return animation === 'wind'
    ? <DotGridWind brandColor={brandColor} size={size} />
    : <DotGridPulse brandColor={brandColor} size={size} />;
}

function DotGridPulse({ brandColor, size }: { brandColor: string; size: 'sm' | 'md' | 'lg' }) {
  const s = SIZES[size];
  const delays = [0.0, 0.3, 0.7, 0.15, 0.5, 0.85, 0.4, 0.65, 0.2];
  const durations = [1.8, 2.4, 1.6, 2.1, 1.4, 2.6, 1.9, 2.2, 1.7];

  return (
    <>
      <style>{`
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.8); opacity: 0.9; }
        }
      `}</style>
      <div className="grid grid-cols-3 mx-auto" style={{ width: 'fit-content', gap: s.gap }}>
        {delays.map((delay, i) => {
          const isBrand = i === 4;
          return (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: s.dot,
                height: s.dot,
                backgroundColor: brandColor,
                opacity: isBrand ? 1 : 0.25,
                animation: `dotPulse ${durations[i]}s ${delay}s ease-in-out infinite`,
              }}
            />
          );
        })}
      </div>
    </>
  );
}

function makeWindSeeds(spacing: number, drift: number) {
  return Array.from({ length: 9 }, (_, i) => ({
    x: (i % 3) * spacing - spacing,
    y: Math.floor(i / 3) * spacing - spacing,
    delay: [0, 0.4, 1.1, 0.7, 0, 1.5, 0.3, 0.9, 1.3][i],
    dur: [4, 5, 3.5, 4.5, 3, 5.5, 4.2, 3.8, 4.8][i],
    dx: [12, -8, 15, -10, 0, 14, -12, 9, -7][i] * drift,
    dy: [-6, 10, -8, 7, 0, -9, 8, -5, 11][i] * drift,
  }));
}

function DotGridWind({ brandColor, size }: { brandColor: string; size: 'sm' | 'md' | 'lg' }) {
  const s = SIZES[size];
  const seeds = makeWindSeeds(s.windSpacing, s.windDrift);

  const keyframes = seeds.map((d, i) => `
    @keyframes wind_${size}_${i} {
      0%   { transform: translate(0px, 0px); }
      15%  { transform: translate(${d.dx}px, ${d.dy}px); }
      35%  { transform: translate(${-d.dx * 0.8}px, ${d.dy * 1.2}px); }
      55%  { transform: translate(${d.dx * 0.6}px, ${-d.dy * 0.9}px); }
      75%  { transform: translate(${-d.dx * 0.4}px, ${-d.dy * 0.5}px); }
      100% { transform: translate(0px, 0px); }
    }
  `).join('\n');

  return (
    <>
      <style>{keyframes}</style>
      <div className="relative mx-auto" style={{ width: s.wind, height: s.wind }}>
        {seeds.map((d, i) => {
          const isCenter = i === 4;
          const dotSize = isCenter ? s.windCenter : s.windDot;
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: dotSize,
                height: dotSize,
                backgroundColor: brandColor,
                left: `calc(50% + ${d.x}px - ${dotSize / 2}px)`,
                top: `calc(50% + ${d.y}px - ${dotSize / 2}px)`,
                opacity: isCenter ? 0.9 : 0.35,
                animation: `wind_${size}_${i} ${d.dur}s ${d.delay}s ease-in-out infinite`,
              }}
            />
          );
        })}
      </div>
    </>
  );
}
