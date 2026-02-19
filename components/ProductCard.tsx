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
    e.currentTarget.src = "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.onerror = null;
  };

  if (!isList) {
      return (
        <div className="card relative overflow-hidden w-full max-w-4xl mx-auto h-full max-h-[450px] flex">
            {onRemove && (
                <button onClick={onRemove} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
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

                <div className="p-8 md:w-7/12 flex flex-col justify-center text-gray-900 dark:text-gray-100 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold mb-1.5 leading-snug">{product.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-700 inline-block px-2 py-0.5 rounded border border-gray-100 dark:border-gray-600">{product.licenseNumber}</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="section-label">Brands</p>
                            <span className="badge-outline">{product.brand}</span>
                        </div>

                        <div>
                             <p className="section-label">Category & potency</p>
                             <div className="flex flex-wrap gap-2">
                                <span className="badge-outline">{product.category}</span>
                                <span className="badge-outline">{product.potency}</span>
                             </div>
                        </div>

                        <div className="flex items-end justify-between border-t border-gray-100 dark:border-gray-700 pt-5 mt-2">
                            <div>
                                <p className="section-label">Markets</p>
                                <div className="flex gap-1.5">
                                    {product.markets.map(m => (
                                        <span key={m} className="badge-market">{m}</span>
                                    ))}
                                </div>
                            </div>
                            <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">{product.totalMarkets} Markets</span>
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
      className={`
        relative flex p-4 rounded-2xl border-2 transition-all cursor-pointer group
        ${isSelected 
          ? 'border-brand-500 bg-white dark:bg-gray-800 ring-1 ring-brand-500 shadow-md z-10' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-400 dark:hover:border-brand-400 hover:shadow-md shadow-sm'
        }
      `}
    >
      <div className="flex flex-col sm:flex-row w-full">
        
        {/* Mobile Header: Radio + Image + Title */}
        <div className="flex sm:hidden w-full mb-4">
             <div className="pt-1 mr-3 shrink-0">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700'}`}>
                   {isSelected && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                </div>
             </div>
             
             <div className="w-16 h-16 shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-600 mr-3 relative shadow-sm">
                <img src={product.imageUrl} alt="" className="w-full h-full object-cover" onError={handleImageError} />
             </div>

             <div className="flex-1 min-w-0">
                 <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-1">{product.name}</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{product.licenseNumber}</p>
             </div>
        </div>

        {/* Desktop Left: Radio + Image */}
        <div className="hidden sm:flex shrink-0">
           <div className="pt-1 mr-4 shrink-0">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 group-hover:border-brand-400'}`}>
                 {isSelected && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
              </div>
           </div>

           <div className="w-20 h-20 shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-600 mr-4 relative shadow-sm">
             <img src={product.imageUrl} alt="" className="w-full h-full object-cover" onError={handleImageError} />
           </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 w-full">
            <div className="hidden sm:flex justify-between items-start mb-2">
                 <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-0.5">{product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{product.licenseNumber}</p>
                 </div>
                 <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-4 font-medium">{product.totalMarkets} Markets</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-10 gap-3 sm:gap-4 mt-1 sm:mt-2">
                 <div className="sm:col-span-3">
                    <span className="section-label block">Brands</span>
                    <span className="badge-outline">{product.brand}</span>
                 </div>

                 <div className="sm:col-span-4">
                    <span className="section-label block">Category & potency</span>
                    <div className="flex flex-wrap gap-1.5">
                        <span className="badge-outline">{product.category}</span>
                        <span className="badge-outline truncate max-w-full">{product.potency}</span>
                    </div>
                 </div>

                 <div className="sm:col-span-3 flex flex-col sm:items-end">
                     <span className="section-label block">Markets</span>
                     <div className="flex gap-1 sm:justify-end flex-wrap">
                        {product.markets.map(m => (
                            <span key={m} className="badge-market">{m}</span>
                        ))}
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
