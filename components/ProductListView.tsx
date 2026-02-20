import React from 'react';
import { useAppColors } from '../hooks/useDarkMode';
import { AppBadge as Badge } from './AppBadge';
import { ArrowUp, Check, Minus, MoreVertical } from 'lucide-react';
import { DashboardProduct } from '../types';
import type { ThemeColors } from 'mtr-design-system/styles/themes/theme-interface';

export interface ProductColumn {
  id: string;
  label: string;
  visible: boolean;
  locked?: boolean;
}

export const DEFAULT_COLUMNS: ProductColumn[] = [
  { id: 'image',    label: 'Image',    visible: true },
  { id: 'product',  label: 'Product',  visible: true },
  { id: 'brand',    label: 'Brand',    visible: true },
  { id: 'category', label: 'Category', visible: true },
  { id: 'license',  label: 'License',  visible: true },
  { id: 'status',   label: 'Status',   visible: true },
];

interface ProductListViewProps {
  products: DashboardProduct[];
  columns: ProductColumn[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onProductClick?: (product: DashboardProduct) => void;
}

const CELL_RENDERERS: Record<string, {
  headerClass?: string;
  sortable?: boolean;
  render: (product: DashboardProduct, colors: ThemeColors, onProductClick?: (p: DashboardProduct) => void, handleImageError?: (e: React.SyntheticEvent<HTMLImageElement>) => void) => React.ReactNode;
}> = {
  image: {
    headerClass: 'w-16',
    render: (product, colors, _onClick, handleImageError) => (
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: colors.surface.lightDarker }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
    ),
  },
  product: {
    sortable: true,
    render: (product, colors, onProductClick) => (
      <button
        onClick={() => onProductClick?.(product)}
        className="font-medium text-left hover:underline transition-colors"
        style={{ color: colors.brand.default }}
      >
        {product.name}
      </button>
    ),
  },
  brand: {
    render: (product) => (
      <div className="flex flex-wrap gap-1.5">
        {product.brands.map((brand) => (
          <Badge key={brand} variant="subtle" color="neutral" size="sm">{brand}</Badge>
        ))}
      </div>
    ),
  },
  category: {
    render: (product, colors) => (
      <span style={{ color: colors.text.highEmphasis.onLight }}>{product.category || '—'}</span>
    ),
  },
  license: {
    render: (product, colors) => (
      <span className="font-mono text-xs" style={{ color: colors.text.lowEmphasis.onLight }}>{product.licenseNumber}</span>
    ),
  },
  status: {
    render: (product) => (
      <Badge variant="subtle" color={product.status === 'Active' ? 'success' : 'neutral'} size="sm">
        {product.status || 'Active'}
      </Badge>
    ),
  },
};

export const ProductListView: React.FC<ProductListViewProps> = ({
  products, columns, selectedIds, onToggleSelect, onToggleSelectAll, onProductClick
}) => {
  const colors = useAppColors();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.onerror = null;
  };

  const visibleColumns = columns.filter(c => c.visible);
  const allSelected = products.length > 0 && selectedIds.size === products.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <div className="card overflow-hidden" style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}>
              <th className="w-12 px-4 py-3 text-left">
                <div
                  onClick={onToggleSelectAll}
                  className="check-indicator w-5 h-5 cursor-pointer"
                  style={{
                    backgroundColor: (allSelected || someSelected) ? colors.brand.default : colors.surface.light,
                    borderColor: (allSelected || someSelected) ? colors.brand.default : colors.border.midEmphasis.onLight
                  }}
                >
                  {allSelected && <Check size={14} style={{ color: colors.text.highEmphasis.onDark }} />}
                  {someSelected && <Minus size={14} style={{ color: colors.text.highEmphasis.onDark }} />}
                </div>
              </th>
              {visibleColumns.map((col) => {
                const renderer = CELL_RENDERERS[col.id];
                return (
                  <th key={col.id} className={`px-3 py-3 text-left ${renderer?.headerClass || ''}`}>
                    {renderer?.sortable ? (
                      <button className="flex items-center gap-1 text-xs font-medium tracking-wider hover:opacity-70 transition-colors" style={{ color: colors.text.highEmphasis.onLight }}>
                        <ArrowUp size={12} />
                        {col.label}
                      </button>
                    ) : (
                      <span className="text-xs font-medium tracking-wider" style={{ color: colors.text.highEmphasis.onLight }}>
                        {col.label}
                      </span>
                    )}
                  </th>
                );
              })}
              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isSelected = selectedIds.has(product.id);
              return (
                <tr
                  key={product.id}
                  className="hover-surface-subtle transition-colors group"
                  style={{
                    borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}`,
                    backgroundColor: isSelected ? `${colors.brand.default}0A` : undefined
                  }}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div
                      onClick={() => onToggleSelect(product.id)}
                      className="check-indicator w-5 h-5 cursor-pointer"
                      style={{
                        backgroundColor: isSelected ? colors.brand.default : colors.surface.light,
                        borderColor: isSelected ? colors.brand.default : colors.border.midEmphasis.onLight
                      }}
                    >
                      {isSelected && <Check size={14} style={{ color: colors.text.highEmphasis.onDark }} />}
                    </div>
                  </td>
                  {visibleColumns.map((col) => {
                    const renderer = CELL_RENDERERS[col.id];
                    return (
                      <td key={col.id} className="px-3 py-3">
                        {renderer?.render(product, colors, onProductClick, handleImageError)}
                      </td>
                    );
                  })}
                  <td className="px-3 py-3">
                    <button
                      className="p-1 rounded-md hover-surface opacity-0 group-hover:opacity-100 transition-all"
                      style={{ color: colors.text.disabled.onLight }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
