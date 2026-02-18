import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Sparkles, ArrowLeft } from 'lucide-react';
import { Product, ViewState } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';
import { Button } from './Button';
import { EditProductView } from './EditProductView';
import { generateProductFromDescription } from '../services/geminiService';

interface ProductRegistrationFlowProps {
  onClose: () => void;
}

export const ProductRegistrationFlow: React.FC<ProductRegistrationFlowProps> = ({ onClose }) => {
  // Application State
  const [view, setView] = useState<ViewState>(ViewState.SEARCH);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Derived State
  const selectedProduct = products.find(p => p.id === selectedProductId);

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
        const filtered = MOCK_PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) || 
          p.licenseNumber.includes(query)
        );
        setProducts(filtered);
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
    if (selectedProductId) {
      if (view === ViewState.SEARCH) {
        setView(ViewState.CONFIRM);
      } else if (view === ViewState.CONFIRM) {
        setView(ViewState.EDIT);
      }
    }
  }, [selectedProductId, view]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if ((view === ViewState.SEARCH || view === ViewState.CONFIRM) && selectedProductId) {
          handleNext();
        }
      }
      if (e.key === 'Escape') {
        if (view !== ViewState.EDIT) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, selectedProductId, handleNext, onClose]);

  const handleCardDoubleClick = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleCancel = () => {
    if (view === ViewState.EDIT) {
        setSearchQuery('');
        setProducts([]);
        setSelectedProductId(null);
        setView(ViewState.SEARCH);
        setIsTyping(false);
    } else if (view === ViewState.CONFIRM) {
        setView(ViewState.SEARCH);
    } else {
        onClose();
    }
  };

  const handleRemoveSelection = () => {
    setView(ViewState.SEARCH);
  };

  const handleSaveProduct = () => {
    alert("Product saved! (Prototype end)");
    onClose();
  };

  // Dynamic sizing for the modal container
  const containerMaxWidth = 'max-w-5xl min-h-[650px] max-h-[90vh]';

  // Render Edit View as full screen overlay
  if (view === ViewState.EDIT && selectedProduct) {
    return (
        <div className="fixed inset-0 w-full h-full bg-white z-[60] overflow-hidden flex flex-col animate-in fade-in duration-300">
            <EditProductView 
                product={selectedProduct}
                onSave={handleSaveProduct}
                onCancel={handleCancel}
            />
        </div>
    );
  }

  // Render Search/Confirm Views inside the dark green overlay
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1B4D3E]/95 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className={`w-full ${containerMaxWidth} bg-[#F9FAFB] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out relative`}>
        
        {/* Close Button absolute top right */}
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 z-10 transition-colors"
        >
            <X size={20} />
        </button>

        {/* Header */}
        <div className="px-10 pt-10 pb-2 bg-white border-b border-gray-100 shadow-sm z-20">
          <div className="flex items-center gap-3 mb-2">
            {view === ViewState.CONFIRM && (
                <button onClick={() => setView(ViewState.SEARCH)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <ArrowLeft size={24} />
                </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">Find or create new product</h1>
          </div>
          <p className="text-gray-500 text-sm mb-6">Look for the product in Metrc database of create a new one</p>

          {/* Search Input - Always visible in SEARCH view */}
          {view === ViewState.SEARCH && (
             <div className="relative group shrink-0 mb-8">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-10 py-3.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all duration-200 text-base shadow-sm"
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
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 px-10 py-6 overflow-y-auto custom-scrollbar bg-[#F9FAFB] relative">
          
          {view === ViewState.SEARCH && (
            <div className="h-full flex flex-col">
              
              {/* Zero State - Prominent and Centered */}
              {!searchQuery && products.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                      <Search size={32} className="text-gray-300" />
                   </div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Search for a product</h3>
                   <p className="text-gray-500 text-center max-w-xs leading-relaxed">
                      Enter the product name or license number to search the Metrc database.
                   </p>
                </div>
              )}

              {/* AI Assist - No Results Found */}
              {isTyping && products.length === 0 && !isGenerating && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8 animate-in fade-in">
                  <p className="text-gray-500 mb-5">No products found for "<span className="font-medium text-gray-900">{searchQuery}</span>"</p>
                  <button 
                    onClick={handleGenerateWithAI}
                    className="inline-flex items-center text-sm text-emerald-700 hover:text-emerald-800 font-medium transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm border border-emerald-100 hover:border-emerald-200 hover:shadow-md"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate details with AI
                  </button>
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
               <div className="w-full">
                  <ProductCard 
                    product={selectedProduct}
                    isSelected={true}
                    variant="standalone"
                    onRemove={handleRemoveSelection}
                  />
               </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-10 py-6 bg-white border-t border-gray-100 mt-auto flex justify-between items-center z-20">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          
          <Button 
            variant="primary" 
            disabled={!selectedProductId}
            onClick={handleNext}
            isLoading={isGenerating}
            className="px-8 min-w-[120px]"
          >
            {view === ViewState.SEARCH ? 'Next' : 'Next'}
          </Button>
        </div>

      </div>
    </div>
  );
}