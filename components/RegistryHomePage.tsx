import React from 'react';
import { useAppColors, useDarkMode } from '../hooks/useDarkMode';
import { TabBar } from 'mtr-design-system/components';
import { Package, Box, FileText, Layers, Plus, Pencil, RefreshCw, Archive } from 'lucide-react';
import { DASHBOARD_PRODUCTS } from '../constants';
import { DashboardProductCard } from './DashboardProductCard';
import { StatsRow } from './StatsRow';

const CATALOG_STATS = [
  { label: 'Total products', value: '4,500', icon: <Box size={20} /> },
  { label: 'Active brands', value: '14', icon: <Layers size={20} /> },
  { label: 'Total bundles', value: '4', icon: <Package size={20} /> },
  { label: 'Drafts', value: '3', icon: <FileText size={20} /> },
];

const SEGMENTS = [
  { label: 'Flower', count: 285, pct: 26 },
  { label: 'Edibles', count: 248, pct: 23 },
  { label: 'Vape', count: 198, pct: 18 },
  { label: 'Concentrates', count: 143, pct: 13 },
  { label: 'Pre-rolls', count: 110, pct: 10 },
  { label: 'Topicals', count: 65, pct: 6 },
  { label: 'Tinctures', count: 43, pct: 4 },
];

const ACTIVITIES = [
  { icon: <Plus size={16} />, title: 'Wyld Variety Pack', desc: 'Created new product', time: 'Just now' },
  { icon: <Pencil size={16} />, title: 'Wyld Raspberry', desc: 'Updated metadata', time: '5 min' },
  { icon: <RefreshCw size={16} />, title: 'Raspberry e-pack', desc: 'Synced inventory', time: '30 min' },
  { icon: <Pencil size={16} />, title: 'Elderberry gummies', desc: 'Updated price', time: '2 hrs' },
  { icon: <Pencil size={16} />, title: 'Elderberry gummies', desc: 'Updated price', time: '5 hrs' },
  { icon: <Archive size={16} />, title: 'Blood Oranges', desc: 'Archived product', time: '1 day' },
];

interface RegistryHomePageProps {
  onNavigateToProducts: () => void;
}

export function RegistryHomePage({ onNavigateToProducts }: RegistryHomePageProps) {
  const colors = useAppColors();
  const { isDark } = useDarkMode();
  const [segmentTab, setSegmentTab] = React.useState('category');

  const recentProducts = DASHBOARD_PRODUCTS.slice(0, 4);
  const maxSegment = Math.max(...SEGMENTS.map(s => s.count));

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
        {/* Products by segment */}
        <div
          className="md:col-span-3 rounded-2xl border p-6"
          style={{
            backgroundColor: colors.surface.light,
            borderColor: colors.border.lowEmphasis.onLight,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium" style={{ color: colors.text.highEmphasis.onLight }}>Products by segment</h2>
            <button className="text-xs font-medium" style={{ color: colors.brand.default }}>Show all</button>
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
          <div className="mt-6 space-y-3">
            {SEGMENTS.map(seg => (
              <div key={seg.label} className="flex items-center gap-3">
                <span className="text-xs w-24 text-right shrink-0" style={{ color: colors.text.lowEmphasis.onLight }}>{seg.label}</span>
                <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(seg.count / maxSegment) * 100}%`,
                      backgroundColor: colors.brand.default,
                    }}
                  />
                </div>
                <span className="text-xs tabular-nums w-20 shrink-0" style={{ color: colors.text.lowEmphasis.onLight }}>
                  {seg.count}  ({seg.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="md:col-span-2 rounded-2xl border p-6"
          style={{
            backgroundColor: colors.surface.light,
            borderColor: colors.border.lowEmphasis.onLight,
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-medium" style={{ color: colors.text.highEmphasis.onLight }}>Recent activity</h2>
            <button className="text-xs font-medium" style={{ color: colors.brand.default }}>Show all</button>
          </div>
          <div className="space-y-4">
            {ACTIVITIES.map((a, i) => (
              <div key={i} className="flex items-start gap-3 relative">
                {/* Connector Line */}
                {i !== ACTIVITIES.length - 1 && (
                  <div
                    className="absolute left-[15px] top-[32px] bottom-[-16px] w-[2px] z-0"
                    style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                  />
                )}
                
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10"
                  style={{
                    color: colors.brand.default,
                    border: `1.5px solid ${isDark ? colors.brand.default : 'rgba(0,0,0,0.07)'}`,
                  }}
                >{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: colors.text.highEmphasis.onLight }}>{a.title}</p>
                  <p className="text-xs" style={{ color: colors.text.lowEmphasis.onLight }}>{a.desc}</p>
                </div>
                <span className="text-xs shrink-0" style={{ color: colors.text.lowEmphasis.onLight }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="mb-8">
        <h2 className="text-sm font-medium mb-4" style={{ color: colors.text.highEmphasis.onLight }}>Recently viewed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
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
