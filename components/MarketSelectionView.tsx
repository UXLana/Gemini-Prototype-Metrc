import React, { useState } from 'react';
import { Product } from '../types';
import { Check, CheckCircle2, MapPin } from 'lucide-react';
import { ALL_MARKETS } from '../constants';

interface MarketSelectionViewProps {
  product: Product;
  onSelectMarkets: (markets: string[]) => void;
}

export const MarketSelectionView: React.FC<MarketSelectionViewProps> = ({ product, onSelectMarkets }) => {
  // Pre-select product's existing markets or default to none
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
          {/* Small Product Summary */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                  <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">{product.licenseNumber}</p>
                  <p className="text-xs text-gray-400 mt-1">{product.brand}</p>
              </div>
          </div>
      </div>

      <div className="px-1">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Select Markets</h2>
          <p className="text-gray-500 text-sm mb-6">Which states do you want to register this product in?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALL_MARKETS.map((market) => {
                  const isSelected = selectedMarkets.includes(market.id);
                  const isDisabled = !market.active;
                  
                  return (
                      <div 
                        key={market.id}
                        onClick={() => !isDisabled && toggleMarket(market.id)}
                        className={`
                            relative flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer select-none
                            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-100' : ''}
                            ${isSelected 
                                ? 'border-emerald-600 bg-emerald-50/30' 
                                : 'border-gray-200 bg-white hover:border-emerald-200 hover:shadow-sm'
                            }
                        `}
                      >
                          {/* Updated to Square Checkbox */}
                          <div className={`
                              w-5 h-5 rounded border flex items-center justify-center mr-4 transition-colors
                              ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-gray-300'}
                          `}>
                              {isSelected && <Check size={14} className="text-white" />}
                          </div>
                          
                          <div className="flex-1">
                              <p className={`font-bold text-sm ${isSelected ? 'text-emerald-900' : 'text-gray-700'}`}>{market.name}</p>
                              <p className="text-xs text-gray-400 font-mono">{market.id}</p>
                          </div>

                          {!market.active && (
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">Unavailable</span>
                          )}

                          {isSelected && (
                              <MapPin size={16} className="text-emerald-600 absolute right-4 opacity-20" />
                          )}
                      </div>
                  )
              })}
          </div>
      </div>

    </div>
  );
};