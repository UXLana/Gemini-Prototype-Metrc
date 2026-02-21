import React, { useState, useEffect } from 'react';
import { useAppColors } from '../hooks/useDarkMode';
import { X, ChevronDown, Search, Check, RotateCcw } from 'lucide-react';
import { Button } from 'mtr-design-system/components';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterCategory {
  id: string;
  label: string;
  searchable?: boolean;
  options: FilterOption[];
}

export const MOCK_FILTERS: FilterCategory[] = [
  {
    id: 'brand',
    label: 'Brand',
    searchable: true,
    options: [
      { id: 'wyld', label: 'Wyld' },
      { id: 'kynd', label: 'Kynd' },
      { id: 'heavy_hitters', label: 'Heavy Hitters' },
      { id: '710_labs', label: '710 Labs' },
      { id: 'lowell_farms', label: 'Lowell Farms' },
      { id: 'stiiizy', label: 'Stiiizy' },
      { id: 'kiva_confections', label: 'Kiva Confections' },
      { id: 'raw_garden', label: 'Raw Garden' },
      { id: 'dogwalkers', label: 'Dogwalkers' },
      { id: 'cookies', label: 'Cookies' },
      { id: 'kiva___camino', label: 'Kiva / Camino' },
    ]
  },
  {
    id: 'category',
    label: 'Category',
    options: [
      { id: 'edibles', label: 'Edibles' },
      { id: 'flower', label: 'Flower' },
      { id: 'vape', label: 'Vape' },
      { id: 'concentrate', label: 'Concentrate' },
      { id: 'pre-roll', label: 'Pre-Roll' },
    ]
  },
  {
    id: 'type',
    label: 'Type',
    options: [
      { id: 'product', label: 'Product' },
      { id: 'bundle', label: 'Bundle' },
    ]
  },
  {
    id: 'status',
    label: 'Status',
    options: [
      { id: 'active', label: 'Active' },
      { id: 'inactive', label: 'Inactive' },
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

  useEffect(() => {
    if (isOpen) {
      setTempFilters(selectedFilters);
    }
  }, [isOpen, selectedFilters]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const toggleFilter = (categoryId: string, optionId: string) => {
    setTempFilters(prev => {
      const next = { ...prev };
      const categorySet = new Set(next[categoryId] || []);
      if (categorySet.has(optionId)) categorySet.delete(optionId);
      else categorySet.add(optionId);
      if (categorySet.size === 0) delete next[categoryId];
      else next[categoryId] = categorySet;
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
  };

  return (
    <>
    {/* Scrim */}
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ backgroundColor: colors.scrim }}
      onClick={onClose}
    />

    <div 
      className={`fixed top-0 right-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ 
        backgroundColor: colors.surface.light,
        width: 256,
        borderLeft: `1px solid ${colors.border.lowEmphasis.onLight}`
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 shrink-0" style={{ borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-1 rounded transition-colors hover:bg-black/5" style={{ color: colors.text.lowEmphasis.onLight }}>
              <X size={18} />
            </button>
            <span className="text-base font-semibold" style={{ color: colors.text.highEmphasis.onLight }}>Filters</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleReset}
              className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
              style={{ color: colors.text.lowEmphasis.onLight }}
              title="Reset filters"
            >
              <RotateCcw size={16} />
            </button>
            <Button emphasis="high" size="md" onClick={handleApply} style={{ minWidth: 'auto', height: 32, fontSize: 13 }}>
              Apply
            </Button>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex-1 overflow-y-auto">
          {MOCK_FILTERS.map(category => {
            const isExpanded = expandedCategories.has(category.id);

            return (
              <div key={category.id} style={{ borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
                <button 
                  className="flex items-center justify-between w-full px-4 py-3"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="font-medium text-sm" style={{ color: colors.text.highEmphasis.onLight }}>
                    {category.label}
                  </span>
                  <ChevronDown 
                    size={16} 
                    style={{ 
                      color: colors.text.lowEmphasis.onLight,
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease'
                    }} 
                  />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4">
                    {category.searchable && (
                      <div className="relative mb-2">
                        <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: colors.text.disabled.onLight }} />
                        <input 
                          type="text" 
                          placeholder="Search" 
                          className="w-full pl-8 pr-2 py-1.5 text-sm rounded-md border outline-none"
                          style={{ 
                            borderColor: colors.border.midEmphasis.onLight,
                            backgroundColor: colors.surface.light,
                            color: colors.text.highEmphasis.onLight
                          }}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      {category.options.map(option => {
                        const isSelected = tempFilters[category.id]?.has(option.id);
                        return (
                          <label 
                            key={option.id} 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => toggleFilter(category.id, option.id)}
                          >
                            <div 
                              className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors"
                              style={{ 
                                border: isSelected ? 'none' : `1.5px solid ${colors.border.highEmphasis.onLight}`,
                                backgroundColor: isSelected ? colors.brand.default : 'transparent'
                              }}
                            >
                              {isSelected && <Check size={12} strokeWidth={2.5} color="#fff" />}
                            </div>
                            <span className="text-sm" style={{ color: colors.text.highEmphasis.onLight }}>
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <button 
                      className="text-xs mt-2 underline"
                      style={{ color: colors.text.action.enabled }}
                    >
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
