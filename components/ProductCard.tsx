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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.onerror = null;
  };

  // Standalone/Confirm View (The detailed view on the far right of the screenshot)
  if (!isList) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-hidden max-w-4xl mx-auto">
            {/* Close/Remove */}
            {onRemove && (
                <button onClick={onRemove} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                </button>
            )}

            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-5/12 bg-gray-50 relative min-h-[300px] md:min-h-0 group border-r border-gray-100">
                     <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover absolute inset-0"
                        onError={handleImageError}
                     />
                </div>

                {/* Content Section */}
                <div className="p-8 md:w-7/12 flex flex-col justify-center">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1.5 leading-snug">{product.name}</h3>
                        <p className="text-sm text-gray-500 font-mono bg-gray-50 inline-block px-2 py-0.5 rounded border border-gray-100">{product.licenseNumber}</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-semibold">Brands</p>
                            <span className="inline-block px-3 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700 border border-gray-200">{product.brand}</span>
                        </div>

                        <div>
                             <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-semibold">Category & potency</p>
                             <div className="flex flex-wrap gap-2">
                                <span className="inline-block px-3 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700 border border-gray-200">{product.category}</span>
                                <span className="inline-block px-3 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700 border border-gray-200">{product.potency}</span>
                             </div>
                        </div>

                        <div className="flex items-end justify-between border-t border-gray-100 pt-5 mt-2">
                            <div>
                                <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-semibold">Markets</p>
                                <div className="flex gap-1.5">
                                    {product.markets.map(m => (
                                        <span key={m} className="inline-block px-2.5 py-1 bg-[#E8F5F1] text-[#1B4D3E] rounded text-xs font-bold border border-[#D1EBE5]">{m}</span>
                                    ))}
                                </div>
                            </div>
                            <span className="text-sm text-gray-400 font-medium">{product.totalMarkets} Markets</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // List View (Selector Cards)
  return (
    <div 
      onClick={() => onSelect?.(product.id)}
      onDoubleClick={onDoubleClick}
      className={`
        relative flex items-start p-5 rounded-xl border-2 transition-all cursor-pointer group
        ${isSelected 
          ? 'border-emerald-600 bg-white ring-1 ring-emerald-600 shadow-md z-10' 
          : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md shadow-sm'
        }
      `}
    >
      {/* Radio Button */}
      <div className="pt-1 mr-5 shrink-0">
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300 bg-white group-hover:border-emerald-400'}`}>
             {isSelected && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
          </div>
      </div>

      {/* Image */}
      <div className="w-28 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 mr-6 relative shadow-sm">
        <img 
            src={product.imageUrl} 
            alt="" 
            className="w-full h-full object-cover"
            onError={handleImageError}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
         <div className="flex justify-between items-start mb-3">
             <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 font-mono">{product.licenseNumber}</p>
             </div>
             {/* Market Count - Top Right */}
             <span className="text-xs text-gray-400 shrink-0 ml-4 font-medium">{product.totalMarkets} Markets</span>
         </div>

         <div className="grid grid-cols-10 gap-4">
            <div className="col-span-3">
                <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider block mb-1.5">Brands</span>
                <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                    {product.brand}
                </span>
            </div>
            
            <div className="col-span-4">
                <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider block mb-1.5">Category & potency</span>
                <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                        {product.category}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium truncate max-w-full border border-gray-200">
                        {product.potency}
                    </span>
                </div>
            </div>
            
            <div className="col-span-3 flex flex-col items-end">
                <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider block mb-1.5">Markets</span>
                <div className="flex gap-1 justify-end">
                    {product.markets.map(m => (
                        <span key={m} className="inline-flex items-center px-2 py-1 rounded bg-[#E8F5F1] text-[#1B4D3E] text-xs font-bold border border-[#D1EBE5]">
                            {m}
                        </span>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};