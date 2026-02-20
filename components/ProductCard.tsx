import React from 'react';
import { X } from 'lucide-react';
import { useColors } from 'mtr-design-system/styles/themes';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect?: (id: string) => void;
  variant: 'list' | 'standalone';
  onRemove?: () => void;
  onDoubleClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelect,
  variant,
  onRemove,
  onDoubleClick
}) => {
  const colors = useColors();
  const isList = variant === 'list';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.onerror = null;
  };

  if (!isList) {
      return (
        <div
          className="card relative overflow-hidden w-full max-w-4xl mx-auto h-full max-h-[450px] flex"
          style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
        >
            {onRemove && (
                <button
                  onClick={onRemove}
                  className="absolute top-4 right-4 z-10 p-1 rounded-full transition-colors hover-surface"
                  style={{ color: colors.text.disabled.onLight }}
                >
                    <X size={20} />
                </button>
            )}

            <div className="flex flex-col md:flex-row w-full h-full">
                <div className="w-full md:w-5/12 relative min-h-[250px] md:min-h-0">
                     <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                     />
                </div>

                <div className="p-8 md:w-7/12 flex flex-col justify-center overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold mb-1.5 leading-snug" style={{ color: colors.text.highEmphasis.onLight }}>{product.name}</h3>
                        <p
                          className="text-sm font-mono inline-block px-2 py-0.5 rounded border"
                          style={{
                            color: colors.text.lowEmphasis.onLight,
                            backgroundColor: colors.surface.lightDarker,
                            borderColor: colors.border.lowEmphasis.onLight
                          }}
                        >
                          {product.licenseNumber}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="section-label" style={{ color: colors.text.disabled.onLight }}>Brands</p>
                            <span className="badge-outline" style={{ borderColor: colors.border.midEmphasis.onLight, color: colors.text.highEmphasis.onLight }}>{product.brand}</span>
                        </div>

                        <div>
                             <p className="section-label" style={{ color: colors.text.disabled.onLight }}>Category & potency</p>
                             <div className="flex flex-wrap gap-2">
                                <span className="badge-outline" style={{ borderColor: colors.border.midEmphasis.onLight, color: colors.text.highEmphasis.onLight }}>{product.category}</span>
                                <span className="badge-outline" style={{ borderColor: colors.border.midEmphasis.onLight, color: colors.text.highEmphasis.onLight }}>{product.potency}</span>
                             </div>
                        </div>

                        <div className="flex items-end justify-between pt-5 mt-2" style={{ borderTop: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                            <div>
                                <p className="section-label" style={{ color: colors.text.disabled.onLight }}>Markets</p>
                                <div className="flex gap-1.5">
                                    {product.markets.map(m => (
                                        <span
                                          key={m}
                                          className="badge-market"
                                          style={{ backgroundColor: `${colors.brand.default}12`, color: colors.brand.default, borderColor: `${colors.brand.default}30` }}
                                        >
                                          {m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <span className="text-sm font-medium" style={{ color: colors.text.disabled.onLight }}>{product.totalMarkets} Markets</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div
      onClick={() => onSelect?.(product.id)}
      onDoubleClick={onDoubleClick}
      className="relative flex p-4 rounded-2xl border-2 transition-all cursor-pointer group"
      style={{
        borderColor: isSelected ? colors.brand.default : colors.border.lowEmphasis.onLight,
        backgroundColor: colors.surface.light,
        boxShadow: isSelected ? `0 0 0 1px ${colors.brand.default}, 0 4px 6px -1px rgba(0,0,0,0.1)` : '0 1px 2px 0 rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex flex-col sm:flex-row w-full">

        {/* Mobile Header: Radio + Image + Title */}
        <div className="flex sm:hidden w-full mb-4">
             <div className="pt-1 mr-3 shrink-0">
                <div
                  className="w-5 h-5 rounded-full border flex items-center justify-center transition-all"
                  style={{
                    borderColor: isSelected ? colors.brand.default : colors.border.midEmphasis.onLight,
                    backgroundColor: isSelected ? colors.brand.default : colors.surface.light
                  }}
                >
                   {isSelected && <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: colors.text.highEmphasis.onDark }} />}
                </div>
             </div>

             <div
               className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border mr-3 relative shadow-sm"
               style={{ backgroundColor: colors.surface.lightDarker, borderColor: colors.border.lowEmphasis.onLight }}
             >
                <img src={product.imageUrl} alt="" className="w-full h-full object-cover" onError={handleImageError} />
             </div>

             <div className="flex-1 min-w-0">
                 <h3 className="text-base font-bold leading-tight mb-1" style={{ color: colors.text.highEmphasis.onLight }}>{product.name}</h3>
                 <p className="text-xs font-mono" style={{ color: colors.text.lowEmphasis.onLight }}>{product.licenseNumber}</p>
             </div>
        </div>

        {/* Desktop Left: Radio + Image */}
        <div className="hidden sm:flex shrink-0">
           <div className="pt-1 mr-4 shrink-0">
              <div
                className="w-5 h-5 rounded-full border flex items-center justify-center transition-all"
                style={{
                  borderColor: isSelected ? colors.brand.default : colors.border.midEmphasis.onLight,
                  backgroundColor: isSelected ? colors.brand.default : colors.surface.light
                }}
              >
                 {isSelected && <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: colors.text.highEmphasis.onDark }} />}
              </div>
           </div>

           <div
             className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border mr-4 relative shadow-sm"
             style={{ backgroundColor: colors.surface.lightDarker, borderColor: colors.border.lowEmphasis.onLight }}
           >
             <img src={product.imageUrl} alt="" className="w-full h-full object-cover" onError={handleImageError} />
           </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 w-full">
            <div className="hidden sm:flex justify-between items-start mb-2">
                 <div>
                    <h3 className="text-base font-bold leading-tight mb-0.5" style={{ color: colors.text.highEmphasis.onLight }}>{product.name}</h3>
                    <p className="text-xs font-mono" style={{ color: colors.text.lowEmphasis.onLight }}>{product.licenseNumber}</p>
                 </div>
                 <span className="text-xs shrink-0 ml-4 font-medium" style={{ color: colors.text.disabled.onLight }}>{product.totalMarkets} Markets</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-10 gap-3 sm:gap-4 mt-1 sm:mt-2">
                 <div className="sm:col-span-3">
                    <span className="section-label block" style={{ color: colors.text.disabled.onLight }}>Brands</span>
                    <span className="badge-outline" style={{ borderColor: colors.border.midEmphasis.onLight, color: colors.text.highEmphasis.onLight }}>{product.brand}</span>
                 </div>

                 <div className="sm:col-span-4">
                    <span className="section-label block" style={{ color: colors.text.disabled.onLight }}>Category & potency</span>
                    <div className="flex flex-wrap gap-1.5">
                        <span className="badge-outline" style={{ borderColor: colors.border.midEmphasis.onLight, color: colors.text.highEmphasis.onLight }}>{product.category}</span>
                        <span className="badge-outline truncate max-w-full" style={{ borderColor: colors.border.midEmphasis.onLight, color: colors.text.highEmphasis.onLight }}>{product.potency}</span>
                    </div>
                 </div>

                 <div className="sm:col-span-3 flex flex-col sm:items-end">
                     <span className="section-label block" style={{ color: colors.text.disabled.onLight }}>Markets</span>
                     <div className="flex gap-1 sm:justify-end flex-wrap">
                        {product.markets.map(m => (
                            <span
                              key={m}
                              className="badge-market"
                              style={{ backgroundColor: `${colors.brand.default}12`, color: colors.brand.default, borderColor: `${colors.brand.default}30` }}
                            >
                              {m}
                            </span>
                        ))}
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
