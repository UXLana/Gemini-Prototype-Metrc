import React from 'react';
import { useAppColors, useDarkMode } from '../hooks/useDarkMode';
import { X } from 'lucide-react';
import { Button } from 'mtr-design-system/components';
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
  const { isDark } = useDarkMode();
  
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
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {activeChips.map(chip => (
        <div 
          key={`${chip.categoryId}-${chip.optionId}`}
          className="flex items-center gap-1 pl-2 pr-1 py-1 rounded-full text-sm"
          style={{ 
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)', 
            color: colors.text.highEmphasis.onLight
          }}
        >
          <span>{chip.categoryLabel}: {chip.optionLabel}</span>
          <button 
            onClick={() => onRemove(chip.categoryId, chip.optionId)}
            className="p-0.5 rounded-full hover:bg-black/10 transition-colors ml-0.5"
            style={{ color: colors.text.lowEmphasis.onLight }}
          >
            <X size={12} />
          </button>
        </div>
      ))}
      
      <Button emphasis="low" size="md" onClick={onClearAll} style={{ minWidth: 'auto', height: 28, fontSize: 12 }}>
        Clear
      </Button>
    </div>
  );
};
