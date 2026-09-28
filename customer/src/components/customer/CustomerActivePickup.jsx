import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Navigation,
  Clock,
  Sparkles,
  Leaf,
  Check,
  Award,
  CheckCheck,
  History,
  ShoppingBag,
  Search,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  Tag,
  ShieldCheck
} from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';
import { socket, getCustomerOrders } from '../../services/api';
import { getCustomerOrderHistory, markOrderCompletedInHistory } from '../../utils/userSession';

export default function CustomerActivePickup({
  order,
  currentUser,
  onBackToHome,
  onNavigateToProfile,
  onSelectListing
}) {
  // Tab state: 'now' (Active Pickup Pass) | 'before' (Past Reservation History)
  const [activeSubTab, setActiveSubTab] = useState('now');
  const [historySearch, setHistorySearch] = useState('');
  const [historyOrders, setHistoryOrders] = useState(() => getCustomerOrderHistory(currentUser?.id));
  const [selectedActiveIdx, setSelectedActiveIdx] = useState(0);

  // Normalize current active order
  const currentActiveOrder = order;
  const [isVerified, setIsVerified] = useState(currentActiveOrder?.status === 'COMPLETED');

  // Load latest orders from backend API on mount
  useEffect(() => {
    async function syncBackendOrders() {
      try {
        const remoteOrders = await getCustomerOrders(currentUser?.id);
        if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
          const formatted = remoteOrders.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber || `#FS-${o.id.slice(-5)}`,
            pickupCode: o.pickupCode,
            storeName: o.store?.name || o.storeName || 'CAD Bakery',
            storeAddress: o.store?.address || '422 St 178, Daun Penh, Phnom Penh',
            items: Array.isArray(o.items) && o.items.length > 0
              ? o.items
              : (o.listing ? [{
                  title: o.listing.title,
                  quantity: o.quantity || 1,
                  price: typeof o.listing.price === 'number' ? o.listing.price : parseFloat(o.listing.price) || 4.99,
                  originalPrice: typeof o.listing.originalPrice === 'number' ? o.listing.originalPrice : 16.00,
                  photoUrl: o.listing.photoUrl || o.listing.image,
                }] : []),
            totalPrice: o.totalPrice || 4.99,
            totalSaved: Math.max(0, 16.00 - (o.totalPrice || 4.99)),
            co2SavedKg: o.co2SavedKg || 1.8,
            status: o.status || 'PENDING',
            pickupDate: o.pickupDate || 'Today',
            pickupWindow: o.pickupStart ? `${o.pickupStart} – ${o.pickupEnd}` : '6:30 PM – 7:30 PM',
            completedAt: o.status === 'COMPLETED' ? (o.verifiedAt ? new Date(o.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Collected') : null,
            createdAt: o.createdAt || new Date().toISOString(),
          }));

          setHistoryOrders((prev) => {
            const merged = [...formatted];
            prev.forEach((p) => {
              if (!merged.some((m) => m.id === p.id || m.pickupCode === p.pickupCode)) {
                merged.push(p);
              }
            });
            return merged;
          });
        }
      } catch (e) {
        console.warn('Could not sync customer orders from backend:', e.message);
      }
    }
    syncBackendOrders();
  }, [currentUser?.id]);

  // Combine prop order into active list
  const activeOrders = [];
  if (currentActiveOrder && currentActiveOrder.status !== 'COMPLETED') {
    activeOrders.push(currentActiveOrder);
  }
  historyOrders.forEach((h) => {
    if (h.status !== 'COMPLETED' && !activeOrders.some((a) => (a.id && a.id === h.id) || (a.pickupCode && a.pickupCode === h.pickupCode))) {
      activeOrders.push(h);
    }
  });

  const displayOrder = activeOrders[selectedActiveIdx] || currentActiveOrder;

  // Past (Before) Orders
  const pastOrders = historyOrders.filter((h) => h.status === 'COMPLETED' || (h.id !== displayOrder?.id && h.pickupCode !== displayOrder?.pickupCode && !activeOrders.some(a => a.id === h.id)));

  // Parse items from active order
  const items = Array.isArray(displayOrder?.items) && displayOrder.items.length > 0
    ? displayOrder.items
    : (displayOrder?.listing ? [{
        title: displayOrder.listing.title,
        quantity: displayOrder.quantity || 1,
        price: typeof displayOrder.listing.price === 'number' ? displayOrder.listing.price : parseFloat(String(displayOrder.listing.price || '4.99').replace(/[^0-9.]/g, '')) || 4.99,
        originalPrice: typeof displayOrder.listing.originalPrice === 'number' ? displayOrder.listing.originalPrice : parseFloat(String(displayOrder.listing.originalPrice || '16.00').replace(/[^0-9.]/g, '')) || 16.00,
        photoUrl: displayOrder.listing.image || displayOrder.listing.photoUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=120&q=70',
      }] : [
        {
          title: 'Artisan Pastry & Sourdough Surprise Bag',
          quantity: displayOrder?.quantity || 1,
          price: 4.99,
          originalPrice: 16.00,
          photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=120&q=70',
        }
      ]);

  const totalBags = items.reduce((sum, it) => sum + (it.quantity || 1), 0);
  const totalPaid = displayOrder?.totalPrice !== undefined
    ? Number(displayOrder.totalPrice).toFixed(2)
    : (displayOrder?.totalPaid || items.reduce((sum, it) => sum + ((it.price || 4.99) * (it.quantity || 1)), 0).toFixed(2));

  const totalOriginal = items.reduce((sum, it) => sum + ((it.originalPrice || 16.00) * (it.quantity || 1)), 0);
  const totalSaved = Math.max(0, totalOriginal - parseFloat(totalPaid)).toFixed(2);

  const orderId = displayOrder?.orderNumber || (displayOrder?.id ? `#FS-${displayOrder.id.slice(-6)}` : 'FS-84920');
  const storeName = (typeof displayOrder?.listing?.store === 'string' ? displayOrder.listing.store : displayOrder?.listing?.store?.name) || displayOrder?.storeName || 'CAD Bakery';

  // 6-digit pickup code
  const codeStr = displayOrder?.pickupCode || (Array.isArray(displayOrder?.digits) ? displayOrder.digits.join('') : (orderId.replace(/[^0-9]/g, '') || '789420'));
  const digits = codeStr.padStart(6, '0').slice(-6).split('');

  // Socket listener for real-time verification when merchant scans/confirms
  useEffect(() => {
    const handleVerified = (data) => {
      const verifiedCode = data?.pickupCode || data?.code;
      const verifiedId = data?.orderId || data?.id;
      if (verifiedCode === codeStr || (displayOrder?.id && verifiedId === displayOrder.id)) {
        setIsVerified(true);
        markOrderCompletedInHistory(currentUser?.id, codeStr);
        setHistoryOrders((prev) =>
          prev.map((o) => (o.pickupCode === codeStr || o.id === verifiedId ? { ...o, status: 'COMPLETED' } : o))
        );
      }
    };

    socket.on('PICKUP_VERIFIED', handleVerified);
    return () => {
      socket.off('PICKUP_VERIFIED', handleVerified);
    };
  }, [codeStr, displayOrder?.id, currentUser?.id]);

  const customerAvatar = currentUser?.avatar || displayOrder?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=70';

  // Filtered past history
  const filteredPastOrders = pastOrders.filter((o) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    const titleMatch = (o.items || []).some((it) => it.title?.toLowerCase().includes(q));
    const storeMatch = o.storeName?.toLowerCase().includes(q);
    const codeMatch = o.pickupCode?.toLowerCase().includes(q);
    return titleMatch || storeMatch || codeMatch;
  });

  return (
    <div className="space-y-4 pb-24 max-w-xl mx-auto">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToHome}
            className="w-9 h-9 rounded-full bg-white border border-stone-200/90 hover:bg-stone-50 flex items-center justify-center text-stone-700 shadow-2xs transition-colors cursor-pointer"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-sm shadow-2xs">
            🛍
          </div>
          <div>
            <h1 className="font-extrabold text-base text-[#1C1C1E]">My Reserves</h1>
            <p className="text-[11px] text-stone-500 font-medium">Active & Past Food Rescues</p>
          </div>
        </div>

        <button
          onClick={onNavigateToProfile}
          className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#2E7D32]/30 shadow-xs cursor-pointer"
          title="View Profile"
        >
          <OptimizedImage
            src={customerAvatar}
            alt="User Avatar"
            width={80}
            height={80}
            quality={70}
            priority={true}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />
        </button>
      </div>

      {/* Segmented Switcher: Now (Active) vs Before (History) */}
      <div className="bg-stone-200/80 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveSubTab('now')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'now'
              ? 'bg-white text-[#1C1C1E] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${displayOrder && !isVerified ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
          <span>Now (Active Pass)</span>
          {activeOrders.length > 0 && !isVerified && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#1b5e20] text-[10px] font-black">
              {activeOrders.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('before')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'before'
              ? 'bg-white text-[#1C1C1E] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <History className="w-3.5 h-3.5 text-stone-500" />
          <span>Before (History)</span>
          {pastOrders.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold">
              {pastOrders.length}
            </span>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: NOW (ACTIVE RESERVATIONS)                          */}
      {/* ======================================================== */}
      {activeSubTab === 'now' && (
        <div className="space-y-4 animate-in fade-in">
          
          {/* Multiple active order switcher (if more than 1 active) */}
          {activeOrders.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {activeOrders.map((ord, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedActiveIdx(idx);
                    setIsVerified(ord.status === 'COMPLETED');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                    selectedActiveIdx === idx
                      ? 'bg-[#1b5e20] text-white border-[#1b5e20] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200/80 hover:bg-stone-50'
                  }`}
                >
                  <span>Pass #{ord.pickupCode || ord.orderNumber}</span>
                  <span className="opacity-75">· {ord.storeName || 'CAD Bakery'}</span>
                </button>
              ))}
            </div>
          )}

          {displayOrder ? (
            <>
              {/* Hero Status Banner */}
              <div className="text-center space-y-2 py-1">
                <div className="relative inline-block">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-md transition-all ${
                    isVerified ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-[#2E7D32]'
                  }`}>
                    {isVerified ? (
                      <CheckCheck className="w-8 h-8 text-white stroke-[2.5]" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 fill-[#2E7D32] text-white" />
                    )}
                  </div>
                  <span className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${isVerified ? 'bg-emerald-400' : 'bg-orange-500'}`} />
                </div>

                <div className="space-y-1">
                  <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border ${
                    isVerified
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-[#EAF7ED] text-[#2E7D32] border-emerald-200'
                  }`}>
                    <Leaf className="w-3 h-3" />
                    <span>{isVerified ? 'Pickup Completed!' : 'Active Reservation'}</span>
                  </span>

                  <h2 className="text-xl font-black text-[#1C1C1E] tracking-tight">
                    {isVerified
                      ? 'Order Verified & Collected!'
                      : `You Rescued ${totalBags > 1 ? `${totalBags} Surprise Bags!` : 'a Surprise Bag!'}`}
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">{storeName} · {items.length} item type{items.length > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Digital Pickup Pass Card */}
              <div className={`bg-white rounded-3xl border p-5 shadow-2xs space-y-4 relative overflow-hidden transition-all ${
                isVerified ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-stone-200/80'
              }`}>
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-stone-400">
                    DIGITAL PICKUP PASS
                  </span>
                  <span className="text-xs font-bold text-[#2E7D32] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {orderId}
                  </span>
                </div>

                {/* 6-Digit Code Display */}
                <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2.5 transition-colors ${
                  isVerified ? 'bg-emerald-50/60 border-emerald-200' : 'bg-stone-50 border-stone-200/70'
                }`}>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    {digits.map((d, i) => (
                      <div
                        key={i}
                        className={`w-10 h-13 sm:w-11 sm:h-14 rounded-xl bg-white border-2 flex items-center justify-center font-mono text-2xl font-black shadow-xs ${
                          isVerified ? 'border-emerald-600 text-emerald-800' : 'border-[#1b5e20] text-[#1C1C1E]'
                        }`}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  <span className={`text-[10px] font-mono tracking-widest font-extrabold uppercase ${
                    isVerified ? 'text-emerald-700' : 'text-stone-500'
                  }`}>
                    {isVerified ? '✓ VERIFIED BY MERCHANT' : 'SHOW PASS AT COUNTER'}
                  </span>
                </div>

                {/* Pickup Window */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2E7D32]" />
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Pickup Window</span>
                      <span className="font-extrabold text-stone-900">Today, 6:30 PM – 7:30 PM</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#1b5e20] text-xs font-black">
                    Ready
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#1C1C1E]">Reserved Items ({items.length})</span>
                  <span className="text-xs font-bold text-[#1b5e20] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {totalBags} bag{totalBags > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-2.5 divide-y divide-stone-100">
                  {items.map((it, idx) => {
                    const qty = it.quantity || 1;
                    const price = typeof it.price === 'number' ? it.price : parseFloat(it.price) || 4.99;
                    const orig = typeof it.originalPrice === 'number' ? it.originalPrice : parseFloat(it.originalPrice) || 16.00;
                    return (
                      <div key={idx} className={`flex items-center justify-between ${idx > 0 ? 'pt-2.5' : ''}`}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-stone-200 shadow-2xs">
                            <OptimizedImage
                              src={it.photoUrl || it.image}
                              alt={it.title}
                              width={80}
                              height={80}
                              quality={70}
                              className="w-full h-full object-cover"
                              containerClassName="w-full h-full"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-[#1C1C1E] line-clamp-1">{qty}× {it.title}</h4>
                            <p className="text-[10px] text-stone-400 font-mono">${price.toFixed(2)} / bag</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-xs text-[#1b5e20] block">${(price * qty).toFixed(2)}</span>
                          {orig > price && (
                            <span className="text-[10px] text-stone-400 line-through">${(orig * qty).toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-600">Total Paid (KHQR / Bakong)</span>
                  <span className="font-black text-base text-[#1C1C1E]">${totalPaid}</span>
                </div>

                {parseFloat(totalSaved) > 0 && (
                  <div className="p-2.5 rounded-xl bg-[#EAF7ED] border border-emerald-200/70 flex items-center justify-between text-xs font-bold text-[#1b5e20]">
                    <span className="flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>Total Saved</span>
                    </span>
                    <span>${totalSaved}</span>
                  </div>
                )}
              </div>

              {/* Store Address & Map Card */}
              <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center text-lg shrink-0">
                      🏬
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#1C1C1E]">{storeName}</h4>
                      <p className="text-xs text-stone-500">422 St 178, Daun Penh, Phnom Penh</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold shrink-0">
                    0.4 km
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    className="py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Add to Calendar</span>
                  </button>

                  <button
                    type="button"
                    className="py-2 rounded-xl bg-[#1b5e20] hover:bg-[#144919] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty Active Reserves State */
            <div className="bg-white rounded-3xl border border-stone-200/80 p-8 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#2E7D32] flex items-center justify-center text-2xl mx-auto shadow-inner">
                🧺
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-base text-[#1C1C1E]">No Active Reserves Right Now</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  You don't have any pickup passes waiting right now. You can check your past reserves in the <strong className="text-stone-700">Before</strong> tab, or explore fresh surplus bags available today!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  onClick={onBackToHome}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1b5e20] hover:bg-[#144919] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Explore Today's Surplus
                </button>
                <button
                  onClick={() => setActiveSubTab('before')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  View Past History
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BEFORE (RESERVATION HISTORY)                       */}
      {/* ======================================================== */}
      {activeSubTab === 'before' && (
        <div className="space-y-4 animate-in fade-in">
          
          {/* History Impact Statistics Pill */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white border border-stone-200/80 shadow-2xs text-center">
            <div className="space-y-0.5">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Rescued</span>
              <span className="text-sm sm:text-base font-black text-[#1C1C1E]">
                {pastOrders.reduce((sum, o) => sum + (o.items?.length || 1), 0)} bags
              </span>
            </div>
            <div className="space-y-0.5 border-x border-stone-100">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Total Saved</span>
              <span className="text-sm sm:text-base font-black text-[#2E7D32]">
                ${pastOrders.reduce((sum, o) => sum + (parseFloat(o.totalSaved) || 10.5), 0).toFixed(2)}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">CO₂ Diverted</span>
              <span className="text-sm sm:text-base font-black text-[#1b5e20]">
                {pastOrders.reduce((sum, o) => sum + (parseFloat(o.co2SavedKg) || 1.8), 0).toFixed(1)} kg
              </span>
            </div>
          </div>

          {/* Search in History */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Search past reserves by item, bakery, or code..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200/80 rounded-2xl text-xs font-semibold placeholder:text-stone-400 shadow-2xs outline-none focus:border-[#2E7D32]"
            />
          </div>

          {/* Past Orders List */}
          {filteredPastOrders.length > 0 ? (
            <div className="space-y-3">
              {filteredPastOrders.map((past, idx) => {
                const pItems = Array.isArray(past.items) && past.items.length > 0 ? past.items : [{
                  title: 'Artisan Pastry & Sourdough Surprise Bag',
                  quantity: 1,
                  price: past.totalPrice || 4.99,
                  originalPrice: 16.00,
                  photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=70',
                }];
                const mainItem = pItems[0];
                const saved = past.totalSaved || (16.00 - (past.totalPrice || 4.99)).toFixed(2);

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3 transition-all hover:border-emerald-300"
                  >
                    {/* Top Row: Store, Date, and Collected Status */}
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{past.storeName || 'CAD Bakery'}</span>
                        <span className="text-stone-300">·</span>
                        <span className="text-stone-500">{past.completedAt || past.pickupDate || 'Completed'}</span>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1b5e20] text-[10px] font-black flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Collected
                      </span>
                    </div>

                    {/* Middle: Item Details */}
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-stone-200 shadow-2xs">
                        <OptimizedImage
                          src={mainItem.photoUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=70'}
                          alt={mainItem.title}
                          width={100}
                          height={100}
                          quality={70}
                          className="w-full h-full object-cover"
                          containerClassName="w-full h-full"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs sm:text-sm text-[#1C1C1E] truncate">
                          {mainItem.quantity || 1}× {mainItem.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs">
                          <span className="font-extrabold text-[#1b5e20]">${(past.totalPrice || 4.99).toFixed(2)}</span>
                          <span className="text-[10px] text-stone-400 font-semibold">Saved ${saved}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-mono font-bold">
                            Pass #{past.pickupCode}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#1b5e20] text-[10px] font-bold flex items-center gap-1">
                            <Leaf className="w-2.5 h-2.5" />
                            {past.co2SavedKg || 1.8} kg CO₂
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action: Reserve Again */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-400 font-medium">Verified FoodLink Rescue</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectListing) {
                            onSelectListing({
                              id: past.listingId || 'cad-surprise-sourdough',
                              title: mainItem.title,
                              price: mainItem.price,
                              image: mainItem.photoUrl,
                              store: past.storeName,
                            });
                          } else {
                            onBackToHome();
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1b5e20] text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reserve Again</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200/80 p-8 text-center space-y-2 shadow-2xs">
              <span className="text-2xl">📜</span>
              <p className="font-bold text-xs text-stone-700">No past reserves found</p>
              <p className="text-[11px] text-stone-400">All your collected and completed food rescues will appear here.</p>
            </div>
          )}

        </div>
      )}

      {/* Bottom Back Button */}
      <div className="pt-2 text-center">
        <button
          onClick={onBackToHome}
          className="px-6 py-2.5 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
        >
          ← Back to Discover Deals
        </button>
      </div>

    </div>
  );
}
