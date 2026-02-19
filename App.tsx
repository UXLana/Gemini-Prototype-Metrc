import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, HelpCircle, Box, Home, Layers, Plus, 
  Filter, ArrowUpDown, LayoutGrid, List, ChevronLeft, ChevronRight,
  FileText, Settings, Menu, Grip, ChevronDown, Moon, Sun, X
} from 'lucide-react';
import { DASHBOARD_PRODUCTS } from './constants';
import { DashboardProductCard } from './components/DashboardProductCard';
import { ProductRegistrationFlow } from './components/ProductRegistrationFlow';
import { Button } from './components/Button';
import { Product, DashboardProduct } from './types';
import { EditProductView } from './components/EditProductView';
import { Toast } from './components/Toast';

export type UseCase = 'standard' | 'empty-search' | 'market-selection';

export default function App() {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [useCase, setUseCase] = useState<UseCase>('standard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [isSidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
  
  const [dashboardProducts, setDashboardProducts] = useState<DashboardProduct[]>(DASHBOARD_PRODUCTS);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };

  const handleProductClick = (dashProduct: DashboardProduct) => {
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
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
      {/* Top Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-30 h-16 shrink-0 transition-colors shadow-sm md:shadow-none">
        <div className="flex items-center gap-2 shrink-0 min-w-[50px] md:min-w-[200px]">
            <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 md:hidden"
                aria-label="Open Sidebar"
            >
                <Menu size={20} />
            </button>
            <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 hidden md:block"
                aria-label="Toggle Sidebar"
            >
                <Menu size={20} />
            </button>
            
            <button className="flex items-center gap-2 p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg transition-colors">
                <Grip size={20} />
            </button>
            
            <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group ml-1">
                 <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[10px] border border-brand-200 shadow-sm">
                    JD
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">Jane Doe</span>
                <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
            </button>
        </div>

        {/* Center Section: Search Bar */}
        <div className="flex-1 flex justify-center px-4 lg:px-8">
            <div className="w-full max-w-xl relative hidden md:block">
                <input 
                type="text" 
                placeholder="Find or ask about a product or integration" 
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm focus:bg-white dark:focus:bg-gray-700 transition-all"
                />
                <div className="absolute right-3 top-2.5 text-gray-400">
                    <Search size={16} />
                </div>
            </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-2 text-gray-500 dark:text-gray-400 shrink-0 min-w-[100px] md:min-w-[200px]">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><Bell size={20} /></button>
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Toggle Theme"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="flex items-center gap-2 px-1.5 ml-2">
                <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600 overflow-hidden">
                    <img 
                        src="https://ui-avatars.com/api/?name=Canopy&background=0D8ABC&color=fff" 
                        alt="Org" 
                        className="w-full h-full opacity-90"
                    />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">Canopy</span>
            </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Scrim Overlay */}
        <div 
          className={`
            fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden
            ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside 
            className={`
                bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50
                fixed inset-y-0 left-0 
                transition-all duration-300 ease-in-out
                
                w-[85vw] sm:w-[50vw]
                ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}

                md:sticky md:top-0 md:translate-x-0 md:shadow-none md:z-auto md:h-[calc(100vh-64px)] md:self-start
                ${isSidebarOpen ? 'md:w-64' : 'md:w-[68px]'}
            `}
        >
            <div className={`h-16 flex items-center shrink-0 ${isSidebarOpen ? 'px-4 justify-between md:justify-start gap-3' : 'justify-center'} mb-2`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-700 text-white rounded flex items-center justify-center font-bold text-lg shadow-sm shrink-0 transition-transform hover:scale-105">
                        <Box size={20} />
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 flex flex-col justify-center ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 hidden md:hidden'}`}>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-none whitespace-nowrap">GCR</h2>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 whitespace-nowrap">Global Cannabis Registry</p>
                    </div>
                </div>

                <button 
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className={`flex-1 py-4 space-y-1 px-2`}>
                <NavItem icon={<Home size={20} />} label="Home" collapsed={!isSidebarOpen} />
                <NavItem icon={<Box size={20} />} label="Products" active collapsed={!isSidebarOpen} />
                <NavItem icon={<Layers size={20} />} label="Integrations" collapsed={!isSidebarOpen} />
            </nav>

            <div className={`p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 transition-all space-y-3 ${!isSidebarOpen ? 'flex flex-col items-center justify-center' : ''}`}>
                
                {isSidebarOpen ? (
                    <div className="space-y-2">
                        <label className="form-label px-2">Prototype Mode</label>
                        <div className="relative">
                            <select 
                                value={useCase} 
                                onChange={(e) => setUseCase(e.target.value as UseCase)}
                                className="form-select py-2 pl-3 pr-8 text-xs font-medium shadow-sm"
                            >
                                <option value="standard">Standard</option>
                                <option value="empty-search">Empty Search</option>
                                <option value="market-selection">Market Select</option>
                            </select>
                            <div className="absolute right-2 top-2.5 pointer-events-none text-gray-400">
                                <ArrowUpDown size={12} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg" title="Settings">
                        <Settings size={20} />
                    </button>
                )}
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-y-auto relative transition-colors">
            <div className="p-4 md:p-8">
                <div className="mb-8 mt-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Products</h1>
                    <p className="text-gray-500 dark:text-gray-400">Here you can manage all your products and bundles</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <StatCard label="Have gaps" value="11" icon={<FileText size={20} className="text-gray-400" />} />
                    <StatCard label="Total products" value="74" icon={<Box size={20} className="text-gray-400" />} />
                    <StatCard label="Drafts" value="2" icon={<FileText size={20} className="text-gray-400" />} />
                    <StatCard label="Active" value="65" icon={<Box size={20} className="text-gray-400" />} />
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex gap-6 overflow-x-auto pb-1 ml-2">
                            <TabButton active>All</TabButton>
                            <TabButton>Active</TabButton>
                            <TabButton>Archived</TabButton>
                        </div>
                        <div className="pb-2">
                            <Button onClick={() => setIsRegistrationModalOpen(true)} className="flex items-center gap-2 px-4 py-2 w-full sm:w-auto">
                                <Plus size={16} />
                                Register new product
                            </Button>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between card p-2 gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 pl-2">Selected: 0</span>
                        <div className="flex items-center gap-2 ml-auto">
                            <IconButton><Filter size={16} /></IconButton>
                            <IconButton><ArrowUpDown size={16} /></IconButton>
                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                            <IconButton active><LayoutGrid size={16} /></IconButton>
                            <IconButton><List size={16} /></IconButton>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {dashboardProducts.map(product => (
                        <DashboardProductCard 
                            key={product.id} 
                            product={product} 
                            onClick={() => handleProductClick(product)}
                        />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-end gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <span>80–90 of 90</span>
                    <div className="flex items-center gap-2">
                        <span>10 per page</span>
                        <ChevronDown size={14} />
                    </div>
                    <span>Page 9 of 9</span>
                    <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"><ChevronLeft size={16} /></button>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50" disabled><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </main>
      </div>

      {isRegistrationModalOpen && (
          <ProductRegistrationFlow 
            useCase={useCase} 
            onClose={() => setIsRegistrationModalOpen(false)}
            onSave={() => showToast("New product registered successfully")}
          />
      )}

      {selectedProduct && (
        <div className="fixed inset-0 w-full h-full bg-white dark:bg-gray-900 z-[60] overflow-hidden flex flex-col animate-in fade-in duration-300">
            <EditProductView 
                product={selectedProduct}
                onSave={handleProductSave}
                onCancel={() => setSelectedProduct(null)}
            />
        </div>
      )}

      <Toast 
        message={toast.message} 
        isVisible={toast.visible} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />
    </div>
  );
}

function NavItem({ icon, label, active, collapsed }: { icon: React.ReactNode, label: string, active?: boolean, collapsed?: boolean }) {
    return (
        <a 
            href="#" 
            className={`
                flex items-center text-sm font-medium rounded-lg transition-all duration-200 group relative
                ${active ? 'text-brand-700 dark:text-brand-400 bg-black/[0.06] dark:bg-white/[0.06]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}
                ${collapsed ? 'justify-center w-10 h-10 mx-auto gap-0' : 'px-2 py-2 w-full gap-3'}
            `}
            title={collapsed ? label : undefined}
        >
            <span className="shrink-0">{icon}</span>
            <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                {label}
            </span>
            {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {label}
                </div>
            )}
        </a>
    )
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="card p-5 flex items-start gap-4">
            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{icon}</div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    )
}

function TabButton({ children, active }: { children?: React.ReactNode, active?: boolean }) {
    return (
        <button className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${active ? 'border-brand-500 dark:border-brand-400 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            {children}
        </button>
    )
}

function IconButton({ children, active }: { children?: React.ReactNode, active?: boolean }) {
    return (
        <button className={`p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${active ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400'}`}>
            {children}
        </button>
    )
}
