import React, { useEffect } from 'react';
import { useColors } from 'mtr-design-system/styles/themes';
import { AlertTriangle } from 'lucide-react';
import { Button } from 'mtr-design-system/components';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'warning' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  onConfirm,
  onCancel,
}) => {
  const colors = useColors();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const isDestructive = variant === 'destructive';
  const iconColor = isDestructive ? colors.status.important : colors.status.warning;
  const iconBgColor = isDestructive ? colors.iconBg.important : colors.iconBg.warning;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200"
      style={{ backgroundColor: `${colors.surface.light}99` }}
    >
      <div
        className="rounded-xl shadow-2xl border p-6 max-w-sm w-full"
        style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
      >
        <div className="flex gap-4 mb-5">
          <div
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: iconBgColor }}
          >
            <AlertTriangle size={20} style={{ color: iconColor }} />
          </div>
          <div className="pt-0.5">
            <h3 className="text-lg font-bold mb-1" style={{ color: colors.text.highEmphasis.onLight }}>{title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: colors.text.lowEmphasis.onLight }}>{description}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button emphasis="mid" onClick={onCancel} className="px-4 py-2">
            {cancelLabel}
          </Button>
          <Button emphasis="high" destructive onClick={onConfirm} className="px-4 py-2">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
