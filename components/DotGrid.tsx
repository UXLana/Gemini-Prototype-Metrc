import React from 'react';
import { DotAnimation } from '../types';

interface DotGridProps {
  brandColor: string;
  animation?: DotAnimation;
}

export function DotGrid({ brandColor, animation = 'pulse' }: DotGridProps) {
  return animation === 'wind'
    ? <DotGridWind brandColor={brandColor} />
    : <DotGridPulse brandColor={brandColor} />;
}

function DotGridPulse({ brandColor }: { brandColor: string }) {
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
      <div className="grid grid-cols-3 gap-2 mx-auto" style={{ width: 'fit-content' }}>
        {delays.map((delay, i) => {
          const isBrand = i === 4;
          return (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 5,
                height: 5,
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

const WIND_SEEDS = Array.from({ length: 9 }, (_, i) => ({
  x: (i % 3) * 18 - 18,
  y: Math.floor(i / 3) * 18 - 18,
  delay: [0, 0.4, 1.1, 0.7, 0, 1.5, 0.3, 0.9, 1.3][i],
  dur: [4, 5, 3.5, 4.5, 3, 5.5, 4.2, 3.8, 4.8][i],
  dx: [12, -8, 15, -10, 0, 14, -12, 9, -7][i],
  dy: [-6, 10, -8, 7, 0, -9, 8, -5, 11][i],
}));

function DotGridWind({ brandColor }: { brandColor: string }) {
  const keyframes = WIND_SEEDS.map((d, i) => `
    @keyframes wind_${i} {
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
      <div className="relative mx-auto" style={{ width: 60, height: 60 }}>
        {WIND_SEEDS.map((d, i) => {
          const isCenter = i === 4;
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: isCenter ? 6 : 4,
                height: isCenter ? 6 : 4,
                backgroundColor: brandColor,
                left: `calc(50% + ${d.x}px - ${isCenter ? 3 : 2}px)`,
                top: `calc(50% + ${d.y}px - ${isCenter ? 3 : 2}px)`,
                opacity: isCenter ? 0.9 : 0.35,
                animation: `wind_${i} ${d.dur}s ${d.delay}s ease-in-out infinite`,
              }}
            />
          );
        })}
      </div>
    </>
  );
}
