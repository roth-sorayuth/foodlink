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
import OrderNotificationMenu from './components/common/OrderNotificationMenu';

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'listings' | 'orders' | 'insights' | 'profile'
  const [subView, setSubView] = useState(null); // 'create-listing' | 'verify-pickup'
  const [verificationCode, setVerificationCode] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [hasPendingPickups, setHasPendingPickups] = useState(true);
  const [latestListing, setLatestListing] = useState(null);
  const [editingListing, setEditingListing] = useState(null);

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
        initialListing={editingListing}
        onBack={() => {
          setEditingListing(null);
          setSubView(null);
        }}
        onSave={(newListing, isEdit) => {
          setEditingListing(null);
          setLatestListing(newListing);
          setSubView(null);
          setActiveTab('listings');
          showToast(isEdit ? `Updated "${newListing.title}"!` : `Published "${newListing.title}"!`);
        }}
        onNavigateToProfile={() => {
          setEditingListing(null);
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
            <img src="/cad-bakery-logo.png" alt="CAD Bakery Logo" className="w-5 h-5 rounded-full object-contain bg-white p-0.5" />
            <span className="font-bold">CAD Bakery</span>
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
            <div className="w-11 h-11 rounded-2xl bg-white border border-stone-200/90 overflow-hidden flex items-center justify-center shadow-2xs shrink-0 p-1">
              <img
                src="/cad-bakery-logo.png"
                alt="CAD Bakery Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div 
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-85 transition-opacity"
              >
                <h1 className="font-bold text-base text-[#1C1C1E] tracking-tight">CAD Bakery</h1>
                <div className="flex flex-col text-stone-400 text-[9px] -space-y-1">
                  <span>▲</span>
                  <span>▼</span>
                </div>
              </div>
              <p className="text-[11px] font-semibold text-[#2E7D32]">Artisan Bakery • Partner</p>
            </div>
          </div>

          {/* Right Controls: Order Notifications Center */}
          <div className="flex items-center gap-2">
            <OrderNotificationMenu
              hasPendingPickups={hasPendingPickups}
              onNavigateToOrders={() => {
                setSubView(null);
                setActiveTab('orders');
              }}
              onOpenVerify={(code) => {
                setVerificationCode(code);
                setSubView('verify-pickup');
              }}
              onNewOrder={() => setHasPendingPickups(true)}
              showToast={showToast}
            />
          </div>
        </div>
      </header>

      {/* Main Responsive Canvas */}
      <main className="max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto w-full px-3.5 sm:px-6 py-4">
        
        {/* SubView: Verify Pickup */}
        {subView === 'verify-pickup' ? (
          <VerifyPickupPage
            initialCode={verificationCode}
            onBack={() => {
              setSubView(null);
              setVerificationCode(null);
            }}
            onCompleteHandover={(data) => {
              setSubView(null);
              setVerificationCode(null);
              setHasPendingPickups(false);
            }}
          />
        ) : (
          <>
            {/* Tab 1: Dashboard */}
            {activeTab === 'dashboard' && (
              <MerchantDashboard
                onNavigateToProfile={() => setActiveTab('profile')}
                onOpenCreate={() => {
                  setEditingListing(null);
                  setSubView('create-listing');
                }}
                onOpenVerify={() => setSubView('verify-pickup')}
                onEditListing={(item) => {
                  setEditingListing(item.raw || item);
                  setSubView('create-listing');
                }}
              />
            )}

            {/* Tab 2: Listings */}
            {activeTab === 'listings' && (
              <MerchantListings
                newListing={latestListing}
                onOpenCreate={() => {
                  setEditingListing(null);
                  setSubView('create-listing');
                }}
                onEditListing={(item) => {
                  setEditingListing(item.raw || item);
                  setSubView('create-listing');
                }}
                onNavigateToProfile={() => setActiveTab('profile')}
              />
            )}

            {/* Tab 3: Orders */}
            {activeTab === 'orders' && (
              <MerchantOrders
                onOpenVerify={() => setSubView('verify-pickup')}
                onNavigateToProfile={() => setActiveTab('profile')}
                onConfirmPickup={(remainingCount) => {
                  setHasPendingPickups(remainingCount > 0);
                }}
                onPendingOrdersChange={(count) => {
                  setHasPendingPickups(count > 0);
                }}
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
