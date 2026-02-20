import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useAppColors } from '../hooks/useDarkMode';

interface UploadedFile {
  name: string;
  size: string;
  thumb: string;
}

interface CustomerPreviewProps {
  formData: {
    name: string;
    brand: string;
    category: string;
    subspecies: string;
    strain: string;
    potency: string;
    feelings: string[];
    description: string;
    markets: string[];
  };
  images: UploadedFile[];
  activeImage: string;
  onImageChange: (thumb: string) => void;
}

export const CustomerPreview: React.FC<CustomerPreviewProps> = ({
  formData,
  images,
  activeImage,
  onImageChange,
}) => {
  const colors = useAppColors();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length <= 1) return;
    const currentIndex = images.findIndex(f => f.thumb === activeImage);
    const nextIndex = (currentIndex + 1) % images.length;
    onImageChange(images[nextIndex].thumb);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length <= 1) return;
    const currentIndex = images.findIndex(f => f.thumb === activeImage);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    onImageChange(images[prevIndex].thumb);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNextImage();
    if (distance < -50) handlePrevImage();
  };

  /*
   * CustomerPreview is an intentionally light-only "iPhone mock" preview card.
   * Colors here are deliberately hardcoded to simulate a white consumer UI,
   * independent of the app theme. This is a design choice, not a migration gap.
   * We still use the colors hook for brand accent colors.
   */

  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-4">
        <h2 className="text-base font-semibold mb-0.5" style={{ color: colors.text.highEmphasis.onLight }}>Customer preview</h2>
        <p className="text-xs" style={{ color: colors.text.lowEmphasis.onLight }}>Product information people see when they scan the barcode</p>
      </div>

      {/* iPhone-style Preview Card — intentionally light-only with fixed colors */}
      <div
        className="rounded-[24px] border overflow-hidden flex flex-col"
        style={{ backgroundColor: '#FFFFFF', borderColor: colors.border.lowEmphasis.onLight }}
      >
        <div className="p-6 pb-3">
          <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: colors.text.lowEmphasis.onLight }}>{formData.brand || 'BRAND'}</p>
          <h3 className="text-base font-semibold leading-tight" style={{ color: colors.text.highEmphasis.onLight }}>{formData.name || 'Product Name'}</h3>
          <p className="text-[10px] mt-1" style={{ color: colors.text.lowEmphasis.onLight }}>Count: 10</p>
        </div>

        <div className="px-6 mb-4 relative flex flex-col items-center group">
          <div
            className="w-full aspect-[1/0.85] rounded-xl overflow-hidden mb-4 border relative isolate"
            style={{ backgroundColor: colors.surface.lightDarker, borderColor: colors.border.lowEmphasis.onLight }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {images.length > 0 ? (
              images.map((file) => (
                <img
                  key={file.thumb}
                  src={file.thumb}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${activeImage === file.thumb ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ))
            ) : activeImage ? (
              <img
                src={activeImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <ImageIcon size={48} className="mb-2 opacity-50" style={{ color: colors.text.disabled.onLight }} />
                <span className="text-xs font-medium" style={{ color: colors.text.disabled.onLight }}>No Image</span>
              </div>
            )}

            {images.length > 1 && (
              <div className="absolute inset-0 z-20 flex items-center justify-between px-2 pointer-events-none">
                <button
                  onClick={handlePrevImage}
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 pointer-events-auto cursor-pointer"
                  style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: colors.text.highEmphasis.onLight }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 pointer-events-auto cursor-pointer"
                  style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: colors.text.highEmphasis.onLight }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {images.length > 0 && (
            <div className="flex gap-1.5 z-10">
              {images.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => onImageChange(file.thumb)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: activeImage === file.thumb ? 20 : 6,
                    backgroundColor: activeImage === file.thumb ? colors.text.highEmphasis.onLight : colors.border.lowEmphasis.onLight
                  }}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {(['category', 'subspecies', 'strain', 'potency'] as const).map((field) => (
              <div
                key={field}
                className="rounded-lg px-3 py-2 h-full border"
                style={{ backgroundColor: colors.surface.lightDarker, borderColor: colors.border.lowEmphasis.onLight }}
              >
                <p className="text-[9px] uppercase mb-1 capitalize" style={{ color: colors.text.disabled.onLight }}>{field}</p>
                <p className="text-[10px] leading-tight" style={{ color: colors.text.highEmphasis.onLight }}>{formData[field] || '—'}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: colors.text.lowEmphasis.onLight }}>Feelings</p>
            <div className="flex flex-wrap gap-2">
              {formData.feelings.length > 0 ? formData.feelings.map((f, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-[9px] rounded"
                  style={{
                    backgroundColor: i === 0 ? `${colors.brand.default}15` : `${colors.brand.default}20`,
                    color: colors.brand.darker
                  }}
                >
                  {f}
                </span>
              )) : <span className="text-[9px] italic" style={{ color: colors.text.disabled.onLight }}>No feelings specified</span>}
            </div>
          </div>

          {formData.markets.length > 0 && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: colors.text.lowEmphasis.onLight }}>Active Markets</p>
              <div className="flex gap-1.5 flex-wrap">
                {formData.markets.map(m => (
                  <span
                    key={m}
                    className="badge-market-sm text-[9px]"
                    style={{ backgroundColor: `${colors.brand.default}12`, color: colors.brand.default }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: colors.text.highEmphasis.onLight }}>Details</h4>
            <p className="text-xs leading-relaxed" style={{ color: colors.text.lowEmphasis.onLight }}>
              {formData.description || "Enter a description to see it here."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
