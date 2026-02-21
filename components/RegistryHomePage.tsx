import React, { useState, useRef, useEffect } from 'react';
import { useAppColors, useDarkMode } from '../hooks/useDarkMode';
import { TabBar } from 'mtr-design-system/components';
import { Package, Box, FileText, Layers, Plus, Pencil, RefreshCw, Archive, X, ArrowRight } from 'lucide-react';
import { DASHBOARD_PRODUCTS } from '../constants';
import { DashboardProduct } from '../types';
import { DashboardProductCard } from './DashboardProductCard';
import { StatsRow } from './StatsRow';

const CATALOG_STATS = [
  { label: 'Total products', value: '4,500', icon: <Box size={20} /> },
  { label: 'Active brands', value: '14', icon: <Layers size={20} /> },
  { label: 'Total bundles', value: '4', icon: <Package size={20} /> },
  { label: 'Drafts', value: '3', icon: <FileText size={20} /> },
];

const SEGMENTS_BY_TAB: Record<string, { label: string; count: number; pct: number }[]> = {
  category: [
    { label: 'Flower', count: 285, pct: 26 },
    { label: 'Edibles', count: 248, pct: 23 },
    { label: 'Vape', count: 198, pct: 18 },
    { label: 'Concentrates', count: 143, pct: 13 },
    { label: 'Pre-rolls', count: 110, pct: 10 },
    { label: 'Topicals', count: 65, pct: 6 },
    { label: 'Tinctures', count: 43, pct: 4 },
  ],
  brand: [
    { label: 'Wyld', count: 320, pct: 29 },
    { label: 'Kynd', count: 215, pct: 20 },
    { label: 'Heavy Hitters', count: 178, pct: 16 },
    { label: 'Select', count: 134, pct: 12 },
    { label: 'Cann', count: 98, pct: 9 },
    { label: 'Kiva', count: 87, pct: 8 },
    { label: 'Other', count: 60, pct: 6 },
  ],
  market: [
    { label: 'California', count: 380, pct: 35 },
    { label: 'Colorado', count: 245, pct: 22 },
    { label: 'Nevada', count: 165, pct: 15 },
    { label: 'Oregon', count: 120, pct: 11 },
    { label: 'Michigan', count: 98, pct: 9 },
    { label: 'Illinois', count: 54, pct: 5 },
    { label: 'Other', count: 30, pct: 3 },
  ],
};

interface ActivityChange {
  field: string;
  from?: string;
  to: string;
}

interface Activity {
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
  productId: string | null;
  changes: ActivityChange[];
}

const ACTIVITIES: Activity[] = [
  {
    icon: <Plus size={16} />,
    title: 'Summer Vibes Starter Pack',
    desc: 'Created new bundle',
    time: 'Just now',
    productId: 'dash_4',
    changes: [
      { field: 'Name', to: 'Summer Vibes Starter Pack' },
      { field: 'Type', to: 'Bundle' },
      { field: 'Brands', to: 'Wyld, Kynd' },
      { field: 'Market', to: 'Nevada' },
    ],
  },
  {
    icon: <Pencil size={16} />,
    title: 'Elderberry Indica Gummies',
    desc: 'Updated metadata',
    time: '5 min',
    productId: 'dash_1',
    changes: [
      { field: 'Strain', from: 'Raspberry', to: 'Elderberry' },
      { field: 'Description', from: 'Made with real fruit...', to: 'Made with real fruit ingredients and cannabis terpenes. Perfect for winding down.' },
    ],
  },
  {
    icon: <RefreshCw size={16} />,
    title: 'Stiiizy - Blue Dream Pod',
    desc: 'Synced inventory',
    time: '30 min',
    productId: 'dash_7',
    changes: [
      { field: 'Inventory', from: '1,240 units', to: '1,185 units' },
      { field: 'Markets synced', to: 'CA, NV, MI, AZ' },
    ],
  },
  {
    icon: <Pencil size={16} />,
    title: 'Elderberry Indica Gummies',
    desc: 'Updated price',
    time: '2 hrs',
    productId: 'dash_1',
    changes: [
      { field: 'Retail price', from: '$24.99', to: '$22.99' },
      { field: 'Wholesale price', from: '$14.50', to: '$13.00' },
    ],
  },
  {
    icon: <Archive size={16} />,
    title: 'Blood Oranges',
    desc: 'Archived product',
    time: '1 day',
    productId: null,
    changes: [
      { field: 'Status', from: 'Active', to: 'Archived' },
    ],
  },
];

