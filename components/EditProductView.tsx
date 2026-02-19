import React, { useState, useRef, useEffect } from 'react';
import { Upload, Trash2, ChevronDown, ChevronUp, X, Image as ImageIcon, Check, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { Button } from './Button';
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
  
  // Feelings Dropdown State
  const [isFeelingsOpen, setIsFeelingsOpen] = useState(false);
  const feelingsRef = useRef<HTMLDivElement>(null);

  // Market Dropdown State
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [marketSearch, setMarketSearch] = useState('');
  const marketRef = useRef<HTMLDivElement>(null);

  // Initialize form with product data
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

  // Track the active preview image
  const [previewImage, setPreviewImage] = useState<string>(product.imageUrl);

  const initialFiles = product.imageUrl ? [
    { name: 'product_image_hires.jpg', size: '2.4 MB', thumb: product.imageUrl },
  ] : [];

  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);

  // Slideshow Touch State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Click outside handlers
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
      if (exists) {
        return { ...prev, feelings: current.filter(f => f !== feeling) };
      } else {
        return { ...prev, feelings: [...current, feeling] };
      }
    });
  };

  const toggleMarket = (marketId: string) => {
    setFormData(prev => {
        const current = prev.markets;
        const exists = current.includes(marketId);
        if (exists) {
            return { ...prev, markets: current.filter(m => m !== marketId) };
        } else {
            return { ...prev, markets: [...current, marketId] };
        }
    });
  };

  const filteredMarkets = ALL_MARKETS.filter(m => 
    m.name.toLowerCase().includes(marketSearch.toLowerCase()) || 
    m.id.toLowerCase().includes(marketSearch.toLowerCase())
  );

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // Create a fake URL for the uploaded file to preview it
        const objectUrl = URL.createObjectURL(file);
        
        // Update state
        setPreviewImage(objectUrl);
        setUploadedFiles(prev => [
            ...prev,
            {
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                thumb: objectUrl
            }
        ]);
    }
  };

  const handleDeleteFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    
    // If we deleted the current preview, revert to default or empty
    if (newFiles.length === 0) {
        setPreviewImage("");
    } else {
        // Switch to the previous image if available
        setPreviewImage(newFiles[newFiles.length - 1].thumb);
    }
  };

  // Slideshow Navigation Handlers
  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (uploadedFiles.length <= 1) return;
    const currentIndex = uploadedFiles.findIndex(f => f.thumb === previewImage);
    const nextIndex = (currentIndex + 1) % uploadedFiles.length;
    setPreviewImage(uploadedFiles[nextIndex].thumb);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (uploadedFiles.length <= 1) return;
    const currentIndex = uploadedFiles.findIndex(f => f.thumb === previewImage);
    const prevIndex = (currentIndex - 1 + uploadedFiles.length) % uploadedFiles.length;
    setPreviewImage(uploadedFiles[prevIndex].thumb);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) handleNextImage();
    if (isRightSwipe) handlePrevImage();
  };

  const handleSave = () => {
    const updatedProduct: Product = {
        ...product,
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        subspecies: formData.subspecies,
        strain: formData.strain,
        potency: formData.potency,
        feelings: formData.feelings,
        description: formData.description,
        upc: formData.upc,
        markets: formData.markets,
        totalMarkets: formData.markets.length,
        imageUrl: previewImage
    };
    onSave(updatedProduct);
  };

  // Common styling for inputs to ensure white background
  const inputStyle = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-1 focus:ring-emerald-600 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors";
  const labelStyle = "block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5";

  // Formatted market text
  const getMarketText = () => {
      if (formData.markets.length === 0) return "Select Market";
      const names = formData.markets.map(id => ALL_MARKETS.find(m => m.id === id)?.name || id);
      return names.join(", ");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">{formData.name || 'New Product'}</h2>
        </div>
        <Button onClick={handleSave} className="bg-[#2D7A65] hover:bg-[#236351] text-white px-5 py-2 rounded-lg text-xs font-bold shadow-sm">
          Save
        </Button>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 z-40">
        <button 
          className={`flex-1 py-4 text-xs font-bold transition-colors ${activeTab === 'edit' ? 'text-emerald-800 dark:text-emerald-400 border-b-2 border-emerald-800 dark:border-emerald-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('edit')}
        >
          Edit product
        </button>
        <button 
          className={`flex-1 py-4 text-xs font-bold transition-colors ${activeTab === 'preview' ? 'text-emerald-800 dark:text-emerald-400 border-b-2 border-emerald-800 dark:border-emerald-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('preview')}
        >
          Customer preview
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-full">
            
            {/* LEFT: FORM SECTION (Order 1) */}
            <div className={`p-10 lg:px-12 lg:pt-8 lg:pb-20 flex flex-col items-end ${activeTab === 'edit' ? 'block' : 'hidden'} lg:block bg-white dark:bg-gray-800 lg:order-1 transition-colors`}>
              <div className="w-full max-w-[500px]">
                <div className="mb-10">
                  <h1 className="text-2xl font-bold mb-2">Edit product</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Here you can register your product and preview how it will appear to customers.</p>
                </div>

                <div className="space-y-6">
                  {/* Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className={labelStyle}>Name</label>
                      <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className={inputStyle} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyle}>Brand</label>
                        <div className="relative">
                          <select name="brand" value={formData.brand} onChange={handleInputChange} className={`${inputStyle} appearance-none`}>
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
                        <label className={labelStyle}>Category</label>
                        <div className="relative">
                          <select name="category" value={formData.category} onChange={handleInputChange} className={`${inputStyle} appearance-none`}>
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
                        <label className={labelStyle}>Subspecies</label>
                        <div className="relative">
                          <select name="subspecies" value={formData.subspecies} onChange={handleInputChange} className={`${inputStyle} appearance-none`}>
                            <option value="">Select Subspecies</option>
                            <option value="Sativa">Sativa</option>
                            <option value="Indica">Indica</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className={labelStyle}>Strain</label>
                        <div className="relative">
                          <select name="strain" value={formData.strain} onChange={handleInputChange} className={`${inputStyle} appearance-none`}>
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
                      <label className={labelStyle}>Potency</label>
                      <div className="relative">
                        <select name="potency" value={formData.potency} onChange={handleInputChange} className={`${inputStyle} appearance-none`}>
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
                      <label className={labelStyle}>Feelings (optional)</label>
                      
                      {/* Custom Dropdown Trigger */}
                      <div 
                        onClick={() => setIsFeelingsOpen(!isFeelingsOpen)}
                        className={`${inputStyle} cursor-pointer flex justify-between items-center ${isFeelingsOpen ? 'ring-1 ring-emerald-600 border-emerald-600' : ''}`}
                      >
                         <span className={formData.feelings.length === 0 ? "text-gray-400" : "text-gray-900 dark:text-white truncate pr-2"}>
                            {formData.feelings.length > 0 
                                ? formData.feelings.join(", ") 
                                : "Select Feelings"
                            }
                         </span>
                         {isFeelingsOpen ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
                      </div>

                      {/* Custom Dropdown Menu */}
                      {isFeelingsOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {FEELING_OPTIONS.map(option => {
                                const isSelected = formData.feelings.includes(option);
                                return (
                                    <div 
                                        key={option}
                                        onClick={() => toggleFeeling(option)}
                                        className={`flex items-center px-3 py-2.5 cursor-pointer text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${isSelected ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100' : 'text-gray-700 dark:text-gray-200'}`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700'}`}>
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
                      <label className={labelStyle}>Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter a product description..." rows={6} className={`${inputStyle} resize-none leading-relaxed`} />
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
                    
                    {/* Hidden File Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                    />

                    <div 
                        onClick={handleFileClick}
                        className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-emerald-500 transition-all mb-4 group bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-2 mb-1 pointer-events-none">
                        <Upload size={18} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                        <p className="text-xs text-gray-600 dark:text-gray-300">Drag and drop or <span className="text-emerald-800 dark:text-emerald-400 underline font-semibold">browse files</span></p>
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
                          <button onClick={() => handleDeleteFile(idx)} className="text-gray-300 hover:text-red-500 p-2">
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
                        <label className={labelStyle}>Inventory UPC (optional)</label>
                        <input name="upc" value={formData.upc} onChange={handleInputChange} placeholder="UPC Code" className={inputStyle} />
                      </div>
                      
                      {/* Market Multi-Select Dropdown with Search */}
                      <div className="relative" ref={marketRef}>
                        <label className={labelStyle}>Market</label>
                        
                        {/* Custom Dropdown Trigger */}
                        <div 
                            onClick={() => setIsMarketOpen(!isMarketOpen)}
                            className={`${inputStyle} cursor-pointer flex justify-between items-center ${isMarketOpen ? 'ring-1 ring-emerald-600 border-emerald-600' : ''}`}
                        >
                            <span className={formData.markets.length === 0 ? "text-gray-400" : "text-gray-900 dark:text-white truncate pr-2"}>
                                {getMarketText()}
                            </span>
                            {isMarketOpen ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
                        </div>

                        {/* Dropdown Content */}
                        {isMarketOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 flex flex-col">
                                {/* Search Bar Fixed at Top - Explicitly Light Mode */}
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
                                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-md focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-700 dark:text-gray-200 placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                                
                                {/* Scrollable List */}
                                <div className="overflow-y-auto flex-1 p-1">
                                    {filteredMarkets.length > 0 ? filteredMarkets.map(market => {
                                        const isSelected = formData.markets.includes(market.id);
                                        return (
                                            <div 
                                                key={market.id}
                                                onClick={() => toggleMarket(market.id)}
                                                className={`flex items-center px-3 py-2 cursor-pointer text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${isSelected ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100' : 'text-gray-700 dark:text-gray-200'}`}
                                            >
                                                {/* Checkbox Style - Light Mode */}
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700'}`}>
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
                        <button className="text-red-700 dark:text-red-400 text-xs font-bold hover:underline">Archive product</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: CUSTOMER PREVIEW SECTION (Order 2) */}
            <div className={`bg-[#F9FAFB] dark:bg-gray-900 flex flex-col items-center justify-center lg:border-l border-gray-100 dark:border-gray-700 ${activeTab === 'preview' ? 'block' : 'hidden'} lg:block sticky top-0 h-full min-h-[600px] lg:order-2 transition-colors`}>
              <div className="w-full max-w-[480px] p-10">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">Customer preview</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Product information people see when they scan the barcode</p>
                </div>

                {/* iPhone-style Preview Card - SHADOW REMOVED */}
                <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden flex flex-col h-full max-h-[780px]">
                  <div className="p-8 pb-4">
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">{formData.brand || 'BRAND'}</p>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{formData.name || 'Product Name'}</h3>
                    <p className="text-[10px] text-gray-500 mt-1">Count: 10</p>
                  </div>

                  <div 
                    className="px-8 mb-6 relative flex flex-col items-center group"
                  >
                    <div 
                        className="w-full aspect-[1/0.85] rounded-xl overflow-hidden mb-4 bg-gray-50/50 flex items-center justify-center border border-gray-50 relative isolate"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                      {uploadedFiles.length > 0 ? (
                         uploadedFiles.map((file, idx) => (
                             <img 
                                key={file.thumb} // Using thumb URL as key to ensure uniqueness
                                src={file.thumb} 
                                alt="" 
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${previewImage === file.thumb ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} 
                             />
                         ))
                      ) : (
                         <div className="text-gray-300 flex flex-col items-center z-20">
                            <ImageIcon size={48} className="mb-2 opacity-50" />
                            <span className="text-xs font-medium">No Image</span>
                         </div>
                      )}
                      
                      {/* Left/Right Arrows for Slideshow - On Top Layer */}
                      {uploadedFiles.length > 1 && (
                        <div className="absolute inset-0 z-20 flex items-center justify-between px-2 pointer-events-none">
                            <button 
                                onClick={handlePrevImage}
                                className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 pointer-events-auto cursor-pointer"
                            >
                                <ChevronLeft size={18} className="text-gray-800" />
                            </button>
                            <button 
                                onClick={handleNextImage}
                                className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 pointer-events-auto cursor-pointer"
                            >
                                <ChevronRight size={18} className="text-gray-800" />
                            </button>
                        </div>
                      )}
                    </div>

                    {/* Functional Slideshow Dots */}
                    {uploadedFiles.length > 0 && (
                      <div className="flex gap-1.5 z-10">
                        {uploadedFiles.map((file, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPreviewImage(file.thumb)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              previewImage === file.thumb 
                                ? 'w-5 bg-gray-800' 
                                : 'w-1.5 bg-gray-200 hover:bg-gray-300'
                            }`}
                            aria-label={`View image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="px-8 pb-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-50">
                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Category</p>
                        <p className="text-[11px] font-bold text-gray-900 leading-tight">{formData.category || '—'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-50">
                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Subspecies</p>
                        <p className="text-[11px] font-bold text-gray-900 leading-tight">{formData.subspecies || '—'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-50">
                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Strain</p>
                        <p className="text-[11px] font-bold text-gray-900 leading-tight">{formData.strain || '—'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-50">
                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Potency</p>
                        <p className="text-[11px] font-bold text-gray-900 leading-tight">{formData.potency || '—'}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-gray-500 mb-2">Feelings</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.feelings.length > 0 ? formData.feelings.map((f, i) => (
                          <span key={i} className={`px-2 py-1 text-[10px] font-bold rounded ${i === 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-pink-50 text-pink-700'}`}>
                            {f}
                          </span>
                        )) : <span className="text-[10px] text-gray-300 italic">No feelings specified</span>}
                      </div>
                    </div>

                    {/* Display Selected Markets in Preview if available */}
                    {formData.markets && formData.markets.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 mb-2">Active Markets</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {formData.markets.map(m => (
                            <span key={m} className="inline-block px-2.5 py-1 bg-[#E8F5F1] text-[#1B4D3E] rounded text-[10px] font-bold border border-[#D1EBE5]">{m}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Details</h4>
                      <div className="space-y-4">
                        {/* Increased Text Size to text-sm */}
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {formData.description || "Enter a description to see it here."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};