import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Sparkles, PackageSearch } from 'lucide-react';
import { Product, ViewState } from './types';
import { MOCK_PRODUCTS } from './constants';
import { ProductCard } from './components/ProductCard';
import { Button } from './components/Button';
import { EditProductView } from './components/EditProductView';
import { generateProductFromDescription } from './services/geminiService';

export default function App() {
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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, selectedProductId, handleNext]);

  const handleCardDoubleClick = (productId: string) => {
    setSelectedProductId(productId);
    setTimeout(() => {
      setView(ViewState.CONFIRM);
    }, 50);
  };

  const handleCancel = () => {
    // Reset to initial state
    setSearchQuery('');
    setProducts([]);
    setSelectedProductId(null);
    setView(ViewState.SEARCH);
    setIsTyping(false);
  };

  const handleRemoveSelection = () => {
    setView(ViewState.SEARCH);
  };

  const handleSaveProduct = () => {
    alert("Product saved! (Prototype end)");
    handleCancel();
  };

  // Dynamic sizing for the modal container
  const containerMaxWidth = 'max-w-3xl min-h-[500px] max-h-[90vh]';

  // Render Edit View as full screen overlay
  if (view === ViewState.EDIT && selectedProduct) {
    return (
        <div className="fixed inset-0 w-full h-full bg-white z-50 overflow-hidden flex flex-col animate-in fade-in duration-300">
            <EditProductView 
                product={selectedProduct}
                onSave={handleSaveProduct}
                onCancel={handleCancel}
            />
        </div>
    );
  }

  // Render Search/Confirm Views
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#1B4D3E]">
      
      {/* Modal Container */}
      <div className={`w-full ${containerMaxWidth} bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out`}>
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <h1 className="text-xl font-bold text-gray-900">Register product</h1>
          <p className="text-gray-500 text-sm mt-1">Enter a license number to register a product from the database or create a new one.</p>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-8 py-2 overflow-y-auto custom-scrollbar">
          
          {view === ViewState.SEARCH && (
            <div className="space-y-6 h-full flex flex-col">
              {/* Search Input */}
              <div className="relative group shrink-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all duration-200 sm:text-sm"
                  placeholder="Enter license number (e.g. 12345-NG...)"
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

              {/* Zero State Illustration */}
              {!searchQuery && products.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center -mt-8 animate-in fade-in duration-500">
                   <div className="relative w-48 h-48 mb-4">
                      {/* Soft glow background */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-80"></div>
                      
                      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
                        {/* Document */}
                        <rect x="65" y="55" width="70" height="90" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="2" className="drop-shadow-sm" />
                        
                        {/* Document Lines - varying widths for organic feel */}
                        <rect x="78" y="75" width="30" height="3" rx="1.5" fill="#E5E7EB"/>
                        <rect x="78" y="85" width="44" height="3" rx="1.5" fill="#E5E7EB"/>
                        <rect x="78" y="95" width="40" height="3" rx="1.5" fill="#E5E7EB"/>
                        <rect x="78" y="105" width="20" height="3" rx="1.5" fill="#E5E7EB"/>

                        {/* Magnifying Glass */}
                        <g className="text-emerald-600">
                          <circle cx="115" cy="115" r="26" fill="white" stroke="currentColor" strokeWidth="3.5" className="drop-shadow-md"/>
                          <circle cx="115" cy="115" r="20" fill="#D1FAE5" fillOpacity="0.3"/>
                          <path d="M134 134L148 148" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
                        </g>

                        {/* Sparkle accents */}
                        <path d="M150 70L152 75L157 77L152 79L150 84L148 79L143 77L148 75L150 70Z" fill="#FCD34D" className="animate-pulse" />
                      </svg>
                   </div>
                   
                   <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter license number</h3>
                   <p className="text-gray-500 text-sm text-center max-w-[280px] leading-relaxed">
                     Enter a license number to find a product in the database or create a new listing.
                   </p>
                </div>
              )}

              {/* Gemini AI Assist Trigger */}
              {isTyping && products.length === 0 && !isGenerating && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No products found for "{searchQuery}"</p>
                  <button 
                    onClick={handleGenerateWithAI}
                    className="inline-flex items-center text-sm text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate details with AI
                  </button>
                </div>
              )}

              {/* Search Results List */}
              <div className="space-y-3 pb-4">
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
            </div>
          )}

          {view === ViewState.CONFIRM && selectedProduct && (
            <div className="py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
               {/* Standalone Selected Card */}
               <ProductCard 
                 product={selectedProduct}
                 isSelected={true}
                 variant="standalone"
                 onRemove={handleRemoveSelection}
               />
               <p className="mt-4 text-center text-sm text-gray-500">
                 Please confirm this is the correct product before proceeding.
               </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 mt-auto flex gap-3">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          
          <Button 
            variant="primary" 
            disabled={!selectedProductId}
            onClick={handleNext}
            isLoading={isGenerating}
            className={view === ViewState.CONFIRM ? "bg-[#2D7A65]" : ""}
          >
            {view === ViewState.SEARCH ? 'Next' : 'Confirm selection'}
          </Button>
        </div>

      </div>
    </div>
  );
}