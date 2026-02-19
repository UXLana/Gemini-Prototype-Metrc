import React, { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, ChevronDown, ChevronUp, X, Check, Search } from 'lucide-react';
import { Product } from '../types';
import { Button } from './Button';
import { CustomerPreview } from './CustomerPreview';
import { ALL_MARKETS } from '../constants';

interface EditProductViewProps {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const FEELING_OPTIONS = [
  "Inspired",
  "Energetic",
  "Relaxed",
  "Euphoric",
  "Sleepy",
  "Calm",
  "Focused",
  "Creative",
  "Happy",
  "Hungry"
];

export const EditProductView: React.FC<EditProductViewProps> = ({ product, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isFeelingsOpen, setIsFeelingsOpen] = useState(false);
  const feelingsRef = useRef<HTMLDivElement>(null);

  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [marketSearch, setMarketSearch] = useState('');
  const marketRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: product.name || "",
    brand: product.brand || "",
    category: product.category || "",
    subspecies: product.subspecies || "",
    strain: product.strain || "",
    potency: product.potency || "",
    feelings: product.feelings || [],
    description: product.description || "",
    upc: product.upc || "",
    markets: product.markets || []
  });

  const [previewImage, setPreviewImage] = useState<string>(product.imageUrl);

  const initialFiles = product.imageUrl ? [
    { name: 'product_image_hires.jpg', size: '2.4 MB', thumb: product.imageUrl },
  ] : [];

  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const hasMatchingFile = uploadedFiles.some(file => file.thumb === previewImage);
      if (!hasMatchingFile) {
        setPreviewImage(uploadedFiles[0].thumb);
      }
    } else if (product.imageUrl && !previewImage) {
      setPreviewImage(product.imageUrl);
    }
  }, [uploadedFiles, previewImage, product.imageUrl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (feelingsRef.current && !feelingsRef.current.contains(event.target as Node)) {
        setIsFeelingsOpen(false);
      }
      if (marketRef.current && !marketRef.current.contains(event.target as Node)) {
        setIsMarketOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleFeeling = (feeling: string) => {
    setFormData(prev => {
      const current = prev.feelings;
      const exists = current.includes(feeling);
      return exists
        ? { ...prev, feelings: current.filter(f => f !== feeling) }
        : { ...prev, feelings: [...current, feeling] };
    });
  };

  const toggleMarket = (marketId: string) => {
    setFormData(prev => {
        const current = prev.markets;
        const exists = current.includes(marketId);
        return exists
          ? { ...prev, markets: current.filter(m => m !== marketId) }
          : { ...prev, markets: [...current, marketId] };
    });
  };

  const filteredMarkets = ALL_MARKETS.filter(m => 
    m.name.toLowerCase().includes(marketSearch.toLowerCase()) || 
    m.id.toLowerCase().includes(marketSearch.toLowerCase())
  );

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewImage(objectUrl);
        setUploadedFiles(prev => [
            ...prev,
            { name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + ' MB', thumb: objectUrl }
        ]);
    }
  };

  const handleDeleteFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    if (newFiles.length === 0) {
        setPreviewImage("");
    } else {
        setPreviewImage(newFiles[newFiles.length - 1].thumb);
    }
  };

  const handleSave = () => {
    const updatedProduct: Product = {
        ...product,
        ...formData,
        totalMarkets: formData.markets.length,
        imageUrl: previewImage
    };
    onSave(updatedProduct);
  };

  const getMarketText = () => {
      if (formData.markets.length === 0) return "Select Market";
      const names = formData.markets.map(id => ALL_MARKETS.find(m => m.id === id)?.name || id);
      return names.join(", ");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Top Bar - Sticky Header (h-16 fixed height) */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
          <h2 className="text-sm font-medium text-gray-900 dark:text-white hidden sm:block">{formData.name || 'New Product'}</h2>
        </div>
        <Button onClick={handleSave} className="px-5 py-2 text-xs font-bold shadow-sm">
          Save
        </Button>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 z-40">
        <button 
          className={`flex-1 py-4 text-xs font-bold transition-colors ${activeTab === 'edit' ? 'text-brand-700 dark:text-brand-400 border-b-2 border-brand-700 dark:border-brand-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('edit')}
        >
          Edit product
        </button>
        <button 
          className={`flex-1 py-4 text-xs font-bold transition-colors ${activeTab === 'preview' ? 'text-brand-700 dark:text-brand-400 border-b-2 border-brand-700 dark:border-brand-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('preview')}
        >
          Customer preview
        </button>
      </div>

      <div className="flex-1 overflow-hidden w-full">
        <div className="h-full overflow-y-auto custom-scrollbar w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-1 min-h-full w-full">
            
            {/* LEFT: FORM SECTION */}
            <div className={`
                w-full p-6 lg:pl-16 lg:pr-8 
                pt-8 lg:pt-8 lg:pb-12
                xl:pl-24 xl:pr-8
                flex flex-col items-end 
                ${activeTab === 'edit' ? 'flex' : 'hidden'} lg:flex 
                bg-white dark:bg-gray-800 
                lg:order-1 transition-colors
            `}>
              <div className="w-full max-w-[500px] ml-auto">
                <div className="mb-8 lg:mb-10">
                  <h1 className="text-2xl font-bold mb-2">Edit product</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Here you can register your product and preview how it will appear to customers.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Name</label>
                      <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="form-input" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Brand</label>
                        <div className="relative">
                          <select name="brand" value={formData.brand} onChange={handleInputChange} className="form-select">
                            <option value="">Select Brand</option>
                            <option value="Wyld">Wyld</option>
                            <option value="Kynd">Kynd</option>
                            <option value="Kiva / Camino">Kiva / Camino</option>
                            <option value="Heavy Hitters">Heavy Hitters</option>
                            <option value="710 Labs">710 Labs</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Category</label>
                        <div className="relative">
                          <select name="category" value={formData.category} onChange={handleInputChange} className="form-select">
                            <option value="">Select Category</option>
                            <option value="Flower">Flower</option>
                            <option value="Edibles">Edibles</option>
                            <option value="Vape">Vape</option>
                            <option value="Concentrate">Concentrate</option>
                            <option value="Pre-Roll">Pre-Roll</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Subspecies</label>
                        <div className="relative">
                          <select name="subspecies" value={formData.subspecies} onChange={handleInputChange} className="form-select">
                            <option value="">Select Subspecies</option>
                            <option value="Sativa">Sativa</option>
                            <option value="Indica">Indica</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Strain</label>
                        <div className="relative">
                          <select name="strain" value={formData.strain} onChange={handleInputChange} className="form-select">
                            <option value="">Select Strain</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Raspberry">Raspberry</option>
                            <option value="Kush Mints">Kush Mints</option>
                            <option value="Midnight Blueberry">Midnight Blueberry</option>
                            <option value="Northern Lights">Northern Lights</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Potency</label>
                      <div className="relative">
                        <select name="potency" value={formData.potency} onChange={handleInputChange} className="form-select">
                          <option value="">Select Potency</option>
                          <option value="10 mg of THC">10 mg of THC</option>
                          <option value="100 mg of THC">100 mg of THC</option>
                          <option value="20% THC">20% THC</option>
                          <option value="24% THC">24% THC</option>
                          <option value="28% THC">28% THC</option>
                          <option value="78% THC">78% THC</option>
                          <option value="90% THC">90% THC</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="relative" ref={feelingsRef}>
                      <label className="form-label">Feelings (optional)</label>
                      
                      <div 
                        onClick={() => setIsFeelingsOpen(!isFeelingsOpen)}
                        className={`form-input cursor-pointer flex justify-between items-center ${isFeelingsOpen ? 'ring-1 ring-brand-500 border-brand-500' : ''}`}
                      >
                         <span className={formData.feelings.length === 0 ? "text-gray-400" : "text-gray-900 dark:text-white truncate pr-2"}>
                            {formData.feelings.length > 0 
                                ? formData.feelings.join(", ") 
                                : "Select Feelings"
                            }
                         </span>
                         {isFeelingsOpen ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
                      </div>

                      {isFeelingsOpen && (
                        <div className="dropdown-menu max-h-60 overflow-y-auto">
                            {FEELING_OPTIONS.map(option => {
                                const isSelected = formData.feelings.includes(option);
                                return (
                                    <div 
                                        key={option}
                                        onClick={() => toggleFeeling(option)}
                                        className={`dropdown-item ${isSelected ? 'dropdown-item-selected' : 'text-gray-700 dark:text-gray-200'}`}
                                    >
                                        <div className={`check-indicator mr-3 ${isSelected ? 'check-indicator-on' : 'check-indicator-off'}`}>
                                            {isSelected && <Check size={10} className="text-white" />}
                                        </div>
                                        {option}
                                    </div>
                                )
                            })}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="form-label">Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter a product description..." rows={6} className="form-input resize-none leading-relaxed" />
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-gray-400">Assistive text</span>
                        <span className="text-[10px] text-gray-400">0/30</span>
                      </div>
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="pt-8">
                    <h3 className="text-xl font-bold mb-1">Upload product image</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-5">Best practices for product image upload go here</p>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                    />

                    <div 
                        onClick={handleFileClick}
                        className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-brand-500 transition-all mb-4 group bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-2 mb-1 pointer-events-none">
                        <Upload size={18} className="text-gray-400 group-hover:text-brand-500 transition-colors" />
                        <p className="text-xs text-gray-600 dark:text-gray-300">Drag and drop or <span className="text-brand-700 dark:text-brand-400 underline font-semibold">browse files</span></p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-700 flex items-center justify-center border border-gray-100 dark:border-gray-600">
                               <img src={file.thumb} alt="" className="w-full h-full object-cover" />
                             </div>
                             <div>
                               <p className="text-xs font-bold text-gray-900 dark:text-white">{file.name}</p>
                               <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">{file.size}</p>
                             </div>
                          </div>
                          <button onClick={() => handleDeleteFile(idx)} className="text-gray-300 hover:text-important p-2">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Internal use */}
                  <div className="pt-8">
                    <h3 className="text-xl font-bold mb-1">Internal use</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-5">Microcopy goes here</p>
                    <div className="space-y-4">
                      <div>
                        <label className="form-label">Inventory UPC (optional)</label>
                        <input name="upc" value={formData.upc} onChange={handleInputChange} placeholder="UPC Code" className="form-input" />
                      </div>
                      
                      {/* Market Multi-Select Dropdown */}
                      <div className="relative" ref={marketRef}>
                        <label className="form-label">Market</label>
                        
                        <div 
                            onClick={() => setIsMarketOpen(!isMarketOpen)}
                            className={`form-input cursor-pointer flex justify-between items-center ${isMarketOpen ? 'ring-1 ring-brand-500 border-brand-500' : ''}`}
                        >
                            <span className={formData.markets.length === 0 ? "text-gray-400" : "text-gray-900 dark:text-white truncate pr-2"}>
                                {getMarketText()}
                            </span>
                            {isMarketOpen ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
                        </div>

                        {isMarketOpen && (
                            <div className="dropdown-menu max-h-60 flex flex-col">
                                <div className="p-2 border-b border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-t-md">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="Search markets..." 
                                            value={marketSearch}
                                            onChange={(e) => setMarketSearch(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-md focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 text-gray-700 dark:text-gray-200 placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                                
                                <div className="overflow-y-auto flex-1 p-1">
                                    {filteredMarkets.length > 0 ? filteredMarkets.map(market => {
                                        const isSelected = formData.markets.includes(market.id);
                                        return (
                                            <div 
                                                key={market.id}
                                                onClick={() => toggleMarket(market.id)}
                                                className={`dropdown-item ${isSelected ? 'dropdown-item-selected' : 'text-gray-700 dark:text-gray-200'}`}
                                            >
                                                <div className={`check-indicator mr-3 ${isSelected ? 'check-indicator-on' : 'check-indicator-off'}`}>
                                                    {isSelected && <Check size={10} className="text-white" />}
                                                </div>
                                                <div className="flex-1 flex justify-between">
                                                    <span>{market.name}</span>
                                                    <span className="text-xs text-gray-400 font-mono">{market.id}</span>
                                                </div>
                                            </div>
                                        )
                                    }) : (
                                        <div className="p-4 text-center text-xs text-gray-400 italic">No markets found</div>
                                    )}
                                </div>
                            </div>
                        )}
                      </div>

                      <div className="pt-6">
                        <button className="text-important-text dark:text-important text-xs font-bold hover:underline">Archive product</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: CUSTOMER PREVIEW SECTION */}
            <div className={`bg-gray-50 dark:bg-gray-900 flex flex-col lg:border-l border-gray-100 dark:border-gray-700 ${activeTab === 'preview' ? 'block' : 'hidden'} lg:block lg:order-2 transition-colors`} style={{ minHeight: '100%' }}>
              <div className="
                  sticky top-16 
                  flex flex-col items-center lg:items-start 
                  pt-[40px] pb-10 
                  px-6 lg:pb-12 lg:px-12 
                  h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar
              ">
                <CustomerPreview
                  formData={formData}
                  images={uploadedFiles}
                  activeImage={previewImage}
                  onImageChange={setPreviewImage}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};