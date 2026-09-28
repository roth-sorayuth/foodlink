import React, { useState, useEffect } from 'react';
import {
  Clock,
  QrCode,
  Copy,
  Check,
  CheckCircle2,
  Calendar,
  X,
  User,
  Sparkles,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';
import { getMerchantOrders, verifyOrderPickup } from '../../services/api';
import { socket } from '../../services/socket';

export default function MerchantOrders({ onOpenVerify, onNavigateToProfile, onConfirmPickup, onPendingOrdersChange }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  // Normalize order from DB
  const normalizeOrder = (o) => {
    let parsedItems = [];
    if (Array.isArray(o.items) && o.items.length > 0) {
      parsedItems = o.items;
    } else if (o.qrCodeData) {
      try {
        const parsed = JSON.parse(o.qrCodeData);
        if (Array.isArray(parsed.items)) parsedItems = parsed.items;
      } catch (e) {}
    }

    if (parsedItems.length === 0 && o.listing) {
      parsedItems = [{
        title: o.listing.title,
        quantity: o.quantity || 1,
        price: o.listing.price || 4.99,
        photoUrl: o.listing.photoUrl || o.listing.image,
      }];
    }

    const totalQty = o.quantity || parsedItems.reduce((s, it) => s + (it.quantity || 1), 0) || 1;
    const itemsTitle = parsedItems.length > 1
      ? `${parsedItems.map(it => `${it.quantity}x ${it.title}`).join(', ')}`
      : (parsedItems[0]?.title || o.listing?.title || 'Surplus Surprise Bag');

    return {
      id: o.id,
      customer: o.user?.name || o.customerName || 'Valued Customer',
      orderNumber: o.orderNumber || `#FS-${String(o.id).slice(-5)}`,
      code: o.pickupCode || 'SAVER-100',
      avatarColor: 'bg-emerald-200 text-emerald-900',
      initials: (o.user?.name || o.customerName || 'VC').split(' ').map((n) => n[0]).join('').slice(0, 2),
      itemTitle: itemsTitle,
      items: parsedItems,
      image: parsedItems[0]?.photoUrl || o.listing?.photoUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80',
      qty: totalQty,
      co2: `Saved ${(o.co2SavedKg || 1.2 * totalQty).toFixed(1)} kg CO₂e`,
      price: `$${(o.totalPrice || 4.99).toFixed(2)}`,
      status: o.status,
      time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
      verifiedAt: o.verifiedAt ? new Date(o.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
    };
  };

  // Fetch initial orders from database
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getMerchantOrders();
      if (Array.isArray(data) && data.length > 0) {
        const pending = data.filter((o) => o.status === 'PENDING' || o.status === 'READY').map(normalizeOrder);
        const completed = data.filter((o) => o.status === 'COMPLETED').map(normalizeOrder);
        setPendingOrders(pending);
        setCompletedOrders(completed);
        if (onPendingOrdersChange) onPendingOrdersChange(pending.length);
      } else {
        setPendingOrders([]);
        setCompletedOrders([]);
        if (onPendingOrdersChange) onPendingOrdersChange(0);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Listen for real-time incoming orders & pickup verifications via Socket.io
  useEffect(() => {
    const handleOrderCreated = (data) => {
      const order = data?.order || data;
      const normalized = normalizeOrder(order);
      setPendingOrders((prev) => {
        const updated = [normalized, ...prev.filter((o) => o.id !== normalized.id)];
        if (onPendingOrdersChange) onPendingOrdersChange(updated.length);
        return updated;
      });
      showToast(`🔔 New Order! ${normalized.customer} reserved ${normalized.qty} bag(s) (Code: ${normalized.code})`);
    };

    const handlePickupVerified = (data) => {
      const { orderId, orderNumber, pickupCode } = data || {};
      setPendingOrders((prev) => {
        const target = prev.find(
          (o) => o.id === orderId || o.orderNumber === orderNumber || o.code === pickupCode
        );
        if (!target) return prev;
        const remaining = prev.filter((o) => o.id !== target.id);
        if (onPendingOrdersChange) onPendingOrdersChange(remaining.length);

        setCompletedOrders((compPrev) => [
          {
            id: target.id,
            customer: target.customer,
            orderNumber: target.orderNumber,
            staff: 'Staff (You)',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...compPrev,
        ]);

        return remaining;
      });
    };

    socket.on('ORDER_CREATED', handleOrderCreated);
    socket.on('PICKUP_VERIFIED', handlePickupVerified);

    return () => {
      socket.off('ORDER_CREATED', handleOrderCreated);
      socket.off('PICKUP_VERIFIED', handlePickupVerified);
    };
  }, [onPendingOrdersChange]);

  const confirmPickup = (order) => {
    // 1. INSTANT Optimistic UI Update: zero wait time, immediate feedback
    const remaining = pendingOrders.filter((o) => o.id !== order.id);
    setPendingOrders(remaining);
    setCompletedOrders((prev) => [
      {
        id: order.id,
        customer: order.customer,
        orderNumber: order.orderNumber,
        staff: 'Staff (You)',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);

    if (onConfirmPickup) {
      onConfirmPickup(remaining.length);
    }

    showToast(`✓ Order ${order.orderNumber} confirmed & handed over!`);

    // 2. Fire backend verification asynchronously in the background
    verifyOrderPickup({ code: order.code, orderId: order.id }).catch((err) => {
      console.warn('Background pickup verification note:', err.message);
    });
  };

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code);
    showToast(`Copied code: ${code}`);
  };

  return (
    <div className="space-y-4">
      
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

      {/* Header / Kitchen Queue */}
      <div className="space-y-1 pt-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E7D32] flex items-center gap-1">
          🍃 KITCHEN QUEUE
        </span>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-[#1C1C1E] tracking-tight">Today's Reservations</h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span>Today, Nov 14</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-full transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
          }`}
        >
          All 14
        </button>

        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'pending'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Pending Pickup {pendingOrders.length}</span>
        </button>

        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'completed'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
          }`}
        >
          <Check className="w-3 h-3 text-emerald-500" />
          <span>Completed</span>
        </button>
      </div>



      {/* Group Section: Pickup Window Current */}
      {activeFilter !== 'completed' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-200 border-2 border-rose-400" />
              <span className="text-xs font-bold text-stone-700">Pickup Window: 6:30 PM – 7:30 PM</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-orange-100 text-[#D96B1C] text-[10px] font-extrabold uppercase tracking-wider">
              CURRENT
            </span>
          </div>

          {/* Pending Order Cards */}
          <div className="space-y-3">
            {pendingOrders.map((order, idx) => (
              <div
                key={order.id}
                style={{ animationDelay: `${idx * 70}ms` }}
                className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5 interactive-card hover:border-emerald-300/80"
              >
                {/* Header row: Customer & Code Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${order.avatarColor} font-black text-xs flex items-center justify-center shadow-2xs hover:scale-105 transition-transform`}>
                      {order.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-sm text-[#1C1C1E]">{order.customer}</h3>
                        <span className="text-xs text-stone-400 font-mono">• Order {order.orderNumber}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Pending Pickup
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => copyCode(order.code)}
                    className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 font-mono font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>{order.code}</span>
                    <Copy className="w-3 h-3 text-stone-400" />
                  </button>
                </div>

                {/* Item Details */}
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                  {order.items && order.items.length > 1 ? (
                    <div className="space-y-2 divide-y divide-stone-200/60">
                      {order.items.map((it, i) => (
                        <div key={i} className={`flex items-center justify-between ${i > 0 ? 'pt-2' : ''}`}>
                          <div className="flex items-center gap-2.5">
                            <img
                              src={it.photoUrl || order.image}
                              alt={it.title}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-bold text-xs text-[#1C1C1E]">{it.quantity}× {it.title}</h4>
                              <p className="text-[10px] text-stone-500">${(it.price || 4.99).toFixed(2)} / bag</p>
                            </div>
                          </div>
                          <span className="font-bold text-xs text-stone-700">${((it.price || 4.99) * (it.quantity || 1)).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-stone-500 font-semibold">{order.qty} total bags • <span className="text-[#2E7D32]">{order.co2}</span></span>
                        <span className="font-extrabold text-sm text-[#2E7D32]">{order.price}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.image}
                          alt={order.itemTitle}
                          className="w-10 h-10 rounded-xl object-cover hover:scale-105 transition-transform"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-[#1C1C1E]">{order.itemTitle}</h4>
                          <p className="text-[11px] text-stone-500">
                            Qty: {order.qty} • <span className="text-[#2E7D32] font-semibold">{order.co2}</span>
                          </p>
                        </div>
                      </div>

                      <span className="font-extrabold text-sm text-[#2E7D32]">{order.price}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Pickup Action Button */}
                <button
                  onClick={() => confirmPickup(order)}
                  className="w-full py-3 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md hover:shadow-emerald-950/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Confirm Pickup</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Earlier Pickups Section */}
      {activeFilter !== 'pending' && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Earlier Pickups (Completed)</span>
            </div>
            <span className="text-xs text-stone-400">8 total today</span>
          </div>

          <div className="space-y-2">
            {completedOrders.map((comp) => (
              <div
                key={comp.id}
                className="bg-white rounded-2xl border border-stone-200/80 p-3.5 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1C1C1E]">{comp.customer}</span>
                      <span className="font-mono text-[11px] text-stone-400">{comp.orderNumber}</span>
                    </div>
                    <p className="text-[10px] text-stone-400">Verified by: {comp.staff}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#2E7D32]">
                  <Check className="w-3 h-3" />
                  <span>Picked Up at {comp.time}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
