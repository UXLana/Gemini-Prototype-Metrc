import React, { useState, useEffect, useRef } from 'react';
import { useAppColors } from '../hooks/useDarkMode';
import { Package } from 'lucide-react';
import { Button } from 'mtr-design-system/components';

interface BundleNameModalProps {
  open: boolean;
  onContinue: (name: string) => void;
  onCancel: () => void;
}

export const BundleNameModal: React.FC<BundleNameModalProps> = ({ open, onContinue, onCancel }) => {
  const colors = useAppColors();
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
      if (e.key === 'Enter' && name.trim()) { e.preventDefault(); onContinue(name.trim()); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel, onContinue, name]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200"
      style={{ backgroundColor: colors.scrim }}
      onClick={onCancel}
    >
      <div
        className="rounded-xl shadow-2xl border p-6 max-w-md w-full"
        style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-4 mb-5">
          <div
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.surface.lightDarker }}
          >
            <Package size={20} style={{ color: colors.brand.default }} />
          </div>
          <div className="pt-0.5 flex-1">
            <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text.highEmphasis.onLight }}>Name your bundle</h3>
            <p className="text-sm leading-relaxed" style={{ color: colors.text.lowEmphasis.onLight }}>
              Give your bundle a name to get started.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Cannabis-Infused Gummies"
          className="form-input mb-5"
          style={{
            backgroundColor: colors.surface.light,
            borderColor: colors.border.midEmphasis.onLight,
            color: colors.text.highEmphasis.onLight,
          }}
        />

        <div className="flex justify-end gap-3">
          <Button emphasis="mid" onClick={onCancel}>
            Cancel
          </Button>
          <Button emphasis="high" onClick={() => onContinue(name.trim())} disabled={!name.trim()}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
