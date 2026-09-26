import React, { useState } from 'react';
import {
  Home,
  Map,
  ClipboardList,
  User,
  Leaf,
  CheckCircle2,
  X,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

import CustomerExploreFeed from './components/customer/CustomerExploreFeed';
import CustomerListingDetail from './components/customer/CustomerListingDetail';
import CustomerCheckoutFlow from './components/customer/CustomerCheckoutFlow';
import CustomerActivePickup from './components/customer/CustomerActivePickup';
import CustomerProfile from './components/customer/CustomerProfile';

export default function App() {
  // Screen State: 'feed' | 'listing-detail' | 'checkout' | 'active-pickup' | 'profile'
  const [currentScreen, setCurrentScreen] = useState('feed');
  const [activeBottomTab, setActiveBottomTab] = useState('home');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectListing = (item) => {
    setCurrentScreen('listing-detail');
  };

  const handleProceedToCheckout = () => {
    setCurrentScreen('checkout');
  };

  const handleConfirmPayment = () => {
    showToast('Payment confirmed! Pickup pass generated.');
    setCurrentScreen('active-pickup');
    setActiveBottomTab('orders');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1C1C1E] flex flex-col font-sans antialiased selection:bg-[#2E7D32] selection:text-white">
      
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

      {/* Main Top Header (Shown on Explore Feed) */}
      {currentScreen === 'feed' && (
        <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3 sticky top-0 z-40">
          <div className="max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center text-[#2E7D32]">
                <Leaf className="w-4 h-4 fill-[#2E7D32]/20" />
              </div>
              <span className="font-extrabold text-base text-[#1C1C1E] tracking-tight">FoodSaver</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-stone-500">Explore</span>
              <button
                onClick={() => {
                  setCurrentScreen('profile');
                  setActiveBottomTab('profile');
                }}
                className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#2E7D32]/30 shadow-xs cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Sarah Jenkins"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Responsive Canvas */}
      <main className="flex-1 max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto w-full px-3.5 sm:px-6 py-4">
        
        {/* Screen 1: Explore Feed */}
        {currentScreen === 'feed' && (
          <CustomerExploreFeed
            onSelectListing={handleSelectListing}
            onOpenMap={() => showToast('Opening Full Map View in Mission District')}
            onNavigateToProfile={() => {
              setCurrentScreen('profile');
              setActiveBottomTab('profile');
            }}
            onNavigateToOrders={() => {
              setCurrentScreen('active-pickup');
              setActiveBottomTab('orders');
            }}
          />
        )}

        {/* Screen 2: Listing Details */}
        {currentScreen === 'listing-detail' && (
          <CustomerListingDetail
            onBack={() => setCurrentScreen('feed')}
            onProceedToCheckout={handleProceedToCheckout}
            onNavigateToProfile={() => {
              setCurrentScreen('profile');
              setActiveBottomTab('profile');
            }}
          />
        )}

        {/* Screen 3: Checkout Flow */}
        {currentScreen === 'checkout' && (
          <CustomerCheckoutFlow
            onBack={() => setCurrentScreen('listing-detail')}
            onConfirmPayment={handleConfirmPayment}
            onNavigateToProfile={() => {
              setCurrentScreen('profile');
              setActiveBottomTab('profile');
            }}
          />
        )}

        {/* Screen 4: Active Pickup Screen */}
        {currentScreen === 'active-pickup' && (
          <CustomerActivePickup
            onBackToHome={() => {
              setCurrentScreen('feed');
              setActiveBottomTab('home');
            }}
            onNavigateToProfile={() => {
              setCurrentScreen('profile');
              setActiveBottomTab('profile');
            }}
          />
        )}

        {/* Screen 5: Profile View */}
        {currentScreen === 'profile' && (
          <CustomerProfile
            onBackToHome={() => {
              setCurrentScreen('feed');
              setActiveBottomTab('home');
            }}
          />
        )}

      </main>

      {/* Fixed Bottom Navigation Bar (Home, Map, Orders, Profile) */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-4 py-2 z-40">
        <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-around">
          
          {/* Home Tab */}
          <button
            onClick={() => {
              setCurrentScreen('feed');
              setActiveBottomTab('home');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeBottomTab === 'home' && currentScreen === 'feed'
                ? 'text-[#2E7D32]'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[11px] font-bold">Home</span>
          </button>

          {/* Map Tab */}
          <button
            onClick={() => {
              showToast('Opening interactive map view in San Francisco');
            }}
            className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <Map className="w-5 h-5" />
            <span className="text-[11px] font-medium">Map</span>
          </button>

          {/* Orders Tab */}
          <button
            onClick={() => {
              setCurrentScreen('active-pickup');
              setActiveBottomTab('orders');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeBottomTab === 'orders' || currentScreen === 'active-pickup'
                ? 'text-[#2E7D32]'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-[11px] font-medium">Orders</span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => {
              setCurrentScreen('profile');
              setActiveBottomTab('profile');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
              activeBottomTab === 'profile' || currentScreen === 'profile'
                ? 'text-[#2E7D32]'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[11px] font-medium">Profile</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
