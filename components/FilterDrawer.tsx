import React, { useState, useEffect } from 'react';
import { useAppColors } from '../hooks/useDarkMode';
import { X, ChevronDown, ChevronUp, Search, Check } from 'lucide-react';
import { Button } from 'mtr-design-system/components';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
}

export const MOCK_FILTERS: FilterCategory[] = [
  {
    id: 'brand',
    label: 'Brand',
    options: [
      { id: 'wild', label: 'Wild', count: 15 },
      { id: 'happy_camper', label: 'Happy Camper', count: 2 },
      { id: 'option_1', label: 'Option', count: 0 },
      { id: 'option_2', label: 'Option', count: 0 },
      { id: 'option_3', label: 'Option', count: 0 },
    ]
  },
  {
    id: 'category',
    label: 'Category',
    options: [
      { id: 'edible', label: 'Edible', count: 10 },
      { id: 'flower', label: 'Flower', count: 5 },
      { id: 'concentrate', label: 'Concentrate', count: 3 },
    ]
  },
  {
    id: 'product',
    label: 'Product',
    options: [
      { id: 'product_1', label: 'Product 1', count: 5 },
      { id: 'product_2', label: 'Product 2', count: 3 },
    ]
  },
  {
    id: 'license',
    label: 'License',
    options: [
      { id: 'license_1', label: 'License 123', count: 2 },
      { id: 'license_2', label: 'License 456', count: 1 },
    ]
  },
  {
    id: 'status',
    label: 'Status',
    options: [
      { id: 'active', label: 'Active', count: 65 },
      { id: 'inactive', label: 'Inactive', count: 5 },
      { id: 'draft', label: 'Draft', count: 2 },
    ]
  }
];

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: Record<string, Set<string>>;
  onApply: (filters: Record<string, Set<string>>) => void;
  onReset: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedFilters,
  onApply,
  onReset
}) => {
  const colors = useAppColors();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['brand']));
  const [tempFilters, setTempFilters] = useState<Record<string, Set<string>>>(selectedFilters);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync temp filters when drawer opens or selected filters change externally
  useEffect(() => {
    if (isOpen) {
      setTempFilters(selectedFilters);
    }
  }, [isOpen, selectedFilters]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const toggleFilter = (categoryId: string, optionId: string) => {
    setTempFilters(prev => {
      const next = { ...prev };
      if (!next[categoryId]) {
        next[categoryId] = new Set();
      }
      const categorySet = new Set(next[categoryId]);
      if (categorySet.has(optionId)) {
        categorySet.delete(optionId);
      } else {
        categorySet.add(optionId);
      }
      
      if (categorySet.size === 0) {
        delete next[categoryId];
      } else {
        next[categoryId] = categorySet;
      }
      return next;
    });
  };

  const handleApply = () => {
    onApply(tempFilters);
    onClose();
  };

  const handleReset = () => {
    setTempFilters({});
    onReset();
    // We don't close automatically on reset, usually users might want to re-select
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: colors.surface.light }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: colors.border.lowEmphasis.onLight }}>
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                    <X size={20} style={{ color: colors.text.lowEmphasis.onLight }} />
                </button>
                <h2 className="text-lg font-semibold" style={{ color: colors.text.highEmphasis.onLight }}>Filters</h2>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleReset}
                    className="text-sm font-medium hover:underline px-2 py-1"
                    style={{ color: colors.text.lowEmphasis.onLight }}
                >
                    Reset
                </button>
                <Button size="sm" emphasis="high" onClick={handleApply}>
                    Apply
                </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {MOCK_FILTERS.map(category => {
              const isExpanded = expandedCategories.has(category.id);
              const selectedCount = tempFilters[category.id]?.size || 0;
              
              return (
                <div key={category.id} className="border-b pb-4 last:border-0" style={{ borderColor: colors.border.lowEmphasis.onLight }}>
                  <button 
                    className="flex items-center justify-between w-full py-2 group"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span className="font-medium text-base" style={{ color: colors.text.highEmphasis.onLight }}>
                      {category.label}
                      {selectedCount > 0 && <span className="ml-2 text-xs bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full">{selectedCount}</span>}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={16} style={{ color: colors.text.lowEmphasis.onLight }} />
                    ) : (
                      <ChevronDown size={16} style={{ color: colors.text.lowEmphasis.onLight }} />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Search input for Brand category specifically as per mock */}
                      {category.id === 'brand' && (
                        <div className="relative mb-3">
                            <input 
                                type="text" 
                                placeholder="Search" 
                                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border outline-none focus:ring-1 focus:ring-brand-500"
                                style={{ 
                                    borderColor: colors.border.midEmphasis.onLight,
                                    backgroundColor: colors.surface.light,
                                    color: colors.text.highEmphasis.onLight
                                }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search size={14} className="absolute left-2.5 top-2" style={{ color: colors.text.disabled.onLight }} />
                        </div>
                      )}

                      <div className="space-y-2">
                        {category.options.map(option => {
                          const isSelected = tempFilters[category.id]?.has(option.id);
                          return (
                            <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                              <div 
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-600 border-brand-600' : 'bg-transparent'}`}
                                style={{ 
                                    borderColor: isSelected ? colors.brand.default : colors.border.midEmphasis.onLight,
                                    backgroundColor: isSelected ? colors.brand.default : 'transparent'
                                }}
                              >
                                {isSelected && <Check size={12} className="text-white" />}
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={!!isSelected}
                                    onChange={() => toggleFilter(category.id, option.id)}
                                />
                              </div>
                              <span className="text-sm flex-1" style={{ color: colors.text.highEmphasis.onLight }}>{option.label}</span>
                              {option.count !== undefined && (
                                  <span className="text-xs" style={{ color: colors.text.disabled.onLight }}>{option.count > 0 && option.count}</span>
                              )}
                            </label>
                          );
                        })}
                      </div>
                      
                      <button className="text-xs font-medium mt-2 hover:underline" style={{ color: colors.text.lowEmphasis.onLight }}>
                        Show more
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
