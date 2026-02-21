import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAppColors, useDarkMode } from './hooks/useDarkMode';
import { 
  Search, Bell, Box, Plus, 
  Filter, ArrowUpDown, LayoutGrid, List, ChevronLeft, ChevronRight,
  FileText, Menu, Grip, ChevronDown, Moon, Sun,
  Trash2, Pencil, Package, Bot
} from 'lucide-react';
import { DASHBOARD_PRODUCTS } from './constants';
import { DashboardProductCard } from './components/DashboardProductCard';
import { ProductListView, DEFAULT_COLUMNS, ProductColumn } from './components/ProductListView';
import { ProductRegistrationFlow } from './components/ProductRegistrationFlow';
import { Button, Avatar, TabBar } from 'mtr-design-system/components';
import { Product, DashboardProduct, UseCase, AppView, DotAnimation } from './types';
import { EditProductView } from './components/EditProductView';
import { Toast } from './components/Toast';
import { CanopyLogo } from './components/CanopyLogo';
import { RegistryLeftNav } from './components/RegistryLeftNav';
import { BundleNameModal } from './components/BundleNameModal';
import { BuildBundleView, BundleItem } from './components/BuildBundleView';
import { FilterDrawer } from './components/FilterDrawer';
import { ActiveFilters } from './components/ActiveFilters';
import { AppSwitcher } from './components/AppSwitcher';
import { RegistryHomePage } from './components/RegistryHomePage';
import { IntegrationsPage } from './components/IntegrationsPage';
import { StatsRow } from './components/StatsRow';
import { ChatPanel, CHAT_COLORS } from './components/ChatPanel';


// export type UseCase = 'standard' | 'empty-search' | 'market-selection';
// export type AppView = 'home' | 'products' | 'integrations';

