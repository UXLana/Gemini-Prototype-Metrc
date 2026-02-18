import React, { useState } from 'react';
import { 
  Search, Bell, HelpCircle, Box, Home, Layers, Plus, 
  Filter, ArrowUpDown, LayoutGrid, List, ChevronLeft, ChevronRight,
  MoreVertical, CheckSquare, FileText
} from 'lucide-react';
import { DASHBOARD_PRODUCTS } from './constants';
import { DashboardProductCard } from './components/DashboardProductCard';
import { ProductRegistrationFlow } from './components/ProductRegistrationFlow';
import { Button } from './components/Button';

export default function App() {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-800 text-white rounded flex items-center justify-center font-bold text-lg">
             <Box size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 leading-none">GCR</h2>
            <p className="text-[10px] text-gray-500 mt-0.5">Global Cannabis Registry</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
            <Home size={18} />
            Home
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-emerald-800 bg-emerald-50 rounded-md">
            <Box size={18} />
            Products
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
            <Layers size={18} />
            Integrations
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-700">ON</div>
            <div className="leading-tight">
               <p className="text-sm font-medium text-gray-900">Organization Name</p>
               <p className="text-xs text-gray-500">Organization</p>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-8 relative">
             <input 
               type="text" 
               placeholder="Find or ask about a product or integration" 
               className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
             />
             <div className="absolute right-3 top-2.5 text-gray-400">
                <Search size={16} />
             </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500">
             <button><Bell size={20} /></button>
             <button><HelpCircle size={20} /></button>
             <div className="flex items-center gap-2 text-gray-700">
                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Canopy&background=0D8ABC&color=fff" alt="User" />
                </div>
                <span className="text-sm font-medium">Canopy</span>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
                <p className="text-gray-500">Here you can manage all your products and bundles</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 mb-8">
               <StatCard label="Have gaps" value="11" icon={<FileText size={20} className="text-gray-400" />} />
               <StatCard label="Total products" value="74" icon={<Box size={20} className="text-gray-400" />} />
               <StatCard label="Drafts" value="2" icon={<FileText size={20} className="text-gray-400" />} />
               <StatCard label="Active" value="65" icon={<Box size={20} className="text-gray-400" />} />
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 mb-6">
               <div className="flex items-center justify-between border-b border-gray-200">
                  <div className="flex gap-6">
                      <TabButton active>All</TabButton>
                      <TabButton>Active</TabButton>
                      <TabButton>Archived</TabButton>
                  </div>
                  <div className="pb-2">
                     <Button onClick={() => setIsRegistrationModalOpen(true)} className="flex items-center gap-2 px-4 py-2">
                        <Plus size={16} />
                        Register new product
                     </Button>
                  </div>
               </div>
               
               <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-500 pl-2">Selected: 0</span>
                  <div className="flex items-center gap-2">
                     <IconButton><Filter size={16} /></IconButton>
                     <IconButton><ArrowUpDown size={16} /></IconButton>
                     <div className="h-6 w-px bg-gray-200 mx-1"></div>
                     <IconButton active><LayoutGrid size={16} /></IconButton>
                     <IconButton><List size={16} /></IconButton>
                  </div>
               </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {DASHBOARD_PRODUCTS.map(product => (
                    <DashboardProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-6 text-sm text-gray-600">
               <span>80–90 of 90</span>
               <div className="flex items-center gap-2">
                  <span>10 per page</span>
                  <ChevronDown size={14} />
               </div>
               <span>Page 9 of 9</span>
               <div className="flex items-center gap-2">
                   <button className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"><ChevronLeft size={16} /></button>
                   <button className="p-1 hover:bg-gray-100 rounded disabled:opacity-50" disabled><ChevronRight size={16} /></button>
               </div>
            </div>
        </div>
      </main>

      {/* Registration Modal Overlay */}
      {isRegistrationModalOpen && (
          <ProductRegistrationFlow onClose={() => setIsRegistrationModalOpen(false)} />
      )}
    </div>
  );
}

// Sub-components for Dashboard styling
function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-start gap-4">
            <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
            <div>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    )
}

function TabButton({ children, active }: { children?: React.ReactNode, active?: boolean }) {
    return (
        <button className={`pb-3 text-sm font-medium border-b-2 transition-colors ${active ? 'border-emerald-600 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {children}
        </button>
    )
}

function IconButton({ children, active }: { children?: React.ReactNode, active?: boolean }) {
    return (
        <button className={`p-2 rounded hover:bg-gray-50 ${active ? 'text-gray-900 bg-gray-100' : 'text-gray-500'}`}>
            {children}
        </button>
    )
}

// Tiny utility component for ChevronDown since it was missing from imports in main block but used in pagination
function ChevronDown({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
        </svg>
    )
}
