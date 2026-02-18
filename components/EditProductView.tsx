import React, { useState, useEffect } from 'react';
import { Upload, Trash2, ChevronDown, X, Save } from 'lucide-react';
import { Product } from '../types';
import { Button } from './Button';

interface EditProductViewProps {
  product: Product;
  onSave: () => void;
  onCancel: () => void;
}

export const EditProductView: React.FC<EditProductViewProps> = ({ product, onSave, onCancel }) => {
  // Form State initialized with product data
  const [formData, setFormData] = useState({
    name: product.name,
    brand: product.brand,
    category: product.category,
    subspecies: product.subspecies || 'Sativa',
    strain: product.strain || 'Hybrid',
    potency: product.potency,
    feelings: product.feelings?.join(', ') || 'Inspired, Energetic',
    description: product.description || '',
    upc: product.upc || '',
    market: 'California, Nevada, Colorado'
  });

  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'File name.doc', size: '45 KB' },
    { name: 'File name.doc', size: '45 KB' },
    { name: 'File name.doc', size: '45 KB' }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.onerror = null;
  };

  // Derived state for preview
  const feelingsList = formData.feelings.split(',').map(f => f.trim()).filter(Boolean);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
          <h2 className="text-lg font-medium text-gray-900">{formData.name || 'Product name goes here'}</h2>
        </div>
        <Button onClick={onSave} className="bg-[#2D7A65] hover:bg-[#236351]">
          Save
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-full">
            
            {/* LEFT COLUMN: EDIT FORM */}
            <div className="p-8 border-r border-gray-200 pb-20">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit product</h1>
                <p className="text-gray-600">Here you can register your product and preview how it will appear to customers.</p>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Brand</label>
                    <div className="relative">
                      <select 
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 appearance-none bg-white text-sm"
                      >
                        <option>Wyld</option>
                        <option>Kiva</option>
                        <option>Camino</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                    <div className="relative">
                      <select 
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 appearance-none bg-white text-sm"
                      >
                        <option>Edibles</option>
                        <option>Flower</option>
                        <option>Vape</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Subspecies</label>
                    <div className="relative">
                      <select 
                        name="subspecies"
                        value={formData.subspecies}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 appearance-none bg-white text-sm"
                      >
                        <option>Sativa</option>
                        <option>Indica</option>
                        <option>Hybrid</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Strain</label>
                    <div className="relative">
                      <select 
                        name="strain"
                        value={formData.strain}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 appearance-none bg-white text-sm"
                      >
                        <option>Hybrid</option>
                        <option>Blue Dream</option>
                        <option>OG Kush</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Potency</label>
                    <div className="relative">
                      <select 
                        name="potency"
                        value={formData.potency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 appearance-none bg-white text-sm"
                      >
                        <option>10 mg THC</option>
                        <option>5 mg THC</option>
                        <option>100 mg THC</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Feelings (optional)</label>
                    <div className="relative">
                      <select 
                        name="feelings" // Simplified as text input in state for now, but UI shows dropdown-like
                        value={formData.feelings}
                        onChange={handleInputChange} // For prototype, treat as free text edit or select
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 appearance-none bg-white text-sm"
                      >
                        <option value="Inspired, Energetic">Inspired, Energetic</option>
                        <option value="Relaxed, Sleepy">Relaxed, Sleepy</option>
                        <option value="Happy, Giggly">Happy, Giggly</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-sm resize-none"
                    />
                    <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-400">Assistive text</span>
                        <span className="text-xs text-gray-400">0/30</span>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Upload product image</h3>
                  <p className="text-gray-600 text-sm mb-4">Best practices for product image upload goes here</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors mb-4">
                    <div className="mb-2">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Drag and drop or <span className="text-emerald-700 font-medium underline">browse files</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-purple-900 rounded flex items-center justify-center text-white text-xs font-bold">
                             DOC
                           </div>
                           <div>
                             <p className="text-sm font-medium text-gray-900">{file.name}</p>
                             <p className="text-xs text-gray-500">{file.size}</p>
                           </div>
                        </div>
                        <button onClick={() => handleDeleteFile(idx)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Internal Use */}
                <div className="pt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Internal use</h3>
                  <p className="text-gray-600 text-sm mb-4">Microcopy goes here</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Inventory UPC (optional)</label>
                      <input 
                        type="text" 
                        name="upc"
                        value={formData.upc}
                        onChange={handleInputChange}
                        placeholder="UPC goes here"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Market</label>
                      <div className="relative">
                        <select 
                          name="market"
                          value={formData.market}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 appearance-none bg-white text-sm"
                        >
                          <option>California, Nevada, Colorado</option>
                          <option>Oregon</option>
                          <option>Washington</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                      </div>
                    </div>

                    <div className="pt-4">
                        <button className="text-red-700 font-medium text-sm hover:underline">
                            Archive product
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PREVIEW */}
            <div className="p-8 bg-gray-50">
              <div className="sticky top-8">
                 <h2 className="text-xl font-bold text-gray-900 mb-1">Customer preview</h2>
                 <p className="text-gray-500 text-sm mb-6">Product information people see when they scan the barcode</p>

                 {/* Preview Card */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="mb-2">
                        <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">{formData.brand}</p>
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">{formData.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Count: 10</p>
                    </div>

                    {/* Image Area */}
                    <div className="relative mb-10 mt-6">
                        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 mb-6">
                            <img 
                                src={product.imageUrl} 
                                alt="Product Preview" 
                                className="w-full h-full object-cover"
                                onError={handleImageError}
                            />
                        </div>
                        {/* Pagination Dots - Positioned below image with spacing */}
                        <div className="flex justify-center gap-1.5">
                            <div className="w-6 h-1.5 bg-gray-600 rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-6">
                        <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-[10px] text-gray-500 mb-0.5">Category</p>
                            <p className="text-xs font-semibold text-gray-900">{formData.category}</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-[10px] text-gray-500 mb-0.5">Subspecies</p>
                            <p className="text-xs font-semibold text-gray-900">{formData.subspecies}</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-[10px] text-gray-500 mb-0.5">Strain</p>
                            <p className="text-xs font-semibold text-gray-900">{formData.strain}</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-[10px] text-gray-500 mb-0.5">Potency</p>
                            <p className="text-xs font-semibold text-gray-900">{formData.potency}</p>
                        </div>
                    </div>

                    {/* Feelings */}
                    <div className="mb-6">
                        <p className="text-xs text-gray-500 mb-2">Feelings</p>
                        <div className="flex flex-wrap gap-2">
                            {feelingsList.map((feeling, i) => (
                                <span key={i} className="inline-block px-3 py-1 bg-purple-100 text-purple-900 text-xs font-medium rounded-md">
                                    {feeling}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Details</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {formData.description}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed mt-4">
                            Whether eaten for a creative boost, or prepping for a dance party, you'll be ready to go in no time.
                        </p>
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