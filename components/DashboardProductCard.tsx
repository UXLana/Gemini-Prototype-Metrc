import React from 'react';
import { useAppColors } from '../hooks/useDarkMode';
import { Badge as DSBadge } from 'mtr-design-system/components';
import { AppBadge as Badge } from './AppBadge';
import { Layers, Package, Check } from 'lucide-react';
import { DashboardProduct } from '../types';

interface DashboardProductCardProps {
  product: DashboardProduct;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: () => void;
}

export const DashboardProductCard: React.FC<DashboardProductCardProps> = ({ product, selected = false, onSelect, onClick }) => {
  const colors = useAppColors();
  const isBundle = product?.type === 'Bundle';

  if (!product) return null;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.onerror = null;
  };

  return (
    <div 
      onClick={onClick}
      className="card hover:shadow-lg transition-all duration-300 group relative flex flex-col overflow-hidden h-full cursor-pointer"
      style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
    >
      
      {/* Image Header Area */}
      <div className="relative h-56 w-full group-hover:opacity-95 transition-opacity flex-none" style={{ backgroundColor: colors.surface.lightDarker }}>
        <div className="absolute top-4 left-4 z-10" onClick={(e) => { e.stopPropagation(); onSelect?.(product.id); }}>
           <div className="check-indicator w-5 h-5 shadow-sm cursor-pointer"
             style={selected ? { backgroundColor: colors.brand.default, borderColor: colors.brand.default } : { borderColor: colors.border.midEmphasis.onLight, backgroundColor: colors.surface.light }}
           >
             {selected && <Check size={14} style={{ color: colors.text.highEmphasis.onDark }} />}
           </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <DSBadge
            variant="filled"
            color={isBundle ? "neutral" : "brand"}
            icon={isBundle ? <Layers style={{ width: 12, height: 12 }} /> : <Package style={{ width: 12, height: 12 }} />}
          >
            {product.type}
          </DSBadge>
        </div>

        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1 space-y-4">
            <div>
                <h3 className="text-base font-bold mb-1 leading-tight" style={{ color: colors.text.highEmphasis.onLight }}>{product.name}</h3>
                <p className="text-[11px] font-mono tracking-wide uppercase" style={{ color: colors.text.lowEmphasis.onLight }}>{product.licenseNumber}</p>
            </div>

            <div>
               <p className="section-label" style={{ color: colors.text.disabled.onLight }}>Brands</p>
               <div className="flex flex-wrap gap-2">
                 {(product.brands || []).map(brand => (
                    <Badge key={brand} variant="subtle" color="neutral">{brand}</Badge>
                 ))}
               </div>
            </div>

            <div>
               <p className="section-label" style={{ color: colors.text.disabled.onLight }}>
                  {isBundle ? `Products (${product.subProducts?.length || 0})` : 'Category & potency'}
               </p>
               
               {isBundle ? (
                 <div className="flex flex-wrap gap-1.5">
                    {(product.subProducts || []).slice(0, 3).map((p, i) => (
                        <Badge key={i} variant="subtle" color="neutral">{p}</Badge>
                    ))}
                    {(product.subProducts?.length || 0) > 3 && (
                        <span className="text-[10px] pl-1 self-center" style={{ color: colors.text.disabled.onLight }}>+{(product.subProducts?.length || 0) - 3} more</span>
                    )}
                 </div>
               ) : (
                 <div className="flex flex-wrap gap-2">
                     {product.category && <Badge variant="subtle" color="neutral">{product.category}</Badge>}
                     {product.potency && <Badge variant="subtle" color="neutral">{product.potency}</Badge>}
                 </div>
               )}
            </div>
        </div>

        {/* Markets Footer */}
        <div className="mt-6 pt-2">
            <p className="section-label" style={{ color: colors.text.disabled.onLight }}>Markets</p>
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                    {(product.markets || []).slice(0, 2).map(m => (
                        <Badge key={m} variant="subtle" color="brand" size="sm">{m}</Badge>
                    ))}
                </div>
                <span className="text-[11px] font-medium" style={{ color: colors.text.lowEmphasis.onLight }}>
                    {(product.markets || []).length}/{product.totalMarkets} Markets
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};
