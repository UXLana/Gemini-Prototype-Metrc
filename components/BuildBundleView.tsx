import React, { useState, useRef, useEffect } from 'react';
import { useAppColors } from '../hooks/useDarkMode';
import { Button } from 'mtr-design-system/components';
import { AppBadge as Badge } from './AppBadge';
import { X, Upload, PlusCircle, ChevronDown, Search, Trash2, Package } from 'lucide-react';
import { DashboardProduct } from '../types';

export interface BundleItem {
  product: DashboardProduct;
  units: number;
}

interface BuildBundleViewProps {
  bundleName: string;
  initialProducts: DashboardProduct[];
  allProducts: DashboardProduct[];
  onSave: (name: string, items: BundleItem[], price: string) => void;
  onCancel: () => void;
}

export const BuildBundleView: React.FC<BuildBundleViewProps> = ({
  bundleName,
  initialProducts,
  allProducts,
  onSave,
  onCancel,
}) => {
  const colors = useAppColors();
  const [items, setItems] = useState<BundleItem[]>(() =>
    initialProducts.map(p => ({ product: p, units: 5 }))
  );
  const [bundlePrice, setBundlePrice] = useState('');
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [addSearch, setAddSearch] = useState('');
  const addRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addRef.current && !addRef.current.contains(e.target as Node)) {
        setAddDropdownOpen(false);
        setAddSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (addDropdownOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [addDropdownOpen]);

  const addedIds = new Set(items.map(i => i.product.id));
  const availableProducts = allProducts
    .filter(p => !addedIds.has(p.id) && p.type === 'Product')
    .filter(p => p.name.toLowerCase().includes(addSearch.toLowerCase()));

  const updateUnits = (index: number, units: number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, units: Math.max(1, units) } : item));
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const addProduct = (product: DashboardProduct) => {
    setItems(prev => [...prev, { product, units: 1 }]);
    setAddDropdownOpen(false);
    setAddSearch('');
  };

  const totalUnits = items.reduce((sum, i) => sum + i.units, 0);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800';
    e.currentTarget.onerror = null;
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
        className="flex items-center justify-between px-6 h-16 sticky top-0 z-50 shrink-0"
        style={{ backgroundColor: colors.surface.light, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}
      >
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover-surface rounded-full transition-colors" style={{ color: colors.text.disabled.onLight }}>
            <X size={20} />
          </button>
          <h2 className="text-sm font-medium hidden sm:block" style={{ color: colors.text.highEmphasis.onLight }}>Build your bundle</h2>
        </div>
        <Button emphasis="high" onClick={() => onSave(bundleName, items, bundlePrice)}>
          Save
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

            {/* Left Column — Products */}
            <div>
              <h1 className="text-3xl font-bold mb-8 tracking-tight" style={{ color: colors.text.highEmphasis.onLight }}>
                {bundleName}
              </h1>

              <div className="space-y-6">
                {items.map((item, index) => (
                  <BundleProductCard
                    key={item.product.id}
                    item={item}
                    colors={colors}
                    onUnitsChange={(units) => updateUnits(index, units)}
                    onRemove={() => removeItem(index)}
                    onImageError={handleImageError}
                  />
                ))}
              </div>

              {/* Add another product */}
              <div className="mt-6 relative" ref={addRef}>
                <button
                  onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: colors.text.highEmphasis.onLight }}
                >
                  <PlusCircle size={18} />
                  Add another product
                  <ChevronDown size={14} style={{ color: colors.text.disabled.onLight }} />
                </button>

                {addDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-full max-w-md rounded-lg shadow-xl border z-30 flex flex-col max-h-72"
                    style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
                  >
                    <div className="p-3" style={{ borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.text.disabled.onLight }} />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={addSearch}
                          onChange={(e) => setAddSearch(e.target.value)}
                          placeholder="Search products..."
                          className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-1">
                      {availableProducts.length > 0 ? availableProducts.map(product => (
                        <button
                          key={product.id}
                          onClick={() => addProduct(product)}
                          className="w-full flex items-center gap-3 p-2.5 rounded-md text-left hover:opacity-80 transition-colors"
                          style={{ color: colors.text.highEmphasis.onLight }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.hover.onLight)}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <div
                            className="w-8 h-8 rounded overflow-hidden shrink-0 border"
                            style={{ borderColor: colors.border.lowEmphasis.onLight }}
                          >
                            <img src={product.imageUrl} alt="" className="w-full h-full object-cover" onError={handleImageError} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs truncate" style={{ color: colors.text.lowEmphasis.onLight }}>{product.licenseNumber}</p>
                          </div>
                        </button>
                      )) : (
                        <div className="p-4 text-center text-sm" style={{ color: colors.text.disabled.onLight }}>
                          No products available
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Upload bundle image */}
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-1" style={{ color: colors.text.highEmphasis.onLight }}>Upload bundle image</h3>
                <p className="text-sm mb-5" style={{ color: colors.text.lowEmphasis.onLight }}>
                  If left blank, we will default to the image of one of your products
                </p>
                <div
                  className="border border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:opacity-80 transition-all"
                  style={{ borderColor: colors.border.midEmphasis.onLight, backgroundColor: colors.surface.light }}
                >
                  <div className="flex items-center gap-2">
                    <Upload size={18} style={{ color: colors.text.disabled.onLight }} />
                    <p className="text-sm" style={{ color: colors.text.lowEmphasis.onLight }}>
                      Drag and drop or <span className="underline font-semibold" style={{ color: colors.brand.default }}>browse files</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column — Summary */}
            <div className="lg:pt-[68px]">
              <div
                className="rounded-lg border p-5 sticky top-28"
                style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
              >
                <h3 className="text-base font-semibold mb-4" style={{ color: colors.text.highEmphasis.onLight }}>Summary</h3>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.text.lowEmphasis.onLight }}>Unique Products</span>
                    <span style={{ color: colors.text.highEmphasis.onLight }}>{items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.text.lowEmphasis.onLight }}>Unique Units</span>
                    <span style={{ color: colors.text.highEmphasis.onLight }}>{totalUnits}</span>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${colors.border.lowEmphasis.onLight}` }} className="pt-4">
                  <label className="text-sm block mb-2" style={{ color: colors.text.lowEmphasis.onLight }}>Bundle price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: colors.text.disabled.onLight }}>$</span>
                    <input
                      type="text"
                      value={bundlePrice}
                      onChange={(e) => setBundlePrice(e.target.value)}
                      placeholder="0.00"
                      className="form-input pl-7"
                      style={inputStyle}
                    />
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

function BundleProductCard({
  item,
  colors,
  onUnitsChange,
  onRemove,
  onImageError,
}: {
  item: BundleItem;
  colors: ReturnType<typeof import('../hooks/useDarkMode').useAppColors>;
  onUnitsChange: (units: number) => void;
  onRemove: () => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}) {
  const { product, units } = item;

  return (
    <div
      className="rounded-lg border p-5 flex flex-col sm:flex-row gap-5"
      style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
    >
      {/* Product Image */}
      <div
        className="w-full sm:w-40 h-40 rounded-lg overflow-hidden shrink-0 border"
        style={{ backgroundColor: colors.surface.lightDarker, borderColor: colors.border.lowEmphasis.onLight }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={onImageError}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h4 className="text-base font-semibold leading-tight" style={{ color: colors.text.highEmphasis.onLight }}>
            {product.name}
          </h4>
          {product.status && (
            <Badge
              variant="filled"
              color={product.status === 'Active' ? 'success' : 'neutral'}
              size="sm"
            >
              {product.status}
            </Badge>
          )}
        </div>

        <p className="text-xs font-mono tracking-wide mb-3" style={{ color: colors.text.lowEmphasis.onLight }}>
          {product.licenseNumber}
        </p>

        {product.brands.length > 0 && (
          <div className="mb-3">
            <p className="text-xs mb-1.5" style={{ color: colors.text.disabled.onLight }}>Brand</p>
            <div className="flex flex-wrap gap-1.5">
              {product.brands.map(brand => (
                <Badge key={brand} variant="subtle" color="neutral" size="sm">{brand}</Badge>
              ))}
            </div>
          </div>
        )}

        {(product.category || product.potency) && (
          <div className="mb-4">
            <p className="text-xs mb-1.5" style={{ color: colors.text.disabled.onLight }}>Category & potency</p>
            <div className="flex flex-wrap gap-1.5">
              {product.category && <Badge variant="subtle" color="neutral" size="sm">{product.category}</Badge>}
              {product.potency && <Badge variant="subtle" color="neutral" size="sm">{product.potency}</Badge>}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs mb-1.5" style={{ color: colors.text.disabled.onLight }}>Units</p>
            <input
              type="number"
              value={units}
              onChange={(e) => onUnitsChange(parseInt(e.target.value) || 1)}
              min={1}
              className="form-input w-20 text-center"
              style={{
                backgroundColor: colors.surface.light,
                borderColor: colors.border.midEmphasis.onLight,
                color: colors.text.highEmphasis.onLight,
              }}
            />
          </div>
          <button
            onClick={onRemove}
            className="text-sm font-medium mt-5 transition-colors hover:opacity-80"
            style={{ color: colors.brand.default }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
