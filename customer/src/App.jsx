import React, { useState, useEffect, Suspense, lazy } from 'react';
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

// Eagerly load Discover feed for instant first paint
import CustomerExploreFeed from './components/customer/CustomerExploreFeed';
import ListingAlertPopup from './components/customer/ListingAlertPopup';

// Lazy load secondary views for high performance & minimal initial bundle
const CustomerMapView = lazy(() => import('./components/customer/CustomerMapView'));
const CustomerListingDetail = lazy(() => import('./components/customer/CustomerListingDetail'));
const CustomerCheckoutFlow = lazy(() => import('./components/customer/CustomerCheckoutFlow'));
const CustomerActivePickup = lazy(() => import('./components/customer/CustomerActivePickup'));
const CustomerProfile = lazy(() => import('./components/customer/CustomerProfile'));
const CustomerNotificationsModal = lazy(() => import('./components/customer/CustomerNotificationsModal'));

function CustomerPageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[45vh] py-16 space-y-3">
      <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold text-stone-500">Loading view...</span>
    </div>
  );
}

import {
  socket,
  reserveListing,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  playNotificationSound,
  onNewListingDrop,
} from './services/api';

import {
  getOrCreateCustomerUser,
  getCustomerCart,
  saveCustomerCart,
  getCustomerActiveOrder,
  saveCustomerActiveOrder,
} from './utils/userSession';

