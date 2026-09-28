import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  Lock,
  Minus,
  Plus,
  Trash2,
  Check,
  ShoppingBag
} from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';

export default function CustomerCheckoutFlow({
  cartItems = [],
  listing = null,
  quantity = 1,
  onBack,
  onConfirmPayment,
  onUpdateQuantity,
  onRemoveItem,
  onAddMoreItems
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Normalize items array: supports either cartItems or single listing fallback
  const items = Array.isArray(cartItems) && cartItems.length > 0
    ? cartItems
    : (listing ? [{ listing, quantity: quantity || 1 }] : []);

  // Compute totals
  const totalQty = items.reduce((sum, it) => sum + (it.quantity || 1), 0);
  const totalDue = items.reduce((sum, it) => {
    const rawPrice = it.listing?.price;
    const price = typeof rawPrice === 'number'
      ? rawPrice
      : parseFloat(String(rawPrice || '4.99').replace(/[^0-9.]/g, '')) || 4.99;
    return sum + (price * (it.quantity || 1));
  }, 0);

  // Store information from the first item
  const primaryItem = items[0]?.listing;
  const storeName = primaryItem?.storeName || primaryItem?.store?.name || primaryItem?.store || 'CAD Bakery';
  const address = primaryItem?.address || primaryItem?.store?.address || '422 St 178, Daun Penh, Phnom Penh';
  const pickupWindow = primaryItem?.pickupTime || `${primaryItem?.pickupStart || '6:30 PM'} – ${primaryItem?.pickupEnd || '7:30 PM'}`;

  const handleConfirm = () => {
    setIsSubmitting(true);
    if (onConfirmPayment) {
      onConfirmPayment({
        items,
        totalQty,
        totalDue: totalDue.toFixed(2),
        paymentMethod: 'khqr'
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-4 font-sans text-stone-900">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-2xl text-stone-400">
          🛍️
        </div>
        <div>
          <h2 className="text-lg font-black text-[#1C1C1E]">Your bag is empty</h2>
          <p className="text-xs text-stone-500 mt-1">Explore surplus food bags and add items to your cart.</p>
        </div>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          Explore Bags
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4 pb-24 font-sans text-stone-900">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-stone-200/90 hover:bg-stone-50 flex items-center justify-center text-stone-700 shadow-2xs transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-extrabold text-lg text-[#1C1C1E] tracking-tight">Review & Reserve</h1>
            <p className="text-xs text-stone-500 font-medium">
              {items.length} item type{items.length > 1 ? 's' : ''} ({totalQty} total bags)
            </p>
          </div>
        </div>

        {onAddMoreItems && (
          <button
            onClick={onAddMoreItems}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1b5e20] text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-colors border border-emerald-200/60"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More</span>
          </button>
        )}
      </div>

      {/* 2. Multi-Item Order List Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
          <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">
            Items in your bag ({items.length})
          </span>
          <span className="text-[11px] font-bold text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {storeName}
          </span>
        </div>

        <div className="space-y-3.5 divide-y divide-stone-100">
          {items.map((it, idx) => {
            const item = it.listing || it;
            const qty = it.quantity || 1;
            const rawPrice = item.price;
            const price = typeof rawPrice === 'number'
              ? rawPrice
              : parseFloat(String(rawPrice || '4.99').replace(/[^0-9.]/g, '')) || 4.99;
            const rawOrig = item.originalPrice;
            const origPrice = typeof rawOrig === 'number'
              ? rawOrig
              : parseFloat(String(rawOrig || '15.00').replace(/[^0-9.]/g, '')) || 15.00;
            const itemTotal = price * qty;
            const maxAvailable = item.remaining !== undefined ? Math.max(1, item.remaining) : 5;

            return (
              <div key={item.id || idx} className={`flex gap-3.5 items-center ${idx > 0 ? 'pt-3.5' : ''}`}>
                {/* Image */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/70 shadow-2xs">
                  <OptimizedImage
                    src={item.image || item.photoUrl}
                    alt={item.title}
                    width={120}
                    height={120}
                    quality={70}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-xs sm:text-sm text-[#1C1C1E] line-clamp-1 leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-sm font-black text-[#1b5e20]">${price.toFixed(2)}</span>
                    {origPrice > price && (
                      <span className="text-[10px] text-stone-400 line-through">${origPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Stepper & Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 rounded-xl px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, qty - 1)}
                      className="w-5 h-5 rounded-md bg-white text-stone-700 font-bold flex items-center justify-center hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
                      title="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-xs w-5 text-center">{qty}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, Math.min(maxAvailable, qty + 1))}
                      disabled={qty >= maxAvailable}
                      className="w-5 h-5 rounded-md bg-[#2E7D32] text-white font-bold flex items-center justify-center disabled:opacity-30 hover:bg-[#256629] transition-colors shadow-2xs cursor-pointer"
                      title="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {onRemoveItem && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add more items prompt */}
        {onAddMoreItems && (
          <button
            onClick={onAddMoreItems}
            className="w-full py-2.5 rounded-2xl border-2 border-dashed border-stone-200 hover:border-emerald-300 text-stone-600 hover:text-[#1b5e20] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add another item from {storeName}</span>
          </button>
        )}
      </div>

      {/* 3. Pickup Details Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
        <h3 className="font-extrabold text-xs text-stone-400 uppercase tracking-wider">Pickup Logistics</h3>
        
        <div className="space-y-2.5 text-xs">
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900 block">Today, {pickupWindow}</span>
              <span className="text-stone-500 text-[11px]">Show your 6-digit pickup pass upon arrival</span>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2 border-t border-stone-100">
            <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900 block">{storeName}</span>
              <span className="text-stone-500 text-[11px]">{address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Payment Method Card (KHQR / Bakong Only) */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-2.5">
        <h3 className="font-extrabold text-xs text-stone-400 uppercase tracking-wider">Payment Method</h3>
        
        <div className="p-3 rounded-2xl bg-emerald-50/40 border border-[#2E7D32]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[9px] uppercase tracking-wider shadow-2xs">
              KHQR
            </span>
            <div>
              <span className="font-bold text-xs text-stone-900 block">KHQR / Bakong Instant Pay</span>
              <span className="text-[11px] text-stone-500">Scan via any Cambodian banking app</span>
            </div>
          </div>
          <div className="w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* 5. Summary & Single Primary CTA */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-extrabold text-sm text-stone-900 block">Total Due</span>
            <span className="text-[11px] text-stone-400">{totalQty} surplus bag{totalQty > 1 ? 's' : ''}</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[#1b5e20]">${totalDue.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-70"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Confirm & Reserve • ${totalDue.toFixed(2)}</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Official 6-digit pickup pass generated immediately</span>
        </p>
      </div>

    </div>
  );
}
