import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import CustomerHeader from './components/customer/CustomerHeader';
import CustomerSearchBar from './components/customer/CustomerSearchBar';
import HeroPromoBanner from './components/customer/HeroPromoBanner';
import CategoryFilters from './components/customer/CategoryFilters';
import DealsNearYou from './components/customer/DealsNearYou';
import EndingSoonSection from './components/customer/EndingSoonSection';
import PopularRescueHubs from './components/customer/PopularRescueHubs';
import BottomNavBar from './components/customer/BottomNavBar';
import OrderClaimModal from './components/customer/OrderClaimModal';
import ExploreView from './components/customer/ExploreView';

import BakeryDetailPage from './components/customer/BakeryDetailPage';

import {
  CUSTOMER_USER,
  FOOD_CATEGORIES,
  DEALS_NEAR_YOU,
  ENDING_SOON_ITEMS,
  POPULAR_RESCUE_HUBS,
  EXPLORE_TAGS,
  EXPLORE_MAP_PINS,
  EXPLORE_RESCUES,
} from './data/customerMockData';

export default function App() {
  // Customer Profile State
  const [user, setUser] = useState(CUSTOMER_USER);
  
  // Navigation & Filtering State
  const [activeBottomTab, setActiveBottomTab] = useState('explore'); // Can toggle between 'home' & 'explore'
  const [activeStore, setActiveStore] = useState('brown-coffee-tk'); // Show requested Bakery page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Deals & Explore Items State
  const [deals, setDeals] = useState(DEALS_NEAR_YOU);
  const [endingSoonItems, setEndingSoonItems] = useState(ENDING_SOON_ITEMS);
  const [rescueHubs] = useState(POPULAR_RESCUE_HUBS);
  const [exploreRescues, setExploreRescues] = useState(EXPLORE_RESCUES);
  
  // Order Claim Modal State
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ordersCount, setOrdersCount] = useState(2);

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filter home deals based on category & search query
  const filteredDeals = deals.filter((deal) => {
    if (selectedCategory !== 'all' && deal.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = deal.title.toLowerCase().includes(q);
      const matchStore = deal.store.toLowerCase().includes(q);
      if (!matchTitle && !matchStore) return false;
    }
    return true;
  });

  // Dynamically compute category counts for home screen filters
  const categoriesWithCounts = FOOD_CATEGORIES.map((cat) => {
    if (cat.id === 'all') {
      return { ...cat, count: deals.length };
    }
    return {
      ...cat,
      count: deals.filter((d) => d.category === cat.id).length,
    };
  });

  // Toggle favorite heart (Home Deals)
  const handleToggleFavorite = (dealId) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          const nextFav = !d.isFavorite;
          showToast(nextFav ? `Added ${d.title} to favorites` : `Removed from favorites`);
          return { ...d, isFavorite: nextFav };
        }
        return d;
      })
    );
  };

  // Toggle favorite heart (Explore Rescues)
  const handleToggleExploreFavorite = (itemId) => {
    setExploreRescues((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextFav = !item.isFavorite;
          showToast(nextFav ? `Added ${item.store} to favorites` : `Removed from favorites`);
          return { ...item, isFavorite: nextFav };
        }
        return item;
      })
    );
  };

  // Open claim modal
  const handleSelectDeal = (item) => {
    // Normalise fields for modal
    const modalItem = {
      id: item.id,
      title: item.packageTitle || item.title,
      store: item.store,
      distance: item.walkDistance || item.distance,
      time: item.pickupWindow || item.time || item.timeLeft,
      price: item.price,
      originalPrice: item.originalPrice,
      discount: item.discount || item.discountText,
      image: item.image,
      description: item.description || 'Fresh surplus prepared under Foodlink standards.',
    };
    setSelectedItem(modalItem);
    setClaimModalOpen(true);
  };

  // Confirm order
  const handleConfirmOrder = ({ item, quantity, totalPrice }) => {
    setOrdersCount((prev) => prev + 1);
    showToast(`Order reserved: ${quantity}x "${item.title}" for $${totalPrice.toFixed(2)}! Pick up at ${item.store}.`);
  };

  const isExplorePage = activeBottomTab === 'explore';

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900 pb-24 font-sans selection:bg-emerald-500 selection:text-white antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 inset-x-4 max-w-sm mx-auto z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* IF A STORE DETAIL IS OPEN (Brown Coffee & Bakery matching screenshot) */}
      {activeStore ? (
        <BakeryDetailPage
          onBack={() => setActiveStore(null)}
          onShowToast={showToast}
          currentUser={user}
        />
      ) : (
        <>
          {/* Top Quick-Switcher Banner for Bakery Mock */}
          <div className="max-w-md md:max-w-3xl lg:max-w-6xl mx-auto px-4 sm:px-6 pt-3">
            <button
              onClick={() => setActiveStore('brown-coffee-tk')}
              className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-[#0d4a36] to-emerald-850 text-white flex items-center justify-between text-xs font-bold shadow-sm hover:brightness-105 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-white/20 text-sm">🥐</span>
                <span className="truncate">Brown Coffee & Bakery — View Store & Claim Page</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] uppercase tracking-wider font-extrabold group-hover:translate-x-0.5 transition-transform">
                Open →
              </span>
            </button>
          </div>

          {/* Main Responsive Canvas: adapts container to 3 columns on desktop, 2 on tablet, 1 on mobile */}
          <div className={`mx-auto px-4 sm:px-6 py-4 space-y-5 sm:space-y-6 ${
            isExplorePage 
              ? 'max-w-md md:max-w-3xl lg:max-w-6xl' 
              : 'max-w-md sm:max-w-xl md:max-w-2xl'
          }`}>
            
            {/* ========================================================= */}
            {/* TAB 1: HOME PAGE                                          */}
            {/* ========================================================= */}
            {activeBottomTab === 'home' && (
              <>
                {/* Header (Location Selector, Notification, Avatar, Greeting, Impact Badge) */}
                <CustomerHeader
                  user={user}
                  onSelectLocation={(loc) => {
                    setUser({ ...user, currentLocation: loc });
                    showToast(`Location switched to ${loc.district}, ${loc.city}`);
                  }}
                />

                {/* Search & Voice Input with Emerald Filter Button */}
                <CustomerSearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onOpenFilter={() => showToast('Filter options opened')}
                />

                {/* Hero Promo Banner */}
                <HeroPromoBanner
                  onExploreDeals={() => {
                    setActiveBottomTab('explore');
                    showToast('Switched to Explore Page');
                  }}
                />

                {/* Horizontal Category Filter Pills */}
                <CategoryFilters
                  categories={categoriesWithCounts}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(catId) => setSelectedCategory(catId)}
                  onViewAll={() => {
                    setActiveBottomTab('explore');
                    showToast('Viewing all categories on Explore');
                  }}
                />

                {/* Deals Near You Section - only shows 3 items on Home, with See all leading to Explore */}
                <DealsNearYou
                  deals={filteredDeals}
                  limit={3}
                  locationName={user.currentLocation.district}
                  onSelectDeal={(deal) => {
                    if (deal.store?.toLowerCase().includes('brown')) {
                      setActiveStore('brown-coffee-tk');
                    } else {
                      handleSelectDeal(deal);
                    }
                  }}
                  onToggleFavorite={handleToggleFavorite}
                  onSeeAll={() => {
                    setActiveBottomTab('explore');
                    showToast('Switched to Explore to view all rescue deals');
                  }}
                  onSeeMap={() => {
                    setActiveBottomTab('explore');
                    showToast('Opening Toul Kork Map View');
                  }}
                />

                {/* Ending Soon Urgent Rescue Section - only shows 2 items on Home */}
                <EndingSoonSection
                  items={endingSoonItems}
                  limit={2}
                  onClaimItem={(item) => {
                    if (item.store?.toLowerCase().includes('brown')) {
                      setActiveStore('brown-coffee-tk');
                    } else {
                      handleSelectDeal(item);
                    }
                  }}
                  onSeeAll={() => {
                    setActiveBottomTab('explore');
                    showToast('Viewing urgent rescues on Explore');
                  }}
                />

                {/* Popular Rescue Hubs Section - 3 top hubs */}
                <PopularRescueHubs
                  hubs={rescueHubs.slice(0, 3)}
                  onSelectHub={(hub) => {
                    if (hub.name.toLowerCase().includes('brown')) {
                      setActiveStore('brown-coffee-tk');
                    } else {
                      setActiveStore('brown-coffee-tk');
                      showToast(`Opening ${hub.name} store menu`);
                    }
                  }}
                  onSeeAll={() => {
                    setActiveBottomTab('explore');
                    showToast('Viewing all rescue stores on Explore');
                  }}
                />
              </>
            )}

            {/* ========================================================= */}
            {/* TAB 2: EXPLORE PAGE (3 cols desktop / 2 tablet / 1 mobile) */}
            {/* ========================================================= */}
            {activeBottomTab === 'explore' && (
              <ExploreView
                user={user}
                tags={EXPLORE_TAGS}
                mapPins={EXPLORE_MAP_PINS}
                rescues={exploreRescues}
                onRescueItem={(item) => {
                  if (item.store?.toLowerCase().includes('brown')) {
                    setActiveStore('brown-coffee-tk');
                  } else {
                    handleSelectDeal(item);
                  }
                }}
                onToggleFavorite={handleToggleExploreFavorite}
                onOpenFilter={() => showToast('Explore filter settings opened')}
              />
            )}

            {/* Placeholder Views for other tabs */}
            {(activeBottomTab === 'orders' || activeBottomTab === 'favorites' || activeBottomTab === 'profile') && (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-2xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto font-black text-lg">
                  FL
                </div>
                <h3 className="font-extrabold text-lg capitalize">{activeBottomTab}</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Manage your active food rescue bookings and preferences.
                </p>
                <button
                  onClick={() => setActiveBottomTab('explore')}
                  className="px-4 py-2 rounded-xl bg-emerald-850 bg-[#0d4a36] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Back to Explore
                </button>
              </div>
            )}

          </div>

          {/* Fixed Bottom Navigation Bar */}
          <BottomNavBar
            activeTab={activeBottomTab}
            onSelectTab={(tabId) => {
              setActiveBottomTab(tabId);
            }}
            ordersBadgeCount={ordersCount}
          />
        </>
      )}

      {/* Interactive Order Claim Modal */}
      <OrderClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        item={selectedItem}
        onConfirmOrder={handleConfirmOrder}
      />

    </div>
  );
}
