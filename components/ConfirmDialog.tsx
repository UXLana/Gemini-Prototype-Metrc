import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

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

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 max-w-sm w-full">
        <div className="flex gap-4 mb-5">
          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isDestructive
              ? 'bg-important-icon-bg dark:bg-important-surface'
              : 'bg-warning-icon-bg dark:bg-warning-surface'
          }`}>
            <AlertTriangle size={20} className={
              isDestructive
                ? 'text-important dark:text-important-text'
                : 'text-warning dark:text-warning-text'
            } />
          </div>
          <div className="pt-0.5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} className="px-4 py-2">
            {cancelLabel}
          </Button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-2xl text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-important-action hover:bg-important-action-hover focus:ring-important"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
