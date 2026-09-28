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
  CheckCheck
} from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';
import { socket } from '../../services/api';

export default function CustomerActivePickup({
  order,
  currentUser,
  onBackToHome,
  onNavigateToProfile
}) {
  const [isVerified, setIsVerified] = useState(order?.status === 'COMPLETED');

  // Parse items from order (supports array of items or single listing)
  const items = Array.isArray(order?.items) && order.items.length > 0
    ? order.items
    : (order?.listing ? [{
        title: order.listing.title,
        quantity: order.quantity || 1,
        price: typeof order.listing.price === 'number' ? order.listing.price : parseFloat(String(order.listing.price || '4.99').replace(/[^0-9.]/g, '')) || 4.99,
        originalPrice: typeof order.listing.originalPrice === 'number' ? order.listing.originalPrice : parseFloat(String(order.listing.originalPrice || '16.00').replace(/[^0-9.]/g, '')) || 16.00,
        photoUrl: order.listing.image || order.listing.photoUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=120&q=70',
      }] : [
        {
          title: 'Artisan Pastry & Sourdough Surprise Bag',
          quantity: order?.quantity || 1,
          price: 4.99,
          originalPrice: 16.00,
          photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=120&q=70',
        }
      ]);

  const totalBags = items.reduce((sum, it) => sum + (it.quantity || 1), 0);
  const totalPaid = order?.totalPrice !== undefined
    ? Number(order.totalPrice).toFixed(2)
    : (order?.totalPaid || items.reduce((sum, it) => sum + ((it.price || 4.99) * (it.quantity || 1)), 0).toFixed(2));

  const totalOriginal = items.reduce((sum, it) => sum + ((it.originalPrice || 16.00) * (it.quantity || 1)), 0);
  const totalSaved = Math.max(0, totalOriginal - parseFloat(totalPaid)).toFixed(2);

  const orderId = order?.orderNumber || (order?.id ? `#FS-${order.id.slice(-6)}` : 'FS-84920');
  const storeName = (typeof order?.listing?.store === 'string' ? order.listing.store : order?.listing?.store?.name) || order?.storeName || 'CAD Bakery';

  // 6-digit pickup code
  const codeStr = order?.pickupCode || (Array.isArray(order?.digits) ? order.digits.join('') : (orderId.replace(/[^0-9]/g, '') || '789420'));
  const digits = codeStr.padStart(6, '0').slice(-6).split('');

  // Socket listener for real-time verification when merchant scans/confirms
  useEffect(() => {
    const handleVerified = (data) => {
      const verifiedCode = data?.pickupCode || data?.code;
      const verifiedId = data?.orderId || data?.id;
      if (verifiedCode === codeStr || (order?.id && verifiedId === order.id)) {
        setIsVerified(true);
      }
    };

    socket.on('PICKUP_VERIFIED', handleVerified);
    return () => {
      socket.off('PICKUP_VERIFIED', handleVerified);
    };
  }, [codeStr, order?.id]);

  const customerAvatar = currentUser?.avatar || order?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=70';

  return (
    <div className="space-y-4 pb-20">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="w-9 h-9 rounded-full bg-white border border-stone-200/90 hover:bg-stone-50 flex items-center justify-center text-stone-700 shadow-2xs transition-colors cursor-pointer"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-sm shadow-2xs">
            👨‍🍳
          </div>
          <div>
            <h1 className="font-extrabold text-base text-[#1C1C1E]">Digital Pickup Pass</h1>
            <p className="text-[11px] text-stone-500 font-medium">Order {orderId}</p>
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

      {/* Hero Success State Banner */}
      <div className="text-center space-y-2.5 py-2">
        <div className="relative inline-block">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md transition-all ${
            isVerified ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-[#2E7D32]'
          }`}>
            {isVerified ? (
              <CheckCheck className="w-10 h-10 text-white stroke-[2.5]" />
            ) : (
              <CheckCircle2 className="w-10 h-10 fill-[#2E7D32] text-white" />
            )}
          </div>
          <span className={`absolute top-0 right-0 w-4 h-4 rounded-full ring-2 ring-white ${isVerified ? 'bg-emerald-400' : 'bg-orange-500'}`} />
        </div>

        <div className="space-y-1">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
            isVerified
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : 'bg-[#EAF7ED] text-[#2E7D32] border-emerald-200'
          }`}>
            <Leaf className="w-3.5 h-3.5" />
            <span>{isVerified ? 'Pickup Completed!' : 'Surplus Rescued!'}</span>
          </span>

          <h2 className="text-2xl font-black text-[#1C1C1E] tracking-tight">
            {isVerified
              ? 'Order Verified & Collected!'
              : `You Rescued ${totalBags > 1 ? `${totalBags} Surprise Bags!` : 'a Surprise Bag!'}`}
          </h2>
          <p className="text-xs text-stone-500 font-medium">{storeName} · {items.length} item type{items.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Main Responsive Layout (2 cols on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Digital Pickup Pass */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Digital Pickup Pass Card */}
          <div className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-2xs space-y-4 relative overflow-hidden transition-all ${
            isVerified ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-stone-200/80'
          }`}>
            <div className="text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-stone-400">
                OFFICIAL DIGITAL PICKUP PASS
              </span>
            </div>

            {/* 6-Digit Code Display */}
            <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col items-center justify-center space-y-3 transition-colors ${
              isVerified ? 'bg-emerald-50/60 border-emerald-200' : 'bg-stone-50 border-stone-200/70'
            }`}>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2.5">
                {digits.map((d, i) => (
                  <div
                    key={i}
                    className={`w-10 h-14 sm:w-12 sm:h-16 rounded-xl sm:rounded-2xl bg-white border-2 flex items-center justify-center font-mono text-2xl sm:text-3xl font-black shadow-xs ${
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
                {isVerified ? '✓ VERIFIED BY MERCHANT' : 'SHOW AT COUNTER UPON ARRIVAL'}
              </span>
            </div>

            {/* Dashed Tear-off Divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-stone-200" />
              </div>
            </div>

            {/* Pickup Window Timestamp */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-500" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">PICKUP WINDOW</span>
                  <span className="font-extrabold text-stone-900 text-sm">Today, 6:30 PM – 7:30 PM</span>
                </div>
              </div>

              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isVerified ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-[#2E7D32]'
              }`}>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Milestone Unlocked Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1b5e20] text-white flex items-center justify-center text-lg shadow-2xs">
                🌱
              </div>
              <div>
                <span className="font-extrabold text-sm text-[#1C1C1E] block">Milestone Unlocked!</span>
                <span className="text-xs text-stone-500">You earned +{10 * totalBags} Green Hero points</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#1b5e20] text-white font-black text-xs">
              Level 2
            </span>
          </div>

        </div>

        {/* Right Column: Store Location & Order Summary */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Store Location & Map Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center text-xl shrink-0">
                🏬
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#1C1C1E]">{storeName}</h3>
                <p className="text-xs text-stone-500">422 St 178, Daun Penh, Phnom Penh</p>
              </div>
            </div>

            {/* Map Preview */}
            <div className="relative h-32 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=70"
                alt="Store directions map"
                width={400}
                height={130}
                quality={70}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-stone-900/10 pointer-events-none" />

              <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-xs text-xs font-bold text-stone-800 shadow-xs flex items-center gap-1.5 z-10">
                <span>📍</span>
                <span>0.4 km away</span>
              </div>
            </div>

            {/* Actions: Directions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                className="py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Calendar</span>
              </button>

              <button
                type="button"
                className="py-2.5 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions</span>
              </button>
            </div>
          </div>

          {/* Multi-Item Order Summary Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#1C1C1E]">Reserved Items ({items.length})</span>
              <span className="text-xs font-bold text-[#1b5e20] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {totalBags} total bag{totalBags > 1 ? 's' : ''}
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-2.5 divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
              {items.map((it, idx) => {
                const qty = it.quantity || 1;
                const price = typeof it.price === 'number' ? it.price : parseFloat(it.price) || 4.99;
                const orig = typeof it.originalPrice === 'number' ? it.originalPrice : parseFloat(it.originalPrice) || 15.00;
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

            {/* Total Paid Row */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-600">Total Paid (KHQR / Bakong)</span>
              <span className="font-black text-base text-[#1C1C1E]">${totalPaid}</span>
            </div>

            {/* Total Saved Badge */}
            {parseFloat(totalSaved) > 0 && (
              <div className="p-2.5 rounded-xl bg-[#EAF7ED] border border-emerald-200/70 flex items-center justify-between text-xs font-bold text-[#1b5e20]">
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Total Saved</span>
                </span>
                <span>${totalSaved}</span>
              </div>
            )}

            {/* Remember Reusable Bag Note */}
            <div className="p-3 rounded-2xl bg-[#FFEFE7] border border-orange-200/70 flex items-center gap-2.5 text-xs text-[#8C3A00] leading-relaxed">
              <span className="text-base shrink-0">🛍</span>
              <p>
                <strong className="font-bold">Remember your bag!</strong> Bring a reusable tote to help keep Phnom Penh waste-free.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Return to Home CTA */}
      <div className="pt-2 text-center">
        <button
          onClick={onBackToHome}
          className="px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
        >
          ← Back to Discover Rescues
        </button>
      </div>

    </div>
  );
}