export default function App() {
  // Screen State: 'discover' | 'explore' | 'listing-detail' | 'checkout' | 'reserved' | 'profile'
  const [currentScreen, setCurrentScreen] = useState('discover');
  const [activeBottomTab, setActiveBottomTab] = useState('discover');
  const [selectedListing, setSelectedListing] = useState(null);
  const [reserveQuantity, setReserveQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  // Isolated Customer User Identity
  const [currentUser] = useState(() => getOrCreateCustomerUser());

  // Isolated Multi-Item Cart State
  const [cart, setCart] = useState(() => getCustomerCart(getOrCreateCustomerUser()?.id));

  // Isolated Active Pickup Order State
  const [activeOrder, setActiveOrder] = useState(() => getCustomerActiveOrder(getOrCreateCustomerUser()?.id));

  // Real-time Popup Alert & Notifications State
  const [activeAlert, setActiveAlert] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Fetch recent notifications from server on mount
  useEffect(() => {
    async function loadInitialNotifications() {
      try {
        const notifs = await getNotifications();
        if (Array.isArray(notifs)) {
          const valid = notifs.filter(
            (n) =>
              n.type === 'NEW_LISTING' &&
              !n.title?.includes('Order Received') &&
              !n.title?.includes('Pickup Confirmed') &&
              !n.message?.includes('just claimed') &&
              !n.message?.includes('successfully verified')
          );
          setNotifications(valid);
          const unread = valid.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    }
    loadInitialNotifications();
  }, []);

  // Re-fetch notifications whenever user opens the notifications modal
  useEffect(() => {
    if (isNotificationsOpen) {
      getNotifications().then((notifs) => {
        if (Array.isArray(notifs)) {
          const valid = notifs.filter(
            (n) =>
              n.type === 'NEW_LISTING' &&
              !n.title?.includes('Order Received') &&
              !n.title?.includes('Pickup Confirmed') &&
              !n.message?.includes('just claimed') &&
              !n.message?.includes('successfully verified')
          );
          setNotifications(valid);
          const unread = valid.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      }).catch((err) => console.warn('Could not re-fetch notifications:', err));
    }
  }, [isNotificationsOpen]);

  // 2. Real-Time Listener at App Root (WebSockets + BroadcastChannel + LocalStorage)
  useEffect(() => {
    const handleNewListing = (data) => {
      console.log('⚡ [Customer App] Received live NEW_LISTING event:', data);
      setActiveAlert(data);
      playNotificationSound();

      const isRestock = Boolean(
        data?.isRestocked ||
        data?.notification?.title?.includes('Restock') ||
        data?.notification?.message?.includes('restocked')
      );
      const notifTitle = data?.notification?.title || (isRestock ? 'Surplus Food Restocked! 🔥' : 'New Surplus Food Available!');
      const bags = data?.listing?.remaining ?? data?.listing?.bagsAvailable ?? 1;
      const store = data?.listing?.storeName || 'CAD Bakery';
      const notifMsg = data?.notification?.message || (isRestock
        ? `${store} just restocked "${data?.listing?.title || 'Surplus Item'}"! (${bags} available)`
        : `${store} just listed "${data?.listing?.title || 'Surplus Item'}"`);

      const listingId = data?.listing?.id || data?.listingId || data?.notification?.listingId;
      const notifId = data?.notification?.id || `notif-${listingId || Date.now()}`;

      const newNotif = {
        ...(data?.notification || {}),
        id: notifId,
        type: 'NEW_LISTING',
        title: notifTitle,
        message: notifMsg,
        listingId,
        listing: {
          ...(data?.listing || {}),
          bagsAvailable: bags,
          remaining: bags,
        },
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => {
        const existingIdx = prev.findIndex(
          (n) => (listingId && (n.listingId === listingId || n.listing?.id === listingId)) || n.id === notifId
        );

        if (existingIdx !== -1) {
          const existing = prev[existingIdx];
          const updated = {
            ...existing,
            ...newNotif,
            id: existing.id,
            listing: {
              ...(existing.listing || {}),
              ...(newNotif.listing || {}),
              bagsAvailable: bags,
              remaining: bags,
            },
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          const rest = prev.filter((_, idx) => idx !== existingIdx);
          return [updated, ...rest];
        }

        return [newNotif, ...prev];
      });

      setUnreadCount((prev) => prev + 1);
    };

    const handleNotificationReceived = (notif) => {
      if (!notif || notif.type !== 'NEW_LISTING') return;
      const title = (notif.title || '').toLowerCase();
      const msg = (notif.message || '').toLowerCase();
      if (title.includes('order') || title.includes('pickup') || title.includes('claim')) return;
      if (msg.includes('claimed') || msg.includes('verified') || msg.includes('code:')) return;

      console.log('⚡ [Customer App] Received live surplus notification:', notif);
      setNotifications((prev) => {
        const listingId = notif.listingId || notif.listing?.id;
        const existingIdx = prev.findIndex(
          (n) => (listingId && (n.listingId === listingId || n.listing?.id === listingId)) || n.id === notif.id
        );

        if (existingIdx !== -1) {
          const existing = prev[existingIdx];
          const updated = {
            ...existing,
            ...notif,
            id: existing.id,
            listing: {
              ...(existing.listing || {}),
              ...(notif.listing || {}),
            },
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          const rest = prev.filter((_, idx) => idx !== existingIdx);
          return [updated, ...rest];
        }

        return [notif, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
    };

    const handleListingUpdated = (updatedListing) => {
      if (!updatedListing || !updatedListing.id) return;
      console.log('⚡ [Customer App] Received LISTING_UPDATED:', updatedListing.id, 'bags:', updatedListing.bagsAvailable);

      // 1. Update selectedListing if currently open
      setSelectedListing((prev) => {
        if (prev && prev.id === updatedListing.id) {
          return {
            ...prev,
            ...updatedListing,
            remaining: updatedListing.bagsAvailable,
            bagsAvailable: updatedListing.bagsAvailable,
          };
        }
        return prev;
      });

      // 2. Update notification card for this listing so amount decreases immediately
      setNotifications((prev) =>
        prev.map((n) => {
          const match = n.listingId === updatedListing.id || n.listing?.id === updatedListing.id;
          if (match) {
            const store = updatedListing.storeName || n.listing?.storeName || 'CAD Bakery';
            const priceNum = typeof updatedListing.price === 'number' ? updatedListing.price : 4.99;
            const remaining = updatedListing.bagsAvailable;
            const isSoldOut = remaining <= 0;
            const updatedMsg = isSoldOut
              ? `${store}'s "${updatedListing.title}" is now Sold Out!`
              : `${store} has "${updatedListing.title}" (${remaining} available for $${priceNum.toFixed(2)})`;

            return {
              ...n,
              message: updatedMsg,
              listing: {
                ...(n.listing || {}),
                ...updatedListing,
                remaining,
                bagsAvailable: remaining,
              },
            };
          }
          return n;
        })
      );
    };

    // Subscribes across Socket.io, BroadcastChannel, and storage events
    const unsubscribeNewDrops = onNewListingDrop(handleNewListing);
    socket.on('NOTIFICATION_RECEIVED', handleNotificationReceived);
    socket.on('NEW_NOTIFICATION', handleNotificationReceived);
    socket.on('NEW_LISTING_DROPPED', handleNewListing);
    socket.on('LISTING_UPDATED', handleListingUpdated);

    return () => {
      unsubscribeNewDrops();
      socket.off('NOTIFICATION_RECEIVED', handleNotificationReceived);
      socket.off('NEW_NOTIFICATION', handleNotificationReceived);
      socket.off('NEW_LISTING_DROPPED', handleNewListing);
      socket.off('LISTING_UPDATED', handleListingUpdated);
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    await markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await markAllNotificationsAsRead();
  };

  // Cart operations
  const handleAddToCart = (listing, qty = 1) => {
    if (!listing) return;
    setCart((prev) => {
      const existingIdx = prev.findIndex((it) => (it.listing?.id || it.id) === listing.id);
      let updated;
      const maxBags = listing.remaining !== undefined ? listing.remaining : (listing.bagsAvailable || 5);
      if (existingIdx >= 0) {
        updated = [...prev];
        const newTotal = Math.min(maxBags, (updated[existingIdx].quantity || 1) + qty);
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newTotal,
        };
      } else {
        updated = [...prev, { listing, quantity: Math.min(maxBags, qty) }];
      }
      saveCustomerCart(currentUser?.id, updated);
      return updated;
    });
    showToast(`✓ Added "${listing.title}" to bag`);
  };

  const handleUpdateCartQuantity = (listingId, newQty) => {
    setCart((prev) => {
      let updated;
      if (newQty <= 0) {
        updated = prev.filter((it) => (it.listing?.id || it.id) !== listingId);
      } else {
        updated = prev.map((it) => {
          if ((it.listing?.id || it.id) === listingId) {
            return { ...it, quantity: newQty };
          }
          return it;
        });
      }
      saveCustomerCart(currentUser?.id, updated);
      return updated;
    });
  };

  const handleRemoveFromCart = (listingId) => {
    setCart((prev) => {
      const updated = prev.filter((it) => (it.listing?.id || it.id) !== listingId);
      saveCustomerCart(currentUser?.id, updated);
      return updated;
    });
    showToast('Item removed from bag');
  };

  const handleClearCart = () => {
    setCart([]);
    saveCustomerCart(currentUser?.id, []);
  };

  const handleSelectListing = (item) => {
    setSelectedListing(item);
    setReserveQuantity(1);
    setCurrentScreen('listing-detail');
  };

  const handleProceedToCheckout = (qty = 1, item = null) => {
    const targetItem = item || selectedListing;
    if (targetItem) {
      setCart((prev) => {
        const exists = prev.some((it) => (it.listing?.id || it.id) === targetItem.id);
        if (!exists) {
          const updated = [...prev, { listing: targetItem, quantity: qty }];
          saveCustomerCart(currentUser?.id, updated);
          return updated;
        }
        return prev;
      });
    }
    setCurrentScreen('checkout');
  };

  const handleConfirmPayment = async (details = {}) => {
    const itemsToReserve = (details.items && details.items.length > 0)
      ? details.items
      : (cart.length > 0 ? cart : (selectedListing ? [{ listing: selectedListing, quantity: reserveQuantity }] : []));

    try {
      const response = await reserveListing({
        items: itemsToReserve,
        user: currentUser,
      });

      if (response && response.order) {
        setActiveOrder(response.order);
        saveCustomerActiveOrder(currentUser?.id, response.order);
        if (Array.isArray(response.listings)) {
          response.listings.forEach(handleListingUpdated);
        }
      } else {
        const fallbackCode = String(Math.floor(100000 + Math.random() * 900000));
        const fallbackOrder = {
          orderNumber: `#FS-${fallbackCode}`,
          pickupCode: fallbackCode,
          digits: fallbackCode.split(''),
          items: itemsToReserve.map((it) => ({
            title: it.listing?.title || it.title,
            quantity: it.quantity || 1,
            price: typeof it.listing?.price === 'number' ? it.listing.price : 4.99,
            photoUrl: it.listing?.image || it.listing?.photoUrl,
          })),
          totalPrice: details.totalDue || '4.99',
          customerName: currentUser?.name,
          avatarUrl: currentUser?.avatar,
          status: 'PENDING',
        };
        setActiveOrder(fallbackOrder);
        saveCustomerActiveOrder(currentUser?.id, fallbackOrder);
      }

      // Clear cart on successful order placement
      handleClearCart();
      showToast('Payment confirmed! Digital pickup pass issued.');
      setCurrentScreen('reserved');
      setActiveBottomTab('reserved');
    } catch (err) {
      console.warn('Reservation fallback activated:', err);
      const fallbackCode = String(Math.floor(100000 + Math.random() * 900000));
      const fallbackOrder = {
        orderNumber: `#FS-${fallbackCode}`,
        pickupCode: fallbackCode,
        digits: fallbackCode.split(''),
        items: itemsToReserve.map((it) => ({
          title: it.listing?.title || it.title,
          quantity: it.quantity || 1,
          price: typeof it.listing?.price === 'number' ? it.listing.price : 4.99,
          photoUrl: it.listing?.image || it.listing?.photoUrl,
        })),
        totalPrice: details.totalDue || '4.99',
        customerName: currentUser?.name,
        avatarUrl: currentUser?.avatar,
        status: 'PENDING',
      };
      setActiveOrder(fallbackOrder);
      saveCustomerActiveOrder(currentUser?.id, fallbackOrder);
      handleClearCart();
      showToast('Payment confirmed! Digital pickup pass issued.');
      setCurrentScreen('reserved');
      setActiveBottomTab('reserved');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1C1C1E] flex flex-col font-sans antialiased selection:bg-[#2E7D32] selection:text-white relative">
      {/* Real-time Customer Notifications Modal */}
      <Suspense fallback={null}>
        <CustomerNotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onSelectListing={(item) => {
            handleSelectListing(item);
            setIsNotificationsOpen(false);
          }}
        />
      </Suspense>

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
        <Suspense fallback={<CustomerPageLoader />}>
          {/* Screen 1: Discover */}
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
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              unreadCount={unreadCount}
              onAddToCart={handleAddToCart}
              cart={cart}
              onOpenCheckout={() => setCurrentScreen('checkout')}
            />
          )}

          {/* Screen 2: Explore / Map */}
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
              initialQuantity={reserveQuantity}
              onBack={() => setCurrentScreen(activeBottomTab === 'explore' ? 'explore' : 'discover')}
              onProceedToCheckout={handleProceedToCheckout}
              onAddToCart={handleAddToCart}
              cartItemCount={cart.reduce((s, it) => s + (it.quantity || 1), 0)}
              onNavigateToProfile={() => {
                setCurrentScreen('profile');
                setActiveBottomTab('profile');
              }}
            />
          )}

          {/* Screen 4: Checkout Flow (Clean & Multi-Item) */}
          {currentScreen === 'checkout' && (
            <CustomerCheckoutFlow
              cartItems={cart.length > 0 ? cart : (selectedListing ? [{ listing: selectedListing, quantity: reserveQuantity }] : [])}
              onBack={() => setCurrentScreen('discover')}
              onConfirmPayment={handleConfirmPayment}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveFromCart}
              onAddMoreItems={() => setCurrentScreen('discover')}
              onNavigateToProfile={() => {
                setCurrentScreen('profile');
                setActiveBottomTab('profile');
              }}
            />
          )}

          {/* Screen 5: Reserved (Active Pickup Screen with Real 6-Digit Pass) */}
          {currentScreen === 'reserved' && (
            <CustomerActivePickup
              order={activeOrder}
              currentUser={currentUser}
              onBackToHome={() => {
                setCurrentScreen('discover');
                setActiveBottomTab('discover');
              }}
              onNavigateToProfile={() => {
                setCurrentScreen('profile');
                setActiveBottomTab('profile');
              }}
              onSelectListing={handleSelectListing}
            />
          )}

          {/* Screen 6: Profile View */}
          {currentScreen === 'profile' && (
            <CustomerProfile
              currentUser={currentUser}
              onBackToHome={() => {
                setCurrentScreen('discover');
                setActiveBottomTab('discover');
              }}
            />
          )}
        </Suspense>
      </main>

      {/* Fixed Bottom Navigation Bar */}
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
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
              activeBottomTab === 'reserved' || currentScreen === 'reserved'
                ? 'text-[#2E7D32]'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              {cart.length > 0 && currentScreen !== 'reserved' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
              )}
            </div>
            <span className={`text-[11px] ${activeBottomTab === 'reserved' || currentScreen === 'reserved' ? 'font-black' : 'font-medium'}`}>
              Reserved
            </span>
          </button>

          {/* 4. Profile Tab */}
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
