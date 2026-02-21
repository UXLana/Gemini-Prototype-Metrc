import React, { useState, useRef, useEffect } from 'react';
import { useAppColors } from '../hooks/useDarkMode';
import { Upload, Trash2, ChevronDown, ChevronUp, X, Check, Search } from 'lucide-react';
import { Product } from '../types';
import { Button } from 'mtr-design-system/components';
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
  const colors = useAppColors();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isFeelingsOpen, setIsFeelingsOpen] = useState(false);
  const feelingsRef = useRef<HTMLDivElement>(null);

  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [marketSearch, setMarketSearch] = useState('');
  const marketRef = useRef<HTMLDivElement>(null);

  const [feelingsFlip, setFeelingsFlip] = useState(false);
  const [marketFlip, setMarketFlip] = useState(false);

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

  const shouldFlipDropdown = (ref: React.RefObject<HTMLDivElement | null>, dropdownHeight = 240): boolean => {
    if (!ref.current) return false;
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    return spaceBelow < dropdownHeight;
  };

  const toggleFeelings = () => {
    if (!isFeelingsOpen) setFeelingsFlip(shouldFlipDropdown(feelingsRef));
    setIsFeelingsOpen(!isFeelingsOpen);
  };

  const toggleMarketDropdown = () => {
    if (!isMarketOpen) setMarketFlip(shouldFlipDropdown(marketRef));
    setIsMarketOpen(!isMarketOpen);
  };

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

  const inputStyle = {
    backgroundColor: colors.surface.light,
    borderColor: colors.border.midEmphasis.onLight,
    color: colors.text.highEmphasis.onLight,
  };

  return (
    <div className="flex flex-col h-full transition-colors" style={{ backgroundColor: colors.surface.light, color: colors.text.highEmphasis.onLight }}>
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-6 h-16 sticky top-0 z-50"
        style={{ backgroundColor: colors.surface.light, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}
      >
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover-surface rounded-full transition-colors" style={{ color: colors.text.disabled.onLight }}>
            <X size={20} />
          </button>
          <h2 className="text-sm font-medium hidden sm:block" style={{ color: colors.text.highEmphasis.onLight }}>{formData.name || 'New Product'}</h2>
        </div>
        <Button onClick={handleSave} className="px-5 py-2 text-xs font-bold shadow-sm">
          Save
        </Button>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex z-40" style={{ backgroundColor: colors.surface.light, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
        <button 
          className="flex-1 py-4 text-xs font-bold transition-colors"
          style={{
            color: activeTab === 'edit' ? colors.brand.default : colors.text.disabled.onLight,
            borderBottom: activeTab === 'edit' ? `2px solid ${colors.brand.default}` : '2px solid transparent'
          }}
          onClick={() => setActiveTab('edit')}
        >
          Edit product
        </button>
        <button 
          className="flex-1 py-4 text-xs font-bold transition-colors"
          style={{
            color: activeTab === 'preview' ? colors.brand.default : colors.text.disabled.onLight,
            borderBottom: activeTab === 'preview' ? `2px solid ${colors.brand.default}` : '2px solid transparent'
          }}
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
                w-full p-6 lg:px-12
                pt-[40px] lg:pt-[40px] lg:pb-12
                flex flex-col items-center lg:items-end 
                ${activeTab === 'edit' ? 'flex' : 'hidden'} lg:flex 
                lg:order-1 transition-colors
            `}
              style={{ backgroundColor: colors.surface.light }}
            >
              <div className="w-full max-w-[500px] mx-auto lg:ml-auto lg:mr-0">
                <div className="mb-8 lg:mb-10">
                  <h1 className="text-2xl font-bold mb-2">Edit product</h1>
                  <p className="text-sm leading-relaxed" style={{ color: colors.text.lowEmphasis.onLight }}>Here you can register your product and preview how it will appear to customers.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="form-label" style={{ color: colors.text.lowEmphasis.onLight }}>Name</label>
                      <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="form-input" style={inputStyle} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label" style={{ color: colors.text.lowEmphasis.onLight }}>Brand</label>
                        <div className="relative">
                          <select name="brand" value={formData.brand} onChange={handleInputChange} className="form-select" style={inputStyle}>
                            <option value="">Select Brand</option>
                            <option value="Wyld">Wyld</option>
                            <option value="Kynd">Kynd</option>
                            <option value="Kiva / Camino">Kiva / Camino</option>
                            <option value="Heavy Hitters">Heavy Hitters</option>
                            <option value="710 Labs">710 Labs</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none" style={{ color: colors.text.disabled.onLight }} />
                        </div>
                      </div>
                      <div>
                        <label className="form-label" style={{ color: colors.text.lowEmphasis.onLight }}>Category</label>
                        <div className="relative">
                          <select name="category" value={formData.category} onChange={handleInputChange} className="form-select" style={inputStyle}>
                            <option value="">Select Category</option>
                            <option value="Flower">Flower</option>
                            <option value="Edibles">Edibles</option>
                            <option value="Vape">Vape</option>
                            <option value="Concentrate">Concentrate</option>
                            <option value="Pre-Roll">Pre-Roll</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none" style={{ color: colors.text.disabled.onLight }} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label" style={{ color: colors.text.lowEmphasis.onLight }}>Subspecies</label>
                        <div className="relative">
                          <select name="subspecies" value={formData.subspecies} onChange={handleInputChange} className="form-select" style={inputStyle}>
                            <option value="">Select Subspecies</option>
                            <option value="Sativa">Sativa</option>
                            <option value="Indica">Indica</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none" style={{ color: colors.text.disabled.onLight }} />
                        </div>
                      </div>
                      <div>
                        <label className="form-label" style={{ color: colors.text.lowEmphasis.onLight }}>Strain</label>
                        <div className="relative">
                          <select name="strain" value={formData.strain} onChange={handleInputChange} className="form-select" style={inputStyle}>
                            <option value="">Select Strain</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Raspberry">Raspberry</option>
                            <option value="Kush Mints">Kush Mints</option>
                            <option value="Midnight Blueberry">Midnight Blueberry</option>
                            <option value="Northern Lights">Northern Lights</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none" style={{ color: colors.text.disabled.onLight }} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label" style={{ color: colors.text.lowEmphasis.onLight }}>Potency</label>
                      <div className="relative">
                        <select name="potency" value={formData.potency} onChange={handleInputChange} className="form-select" style={inputStyle}>
                          <option value="">Select Potency</option>
                          <option value="10 mg of THC">10 mg of THC</option>
                          <option value="100 mg of THC">100 mg of THC</option>
                          <option value="20% THC">20% THC</option>
                          <option value="24% THC">24% THC</option>
                          <option value="28% THC">28% THC</option>
                          <option value="78% THC">78% THC</option>
                          <option value="90% THC">90% THC</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 pointer-events-none" style={{ color: colors.text.disabled.onLight }} />
                      </div>
                    </div>

                    <div className="relative" ref={feelingsRef}>
                      <label className="form-label" style={{ color: colors.text.lowEmphasis.onLight }}>Feelings (optional)</label>
                      
                      <div 
                        onClick={toggleFeelings}
                        className="form-input cursor-pointer flex justify-between items-center"
                        style={{
                          ...inputStyle,
                          ...(isFeelingsOpen ? { borderColor: colors.brand.default, boxShadow: `0 0 0 1px ${colors.brand.default}` } : {})
                        }}
                      >
                         <span style={{ color: formData.feelings.length === 0 ? colors.text.disabled.onLight : colors.text.highEmphasis.onLight }} className="truncate pr-2">
                            {formData.feelings.length > 0 
                                ? formData.feelings.join(", ") 
                                : "Select Feelings"
                            }
                         </span>
                         {isFeelingsOpen
                           ? <ChevronUp size={14} className="shrink-0" style={{ color: colors.text.disabled.onLight }} />
                           : <ChevronDown size={14} className="shrink-0" style={{ color: colors.text.disabled.onLight }} />
                         }
                      </div>

                      {isFeelingsOpen && (
                        <div
                          className={`dropdown-menu max-h-60 overflow-y-auto ${feelingsFlip ? 'bottom-full mb-1 mt-0' : ''}`}
                          style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
                        >
                            {FEELING_OPTIONS.map(option => {
                                const isSelected = formData.feelings.includes(option);
                                return (
                                    <div 
                                        key={option}
                                        onClick={() => toggleFeeling(option)}
                                        className="dropdown-item"
                                        style={{ color: isSelected ? colors.brand.default : colors.text.highEmphasis.onLight }}
                                    >
                                        <div
                                          className="check-indicator mr-3"
                                          style={{
                                            backgroundColor: isSelected ? colors.brand.default : colors.surface.light,
                                            borderColor: isSelected ? colors.brand.default : colors.border.midEmphasis.onLight
                                          }}
                                        >
                                            {isSelected && <Check size={10} style={{ color: colors.text.highEmphasis.onDark }} />}
                                        </div>
                                        {option}
                                    </div>
                                )
                            })}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="form-label" style={{ color: colors.text.lowEmphasis.onLight }}>Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter a product description..." rows={6} className="form-input resize-none leading-relaxed" style={inputStyle} />
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px]" style={{ color: colors.text.disabled.onLight }}>Assistive text</span>
                        <span className="text-[10px]" style={{ color: colors.text.disabled.onLight }}>0/30</span>
                      </div>
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="pt-8">
                    <h3 className="text-xl font-bold mb-1">Upload product image</h3>
                    <p className="text-xs mb-5" style={{ color: colors.text.lowEmphasis.onLight }}>Best practices for product image upload go here</p>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                    />

                    <div 
                        onClick={handleFileClick}
                        className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:opacity-80 transition-all mb-4 group"
                        style={{ borderColor: colors.border.midEmphasis.onLight, backgroundColor: colors.surface.light }}
                    >
                      <div className="flex items-center gap-2 mb-1 pointer-events-none">
                        <Upload size={18} style={{ color: colors.text.disabled.onLight }} />
                        <p className="text-xs" style={{ color: colors.text.lowEmphasis.onLight }}>
                          Drag and drop or <span className="underline font-semibold" style={{ color: colors.brand.default }}>browse files</span>
                        </p>
                      </div>
                    </div>

                    <div style={{ borderTop: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between py-4" style={{ borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                          <div className="flex items-center gap-3">
                             <div
                               className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center border"
                               style={{ backgroundColor: colors.surface.lightDarker, borderColor: colors.border.lowEmphasis.onLight }}
                             >
                               <img src={file.thumb} alt="" className="w-full h-full object-cover" />
                             </div>
                             <div>
                               <p className="text-xs font-bold" style={{ color: colors.text.highEmphasis.onLight }}>{file.name}</p>
                               <p className="text-[10px] uppercase" style={{ color: colors.text.lowEmphasis.onLight }}>{file.size}</p>
                             </div>
                          </div>
                          <button onClick={() => handleDeleteFile(idx)} className="p-2" style={{ color: colors.text.important }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Internal use */}
                  <div className="pt-8">
                    <h3 className="text-xl font-bold mb-1">Internal use</h3>
                    <p className="text-xs mb-5" style={{ color: colors.text.lowEmphasis.onLight }}>Microcopy goes here</p>
                    <div className="space-y-4">
                      <div>
                        <label className="form-label" style={{ color: colors.text.lowEmphasis.onLight }}>Inventory UPC (optional)</label>
                        <input name="upc" value={formData.upc} onChange={handleInputChange} placeholder="UPC Code" className="form-input" style={inputStyle} />
                      </div>
                      
                      {/* Market Multi-Select Dropdown */}
                      <div className="relative" ref={marketRef}>
                        <label className="form-label" style={{ color: colors.text.lowEmphasis.onLight }}>Market</label>
                        
                        <div 
                            onClick={toggleMarketDropdown}
                            className="form-input cursor-pointer flex justify-between items-center"
                            style={{
                              ...inputStyle,
                              ...(isMarketOpen ? { borderColor: colors.brand.default, boxShadow: `0 0 0 1px ${colors.brand.default}` } : {})
                            }}
                        >
                            <span style={{ color: formData.markets.length === 0 ? colors.text.disabled.onLight : colors.text.highEmphasis.onLight }} className="truncate pr-2">
                                {getMarketText()}
                            </span>
                            {isMarketOpen
                              ? <ChevronUp size={14} className="shrink-0" style={{ color: colors.text.disabled.onLight }} />
                              : <ChevronDown size={14} className="shrink-0" style={{ color: colors.text.disabled.onLight }} />
                            }
                        </div>

                        {isMarketOpen && (
                            <div
                              className={`dropdown-menu max-h-60 flex flex-col ${marketFlip ? 'bottom-full mb-1 mt-0' : ''}`}
                              style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
                            >
                                <div className="p-2 rounded-t-md" style={{ backgroundColor: colors.surface.light, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                                    <div className="relative">
                                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: colors.text.disabled.onLight }} />
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="Search markets..." 
                                            value={marketSearch}
                                            onChange={(e) => setMarketSearch(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full pl-8 pr-3 py-1.5 text-xs border rounded-md focus:outline-none focus-brand"
                                            style={{
                                              backgroundColor: colors.surface.light,
                                              borderColor: colors.border.lowEmphasis.onLight,
                                              color: colors.text.highEmphasis.onLight
                                            }}
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
                                                className="dropdown-item"
                                                style={{ color: isSelected ? colors.brand.default : colors.text.highEmphasis.onLight }}
                                            >
                                                <div
                                                  className="check-indicator mr-3"
                                                  style={{
                                                    backgroundColor: isSelected ? colors.brand.default : colors.surface.light,
                                                    borderColor: isSelected ? colors.brand.default : colors.border.midEmphasis.onLight
                                                  }}
                                                >
                                                    {isSelected && <Check size={10} style={{ color: colors.text.highEmphasis.onDark }} />}
                                                </div>
                                                <div className="flex-1 flex justify-between">
                                                    <span>{market.name}</span>
                                                    <span className="text-xs font-mono" style={{ color: colors.text.disabled.onLight }}>{market.id}</span>
                                                </div>
                                            </div>
                                        )
                                    }) : (
                                        <div className="p-4 text-center text-xs italic" style={{ color: colors.text.disabled.onLight }}>No markets found</div>
                                    )}
                                </div>
                            </div>
                        )}
                      </div>

                      <div className="pt-6">
                        <button className="text-xs font-bold hover:underline" style={{ color: colors.text.important }}>Archive product</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: CUSTOMER PREVIEW SECTION */}
            <div
              className={`flex flex-row flex-wrap items-start justify-start w-full pt-0 pb-0 px-12 gap-y-0 ${activeTab === 'preview' ? 'block' : 'hidden'} lg:grid lg:order-2 transition-colors min-h-full`}
              style={{
                backgroundColor: colors.surface.lightDarker,
                borderLeft: `1px solid ${colors.border.lowEmphasis.onLight}`
              }}
            >
              <div className="
                  sticky top-16 
                  flex flex-col items-center lg:items-start 
                  pt-8 pb-10 
                  px-6 lg:pb-12 lg:px-0 
                  w-full h-full overflow-y-auto custom-scrollbar
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