interface RegistryHomePageProps {
  onNavigateToProducts: () => void;
  onProductClick?: (product: DashboardProduct) => void;
  chatOpen?: boolean;
}

export function RegistryHomePage({ onNavigateToProducts, onProductClick, chatOpen }: RegistryHomePageProps) {
  const colors = useAppColors();
  const { isDark } = useDarkMode();
  const [segmentTab, setSegmentTab] = React.useState('brand');
  const [activePopover, setActivePopover] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activePopover === null) return;
    const handle = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [activePopover]);

  const recentProducts = DASHBOARD_PRODUCTS.slice(0, 4);
  const segments = SEGMENTS_BY_TAB[segmentTab] || SEGMENTS_BY_TAB.category;
  const maxSegment = Math.max(...segments.map(s => s.count));

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full">
      {/* Page Header */}
      <div
        className="rounded-2xl px-8 py-8 mb-8"
        style={{
          backgroundColor: isDark ? `${colors.brand.default}25` : colors.brand.default,
        }}
      >
        <h1 className="text-2xl font-bold mb-1" style={{ color: isDark ? colors.text.highEmphasis.onLight : '#fff' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Jane
        </h1>
        <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.87)' : 'rgba(255,255,255,0.7)' }}>
          Here's what's happening in your registry today.
        </p>
      </div>

      {/* Catalog Overview */}
      <StatsRow title="Catalog overview" stats={CATALOG_STATS} bottomMargin={40} />

      {/* Products by Segment + Recent Activity */}
      <div className={`grid grid-cols-1 ${chatOpen ? 'lg:grid-cols-1 xl:grid-cols-5' : 'md:grid-cols-5'} gap-6 mb-10`}>
        {/* Products by segment */}
        <div
          className={`${chatOpen ? 'xl:col-span-3' : 'md:col-span-3'} rounded-2xl border p-6`}
          style={{
            backgroundColor: colors.surface.light,
            borderColor: colors.border.lowEmphasis.onLight,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium" style={{ color: colors.text.highEmphasis.onLight }}>Products by segment</h2>
            <button
              className="text-xs font-medium hover:underline"
              style={{ color: colors.brand.default }}
              onClick={onNavigateToProducts}
            >Show all</button>
          </div>
          <TabBar
            tabs={[
              { id: 'brand', label: 'Brand' },
              { id: 'market', label: 'Market' },
              { id: 'category', label: 'Category' },
            ]}
            activeTab={segmentTab}
            onTabChange={setSegmentTab}
            align="left"
            hasDivider={false}
            onDark={isDark}
          />
          <div key={segmentTab} className="mt-6 space-y-3 tab-content-animate">
            {segments.map((seg, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs w-24 text-right shrink-0 transition-opacity duration-300" style={{ color: colors.text.lowEmphasis.onLight }}>{seg.label}</span>
                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(seg.count / maxSegment) * 100}%`,
                      backgroundColor: colors.brand.default,
                      transition: 'width 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
                <span className="text-xs tabular-nums w-20 shrink-0 transition-opacity duration-300" style={{ color: colors.text.lowEmphasis.onLight }}>
                  {seg.count}  ({seg.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className={`${chatOpen ? 'xl:col-span-2' : 'md:col-span-2'} rounded-2xl border p-6`}
          style={{
            backgroundColor: colors.surface.light,
            borderColor: colors.border.lowEmphasis.onLight,
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium" style={{ color: colors.text.highEmphasis.onLight }}>Recent activity</h2>
            <button
              className="text-xs font-medium hover:underline"
              style={{ color: colors.brand.default }}
              onClick={onNavigateToProducts}
            >Show all</button>
          </div>
          <div className="relative">
            {ACTIVITIES.map((a, i) => {
              const linkedProduct = a.productId ? DASHBOARD_PRODUCTS.find(p => p.id === a.productId) : null;
              const isLast = i === ACTIVITIES.length - 1;
              const isFirst = i === 0;
              const isPopoverOpen = activePopover === i;

              return (
                <div key={i} className="relative flex gap-3" style={{ paddingLeft: 0 }}>
                  {!isLast && (
                    <div
                      className="absolute w-[1px] z-0"
                      style={{
                        left: 15,
                        top: isFirst ? 42 : 0,
                        bottom: 0,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                      }}
                    />
                  )}

                  <div className="w-8 shrink-0 flex justify-center pt-2.5">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center relative z-10"
                      style={{
                        color: colors.brand.default,
                        border: `1.5px solid ${isDark ? colors.brand.default : 'rgba(0,0,0,0.07)'}`,
                        backgroundColor: colors.surface.light,
                      }}
                    >{a.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0 relative">
                    <button
                      className="w-full flex items-start gap-2 text-left rounded-lg px-3 py-2.5 transition-colors cursor-pointer"
                      style={{ backgroundColor: isPopoverOpen ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') : 'transparent' }}
                      onMouseEnter={e => { if (!isPopoverOpen) e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'; }}
                      onMouseLeave={e => { if (!isPopoverOpen) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      onClick={() => setActivePopover(isPopoverOpen ? null : i)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: colors.text.highEmphasis.onLight }}>{a.title}</p>
                        <p className="text-xs" style={{ color: colors.text.lowEmphasis.onLight }}>{a.desc}</p>
                      </div>
                      <span className="text-xs shrink-0 pt-0.5" style={{ color: colors.text.lowEmphasis.onLight }}>{a.time}</span>
                    </button>

                    {isPopoverOpen && (
                      <div
                        ref={popoverRef}
                        className="absolute left-0 right-0 top-0 z-50 rounded-xl shadow-lg overflow-hidden"
                        style={{
                          backgroundColor: colors.surface.light,
                          border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.04)',
                        }}
                      >
                        {linkedProduct && (
                          <div className="flex items-center gap-3 p-3" style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.04)' }}>
                            <img
                              src={linkedProduct.imageUrl}
                              alt={linkedProduct.name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                              style={{ backgroundColor: colors.surface.lightDarker }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color: colors.text.highEmphasis.onLight }}>{linkedProduct.name}</p>
                              <p className="text-xs" style={{ color: colors.text.lowEmphasis.onLight }}>
                                {linkedProduct.type === 'Bundle' ? `Bundle · ${linkedProduct.subProducts?.length ?? 0} products` : `${linkedProduct.category ?? ''} · ${linkedProduct.brands.join(', ')}`}
                              </p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); setActivePopover(null); }}
                              className="p-1 rounded-lg hover-surface transition-colors shrink-0"
                              style={{ color: colors.text.disabled.onLight }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}

                        <div className="p-3 space-y-1.5">
                          <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: colors.text.lowEmphasis.onLight }}>
                            What changed
                          </p>
                          {a.changes.map((c, ci) => (
                            <div key={ci} className="flex items-center gap-2 text-xs">
                              <span className="font-medium shrink-0" style={{ color: colors.text.lowEmphasis.onLight }}>
                                {c.field}
                              </span>
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                {c.from && (
                                  <>
                                    <span
                                      className="line-through px-1.5 py-0.5 rounded truncate"
                                      style={{
                                        color: isDark ? '#fca5a5' : '#dc2626',
                                        backgroundColor: isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.06)',
                                      }}
                                    >{c.from}</span>
                                    <ArrowRight size={10} style={{ color: colors.text.disabled.onLight, flexShrink: 0 }} />
                                  </>
                                )}
                                <span
                                  className="px-1.5 py-0.5 rounded truncate font-medium"
                                  style={{
                                    color: isDark ? '#6ee7b7' : '#059669',
                                    backgroundColor: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.06)',
                                  }}
                                >{c.to}</span>
                              </div>
                            </div>
                          ))}
                          {linkedProduct && onProductClick && (
                            <div style={{ marginTop: 24 }}>
                              <button
                                className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:opacity-90"
                                style={{
                                  color: colors.brand.default,
                                  backgroundColor: `${colors.brand.default}12`,
                                }}
                                onClick={(e) => { e.stopPropagation(); setActivePopover(null); onProductClick(linkedProduct); }}
                              >
                                View details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="mb-8">
        <h2 className="text-sm font-medium mb-4" style={{ color: colors.text.highEmphasis.onLight }}>Recently viewed</h2>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${chatOpen ? 'lg:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-3 xl:grid-cols-4'} gap-6`}>
          {recentProducts.map(product => (
            <DashboardProductCard
              key={product.id}
              product={product}
              onClick={onNavigateToProducts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
