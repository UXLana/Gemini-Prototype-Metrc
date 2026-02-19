import React from 'react';

interface CanopyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const CanopyLogo: React.FC<CanopyLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`${sizeMap[size]} shrink-0 ${className}`}>
      <img
        src="/logo-light.png"
        alt="Canopy"
        className="w-full h-full object-contain dark:hidden"
      />
      <img
        src="/logo-dark.png"
        alt="Canopy"
        className="w-full h-full object-contain hidden dark:block"
      />
    </div>
  );
};
