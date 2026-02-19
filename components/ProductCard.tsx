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

  // Standalone/Confirm View (The detailed view on the far right of the screenshot)
  if (!isList) {
      return (
        <div className="bg-white dark:bg-[#1f2937] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden w-full max-w-4xl mx-auto transition-colors h-full max-h-[450px] flex">
            {/* Close/Remove */}
            {onRemove && (
                <button onClick={onRemove} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <X size={20} />
                </button>
            )}

            <div className="flex flex-col md:flex-row w-full h-full">
                {/* Image Section - Scalable and Floating */}
                <div className="w-full md:w-5/12 bg-gray-50 dark:bg-[#1f2937] relative min-h-[250px] md:min-h-0 p-4 flex items-center justify-center">
                     <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-xl shadow-sm"
                        onError={handleImageError}
                     />
                </div>

                {/* Content Section */}
                <div className="p-8 md:w-7/12 flex flex-col justify-center text-gray-900 dark:text-gray-100 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold mb-1.5 leading-snug">{product.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-700 inline-block px-2 py-0.5 rounded border border-gray-100 dark:border-gray-600">{product.licenseNumber}</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider font-semibold">Brands</p>
                            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600">{product.brand}</span>
                        </div>

                        <div>
                             <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider font-semibold">Category & potency</p>
                             <div className="flex flex-wrap gap-2">
                                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600">{product.category}</span>
                                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600">{product.potency}</span>
                             </div>
                        </div>

                        <div className="flex items-end justify-between border-t border-gray-100 dark:border-gray-700 pt-5 mt-2">
                            <div>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider font-semibold">Markets</p>
                                <div className="flex gap-1.5">
                                    {product.markets.map(m => (
                                        <span key={m} className="inline-block px-2.5 py-1 bg-[#E8F5F1] dark:bg-[#064e3b] text-[#1B4D3E] dark:text-[#a7f3d0] rounded text-xs font-bold border border-[#D1EBE5] dark:border-[#065f46]">{m}</span>
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

  // List View (Selector Cards)
  return (
    <div 
      onClick={() => onSelect?.(product.id)}
      onDoubleClick={onDoubleClick}
      className={`
        relative flex p-4 rounded-2xl border-2 transition-all cursor-pointer group
        ${isSelected 
          ? 'border-emerald-600 bg-white dark:bg-gray-800 ring-1 ring-emerald-600 shadow-md z-10' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-md shadow-sm'
        }
      `}
    >
      <div className="flex flex-col sm:flex-row w-full">
        
        {/* Mobile Header: Radio + Image + Title */}
        <div className="flex sm:hidden w-full mb-4">
             {/* Radio */}
             <div className="pt-1 mr-3 shrink-0">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700'}`}>
                   {isSelected && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                </div>
             </div>
             
             {/* Image */}
             <div className="w-16 h-16 shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-600 mr-3 relative shadow-sm">
                <img 
                    src={product.imageUrl} 
                    alt="" 
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                />
             </div>

             {/* Title */}
             <div className="flex-1 min-w-0">
                 <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-1">{product.name}</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{product.licenseNumber}</p>
             </div>
        </div>

        {/* Desktop Left: Radio + Image */}
        <div className="hidden sm:flex shrink-0">
           {/* Radio */}
           <div className="pt-1 mr-4 shrink-0">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 group-hover:border-emerald-400'}`}>
                 {isSelected && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
              </div>
           </div>

           {/* Image */}
           <div className="w-20 h-20 shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-600 mr-4 relative shadow-sm">
             <img 
                 src={product.imageUrl} 
                 alt="" 
                 className="w-full h-full object-cover"
                 onError={handleImageError}
             />
           </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 w-full">
            {/* Desktop Title Header */}
            <div className="hidden sm:flex justify-between items-start mb-2">
                 <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight mb-0.5">{product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{product.licenseNumber}</p>
                 </div>
                 <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-4 font-medium">{product.totalMarkets} Markets</span>
            </div>
            
            {/* Mobile Market Count Separator removed */}

            {/* Details Grid (Responsive) */}
            <div className="grid grid-cols-1 sm:grid-cols-10 gap-3 sm:gap-4 mt-1 sm:mt-2">
                 {/* Brand */}
                 <div className="sm:col-span-3">
                    <span className="text-[10px] uppercase text-gray-400 dark:text-gray-500 font-bold tracking-wider block mb-1">Brands</span>
                    <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-gray-600">
                        {product.brand}
                    </span>
                 </div>

                 {/* Category */}
                 <div className="sm:col-span-4">
                    <span className="text-[10px] uppercase text-gray-400 dark:text-gray-500 font-bold tracking-wider block mb-1">Category & potency</span>
                    <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-gray-600">
                            {product.category}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium truncate max-w-full border border-gray-200 dark:border-gray-600">
                            {product.potency}
                        </span>
                    </div>
                 </div>

                 {/* Markets */}
                 <div className="sm:col-span-3 flex flex-col sm:items-end">
                     <span className="text-[10px] uppercase text-gray-400 dark:text-gray-500 font-bold tracking-wider block mb-1">Markets</span>
                     <div className="flex gap-1 sm:justify-end flex-wrap">
                        {product.markets.map(m => (
                            <span key={m} className="inline-flex items-center px-2 py-1 rounded bg-[#E8F5F1] dark:bg-[#064e3b] text-[#1B4D3E] dark:text-[#a7f3d0] text-[10px] font-bold border border-[#D1EBE5] dark:border-[#065f46]">
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