import React from 'react';
import { X } from 'lucide-react';
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
  const isList = variant === 'list';

  return (
    <div 
      className={`
        relative flex gap-4 p-4 rounded-xl border transition-all duration-200 select-none group
        ${isSelected && isList ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600/20' : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'}
        ${!isList ? 'border-gray-100 shadow-sm' : 'cursor-pointer'}
      `}
      onClick={() => isList && onSelect?.(product.id)}
      onDoubleClick={() => isList && onDoubleClick?.()}
      role={isList ? "radio" : undefined}
      aria-checked={isSelected}
    >
      {/* Selection Control (Radio or None) */}
      {isList && (
        <div className="flex-shrink-0 self-center">
          <div className={`
            w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200
            ${isSelected 
              ? 'bg-emerald-600 border-emerald-600 shadow-sm' 
              : 'bg-white border-gray-300 group-hover:border-emerald-400'}
          `}>
            <div className={`
              w-2 h-2 rounded-full bg-white transition-transform duration-200
              ${isSelected ? 'scale-100' : 'scale-0'}
            `} />
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="flex-shrink-0">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-24 h-24 object-cover rounded-lg bg-gray-100 shadow-inner"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-gray-900 font-semibold text-base leading-tight pr-8">
              {product.name}
            </h3>
            {/* Close button for standalone view */}
            {!isList && onRemove && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="text-gray-400 hover:text-gray-600 -mt-1 -mr-1 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <p className="text-xs text-gray-500 font-mono mt-1 mb-3">
            {product.licenseNumber}
          </p>

          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-500 block mb-0.5">Brands</span>
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                {product.brand}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div>
                <span className="text-xs text-gray-500 block mb-0.5">Category & potency</span>
                <div className="flex gap-1">
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                    {product.potency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between border-t border-transparent pt-2">
          <div className="flex flex-col">
             <span className="text-xs text-gray-500 mb-1">Markets</span>
             <div className="flex gap-1">
               {product.markets.map(m => (
                 <span key={m} className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                   {m}
                 </span>
               ))}
             </div>
          </div>
          <span className="text-xs text-gray-400">
            {product.markets.length}/{product.totalMarkets} Markets
          </span>
        </div>
      </div>
    </div>
  );
};