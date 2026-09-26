import React, { useState } from 'react';
import {
  LayoutGrid,
  Package,
  ClipboardList,
  BarChart3,
  User,
  LayoutDashboard,
  CheckCircle2,
  X
} from 'lucide-react';
import MerchantDashboard from './pages/Dashboard/MerchantDashboard';
import MerchantListings from './pages/Listings/MerchantListings';
import CreateListingPage from './pages/Listings/CreateListingPage';
import MerchantOrders from './pages/Orders/MerchantOrders';
import VerifyPickupPage from './pages/Orders/VerifyPickupPage';
import MerchantAnalytics from './pages/Analytics/MerchantAnalytics';
import MerchantProfile from './pages/StoreProfile/MerchantProfile';

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'listings' | 'orders' | 'insights' | 'profile'
  const [subView, setSubView] = useState(null); // 'create-listing' | 'verify-pickup'
  const [isOpen, setIsOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // If subView is create-listing
  if (subView === 'create-listing') {
    return (
      <CreateListingPage
        onBack={() => setSubView(null)}
        onSave={(newListing) => {
          setSubView(null);
          setActiveTab('listings');
          showToast(`Published "${newListing.title}"!`);
        }}
        onNavigateToProfile={() => {
          setSubView(null);
          setActiveTab('profile');
        }}
      />
    );
  }

  // If activeTab is profile
  if (activeTab === 'profile') {
    return (
      <div>
        {/* Quick Top Switcher Bar */}
        <div className="bg-[#1C1C1E] text-white px-4 py-2 text-xs flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">Golden Gate Bakery</span>
            <span className="text-stone-400 hidden sm:inline">— Store Profile & Environmental Impact</span>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-3 py-1 rounded-lg bg-[#2E7D32] hover:bg-[#256629] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Return to Merchant Hub</span>
          </button>
        </div>

        <MerchantProfile onNavigateToDashboard={() => setActiveTab('dashboard')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1C1C1E] flex flex-col font-sans pb-24 antialiased selection:bg-[#2E7D32] selection:text-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 max-w-sm mx-auto z-50 bg-[#1C1C1E] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Top App Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3">
        <div className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto flex items-center justify-between">
          
          {/* Store Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-xl shadow-2xs">
              👨‍🍳
            </div>
            <div>
              <div 
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-85 transition-opacity"
              >
                <h1 className="font-bold text-base text-[#1C1C1E] tracking-tight">Golden Gate Bakery</h1>
                <div className="flex flex-col text-stone-400 text-[9px] -space-y-1">
                  <span>▲</span>
                  <span>▼</span>
                </div>
              </div>
              <p className="text-[11px] font-semibold text-[#2E7D32]">Partner Merchant</p>
            </div>
          </div>

          {/* Right Controls: Open Pill & Profile Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                showToast(isOpen ? 'Store marked as Closed' : 'Store marked as Open for pickup');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isOpen
                  ? 'bg-emerald-100/80 text-[#2E7D32] border border-emerald-300/60'
                  : 'bg-stone-200 text-stone-600 border border-stone-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-[#2E7D32]' : 'bg-stone-400'}`} />
              <span>{isOpen ? 'Open' : 'Closed'}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              title="View Store / Merchant Profile"
              className="w-9 h-9 rounded-full bg-[#1b5e20] hover:bg-[#144919] text-white flex items-center justify-center transition-transform active:scale-95 shadow-xs cursor-pointer"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Canvas */}
      <main className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto w-full px-3.5 sm:px-6 py-4">
        
        {/* SubView: Verify Pickup */}
        {subView === 'verify-pickup' ? (
          <VerifyPickupPage
            onBack={() => setSubView(null)}
            onCompleteHandover={(data) => {
              setSubView(null);
              showToast(`Handover completed for ${data.customerName}!`);
            }}
          />
        ) : (
          <>
            {/* Tab 1: Dashboard */}
            {activeTab === 'dashboard' && (
              <MerchantDashboard
                onNavigateToProfile={() => setActiveTab('profile')}
                onOpenCreate={() => setSubView('create-listing')}
                onOpenVerify={() => setSubView('verify-pickup')}
              />
            )}

            {/* Tab 2: Listings */}
            {activeTab === 'listings' && (
              <MerchantListings
                onOpenCreate={() => setSubView('create-listing')}
                onNavigateToProfile={() => setActiveTab('profile')}
              />
            )}

            {/* Tab 3: Orders */}
            {activeTab === 'orders' && (
              <MerchantOrders
                onOpenVerify={() => setSubView('verify-pickup')}
                onNavigateToProfile={() => setActiveTab('profile')}
              />
            )}

            {/* Tab 4: Insights */}
            {activeTab === 'insights' && (
              <MerchantAnalytics
                onNavigateToProfile={() => setActiveTab('profile')}
              />
            )}
          </>
        )}

      </main>

      {/* Fixed Bottom Navigation Bar (4 Main Tabs) */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-4 py-2 z-40">
        <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-around">
          
          {/* Dashboard Tab */}
          <button
            onClick={() => {
              setSubView(null);
              setActiveTab('dashboard');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'dashboard' && !subView ? 'text-[#2E7D32]' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <LayoutGrid className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[11px] font-bold">Dashboard</span>
          </button>

          {/* Listings Tab */}
          <button
            onClick={() => {
              setSubView(null);
              setActiveTab('listings');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'listings' && !subView ? 'text-[#2E7D32]' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[11px] font-medium">Listings</span>
          </button>

          {/* Orders Tab */}
          <button
            onClick={() => {
              setSubView(null);
              setActiveTab('orders');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'orders' && !subView ? 'text-[#2E7D32]' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-[11px] font-medium">Orders</span>
          </button>

          {/* Insights Tab */}
          <button
            onClick={() => {
              setSubView(null);
              setActiveTab('insights');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'insights' && !subView ? 'text-[#2E7D32]' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[11px] font-medium">Insights</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