export default function App() {
  const colors = useAppColors();

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [useCase, setUseCase] = useState<UseCase>('standard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [isSidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1280;
    }
    return false;
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, Set<string>>>({});
  const [activeTab, setActiveTab] = useState('all');
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const gripRef = useRef<HTMLButtonElement>(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [dotAnimation, setDotAnimation] = useState<DotAnimation>('pulse');

  useEffect(() => {
    const mqMd = window.matchMedia('(min-width: 768px)');
    const mqXl = window.matchMedia('(min-width: 1280px)');
    const handleResize = () => {
      if (!mqMd.matches) {
        setSidebarOpen(false);
      } else if (!mqXl.matches) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    mqMd.addEventListener('change', handleResize);
    mqXl.addEventListener('change', handleResize);
    return () => {
      mqMd.removeEventListener('change', handleResize);
      mqXl.removeEventListener('change', handleResize);
    };
  }, []);

  useEffect(() => {
    if (chatOpen) {
      setSidebarOpen(false);
    }
  }, [chatOpen]);

  const { isDark: isDarkMode, toggle: toggleDarkMode } = useDarkMode();
  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
  
  const [dashboardProducts, setDashboardProducts] = useState<DashboardProduct[]>(DASHBOARD_PRODUCTS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [listColumns, setListColumns] = useState<ProductColumn[]>(DEFAULT_COLUMNS);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  const [bundleFromSelection, setBundleFromSelection] = useState(false);
  const [buildBundleOpen, setBuildBundleOpen] = useState(false);
  const [bundleName, setBundleName] = useState('');
  const [editingBundle, setEditingBundle] = useState<DashboardProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const filteredProducts = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) return dashboardProducts;
    return dashboardProducts.filter(product => {
      return Object.entries(activeFilters).every(([categoryId, selectedIds]) => {
        if (selectedIds.size === 0) return true;
        switch (categoryId) {
          case 'brand':
            return product.brands.some(b => selectedIds.has(b.toLowerCase().replace(/[\s\/]+/g, '_')));
          case 'category':
            return product.category ? selectedIds.has(product.category.toLowerCase()) : false;
          case 'status':
            return product.status ? selectedIds.has(product.status.toLowerCase()) : selectedIds.has('active');
          case 'type':
            return selectedIds.has(product.type.toLowerCase());
          default:
            return true;
        }
      });
    });
  }, [dashboardProducts, activeFilters]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pagedProducts = useMemo(
    () => filteredProducts.slice(startIndex, endIndex),
    [filteredProducts, startIndex, endIndex]
  );

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedProductIds(prev => {
      const pageIds = pagedProducts.map(p => p.id);
      const allSelected = pageIds.every(id => prev.has(id));
      if (allSelected) return new Set();
      return new Set(pageIds);
    });
  };

  const clearSelection = () => setSelectedProductIds(new Set());

  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  const handleProductClick = (dashProduct: DashboardProduct) => {
    if (dashProduct.type === 'Bundle') {
      setBundleName(dashProduct.name);
      setEditingBundle(dashProduct);
      setBuildBundleOpen(true);
      return;
    }
    const product: Product = {
        id: dashProduct.id,
        name: dashProduct.name,
        licenseNumber: dashProduct.licenseNumber,
        brand: dashProduct.brands[0] || '',
        category: dashProduct.category || '',
        potency: dashProduct.potency || '',
        markets: dashProduct.markets,
        totalMarkets: dashProduct.totalMarkets,
        imageUrl: dashProduct.imageUrl,
        feelings: dashProduct.feelings || [], 
        description: dashProduct.description || "", 
        subspecies: dashProduct.subspecies || "",
        strain: dashProduct.strain || ""
    };
    setSelectedProduct(product);
    setIsRegistrationModalOpen(false);
  };

  const handleProductSave = (updatedProduct: Product) => {
    setDashboardProducts(prevProducts => prevProducts.map(p => {
        if (p.id === updatedProduct.id) {
            return {
                ...p,
                name: updatedProduct.name,
                brands: [updatedProduct.brand],
                category: updatedProduct.category,
                potency: updatedProduct.potency,
                markets: updatedProduct.markets,
                totalMarkets: updatedProduct.markets.length,
                imageUrl: updatedProduct.imageUrl,
                subspecies: updatedProduct.subspecies,
                strain: updatedProduct.strain,
                feelings: updatedProduct.feelings,
                description: updatedProduct.description
            };
        }
        return p;
    }));
    setSelectedProduct(null);
    showToast("Product saved successfully");
  };

  return (
    <div
      className="h-[100dvh] overflow-hidden flex flex-col font-sans transition-colors duration-200"
      style={{ backgroundColor: colors.surface.lightDarker, color: colors.text.highEmphasis.onLight }}
    >
      {/* Top Header */}
      <header
        className="px-4 py-2 flex items-center justify-center sticky top-0 z-30 h-fit shrink-0 transition-colors shadow-sm md:shadow-none"
        style={{ backgroundColor: colors.surface.light, borderBottom: `1px solid ${colors.border.lowEmphasis.onLight}` }}
      >
        <div className="flex items-center gap-2 shrink-0 min-w-[50px] md:min-w-[200px]">
            <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover-surface rounded-lg transition-colors focus:outline-none focus-brand md:hidden"
                style={{ color: colors.text.lowEmphasis.onLight }}
                aria-label="Open Sidebar"
            >
                <Menu size={20} />
            </button>
            <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 hover-surface rounded-lg transition-colors focus:outline-none focus-brand hidden md:block"
                style={{ color: colors.text.lowEmphasis.onLight }}
                aria-label="Toggle Sidebar"
            >
                <Menu size={20} />
            </button>
            
            <div className="relative">
              <button
                ref={gripRef}
                onClick={() => setAppSwitcherOpen(!appSwitcherOpen)}
                className="flex items-center gap-2 p-2 hover-surface rounded-lg transition-colors"
                style={{ color: colors.text.lowEmphasis.onLight }}
              >
                  <Grip size={20} />
              </button>
              <AppSwitcher
                isOpen={appSwitcherOpen}
                onClose={() => setAppSwitcherOpen(false)}
                anchorRef={gripRef}
              />
            </div>
            
            <button className="flex items-center gap-2 p-1.5 hover-surface rounded-lg transition-colors group ml-1">
                <Avatar name="Jane Doe" size="xs" />
                <span className="text-sm font-medium hidden md:block" style={{ color: colors.text.highEmphasis.onLight }}>Jane Doe</span>
                <ChevronDown size={14} style={{ color: colors.text.disabled.onLight }} />
            </button>
        </div>

        {/* Center Section: Search Bar (triggers chat panel) */}
        <div className="flex-1 flex justify-center px-4 lg:px-8">
            {!chatOpen && (
              <button
                onClick={() => { setChatOpen(true); setChatExpanded(false); }}
                className="w-full max-w-xl relative hidden md:flex items-center rounded-full border text-sm transition-all cursor-pointer text-left"
                style={{
                  backgroundColor: colors.surface.lightDarker,
                  borderColor: colors.border.lowEmphasis.onLight,
                  color: colors.text.disabled.onLight,
                  padding: '8px 16px',
                }}
              >
                <span className="flex-1">Find or ask about a product or integration</span>
                <Search size={16} />
              </button>
            )}
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-2 shrink-0 min-w-[100px] md:min-w-[200px]" style={{ color: colors.text.lowEmphasis.onLight }}>
            <button className="p-2 hover-surface rounded-full transition-colors"><Bell size={20} /></button>
            <button 
                onClick={toggleDarkMode} 
                className="p-2 hover-surface rounded-full transition-colors"
                title="Toggle Theme"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="flex items-center gap-2 px-1.5 ml-2">
                <CanopyLogo size="md" />
                <span className="text-sm font-medium hidden md:block" style={{ color: colors.text.highEmphasis.onLight }}>Canopy</span>
            </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Scrim Overlay */}
        <div 
          className={`
            fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300 md:hidden
            ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          style={{ backgroundColor: colors.scrim }}
          onClick={() => setSidebarOpen(false)}
        />

        <RegistryLeftNav
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onToggle={() => setSidebarOpen(!isSidebarOpen)}
          useCase={useCase}
          onUseCaseChange={setUseCase}
          dotAnimation={dotAnimation}
          onDotAnimationChange={setDotAnimation}
          currentView={currentView}
          onViewChange={(view) => { setChatExpanded(false); setCurrentView(view); }}
          logo={
            <div className="w-8 h-8 rounded flex items-center justify-center shrink-0 transition-transform hover:scale-105">
              <img src="/logo.png" alt="GCR" className="w-full h-full object-contain" />
            </div>
          }
        />

        {/* Main Content */}
        <main
          className={`flex-1 flex flex-col overflow-y-auto relative transition-colors min-w-0 ${chatOpen && chatExpanded ? 'hidden' : ''}`}
          style={{ backgroundColor: colors.surface.lightDarker }}
        >
          {currentView === 'home' ? (
            <RegistryHomePage onNavigateToProducts={() => setCurrentView('products')} onProductClick={handleProductClick} chatOpen={chatOpen} />
          ) : currentView === 'integrations' ? (
            <IntegrationsPage />
          ) : (
            <div className="p-4 md:p-8 max-w-[1900px] mx-auto w-full">
                <div className="mb-8 mt-2">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text.highEmphasis.onLight }}>Products</h1>
                    <p style={{ color: colors.text.lowEmphasis.onLight }}>Here you can manage all your products and bundles</p>
                </div>

                {/* Stats Row */}
                <StatsRow title="Product stats" stats={PRODUCT_STATS} />


                {/* Toolbar */}
                <div className="flex flex-col mb-4" style={{ gap: 16 }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <TabBar
                            tabs={[
                                { id: 'all', label: 'All' },
                                { id: 'active', label: 'Active' },
                                { id: 'archived', label: 'Archived' },
                            ]}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            iconPosition="leading"
                            align="left"
                            hasDivider={false}
                            onDark={isDarkMode}
                        />
                        <div className="pb-2 flex gap-2">
                            <Button emphasis="high" leftIcon={<Plus size={16} />} onClick={() => setIsRegistrationModalOpen(true)}>
                                Register product
                            </Button>
                        </div>
                    </div>
                    
                    <div
                      className="flex flex-wrap items-center justify-between card p-2 gap-2"
                      style={{ backgroundColor: colors.surface.light, borderColor: colors.border.lowEmphasis.onLight }}
                    >
                        <div className="flex items-center gap-1 pl-2">
                            <span
                              className="text-sm mr-1"
                              style={{
                                color: selectedProductIds.size > 0 ? colors.brand.default : colors.text.lowEmphasis.onLight,
                                fontWeight: selectedProductIds.size > 0 ? 500 : 400
                              }}
                            >
                                Selected: {selectedProductIds.size}
                            </span>
                            {selectedProductIds.size > 0 && (
                                <>
                                    <div className="h-5 w-px mx-1" style={{ backgroundColor: colors.border.lowEmphasis.onLight }} />
                                    <IconButton onClick={() => {
                                        const first = Array.from(selectedProductIds)[0];
                                        const p = dashboardProducts.find(dp => dp.id === first);
                                        if (p) handleProductClick(p);
                                    }} title="Edit" label="Edit">
                                        <Pencil size={16} />
                                    </IconButton>
                                    <IconButton onClick={() => { setBundleFromSelection(true); setBundleModalOpen(true); }} title="Create bundle" label="Bundle">
                                        <Package size={16} />
                                    </IconButton>
                                    <IconButton onClick={() => {
                                        setDashboardProducts(prev => prev.filter(p => !selectedProductIds.has(p.id)));
                                        clearSelection();
                                        showToast(`${selectedProductIds.size} product(s) deleted`);
                                    }} title="Delete" label="Delete">
                                        <Trash2 size={16} />
                                    </IconButton>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-1 ml-auto">
                            <IconButton 
                                onClick={() => setIsFilterOpen(true)} 
                                active={isFilterOpen || Object.keys(activeFilters).length > 0}
                                title="Filter"
                                label="Filter"
                            >
                                <span className="relative">
                                    <Filter size={16} />
                                    {Object.keys(activeFilters).length > 0 && (
                                        <span 
                                            className="absolute -right-0.5 rounded-full"
                                            style={{ backgroundColor: colors.text.important, width: 6, height: 6, top: 0 }}
                                        />
                                    )}
                                </span>
                            </IconButton>
                            <IconButton label="Sort"><ArrowUpDown size={16} /></IconButton>
                            <div className="h-6 w-px mx-1" style={{ backgroundColor: colors.border.lowEmphasis.onLight }}></div>
                            <IconButton active={viewMode === 'grid'} onClick={() => setViewMode('grid')} label="Grid"><LayoutGrid size={16} /></IconButton>
                            <IconButton active={viewMode === 'list'} onClick={() => setViewMode('list')} label="List"><List size={16} /></IconButton>
                        </div>
                    </div>
                </div>

                {/* Active Filters */}
                <ActiveFilters 
                    filters={activeFilters}
                    onRemove={(categoryId, optionId) => {
                        setActiveFilters(prev => {
                            const next = { ...prev };
                            if (next[categoryId]) {
                                const nextSet = new Set(next[categoryId]);
                                nextSet.delete(optionId);
                                if (nextSet.size === 0) delete next[categoryId];
                                else next[categoryId] = nextSet;
                            }
                            return next;
                        });
                        setCurrentPage(1);
                    }}
                    onClearAll={() => { setActiveFilters({}); setCurrentPage(1); }}
                />

                {/* Product Grid / List */}
                <div key={activeTab} className="tab-content-animate">
                {viewMode === 'grid' ? (
                  <div className={`grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 ${chatOpen ? 'lg:grid-cols-2 xl:grid-cols-3 min-[1700px]:grid-cols-4' : 'lg:grid-cols-3 xl:grid-cols-4 min-[1700px]:grid-cols-5'}`}>
                      {pagedProducts.map(product => (
                          <DashboardProductCard 
                              key={product.id} 
                              product={product}
                              selected={selectedProductIds.has(product.id)}
                              onSelect={toggleSelectProduct}
                              onClick={() => handleProductClick(product)}
                          />
                      ))}
                  </div>
                ) : (
                  <div className="mb-8">
                    <ProductListView
                      products={pagedProducts}
                      columns={listColumns}
                      selectedIds={selectedProductIds}
                      onToggleSelect={toggleSelectProduct}
                      onToggleSelectAll={toggleSelectAll}
                      onProductClick={handleProductClick}
                    />
                  </div>
                )}
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-end gap-6 text-sm" style={{ color: colors.text.lowEmphasis.onLight }}>
                    <span>{startIndex + 1}–{endIndex} of {totalItems}</span>
                    <div className="flex items-center gap-2 relative">
                        <select
                          value={pageSize}
                          onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                          className="appearance-none bg-transparent pr-5 cursor-pointer font-medium"
                          style={{ color: 'inherit' }}
                        >
                          <option value={6}>6 per page</option>
                          <option value={12}>12 per page</option>
                          <option value={24}>24 per page</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-0 pointer-events-none" />
                    </div>
                    <span>Page {safePage} of {totalPages}</span>
                    <div className="flex items-center gap-2">
                        <button
                          className="p-1 hover-surface rounded disabled:opacity-50"
                          disabled={safePage <= 1}
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        ><ChevronLeft size={16} /></button>
                        <button
                          className="p-1 hover-surface rounded disabled:opacity-50"
                          disabled={safePage >= totalPages}
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        ><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
          )}

          {/* FAB: Chat trigger */}
          {!chatOpen && (
            <button
              onClick={() => { setChatOpen(true); setChatExpanded(false); }}
              className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full flex items-center justify-center focus:outline-none transition-transform hover:scale-110 active:scale-95 shadow-lg"
              style={{ backgroundColor: CHAT_COLORS.primary }}
              aria-label="Open chat"
            >
              <Bot size={24} color="#fff" />
            </button>
          )}
        </main>

        {/* Chat Panel */}
        <ChatPanel
          isOpen={chatOpen}
          isExpanded={chatExpanded}
          onClose={() => { setChatOpen(false); setChatExpanded(false); }}
          onToggleExpand={() => { if (!chatExpanded) setSidebarOpen(false); setChatExpanded(!chatExpanded); }}
          dotAnimation={dotAnimation}
          onDotAnimationChange={setDotAnimation}
        />
      </div>

      {isRegistrationModalOpen && (
          <ProductRegistrationFlow 
            useCase={useCase} 
            onClose={() => setIsRegistrationModalOpen(false)}
            onSave={() => showToast("New product registered successfully")}
          />
      )}

      {selectedProduct && (
        <div
          className="fixed inset-0 w-full h-full z-[60] overflow-hidden flex flex-col animate-in fade-in duration-300"
          style={{ backgroundColor: colors.surface.light }}
        >
            <EditProductView 
                product={selectedProduct}
                onSave={handleProductSave}
                onCancel={() => setSelectedProduct(null)}
            />
        </div>
      )}

      <BundleNameModal
        open={bundleModalOpen}
        onCancel={() => { setBundleModalOpen(false); setBundleFromSelection(false); }}
        onContinue={(name) => {
          setBundleName(name);
          setEditingBundle(null);
          setBundleModalOpen(false);
          setBuildBundleOpen(true);
        }}
      />

      {buildBundleOpen && (
        <div
          className="fixed inset-0 w-full h-full z-[60] overflow-hidden flex flex-col animate-in fade-in duration-300"
          style={{ backgroundColor: colors.surface.light }}
        >
          <BuildBundleView
            bundleName={bundleName}
            initialProducts={
              editingBundle
                ? dashboardProducts.filter(p => p.type === 'Product' && editingBundle.subProducts?.includes(p.name))
                : bundleFromSelection
                  ? dashboardProducts.filter(p => selectedProductIds.has(p.id))
                  : []
            }
            allProducts={dashboardProducts}
            onCancel={() => { setBuildBundleOpen(false); setEditingBundle(null); setBundleFromSelection(false); }}
            onSave={(name, items, price) => {
              const newBundle: DashboardProduct = {
                id: `bundle_${Date.now()}`,
                type: 'Bundle',
                name,
                licenseNumber: `BNDL-${Date.now().toString(36).toUpperCase()}`,
                brands: [...new Set(items.flatMap(i => i.product.brands))],
                subProducts: items.map(i => i.product.name),
                markets: [...new Set(items.flatMap(i => i.product.markets))],
                totalMarkets: new Set(items.flatMap(i => i.product.markets)).size,
                imageUrl: items[0]?.product.imageUrl || '',
                status: 'Active',
              };
              setDashboardProducts(prev => [newBundle, ...prev]);
              clearSelection();
              setBuildBundleOpen(false);
              setEditingBundle(null);
              setBundleFromSelection(false);
              showToast(`Bundle "${name}" created with ${items.length} products`);
            }}
          />
        </div>
      )}

      <FilterDrawer 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilters={activeFilters}
        onApply={(filters) => { setActiveFilters(filters); setCurrentPage(1); }}
        onReset={() => { setActiveFilters({}); setCurrentPage(1); }}
      />

      <Toast 
        message={toast.message} 
        isVisible={toast.visible} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />
    </div>
  );
}

const PRODUCT_STATS = [
  { label: 'Have gaps', value: '11', icon: <FileText size={20} /> },
  { label: 'Total products', value: '74', icon: <Box size={20} /> },
  { label: 'Drafts', value: '2', icon: <FileText size={20} /> },
  { label: 'Active', value: '65', icon: <Box size={20} /> },
];

function IconButton({ children, active, onClick, title, label }: { children?: React.ReactNode, active?: boolean, onClick?: () => void, title?: string, label?: string }) {
    const colors = useAppColors();
    return (
        <button
          onClick={onClick}
          title={title}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover-surface-subtle text-xs font-medium"
          style={{
            color: active ? colors.text.highEmphasis.onLight : colors.text.lowEmphasis.onLight,
            backgroundColor: active ? colors.hover.onLight : undefined
          }}
        >
            {children}
            {label && <span className="hidden sm:inline">{label}</span>}
        </button>
    )
}
