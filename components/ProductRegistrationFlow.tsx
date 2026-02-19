import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Sparkles, ArrowLeft, Plus, AlertCircle, AlertTriangle } from 'lucide-react';
import { Product, ViewState } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';
import { Button } from './Button';
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
  
  const scrimClassName = isEditView
    ? "fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200" 
    : "fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200";

  const containerClassName = isEditView
    ? "w-full h-[100dvh] bg-white dark:bg-gray-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out relative"
    : "w-full h-[100dvh] md:w-full md:max-w-4xl md:min-h-[500px] md:h-auto md:max-h-[85vh] md:translate-x-[100px] bg-white dark:bg-gray-800 md:rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out relative";

  return (
    <div 
        className={scrimClassName}
        onClick={attemptClose}
    >
      <div 
        className={containerClassName}
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
                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-50 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="px-5 md:px-10 pt-6 md:pt-8 pb-2 z-20 shrink-0">
                  <div className="flex items-center gap-3 mb-1">
                    {(view === ViewState.CONFIRM || view === ViewState.MARKET_SELECTION) && (
                        <button onClick={handleBack} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Find or create new product</h1>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Look for the product in Metrc database of create a new one</p>
                </div>

                <div className="flex-1 px-5 md:px-10 py-6 overflow-y-auto custom-scrollbar relative transition-colors flex flex-col min-h-0">
                  
                  {view === ViewState.SEARCH && (
                    <div className="h-full flex flex-col">

                      <div className="relative group shrink-0 mb-6 mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-11 pr-10 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:placeholder-gray-300 dark:focus:placeholder-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-200 text-sm shadow-sm text-gray-900 dark:text-white"
                          placeholder="Start typing license number or product name..."
                          value={searchQuery}
                          onChange={handleSearch}
                          autoFocus
                        />
                        {searchQuery && (
                          <button 
                            onClick={handleClearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      {!searchQuery && products.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in duration-300 mb-8">
                           <div className="w-14 h-14 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-600">
                              <Search size={22} className="text-gray-300 dark:text-gray-500" />
                           </div>
                           <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Search for a product</h3>
                           <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs leading-relaxed text-sm">
                              Enter the product name or license number to search the Metrc database.
                           </p>
                        </div>
                      )}

                      {isNoResults && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-8 animate-in fade-in">
                          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-5">
                              <Search className="text-gray-400 dark:text-gray-500" size={28} />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No matches found</h3>
                          <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed mb-6">
                              We couldn't find "<span className="font-semibold text-gray-900 dark:text-white">{searchQuery}</span>" in the Metrc database. 
                          </p>
                          <p className="text-sm text-gray-400 dark:text-gray-500">You can create a new product entry below.</p>
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

                <div className="px-5 md:px-10 py-4 md:py-6 mt-auto flex justify-between items-center z-30 transition-colors bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-none">
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    disabled={
                        (view === ViewState.SEARCH && !selectedProductId && !isNoResults) || 
                        (view === ViewState.MARKET_SELECTION && !canProceedFromMarketSelection) ||
                        isGenerating
                    }
                    onClick={handleNext}
                    isLoading={isGenerating}
                    className={`px-8 transition-all ${isNoResults ? 'min-w-[200px]' : 'min-w-[120px]'}`}
                  >
                    {isNoResults ? (
                       <span className="flex items-center gap-2"><Plus size={16} /> Create new product entry</span>
                    ) : "Next"}
                  </Button>
                </div>

                {showExitConfirmation && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 max-w-sm w-full transform scale-100">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="bg-warning-icon-bg dark:bg-warning-surface p-2 rounded-full shrink-0">
                                    <AlertTriangle className="text-warning dark:text-warning-text" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Discard changes?</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                        You will lose all data entered for this product. Are you sure you want to close?
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="secondary" onClick={cancelExit} className="px-4 py-2">
                                    Keep editing
                                </Button>
                                <button 
                                    onClick={confirmExit}
                                    className="px-4 py-2 rounded-2xl text-sm font-medium bg-important-action hover:bg-important-action-hover text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-important"
                                >
                                    Discard & Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}
