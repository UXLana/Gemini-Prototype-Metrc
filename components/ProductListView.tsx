import React from 'react';
import { ArrowUp, Check, Minus, MoreVertical } from 'lucide-react';
import { DashboardProduct } from '../types';

export interface ProductColumn {
  id: string;
  label: string;
  visible: boolean;
  /** Fixed columns (checkbox, actions) can't be removed or reordered */
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
  render: (product: DashboardProduct, onProductClick?: (p: DashboardProduct) => void, handleImageError?: (e: React.SyntheticEvent<HTMLImageElement>) => void) => React.ReactNode;
}> = {
  image: {
    headerClass: 'w-16',
    render: (product, _onClick, handleImageError) => (
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
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
    render: (product, onProductClick) => (
      <button
        onClick={() => onProductClick?.(product)}
        className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium text-left hover:underline transition-colors"
      >
        {product.name}
      </button>
    ),
  },
  brand: {
    render: (product) => (
      <div className="flex flex-wrap gap-1.5">
        {product.brands.map((brand) => (
          <span
            key={brand}
            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
          >
            {brand}
          </span>
        ))}
      </div>
    ),
  },
  category: {
    render: (product) => (
      <span className="text-gray-700 dark:text-gray-300">{product.category || '—'}</span>
    ),
  },
  license: {
    render: (product) => (
      <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">{product.licenseNumber}</span>
    ),
  },
  status: {
    render: (product) => (
      <span className="inline-flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${
          product.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-500'
        }`} />
        <span className={`text-sm ${
          product.status === 'Active' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {product.status || 'Active'}
        </span>
      </span>
    ),
  },
};

export const ProductListView: React.FC<ProductListViewProps> = ({
  products, columns, selectedIds, onToggleSelect, onToggleSelectAll, onProductClick
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800";
    e.currentTarget.onerror = null;
  };

  const visibleColumns = columns.filter(c => c.visible);
  const allSelected = products.length > 0 && selectedIds.size === products.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="w-12 px-4 py-3 text-left">
                <div
                  onClick={onToggleSelectAll}
                  className={`check-indicator w-5 h-5 cursor-pointer ${allSelected || someSelected ? 'check-indicator-on' : 'check-indicator-off'}`}
                >
                  {allSelected && <Check size={14} className="text-white" />}
                  {someSelected && <Minus size={14} className="text-white" />}
                </div>
              </th>
              {visibleColumns.map((col) => {
                const renderer = CELL_RENDERERS[col.id];
                return (
                  <th key={col.id} className={`px-3 py-3 text-left ${renderer?.headerClass || ''}`}>
                    {renderer?.sortable ? (
                      <button className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        <ArrowUp size={12} />
                        {col.label}
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {col.label}
                      </span>
                    )}
                  </th>
                );
              })}
              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {products.map((product) => {
              const isSelected = selectedIds.has(product.id);
              return (
                <tr key={product.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group ${isSelected ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div
                      onClick={() => onToggleSelect(product.id)}
                      className={`check-indicator w-5 h-5 cursor-pointer ${isSelected ? 'check-indicator-on' : 'check-indicator-off'}`}
                    >
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </td>
                  {visibleColumns.map((col) => {
                    const renderer = CELL_RENDERERS[col.id];
                    return (
                      <td key={col.id} className="px-3 py-3">
                        {renderer?.render(product, onProductClick, handleImageError)}
                      </td>
                    );
                  })}
                  <td className="px-3 py-3">
                    <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all">
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
