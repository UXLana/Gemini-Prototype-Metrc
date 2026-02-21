import React from 'react';
import { useAppColors } from '../hooks/useDarkMode';
import { X } from 'lucide-react';
import { MOCK_FILTERS } from './FilterDrawer';

interface ActiveFiltersProps {
  filters: Record<string, Set<string>>;
  onRemove: (categoryId: string, optionId: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemove,
  onClearAll
}) => {
  const colors = useAppColors();
  
  // Flatten filters to a list of chips
  const activeChips: { categoryId: string; categoryLabel: string; optionId: string; optionLabel: string; count?: number }[] = [];
  
  Object.entries(filters).forEach(([categoryId, optionIds]) => {
    const category = MOCK_FILTERS.find(c => c.id === categoryId);
    if (!category) return;
    
    optionIds.forEach(optionId => {
      const option = category.options.find(o => o.id === optionId);
      if (option) {
        activeChips.push({
          categoryId,
          categoryLabel: category.label,
          optionId,
          optionLabel: option.label,
          count: option.count
        });
      }
    });
  });

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
      {activeChips.map(chip => (
        <div 
          key={`${chip.categoryId}-${chip.optionId}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
          style={{ 
            backgroundColor: colors.surface.light, 
            border: `1px solid ${colors.border.midEmphasis.onLight}`,
            color: colors.text.highEmphasis.onLight
          }}
        >
          <span>
            <span style={{ color: colors.text.lowEmphasis.onLight }}>{chip.categoryLabel}:</span> {chip.optionLabel}
            {chip.count !== undefined && <span style={{ color: colors.text.disabled.onLight }} className="ml-1">({chip.count})</span>}
          </span>
          <button 
            onClick={() => onRemove(chip.categoryId, chip.optionId)}
            className="hover:bg-black/5 rounded-full p-0.5 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      
      <button 
        onClick={onClearAll}
        className="text-sm font-medium px-2 py-1 hover:underline transition-colors"
        style={{ color: colors.text.lowEmphasis.onLight }}
      >
        Clear
      </button>
    </div>
  );
};
