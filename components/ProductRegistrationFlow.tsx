import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Sparkles, ArrowLeft, Plus, AlertCircle, AlertTriangle } from 'lucide-react';
import { Product, ViewState } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';
import { Button } from './Button';
import { EditProductView } from './EditProductView';
import { MarketSelectionView } from './MarketSelectionView'; // Import new component
import { generateProductFromDescription } from '../services/geminiService';
import { UseCase } from '../App';

interface ProductRegistrationFlowProps {
  onClose: () => void;
  useCase: UseCase;
}

export const ProductRegistrationFlow: React.FC<ProductRegistrationFlowProps> = ({ onClose, useCase }) => {
  // Application State
  const [view, setView] = useState<ViewState>(ViewState.SEARCH);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [manualProduct, setManualProduct] = useState<Product | null>(null);
  
  // Exit Confirmation State
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  // State for Use Case 3
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);

  // Derived State
  const selectedProduct = manualProduct || products.find(p => p.id === selectedProductId);
  const isNoResults = isTyping && products.length === 0 && !isGenerating && searchQuery.length > 0;

  // If we are in Market Selection, we need to know if the user has selected at least one to enable "Next"
  const canProceedFromMarketSelection = view === ViewState.MARKET_SELECTION && selectedMarkets.length > 0;

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Reset selection if user types again
    if (selectedProductId) {
        setSelectedProductId(null);
    }

    if (query.length > 0) {
      setIsTyping(true);
      // Simulate API search latency slightly for realism
      setTimeout(() => {
        // UseCase 2 Logic: Always return empty if Mode is 'empty-search'
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
      imageUrl: "", // Empty image for manual creation
      description: ""
    };
    setManualProduct(freshProduct);
    setView(ViewState.EDIT);
  };

  const handleGenerateWithAI = async () => {
    if (!searchQuery) return;
    setIsGenerating(true);
    // Use the Gemini service to "create" a product based on the search query as a description
    const newProduct = await generateProductFromDescription(searchQuery);
    if (newProduct) {
      // Prepend to products list and select it
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
        // Use Case 3 Logic: Go to Market Selection instead of Edit directly
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

  // Back Handler
  const handleBack = () => {
    if (view === ViewState.CONFIRM) {
        setView(ViewState.SEARCH);
    } else if (view === ViewState.MARKET_SELECTION) {
        setView(ViewState.CONFIRM);
    }
  };

  // Close / Cancel logic with confirmation
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

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (showExitConfirmation) {
            e.preventDefault();
            // Optional: Confirm exit on Enter? usually better to make them click
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
    alert("Product saved! (Prototype end)");
    onClose();
  };

  // Prepare product with updated markets if coming from Market Selection
  const productForEdit = selectedProduct 
    ? { ...selectedProduct, markets: selectedMarkets.length > 0 ? selectedMarkets : selectedProduct.markets } 
    : selectedProduct;

  // Dynamic sizing for the modal container
  const isEditView = view === ViewState.EDIT;
  const containerMaxWidth = isEditView
    ? 'max-w-6xl h-[85vh] min-h-[500px]' 
    : 'max-w-4xl min-h-[500px] h-auto max-h-[85vh]';

  return (
    // Scrim: lighter background, click to close
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={attemptClose}
    >
      
      {/* Modal Container - Unified Background */}
      <div 
        className={`w-full ${containerMaxWidth} bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out relative`}
        onClick={(e) => e.stopPropagation()} // Prevent click propagation to scrim
      >
        
        {isEditView && productForEdit ? (
            <EditProductView 
                product={productForEdit}
                onSave={handleSaveProduct}
                onCancel={handleCancel}
            />
        ) : (
            <>
                {/* Close Button */}
                <button 
                    onClick={attemptClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header Section (Unified BG) */}
                <div className="px-10 pt-8 pb-2 z-20">
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

                {/* Content Area */}
                <div className="flex-1 px-10 py-6 overflow-y-auto custom-scrollbar relative transition-colors flex flex-col">
                  
                  {view === ViewState.SEARCH && (
                    <div className="h-full flex flex-col">

                       {/* Search Input - Moved to Body */}
                      <div className="relative group shrink-0 mb-6 mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-11 pr-10 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:placeholder-gray-300 dark:focus:placeholder-gray-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all duration-200 text-sm shadow-sm text-gray-900 dark:text-white"
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
                      
                      {/* Zero State */}
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

                      {/* No Results Found State */}
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

                      {/* Search Results List */}
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

                  {/* MARKET SELECTION VIEW */}
                  {view === ViewState.MARKET_SELECTION && selectedProduct && (
                      <MarketSelectionView 
                         product={selectedProduct} 
                         onSelectMarkets={setSelectedMarkets}
                      />
                  )}

                </div>

                {/* Footer Actions (Unified BG, just spacing) */}
                <div className="px-10 py-6 mt-auto flex justify-between items-center z-20 transition-colors">
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

                {/* EXIT CONFIRMATION DIALOG OVERLAY */}
                {showExitConfirmation && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 max-w-sm w-full transform scale-100">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full shrink-0">
                                    <AlertTriangle className="text-amber-600 dark:text-amber-500" size={24} />
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
                                    className="px-4 py-2 rounded-2xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
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
