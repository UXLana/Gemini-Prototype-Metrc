import React from 'react';
import { Layers, Package } from 'lucide-react';
import { DashboardProduct } from '../types';

interface DashboardProductCardProps {
  product: DashboardProduct;
}

export const DashboardProductCard: React.FC<DashboardProductCardProps> = ({ product }) => {
  const isBundle = product.type === 'Bundle';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 group relative flex flex-col overflow-hidden h-full cursor-pointer">
      
      {/* Image Header Area - Full Width & Taller */}
      <div className="relative h-56 w-full bg-gray-50 group-hover:opacity-95 transition-opacity">
        <div className="absolute top-3 left-3 z-10" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600 bg-white/90 backdrop-blur shadow-sm cursor-pointer transition-transform hover:scale-105" />
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold shadow-sm backdrop-blur-md ${
            isBundle ? 'bg-gray-900/80 text-white' : 'bg-[#2D7A65]/90 text-white'
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
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">{product.name}</h3>
            <p className="text-xs text-gray-500 font-mono flex items-center gap-2">
                {product.licenseNumber}
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="text-emerald-700 font-medium">{product.totalMarkets} Markets</span>
            </p>
        </div>

        <div className="space-y-4 mt-auto">
          {/* Tags Row */}
          <div className="flex flex-wrap gap-2">
             {product.brands.map(brand => (
                <span key={brand} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 border border-gray-100 text-xs font-medium text-gray-600">
                  {brand}
                </span>
             ))}
             {!isBundle && (
                <>
                 <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-700">
                   {product.category}
                 </span>
                 <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-50 border border-purple-100 text-xs font-medium text-purple-700">
                   {product.potency}
                 </span>
                </>
             )}
          </div>
          
          {isBundle && (
             <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2 block">Includes</span>
                <ul className="space-y-1">
                    {product.subProducts?.map((p, i) => (
                        <li key={i} className="text-xs text-gray-600 truncate flex items-center gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full shrink-0"></span>
                            {p}
                        </li>
                    ))}
                </ul>
             </div>
          )}

          {/* Markets Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex -space-x-1.5 overflow-hidden">
                {product.markets.slice(0, 4).map((m, i) => (
                    <div key={m} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-200 text-[9px] font-bold text-gray-600 shadow-sm z-0 relative" style={{ zIndex: 4-i }}>
                        {m}
                    </div>
                ))}
                {product.markets.length > 4 && (
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 border border-gray-200 text-[9px] font-medium text-gray-500 z-0">
                        +{product.markets.length - 4}
                    </div>
                )}
            </div>
            <button className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors">
                View details &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};