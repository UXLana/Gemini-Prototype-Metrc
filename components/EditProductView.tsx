import React, { useState } from 'react';
import { Upload, Trash2, ChevronDown, X, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';
import { Button } from './Button';

interface EditProductViewProps {
  product: Product;
  onSave: () => void;
  onCancel: () => void;
}

export const EditProductView: React.FC<EditProductViewProps> = ({ product, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  
  // Initialize form with product data OR empty strings if it's a new entry (checked via empty ID or manual flag in logic)
  const [formData, setFormData] = useState({
    name: product.name || "",
    brand: product.brand || "",
    category: product.category || "",
    subspecies: product.subspecies || "",
    strain: product.strain || "",
    potency: product.potency || "",
    feelings: product.feelings?.join(', ') || "",
    description: product.description || "",
    upc: product.upc || "",
    market: product.markets?.[0] || ""
  });

  // Only show dummy files if the product actually has an image (simulating an existing product)
  const initialFiles = product.imageUrl ? [
    { name: 'File name.doc', size: '45 KB', thumb: product.imageUrl },
    { name: 'File name.doc', size: '45 KB', thumb: product.imageUrl },
    { name: 'File name.doc', size: '45 KB', thumb: product.imageUrl }
  ] : [];

  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const feelingsList = formData.feelings.split(',').map(f => f.trim()).filter(Boolean);

  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={20} />
          </button>
          <h2 className="text-sm font-medium text-gray-900">{formData.name || 'New Product'}</h2>
        </div>
        <Button onClick={onSave} className="bg-[#2D7A65] hover:bg-[#236351] text-white px-5 py-2 rounded-lg text-xs font-bold shadow-sm">
          Save
        </Button>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-gray-100 bg-white z-40">
        <button 
          className={`flex-1 py-4 text-xs font-bold transition-colors ${activeTab === 'edit' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-gray-400'}`}
          onClick={() => setActiveTab('edit')}
        >
          Edit product
        </button>
        <button 
          className={`flex-1 py-4 text-xs font-bold transition-colors ${activeTab === 'preview' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-gray-400'}`}
          onClick={() => setActiveTab('preview')}
        >
          Customer preview
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar">
          {/* Main 50/50 Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-full">
            
            {/* LEFT: FORM SECTION */}
            <div className={`p-10 lg:p-20 flex flex-col items-center ${activeTab === 'edit' ? 'block' : 'hidden'} lg:block`}>
              <div className="w-full max-w-[500px]">
                <div className="mb-10">
                  <h1 className="text-2xl font-bold mb-2">Edit product</h1>
                  <p className="text-gray-500 text-sm leading-relaxed">Here you can register your product and preview how it will appear to customers.</p>
                </div>

                <div className="space-y-6">
                  {/* Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Name</label>
                      <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-600 outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Brand</label>
                        <div className="relative">
                          <select name="brand" value={formData.brand} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white focus:ring-1 focus:ring-emerald-600 outline-none">
                            <option value="">Select Brand</option>
                            <option>Wyld</option>
                            <option>Kynd</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
                        <div className="relative">
                          <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white focus:ring-1 focus:ring-emerald-600 outline-none">
                            <option value="">Select Category</option>
                            <option>Flower</option>
                            <option>Edibles</option>
                            <option>Vape</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Subspecies</label>
                        <div className="relative">
                          <select name="subspecies" value={formData.subspecies} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white focus:ring-1 focus:ring-emerald-600 outline-none">
                            <option value="">Select Subspecies</option>
                            <option>Sativa</option>
                            <option>Indica</option>
                            <option>Hybrid</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Strain</label>
                        <div className="relative">
                          <select name="strain" value={formData.strain} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white focus:ring-1 focus:ring-emerald-600 outline-none">
                            <option value="">Select Strain</option>
                            <option>Hybrid</option>
                            <option>Raspberry</option>
                            <option>Kush Mints</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Potency</label>
                      <div className="relative">
                        <select name="potency" value={formData.potency} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white focus:ring-1 focus:ring-emerald-600 outline-none">
                          <option value="">Select Potency</option>
                          <option>10 mg of THC</option>
                          <option>100 mg of THC</option>
                          <option>28% THC</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Feelings (optional)</label>
                      <div className="relative">
                        <select name="feelings" value={formData.feelings} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white focus:ring-1 focus:ring-emerald-600 outline-none">
                          <option value="">Select Feelings</option>
                          <option>Inspired, Energetic</option>
                          <option>Relaxed, Euphoric</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter a product description..." rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-600 outline-none resize-none leading-relaxed" />
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-gray-400">Assistive text</span>
                        <span className="text-[10px] text-gray-400">0/30</span>
                      </div>
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="pt-8">
                    <h3 className="text-xl font-bold mb-1">Upload product image</h3>
                    <p className="text-gray-500 text-xs mb-5">Best practices for product image upload goe here</p>
                    
                    <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-4 group">
                      <div className="flex items-center gap-2 mb-1">
                        <Upload size={18} className="text-gray-400" />
                        <p className="text-xs text-gray-600">Drag and drop or <span className="text-emerald-800 underline">browse files</span></p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 divide-y divide-gray-100">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
                               <img src={file.thumb} alt="" className="w-full h-full object-cover" />
                             </div>
                             <div>
                               <p className="text-xs font-bold text-gray-900">{file.name}</p>
                               <p className="text-[10px] text-gray-500 uppercase">{file.size}</p>
                             </div>
                          </div>
                          <button onClick={() => handleDeleteFile(idx)} className="text-gray-300 hover:text-red-500 p-2">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Internal Use */}
                  <div className="pt-8">
                    <h3 className="text-xl font-bold mb-1">Internal use</h3>
                    <p className="text-gray-500 text-xs mb-5">Microcopy goes here</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Inventory UPC (optional)</label>
                        <input name="upc" value={formData.upc} onChange={handleInputChange} placeholder="UPC Code" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-600 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Market</label>
                        <div className="relative">
                          <select name="market" value={formData.market} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white focus:ring-1 focus:ring-emerald-600 outline-none">
                            <option value="">Select Market</option>
                            <option>California, Nevada, Colorado</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400" />
                        </div>
                      </div>
                      <div className="pt-6">
                        <button className="text-red-700 text-xs font-bold hover:underline">Archive product</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: CUSTOMER PREVIEW SECTION - UPDATED TO BRAND GREEN */}
            <div className={`bg-[#1B4D3E] flex flex-col items-center justify-center ${activeTab === 'preview' ? 'block' : 'hidden'} lg:block sticky top-0 h-full`}>
              <div className="w-full max-w-[480px] p-10">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1 text-white">Customer preview</h2>
                  <p className="text-emerald-100/70 text-xs">Product information people see when they scan the barcode</p>
                </div>

                {/* iPhone-style Preview Card */}
                <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col h-full max-h-[780px]">
                  <div className="p-8 pb-4">
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">{formData.brand || 'BRAND'}</p>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{formData.name || 'Product Name'}</h3>
                    <p className="text-[10px] text-gray-500 mt-1">Count: 10</p>
                  </div>

                  <div className="px-8 mb-6 relative flex flex-col items-center">
                    <div className="w-full aspect-[1/0.85] rounded-xl overflow-hidden mb-4 bg-gray-50/50 flex items-center justify-center">
                      {product.imageUrl ? (
                         <img src={product.imageUrl} alt="" className="w-full h-full object-contain p-4" />
                      ) : (
                         <div className="text-gray-300 flex flex-col items-center">
                            <ImageIcon size={48} className="mb-2 opacity-50" />
                            <span className="text-xs font-medium">No Image</span>
                         </div>
                      )}
                    </div>
                    {product.imageUrl && (
                      <div className="flex gap-1.5">
                        <div className="w-5 h-1.5 bg-gray-800 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                      </div>
                    )}
                  </div>

                  <div className="px-8 pb-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-50">
                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Category</p>
                        <p className="text-[11px] font-bold text-gray-900">{formData.category || '—'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-50">
                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Subspecies</p>
                        <p className="text-[11px] font-bold text-gray-900">{formData.subspecies || '—'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-50">
                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Strain</p>
                        <p className="text-[11px] font-bold text-gray-900">{formData.strain || '—'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-50">
                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Potency</p>
                        <p className="text-[11px] font-bold text-gray-900">{formData.potency || '—'}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-gray-500 mb-2">Feelings</p>
                      <div className="flex flex-wrap gap-2">
                        {feelingsList.length > 0 ? feelingsList.map((f, i) => (
                          <span key={i} className={`px-2 py-1 text-[10px] font-bold rounded ${i === 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-pink-50 text-pink-700'}`}>
                            {f}
                          </span>
                        )) : <span className="text-[10px] text-gray-300 italic">No feelings specified</span>}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Details</h4>
                      <div className="space-y-4">
                        <p className="text-xs text-gray-500 leading-relaxed">
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