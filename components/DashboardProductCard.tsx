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
      className="card hover:shadow-lg transition-all duration-300 group relative flex flex-col overflow-hidden h-full cursor-pointer"
    >
      
      {/* Image Header Area */}
      <div className="relative h-56 w-full bg-gray-50 dark:bg-gray-700 group-hover:opacity-95 transition-opacity flex-none">
        <div className="absolute top-4 left-4 z-10" onClick={(e) => e.stopPropagation()}>
           <div className="relative flex items-center justify-center w-5 h-5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded cursor-pointer hover:border-brand-500 shadow-sm transition-colors group/checkbox">
               <input 
                 type="checkbox" 
                 className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer z-10" 
               />
               <Check size={14} className="text-brand-500 dark:text-brand-400 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
           </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span className={`badge-filled ${
            isBundle ? 'bg-gray-600 border-gray-600' : 'bg-brand-500 border-brand-500'
          }`}>
            {isBundle ? <Layers className="w-3 h-3" /> : <Package className="w-3 h-3" />}
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
        <div className="flex-1 space-y-4">
            <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 leading-tight">{product.name}</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono tracking-wide uppercase">{product.licenseNumber}</p>
            </div>

            <div>
               <p className="section-label">Brands</p>
               <div className="flex flex-wrap gap-2">
                 {product.brands.map(brand => (
                    <span key={brand} className="badge">{brand}</span>
                 ))}
               </div>
            </div>

            <div>
               <p className="section-label">
                  {isBundle ? `Products (${product.subProducts?.length || 0})` : 'Category & potency'}
               </p>
               
               {isBundle ? (
                 <div className="flex flex-wrap gap-1.5">
                    {product.subProducts?.slice(0, 3).map((p, i) => (
                        <span key={i} className="badge">{p}</span>
                    ))}
                    {(product.subProducts?.length || 0) > 3 && (
                        <span className="text-[10px] text-gray-400 pl-1 self-center">+{(product.subProducts?.length || 0) - 3} more</span>
                    )}
                 </div>
               ) : (
                 <div className="flex flex-wrap gap-2">
                     {product.category && <span className="badge">{product.category}</span>}
                     {product.potency && <span className="badge">{product.potency}</span>}
                 </div>
               )}
            </div>
        </div>

        {/* Markets Footer */}
        <div className="mt-6 pt-2">
            <p className="section-label">Markets</p>
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                    {product.markets.slice(0, 2).map(m => (
                        <span key={m} className="badge-market-sm">{m}</span>
                    ))}
                </div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                    {product.markets.length}/{product.totalMarkets} Markets
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};
