import React, { useState } from 'react';
import { Product } from '../types';
import { Check, MapPin } from 'lucide-react';
import { ALL_MARKETS } from '../constants';

interface MarketSelectionViewProps {
  product: Product;
  onSelectMarkets: (markets: string[]) => void;
}

export const MarketSelectionView: React.FC<MarketSelectionViewProps> = ({ product, onSelectMarkets }) => {
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);

  const toggleMarket = (marketId: string) => {
    setSelectedMarkets(prev => 
      prev.includes(marketId) 
        ? prev.filter(id => id !== marketId) 
        : [...prev, marketId]
    );
  };

  React.useEffect(() => {
    onSelectMarkets(selectedMarkets);
  }, [selectedMarkets, onSelectMarkets]);

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <div className="flex items-center gap-6 p-1">
          <div className="flex-1 card p-4 flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-600 shrink-0">
                  <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{product.licenseNumber}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{product.brand}</p>
              </div>
          </div>
      </div>

      <div className="px-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select Markets</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Which states do you want to register this product in?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALL_MARKETS.map((market) => {
                  const isSelected = selectedMarkets.includes(market.id);
                  const isDisabled = !market.active;
                  
                  return (
                      <div 
                        key={market.id}
                        onClick={() => !isDisabled && toggleMarket(market.id)}
                        className={`
                            relative flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer select-none
                            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700' : ''}
                            ${isSelected 
                                ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-900/20' 
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-200 dark:hover:border-brand-500 hover:shadow-sm'
                            }
                        `}
                      >
                          <div className={`
                              check-indicator w-5 h-5 mr-4
                              ${isSelected ? 'check-indicator-on' : 'check-indicator-off'}
                          `}>
                              {isSelected && <Check size={14} className="text-white" />}
                          </div>
                          
                          <div className="flex-1">
                              <p className={`font-bold text-sm ${isSelected ? 'text-brand-700 dark:text-brand-400' : 'text-gray-700 dark:text-gray-200'}`}>{market.name}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{market.id}</p>
                          </div>

                          {!market.active && (
                              <span className="badge text-[10px] font-bold uppercase tracking-wider">Unavailable</span>
                          )}

                          {isSelected && (
                              <MapPin size={16} className="text-brand-500 dark:text-brand-400 absolute right-4 opacity-20" />
                          )}
                      </div>
                  )
              })}
          </div>
      </div>

    </div>
  );
};
