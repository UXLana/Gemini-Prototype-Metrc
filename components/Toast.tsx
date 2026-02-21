import React, { useEffect } from 'react';
import { useAppColors, useDarkMode } from '../hooks/useDarkMode';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  const colors = useAppColors();
  const { isDark } = useDarkMode();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bg = isDark ? colors.surface.light : colors.surface.darkDarker;
  const fg = isDark ? colors.text.highEmphasis.onLight : colors.text.highEmphasis.onDark;
  const fgMuted = isDark ? colors.text.lowEmphasis.onLight : colors.text.lowEmphasis.onDark;
  const border = isDark ? colors.border.lowEmphasis.onLight : colors.border.lowEmphasis.onDark;
  const checkFg = isDark ? colors.text.highEmphasis.onDark : colors.text.highEmphasis.onDark;

  return (
    <div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 min-w-[300px] justify-between"
      style={{
        backgroundColor: bg,
        color: fg,
        border: `1px solid ${border}`
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: colors.brand.default }}
        >
            <Check size={14} style={{ color: checkFg }} strokeWidth={3} />
        </div>
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="transition-colors p-1"
        style={{ color: fgMuted }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
