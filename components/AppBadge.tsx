import React from 'react';
import { Badge } from 'mtr-design-system/components';
import { useDarkMode } from '../hooks/useDarkMode';

type BadgeProps = React.ComponentProps<typeof Badge>;

const darkStyles: Record<string, Record<string, React.CSSProperties>> = {
  neutral: {
    filled:   { backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'rgba(255, 255, 255, 0.85)', borderColor: 'transparent' },
    outlined: { backgroundColor: 'transparent', color: 'rgba(255, 255, 255, 0.70)', borderColor: 'rgba(255, 255, 255, 0.20)' },
    subtle:   { backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'rgba(255, 255, 255, 0.70)', borderColor: 'transparent' },
  },
  success: {
    filled:   { backgroundColor: 'rgba(52, 211, 153, 0.25)', color: '#6EE7B7', borderColor: 'transparent' },
    outlined: { backgroundColor: 'transparent', color: '#6EE7B7', borderColor: 'rgba(52, 211, 153, 0.40)' },
    subtle:   { backgroundColor: 'rgba(52, 211, 153, 0.12)', color: '#6EE7B7', borderColor: 'transparent' },
  },
  warning: {
    filled:   { backgroundColor: 'rgba(251, 191, 36, 0.25)', color: '#FCD34D', borderColor: 'transparent' },
    outlined: { backgroundColor: 'transparent', color: '#FCD34D', borderColor: 'rgba(251, 191, 36, 0.40)' },
    subtle:   { backgroundColor: 'rgba(251, 191, 36, 0.12)', color: '#FCD34D', borderColor: 'transparent' },
  },
  error: {
    filled:   { backgroundColor: 'rgba(248, 113, 113, 0.25)', color: '#FCA5A5', borderColor: 'transparent' },
    outlined: { backgroundColor: 'transparent', color: '#FCA5A5', borderColor: 'rgba(248, 113, 113, 0.40)' },
    subtle:   { backgroundColor: 'rgba(248, 113, 113, 0.12)', color: '#FCA5A5', borderColor: 'transparent' },
  },
  info: {
    filled:   { backgroundColor: 'rgba(129, 140, 248, 0.25)', color: '#A5B4FC', borderColor: 'transparent' },
    outlined: { backgroundColor: 'transparent', color: '#A5B4FC', borderColor: 'rgba(129, 140, 248, 0.40)' },
    subtle:   { backgroundColor: 'rgba(129, 140, 248, 0.12)', color: '#A5B4FC', borderColor: 'transparent' },
  },
  brand: {
    filled:   { backgroundColor: 'rgba(23, 151, 142, 0.25)', color: '#5EEAD4', borderColor: 'transparent' },
    outlined: { backgroundColor: 'transparent', color: '#5EEAD4', borderColor: 'rgba(23, 151, 142, 0.40)' },
    subtle:   { backgroundColor: 'rgba(23, 151, 142, 0.12)', color: '#5EEAD4', borderColor: 'transparent' },
  },
};

export const AppBadge: React.FC<BadgeProps> = ({ style, color = 'neutral', variant = 'filled', ...props }) => {
  const { isDark } = useDarkMode();
  const darkOverride = isDark ? darkStyles[color]?.[variant] : undefined;

  return (
    <Badge
      color={color}
      variant={variant}
      style={{ ...darkOverride, ...style }}
      {...props}
    />
  );
};
