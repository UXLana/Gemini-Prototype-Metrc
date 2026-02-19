import React from 'react';
import { Layers, Package, Check } from 'lucide-react';
import { DashboardProduct } from '../types';

interface DashboardProductCardProps {
  product: DashboardProduct;
  onClick?: () => void;
}

export const DashboardProductCard: React.FC<DashboardProductCardProps> = ({ product, onClick }) => {
  const isBundle = product.type === 'Bundle';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.onerror = null;
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 group relative flex flex-col overflow-hidden h-full cursor-pointer"
    >
      
      {/* Image Header Area */}
      <div className="relative h-56 w-full bg-gray-50 group-hover:opacity-95 transition-opacity">
        {/* Custom Styled Checkbox */}
        <div className="absolute top-4 left-4 z-10" onClick={(e) => e.stopPropagation()}>
           <div className="relative flex items-center justify-center w-5 h-5 bg-white border border-gray-300 rounded cursor-pointer hover:border-emerald-500 shadow-sm transition-colors group/checkbox">
               <input 
                 type="checkbox" 
                 className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer z-10" 
               />
               <Check size={14} className="text-emerald-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
           </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur-md ${
            isBundle ? 'bg-[#374151] text-white' : 'bg-[#2D7A65] text-white'
          }`}>
            {isBundle ? <Layers className="w-3.5 h-3.5 mr-1.5" /> : <Package className="w-3.5 h-3.5 mr-1.5" />}
            {product.type}
          </span>
        </div>

        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        {/* Title and License */}
        <div>
            <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">{product.name}</h3>
            <p className="text-[11px] text-gray-500 font-mono tracking-wide uppercase">{product.licenseNumber}</p>
        </div>

        {/* Brands Section */}
        <div>
           <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide font-medium">Brands</p>
           <div className="flex flex-wrap gap-2">
             {product.brands.map(brand => (
                <span key={brand} className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-xs font-medium text-gray-700">
                  {brand}
                </span>
             ))}
           </div>
        </div>

        {/* Middle Section: Category & Potency OR Products included */}
        <div>
           <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide font-medium">
              {isBundle ? `Products (${product.subProducts?.length || 0})` : 'Category & potency'}
           </p>
           
           {isBundle ? (
             <div className="flex flex-wrap gap-1.5">
                {product.subProducts?.slice(0, 3).map((p, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-xs font-medium text-gray-700">
                        {p}
                    </span>
                ))}
                {(product.subProducts?.length || 0) > 3 && (
                    <span className="text-[10px] text-gray-400 pl-1 self-center">+{(product.subProducts?.length || 0) - 3} more</span>
                )}
             </div>
           ) : (
             <div className="flex flex-wrap gap-2">
                 {product.category && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-xs font-medium text-gray-700">
                        {product.category}
                    </span>
                 )}
                 {product.potency && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-xs font-medium text-gray-700">
                        {product.potency}
                    </span>
                 )}
             </div>
           )}
        </div>

        {/* Markets Footer */}
        <div className="mt-auto pt-2">
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide font-medium">Markets</p>
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                    {product.markets.slice(0, 2).map(m => (
                        <span key={m} className="inline-flex items-center px-2 py-0.5 rounded bg-[#DCFCE7] text-[#166534] text-[10px] font-bold">
                            {m}
                        </span>
                    ))}
                </div>
                <span className="text-[11px] text-gray-500 font-medium">
                    {product.markets.length}/{product.totalMarkets} Markets
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};