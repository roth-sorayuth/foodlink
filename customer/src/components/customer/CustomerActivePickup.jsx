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
  ShoppingBag,
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
  const [historyOrders, setHistoryOrders] = useState(() => getCustomerOrderHistory(currentUser?.id));

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

  const displayOrder = currentActiveOrder || activeOrders[0];

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
      const verifiedCode = data?.pickupCode || data?.code || data?.verifiedCode;
      const verifiedId = data?.orderId || data?.id;
      const verifiedOrderNum = data?.orderNumber;

      const codeDigits = String(codeStr || '').replace(/\D/g, '');
      const dataDigits = String(verifiedCode || verifiedOrderNum || '').replace(/\D/g, '');

      const isMatch =
        (verifiedId && displayOrder?.id && verifiedId === displayOrder.id) ||
        (verifiedCode && (verifiedCode === codeStr || verifiedCode === displayOrder?.pickupCode)) ||
        (verifiedOrderNum && displayOrder?.orderNumber && verifiedOrderNum === displayOrder.orderNumber) ||
        (codeDigits && dataDigits && (codeDigits === dataDigits || dataDigits.includes(codeDigits) || codeDigits.includes(dataDigits))) ||
        Boolean(displayOrder && (!displayOrder.status || displayOrder.status === 'PENDING'));

      if (isMatch) {
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
  }, [codeStr, displayOrder, currentUser?.id]);

  const customerAvatar = currentUser?.avatar || displayOrder?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=70';

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

      {/* Active Digital Pickup Pass Container */}
      <div className="space-y-4 animate-in fade-in">
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
              </div>
            </div>
          )}
      </div>

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
