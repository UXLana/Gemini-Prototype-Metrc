import React, { useState, useEffect, useCallback } from 'react';
import { useAppColors } from '../hooks/useDarkMode';
import { Search, X, Sparkles, ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import { Product, ViewState } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';
import { Button } from 'mtr-design-system/components';
import { ConfirmDialog } from './ConfirmDialog';
import { EditProductView } from './EditProductView';
import { MarketSelectionView } from './MarketSelectionView';
import { generateProductFromDescription } from '../services/geminiService';
import { UseCase } from '../App';

interface ProductRegistrationFlowProps {
  onClose: () => void;
  useCase: UseCase;
  onSave?: () => void;
}

export const ProductRegistrationFlow: React.FC<ProductRegistrationFlowProps> = ({ onClose, useCase, onSave }) => {
  const colors = useAppColors();
  const [view, setView] = useState<ViewState>(ViewState.SEARCH);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [manualProduct, setManualProduct] = useState<Product | null>(null);
  
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);

  const selectedProduct = manualProduct || products.find(p => p.id === selectedProductId);
  const isNoResults = isTyping && products.length === 0 && !isGenerating && searchQuery.length > 0;

  const canProceedFromMarketSelection = view === ViewState.MARKET_SELECTION && selectedMarkets.length > 0;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (selectedProductId) {
        setSelectedProductId(null);
    }

    if (query.length > 0) {
      setIsTyping(true);
      setTimeout(() => {
        if (useCase === 'empty-search') {
          setProducts([]);
        } else {
          const filtered = MOCK_PRODUCTS.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) || 
            p.licenseNumber.includes(query)
          );
          setProducts(filtered);
        }
      }, 150);
    } else {
      setIsTyping(false);
      setProducts([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setProducts([]);
    setIsTyping(false);
    setSelectedProductId(null);
    setManualProduct(null);
  };

  const handleCreateNewManual = () => {
    const freshProduct: Product = {
      id: `manual_${Date.now()}`,
      name: searchQuery || "",
      brand: "",
      category: "",
      licenseNumber: "",
      potency: "",
      markets: [],
      totalMarkets: 0,
      imageUrl: "",
      description: ""
    };
    setManualProduct(freshProduct);
    setView(ViewState.EDIT);
  };

  const handleGenerateWithAI = async () => {
    if (!searchQuery) return;
    setIsGenerating(true);
    const newProduct = await generateProductFromDescription(searchQuery);
    if (newProduct) {
      setProducts(prev => [newProduct, ...prev]);
      setSelectedProductId(newProduct.id);
    }
    setIsGenerating(false);
  };

  const handleNext = useCallback(() => {
    if (isNoResults) {
      handleCreateNewManual();
      return;
    }

    if (selectedProductId) {
      if (view === ViewState.SEARCH) {
        setView(ViewState.CONFIRM);
      } else if (view === ViewState.CONFIRM) {
        if (useCase === 'market-selection') {
          setView(ViewState.MARKET_SELECTION);
        } else {
          setView(ViewState.EDIT);
        }
      } else if (view === ViewState.MARKET_SELECTION) {
        if (manualProduct) {
            setManualProduct({...manualProduct, markets: selectedMarkets});
        }
        setView(ViewState.EDIT);
      }
    }
  }, [selectedProductId, view, isNoResults, searchQuery, useCase, selectedMarkets, manualProduct]);

  const handleBack = () => {
    if (view === ViewState.CONFIRM) {
        setView(ViewState.SEARCH);
    } else if (view === ViewState.MARKET_SELECTION) {
        setView(ViewState.CONFIRM);
    }
  };

  const attemptClose = () => {
    const hasData = searchQuery.length > 0 || selectedProductId !== null || selectedMarkets.length > 0;
    
    if (hasData) {
      setShowExitConfirmation(true);
    } else {
      onClose();
    }
  };

  const confirmExit = () => {
    setShowExitConfirmation(false);
    onClose();
  };

  const cancelExit = () => {
    setShowExitConfirmation(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (showExitConfirmation) {
            e.preventDefault();
        } else if ((view === ViewState.SEARCH || view === ViewState.CONFIRM) && (selectedProductId || isNoResults)) {
          handleNext();
        } else if (view === ViewState.MARKET_SELECTION && canProceedFromMarketSelection) {
            handleNext();
        }
      }
      if (e.key === 'Escape') {
        if (showExitConfirmation) {
            cancelExit();
        } else if (view !== ViewState.EDIT) {
            attemptClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, selectedProductId, isNoResults, handleNext, showExitConfirmation, canProceedFromMarketSelection]);

  const handleCardDoubleClick = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleCancel = () => {
    if (view === ViewState.EDIT) {
        setSearchQuery('');
        setProducts([]);
        setSelectedProductId(null);
        setManualProduct(null);
        setSelectedMarkets([]);
        setView(ViewState.SEARCH);
        setIsTyping(false);
    } else if (view === ViewState.CONFIRM || view === ViewState.MARKET_SELECTION) {
        setView(ViewState.SEARCH);
        setSelectedMarkets([]);
    } else {
        attemptClose();
    }
  };

  const handleRemoveSelection = () => {
    setView(ViewState.SEARCH);
    setSelectedProductId(null);
  };

  const handleSaveProduct = () => {
    onSave?.();
    onClose();
  };

  const productForEdit = selectedProduct 
    ? { ...selectedProduct, markets: selectedMarkets.length > 0 ? selectedMarkets : selectedProduct.markets } 
    : selectedProduct;

  const isEditView = view === ViewState.EDIT;

  return (
    <div 
        className={`fixed inset-0 z-50 flex ${isEditView ? 'items-center' : 'items-end md:items-center'} justify-center ${!isEditView ? 'md:p-6' : ''} backdrop-blur-sm animate-in fade-in duration-200`}
        style={{ backgroundColor: colors.scrim }}
        onClick={attemptClose}
    >
      <div 
        className={
          isEditView
            ? "w-full h-[100dvh] shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out relative"
            : "w-full h-[100dvh] md:w-full md:max-w-4xl md:min-h-[500px] md:h-auto md:max-h-[85vh] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out relative"
        }
        style={{ backgroundColor: colors.surface.light }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {isEditView && productForEdit ? (
            <EditProductView 
                product={productForEdit}
                onSave={handleSaveProduct}
                onCancel={handleCancel}
            />
        ) : (
            <>
                <button 
                    onClick={attemptClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full hover-surface z-50 transition-colors"
                    style={{ color: colors.text.disabled.onLight }}
                >
                    <X size={20} />
                </button>

                <div className="px-5 md:px-10 pt-6 md:pt-8 pb-2 z-20 shrink-0">
                  <div className="flex items-center gap-3 mb-1">
                    {(view === ViewState.CONFIRM || view === ViewState.MARKET_SELECTION) && (
                        <button onClick={handleBack} className="hover:opacity-70 transition-colors" style={{ color: colors.text.disabled.onLight }}>
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <h1 className="text-xl font-bold" style={{ color: colors.text.highEmphasis.onLight }}>Find or create new product</h1>
                  </div>
                  <p className="text-sm" style={{ color: colors.text.lowEmphasis.onLight }}>Look for the product in Metrc database of create a new one</p>
                </div>

                <div className="flex-1 px-5 md:px-10 py-6 overflow-y-auto custom-scrollbar relative transition-colors flex flex-col min-h-0">
                  
                  {view === ViewState.SEARCH && (
                    <div className="h-full flex flex-col">

                      <div className="relative group shrink-0 mb-6 mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 transition-colors" style={{ color: colors.text.disabled.onLight }} />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-11 pr-10 py-3.5 border rounded-xl leading-5 outline-none focus-brand transition-all duration-200 text-sm shadow-sm"
                          style={{
                            backgroundColor: colors.surface.light,
                            borderColor: colors.border.midEmphasis.onLight,
                            color: colors.text.highEmphasis.onLight
                          }}
                          placeholder="Start typing license number or product name..."
                          value={searchQuery}
                          onChange={handleSearch}
                          autoFocus
                        />
                        {searchQuery && (
                          <button 
                            onClick={handleClearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            style={{ color: colors.text.disabled.onLight }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      {!searchQuery && products.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in duration-300 mb-8">
                           <div
                             className="w-14 h-14 rounded-full flex items-center justify-center mb-4 border"
                             style={{ backgroundColor: colors.surface.lightDarker, borderColor: colors.border.lowEmphasis.onLight }}
                           >
                              <Search size={22} style={{ color: colors.text.disabled.onLight }} />
                           </div>
                           <h3 className="text-base font-semibold mb-1" style={{ color: colors.text.highEmphasis.onLight }}>Search for a product</h3>
                           <p className="text-center max-w-xs leading-relaxed text-sm" style={{ color: colors.text.lowEmphasis.onLight }}>
                              Enter the product name or license number to search the Metrc database.
                           </p>
                        </div>
                      )}

                      {isNoResults && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-8 animate-in fade-in">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                            style={{ backgroundColor: colors.surface.lightDarker }}
                          >
                              <Search size={28} style={{ color: colors.text.disabled.onLight }} />
                          </div>
                          <h3 className="text-lg font-bold mb-2" style={{ color: colors.text.highEmphasis.onLight }}>No matches found</h3>
                          <p className="max-w-sm leading-relaxed mb-6" style={{ color: colors.text.lowEmphasis.onLight }}>
                              We couldn't find "<span className="font-semibold" style={{ color: colors.text.highEmphasis.onLight }}>{searchQuery}</span>" in the Metrc database. 
                          </p>
                          <p className="text-sm" style={{ color: colors.text.disabled.onLight }}>You can create a new product entry below.</p>
                        </div>
                      )}

                      {products.length > 0 && (
                          <div className="space-y-4 pb-4">
                            {products.map((product) => (
                              <ProductCard 
                                key={product.id}
                                product={product}
                                isSelected={selectedProductId === product.id}
                                onSelect={setSelectedProductId}
                                onDoubleClick={() => handleCardDoubleClick(product.id)}
                                variant="list"
                              />
                            ))}
                          </div>
                      )}
                    </div>
                  )}

                  {view === ViewState.CONFIRM && selectedProduct && (
                    <div className="py-4 animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col items-center h-full justify-center">
                       <div className="w-full h-full flex items-center justify-center">
                          <ProductCard 
                            product={selectedProduct}
                            isSelected={true}
                            variant="standalone"
                            onRemove={handleRemoveSelection}
                          />
                       </div>
                    </div>
                  )}

                  {view === ViewState.MARKET_SELECTION && selectedProduct && (
                      <MarketSelectionView 
                         product={selectedProduct} 
                         onSelectMarkets={setSelectedMarkets}
                      />
                  )}

                </div>

                <div
                  className="px-5 md:px-10 py-4 md:py-6 mt-auto flex justify-between items-center z-30 transition-colors shrink-0 shadow-none"
                  style={{
                    backgroundColor: colors.surface.light,
                    borderTop: `1px solid ${colors.border.lowEmphasis.onLight}`
                  }}
                >
                  <Button emphasis="mid" onClick={handleCancel}>
                    Cancel
                  </Button>
                  
                  <Button 
                    emphasis="high" 
                    disabled={
                        (view === ViewState.SEARCH && !selectedProductId && !isNoResults) || 
                        (view === ViewState.MARKET_SELECTION && !canProceedFromMarketSelection) ||
                        isGenerating
                    }
                    onClick={handleNext}
                    loading={isGenerating}
                    className={`px-8 transition-all ${isNoResults ? 'min-w-[200px]' : 'min-w-[120px]'}`}
                  >
                    {isNoResults ? (
                       <span className="flex items-center gap-2"><Plus size={16} /> Create new product entry</span>
                    ) : "Next"}
                  </Button>
                </div>

                <ConfirmDialog
                  open={showExitConfirmation}
                  title="Discard changes?"
                  description="You will lose all data entered for this product. Are you sure you want to close?"
                  confirmLabel="Discard & Close"
                  cancelLabel="Keep editing"
                  variant="warning"
                  onConfirm={confirmExit}
                  onCancel={cancelExit}
                />
            </>
        )}
      </div>
    </div>
  );
}
