import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

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

  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-4">
        <h2 className="text-base font-semibold mb-0.5 text-gray-900 dark:text-white">Customer preview</h2>
        <p className="text-gray-500 dark:text-gray-400 text-xs">Product information people see when they scan the barcode</p>
      </div>

      {/* iPhone-style Preview Card — intentionally light-only */}
      <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-6 pb-3">
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{formData.brand || 'BRAND'}</p>
          <h3 className="text-base font-semibold text-gray-900 leading-tight">{formData.name || 'Product Name'}</h3>
          <p className="text-[10px] text-gray-500 mt-1">Count: 10</p>
        </div>

        <div className="px-6 mb-4 relative flex flex-col items-center group">
          <div
            className="w-full aspect-[1/0.85] rounded-xl overflow-hidden mb-4 bg-gray-50/50 border border-gray-50 relative isolate"
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
                <ImageIcon size={48} className="mb-2 opacity-50 text-gray-300" />
                <span className="text-xs font-medium text-gray-300">No Image</span>
              </div>
            )}

            {images.length > 1 && (
              <div className="absolute inset-0 z-20 flex items-center justify-between px-2 pointer-events-none">
                <button
                  onClick={handlePrevImage}
                  className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 pointer-events-auto cursor-pointer"
                >
                  <ChevronLeft size={18} className="text-gray-800" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 pointer-events-auto cursor-pointer"
                >
                  <ChevronRight size={18} className="text-gray-800" />
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
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeImage === file.thumb
                      ? 'w-5 bg-gray-800'
                      : 'w-1.5 bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {(['category', 'subspecies', 'strain', 'potency'] as const).map((field) => (
              <div key={field} className="bg-gray-50 rounded-lg p-3 border border-gray-50">
                <p className="text-[9px] text-gray-400 uppercase mb-1 capitalize">{field}</p>
                <p className="text-[10px] text-gray-900 leading-tight">{formData[field] || '—'}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">Feelings</p>
            <div className="flex flex-wrap gap-2">
              {formData.feelings.length > 0 ? formData.feelings.map((f, i) => (
                <span key={i} className={`px-2 py-1 text-[9px] rounded ${i === 0 ? 'bg-brand-50 text-brand-700' : 'bg-brand-100 text-brand-800'}`}>
                  {f}
                </span>
              )) : <span className="text-[9px] text-gray-300 italic">No feelings specified</span>}
            </div>
          </div>

          {formData.markets.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">Active Markets</p>
              <div className="flex gap-1.5 flex-wrap">
                {formData.markets.map(m => (
                  <span key={m} className="badge-market-sm text-[9px]">{m}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-[10px] font-medium text-gray-900 uppercase tracking-wider mb-2">Details</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {formData.description || "Enter a description to see it here."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
