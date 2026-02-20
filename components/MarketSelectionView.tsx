import React, { useState } from 'react';
import { useColors } from 'mtr-design-system/styles/themes';
import { Product } from '../types';
import { Check, MapPin } from 'lucide-react';
import { ALL_MARKETS } from '../constants';

interface MarketSelectionViewProps {
  product: Product;
  onSelectMarkets: (markets: string[]) => void;
}

export const MarketSelectionView: React.FC<MarketSelectionViewProps> = ({ product, onSelectMarkets }) => {
  const colors = useColors();
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
          <div
            className="flex-1 card p-4 flex items-center gap-4 mb-6"
            style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
          >
              <div
                className="w-16 h-16 rounded-lg overflow-hidden border shrink-0"
                style={{ backgroundColor: colors.surface.lightDarker, borderColor: colors.border.lowEmphasis.onLight }}
              >
                  <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                  <h3 className="font-bold" style={{ color: colors.text.highEmphasis.onLight }}>{product.name}</h3>
                  <p className="text-xs font-mono" style={{ color: colors.text.lowEmphasis.onLight }}>{product.licenseNumber}</p>
                  <p className="text-xs mt-1" style={{ color: colors.text.disabled.onLight }}>{product.brand}</p>
              </div>
          </div>
      </div>

      <div className="px-1">
          <h2 className="text-xl font-bold mb-2" style={{ color: colors.text.highEmphasis.onLight }}>Select Markets</h2>
          <p className="text-sm mb-6" style={{ color: colors.text.lowEmphasis.onLight }}>Which states do you want to register this product in?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ALL_MARKETS.map((market) => {
                  const isSelected = selectedMarkets.includes(market.id);
                  const isDisabled = !market.active;

                  return (
                      <div
                        key={market.id}
                        onClick={() => !isDisabled && toggleMarket(market.id)}
                        className="relative flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer select-none"
                        style={{
                          opacity: isDisabled ? 0.5 : 1,
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          borderColor: isSelected ? colors.brand.default : colors.border.lowEmphasis.onLight,
                          backgroundColor: isSelected
                            ? `${colors.brand.default}08`
                            : isDisabled
                              ? colors.surface.lightDarker
                              : colors.surface.light
                        }}
                      >
                          <div
                            className="check-indicator w-5 h-5 mr-4"
                            style={{
                              backgroundColor: isSelected ? colors.brand.default : colors.surface.light,
                              borderColor: isSelected ? colors.brand.default : colors.border.midEmphasis.onLight
                            }}
                          >
                              {isSelected && <Check size={14} style={{ color: colors.text.highEmphasis.onDark }} />}
                          </div>

                          <div className="flex-1">
                              <p
                                className="font-bold text-sm"
                                style={{ color: isSelected ? colors.brand.darker : colors.text.highEmphasis.onLight }}
                              >
                                {market.name}
                              </p>
                              <p className="text-xs font-mono" style={{ color: colors.text.disabled.onLight }}>{market.id}</p>
                          </div>

                          {!market.active && (
                              <span
                                className="badge text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: colors.text.disabled.onLight }}
                              >
                                Unavailable
                              </span>
                          )}

                          {isSelected && (
                              <MapPin size={16} className="absolute right-4 opacity-20" style={{ color: colors.brand.default }} />
                          )}
                      </div>
                  )
              })}
          </div>
      </div>

    </div>
  );
};
