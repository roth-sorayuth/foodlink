import React, { useState, useEffect } from 'react';
import {
  Store,
  Compass,
  ShoppingBag,
  User,
  CheckCircle2,
  X,
  Bell,
  Sparkles
} from 'lucide-react';

import CustomerExploreFeed from './components/customer/CustomerExploreFeed';
import CustomerMapView from './components/customer/CustomerMapView';
import CustomerListingDetail from './components/customer/CustomerListingDetail';
import CustomerCheckoutFlow from './components/customer/CustomerCheckoutFlow';
import CustomerActivePickup from './components/customer/CustomerActivePickup';
import CustomerProfile from './components/customer/CustomerProfile';
import ListingAlertPopup from './components/customer/ListingAlertPopup';
import { socket, reserveListing } from './services/api';

export default function App() {
  // Screen State: 'discover' | 'explore' | 'listing-detail' | 'checkout' | 'reserved' | 'profile'
  const [currentScreen, setCurrentScreen] = useState('discover');
  const [activeBottomTab, setActiveBottomTab] = useState('discover');
  const [selectedListing, setSelectedListing] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Real-time Popup Alert State
  const [activeAlert, setActiveAlert] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Socket.io Real-Time Listener at App Root
  useEffect(() => {
    const handleNewListing = (data) => {
      console.log('⚡ [Customer App] Received live NEW_LISTING event:', data);
      setActiveAlert(data);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on('NEW_LISTING', handleNewListing);

    return () => {
      socket.off('NEW_LISTING', handleNewListing);
    };
  }, []);

  const handleSelectListing = (item) => {
    setSelectedListing(item);
    setCurrentScreen('listing-detail');
  };

  const handleProceedToCheckout = () => {
    setCurrentScreen('checkout');
  };

  const handleConfirmPayment = async () => {
    try {
      if (selectedListing?.id) {
        await reserveListing(selectedListing.id, 1);
      }
    } catch (err) {
      console.warn('Realtime reservation socket trigger:', err.message);
    }
    showToast('Payment confirmed! Pickup pass generated.');
    setCurrentScreen('reserved');
    setActiveBottomTab('reserved');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1C1C1E] flex flex-col font-sans antialiased selection:bg-[#2E7D32] selection:text-white relative">
      
      {/* Real-time Popup Alert when Merchant Uploads Food */}
      {activeAlert && (
        <ListingAlertPopup
          alertData={activeAlert}
          onView={(item) => {
            handleSelectListing(item);
            setActiveAlert(null);
          }}
          onClose={() => setActiveAlert(null)}
        />
      )}

      {/* Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 max-w-sm mx-auto z-50 bg-[#1C1C1E] text-white text-xs font-semibold px-4 py-3 rounded-full shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-stone-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Responsive Canvas */}
      <main className="flex-1 max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto w-full px-3.5 sm:px-6 py-3">
        
        {/* Screen 1: Discover (Screenshot 1) */}
        {currentScreen === 'discover' && (
          <CustomerExploreFeed
            onSelectListing={handleSelectListing}
            onOpenMap={() => {
              setCurrentScreen('explore');
              setActiveBottomTab('explore');
            }}
            onNavigateToProfile={() => {
              setCurrentScreen('profile');
              setActiveBottomTab('profile');
            }}
            onNavigateToOrders={() => {
              setCurrentScreen('reserved');
              setActiveBottomTab('reserved');
            }}
          />
        )}

        {/* Screen 2: Explore / Map (Screenshot 2) */}
        {currentScreen === 'explore' && (
          <CustomerMapView
            onSelectListing={handleSelectListing}
            onBackToDiscover={() => {
              setCurrentScreen('discover');
              setActiveBottomTab('discover');
            }}
          />
        )}

        {/* Screen 3: Listing Details */}
        {currentScreen === 'listing-detail' && (
          <CustomerListingDetail
            listing={selectedListing}
            onBack={() => setCurrentScreen(activeBottomTab === 'explore' ? 'explore' : 'discover')}
            onProceedToCheckout={handleProceedToCheckout}
            onNavigateToProfile={() => {
              setCurrentScreen('profile');
              setActiveBottomTab('profile');
            }}
          />
        )}

        {/* Screen 4: Checkout Flow */}
        {currentScreen === 'checkout' && (
          <CustomerCheckoutFlow
            listing={selectedListing}
            onBack={() => setCurrentScreen('listing-detail')}
            onConfirmPayment={handleConfirmPayment}
            onNavigateToProfile={() => {
              setCurrentScreen('profile');
              setActiveBottomTab('profile');
            }}
          />
        )}

        {/* Screen 5: Reserved (Active Pickup Screen) */}
        {currentScreen === 'reserved' && (
          <CustomerActivePickup
            onBackToHome={() => {
              setCurrentScreen('discover');
              setActiveBottomTab('discover');
            }}
            onNavigateToProfile={() => {
              setCurrentScreen('profile');
              setActiveBottomTab('profile');
            }}
          />
        )}

        {/* Screen 6: Profile View */}
        {currentScreen === 'profile' && (
          <CustomerProfile
            onBackToHome={() => {
              setCurrentScreen('discover');
              setActiveBottomTab('discover');
            }}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar (5 Tabs Matching Screenshots 1 & 2) */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200/70 px-2 py-2 z-40">
        <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-around">
          
          {/* 1. Discover Tab */}
          <button
            onClick={() => {
              setCurrentScreen('discover');
              setActiveBottomTab('discover');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeBottomTab === 'discover' && currentScreen === 'discover'
                ? 'text-[#2E7D32]'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Store className="w-5 h-5 stroke-[2.2]" />
            <span className={`text-[11px] ${activeBottomTab === 'discover' && currentScreen === 'discover' ? 'font-black' : 'font-medium'}`}>
              Discover
            </span>
          </button>

          {/* 2. Explore Tab (Dark Vector Map) */}
          <button
            onClick={() => {
              setCurrentScreen('explore');
              setActiveBottomTab('explore');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeBottomTab === 'explore' || currentScreen === 'explore'
                ? 'text-[#2E7D32]'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <Compass className="w-5 h-5 stroke-[2.2]" />
            <span className={`text-[11px] ${activeBottomTab === 'explore' || currentScreen === 'explore' ? 'font-black' : 'font-medium'}`}>
              Explore
            </span>
          </button>

          {/* 3. Reserved Tab */}
          <button
            onClick={() => {
              setCurrentScreen('reserved');
              setActiveBottomTab('reserved');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeBottomTab === 'reserved' || currentScreen === 'reserved'
                ? 'text-[#2E7D32]'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            <span className={`text-[11px] ${activeBottomTab === 'reserved' || currentScreen === 'reserved' ? 'font-black' : 'font-medium'}`}>
              Reserved
            </span>
          </button>


          {/* 5. Profile Tab */}
          <button
            onClick={() => {
              setCurrentScreen('profile');
              setActiveBottomTab('profile');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeBottomTab === 'profile' || currentScreen === 'profile'
                ? 'text-[#2E7D32]'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
            <span className={`text-[11px] ${activeBottomTab === 'profile' || currentScreen === 'profile' ? 'font-black' : 'font-medium'}`}>
              Profile
            </span>
          </button>

        </div>
      </nav>

    </div>
  );
}
