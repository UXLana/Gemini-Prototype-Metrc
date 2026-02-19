import React, { useState } from 'react';

export type AvatarSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';
export type AvatarColor = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  color?: AvatarColor;
  focused?: boolean;
  onDark?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const sizes: Record<AvatarSize, string> = {
  xl: '96px', lg: '72px', md: '40px', sm: '32px', xs: '24px',
};

const typography: Record<AvatarSize, { fontSize: string; fontWeight: number }> = {
  xl: { fontSize: '36px', fontWeight: 600 },
  lg: { fontSize: '28px', fontWeight: 600 },
  md: { fontSize: '16px', fontWeight: 600 },
  sm: { fontSize: '14px', fontWeight: 600 },
  xs: { fontSize: '11px', fontWeight: 600 },
};

const borderRadii: Record<AvatarSize, string> = {
  xl: '24px', lg: '18px', md: '10px', sm: '8px', xs: '6px',
};

const bgColors: Record<AvatarColor, string> = {
  1: '#D6EAFF', 2: '#FFDBFA', 3: '#EFE0FF', 4: '#CFEFC2',
  5: '#BEF4ED', 6: '#FFE68F', 7: '#FFE3DB', 8: '#FFE2C2',
};

function getInitials(name: string): string {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function getColorFromName(name: string): AvatarColor {
  if (!name) return 1;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ((Math.abs(hash) % 8) + 1) as AvatarColor;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name = '',
  size = 'md',
  color,
  focused = false,
  onDark = false,
  onClick,
  className,
  style,
}) => {
  const [imageError, setImageError] = useState(false);

  const showImage = src && !imageError;
  const initials = getInitials(name);
  const avatarColor = color ?? getColorFromName(name);

  const baseStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sizes[size],
    height: sizes[size],
    borderRadius: borderRadii[size],
    overflow: 'hidden',
    flexShrink: 0,
    cursor: onClick ? 'pointer' : 'default',
    transition: '200ms ease-out',
    ...style,
  };

  const focusRingStyles: React.CSSProperties = {
    position: 'absolute',
    inset: '-4px',
    borderRadius: '9999px',
    border: '3px solid #3086BF',
    pointerEvents: 'none',
  };

  const darkBorderStyles: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: borderRadii[size],
    border: '2px solid #FFFFFF',
    pointerEvents: 'none',
  };

  return (
    <div
      className={className}
      style={baseStyles}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={alt || name || 'Avatar'}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColors[avatarColor],
          }}
        >
          <span
            style={{
              fontFamily: 'inherit',
              fontSize: typography[size].fontSize,
              fontWeight: typography[size].fontWeight,
              lineHeight: 1,
              color: 'rgba(0, 0, 0, 0.95)',
              userSelect: 'none',
            }}
          >
            {initials}
          </span>
        </div>
      )}
      {onDark && <div style={darkBorderStyles} />}
      {focused && <div style={focusRingStyles} />}
    </div>
  );
};

export default Avatar;
