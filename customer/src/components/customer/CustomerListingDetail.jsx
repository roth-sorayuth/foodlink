import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  ShoppingBag,
  Star,
  Plus,
  Minus,
  Sparkles,
  Leaf,
  History,
  CheckCircle2
} from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';

export default function CustomerListingDetail({
  listing,
  initialQuantity = 1,
  onBack,
  onProceedToCheckout,
  onAddToCart,
  onNavigateToProfile,
  cartItemCount = 0
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [justAdded, setJustAdded] = useState(false);

  // Dynamic listing properties with clean defaults
  const title = listing?.title || 'Artisan Sourdough & Croissant Surprise Box';
  const storeName = (typeof listing?.store === 'string' ? listing.store : listing?.store?.name) || listing?.storeName || 'CAD Bakery';
  const category = listing?.category || 'Pastry';
  const image = listing?.image || listing?.photoUrl || 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=640&q=75';
  const address = (typeof listing?.address === 'string' ? listing.address : listing?.store?.address) || '422 St 178, Daun Penh';
  const rating = (typeof listing?.rating === 'string' || typeof listing?.rating === 'number' ? listing.rating : listing?.store?.rating) || '4.9';
  const bags = listing?.remaining !== undefined ? listing.remaining : (listing?.bagsAvailable || 3);
  const pickupWindow = listing?.pickupTime || `${listing?.pickupStart || '6:30 PM'} – ${listing?.pickupEnd || '7:30 PM'}`;
  const description = listing?.description || "Assortment of fresh surplus bakery items prepared today. Contents vary based on daily unsold surplus.";

  const priceNum = typeof listing?.price === 'number'
    ? listing.price
    : parseFloat(String(listing?.price || '4.99').replace(/[^0-9.]/g, '')) || 4.99;
  const origPriceNum = typeof listing?.originalPrice === 'number'
    ? listing.originalPrice
    : parseFloat(String(listing?.originalPrice || '16.00').replace(/[^0-9.]/g, '')) || 16.00;
  
  const discount = listing?.discount || 'Save 69%';
  const isSoldOut = bags <= 0 || listing?.status === 'PAUSED' || listing?.isAvailable === false;
  const maxAvailable = Math.min(Math.max(bags, 1), 10);

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-28">
      
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-stone-200/90 hover:bg-stone-50 flex items-center justify-center text-stone-700 shadow-2xs transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-extrabold text-base text-[#1C1C1E]">Listing Details</h1>
        </div>

        <button
          onClick={onNavigateToProfile}
          className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#2E7D32]/30 shadow-xs cursor-pointer"
        >
          <OptimizedImage
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=70"
            alt="Profile"
            width={80}
            height={80}
            quality={70}
            priority={true}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />
        </button>
      </div>

      {/* 2. Hero Image Banner */}
      <div className={`relative h-60 sm:h-72 w-full rounded-3xl overflow-hidden bg-stone-100 shadow-xs transition-all duration-300 ${isSoldOut ? 'grayscale contrast-75' : ''}`}>
        <OptimizedImage
          src={image}
          alt={title}
          width={640}
          quality={75}
          priority={true}
          className="w-full h-full object-cover"
          containerClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/95 text-stone-800 text-xs font-bold shadow-xs backdrop-blur-xs">
            {category}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#1b5e20]/90 text-white text-xs font-bold shadow-xs flex items-center gap-1 backdrop-blur-xs">
            <Leaf className="w-3 h-3" />
            <span>Surplus</span>
          </span>
        </div>

        <div className="absolute bottom-3.5 right-3.5">
          {isSoldOut ? (
            <span className="px-3 py-1 rounded-full bg-stone-900/90 text-stone-200 text-xs font-bold shadow-xs backdrop-blur-xs">
              Sold Out
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold shadow-xs">
              🔥 {bags} left
            </span>
          )}
        </div>
      </div>

      {/* 3. Essential Info Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
        
        {/* Store & Rating */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1C1C1E] tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-stone-500 font-semibold mt-0.5">{storeName}</p>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#2E7D32] text-xs font-black flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-[#2E7D32] text-[#2E7D32]" />
            <span>{rating}</span>
          </span>
        </div>

        {/* Price & Savings */}
        <div className="flex items-baseline justify-between pt-1 border-t border-stone-100">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1b5e20]">
              ${(priceNum * quantity).toFixed(2)}
            </span>
            <span className="text-xs text-stone-400 line-through">
              ${(origPriceNum * quantity).toFixed(2)} value
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#D96B1C] text-xs font-bold">
            {discount}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-stone-600 leading-relaxed">
          {description}
        </p>

        {/* Key Logistics: Pickup Window & Location */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Pickup Window</span>
                <span className="font-extrabold text-stone-900">{pickupWindow}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#2E7D32] bg-emerald-100 px-2 py-0.5 rounded-md">
              Today
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Pickup Address</span>
              <span className="font-medium text-stone-800 truncate">{address}</span>
            </div>
          </div>
        </div>

        {/* Reservation History: Before & Now */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#1C1C1E]">
              <History className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Reservation Activity</span>
            </div>
            <span className="text-[10px] font-bold text-[#2E7D32] bg-emerald-100 px-2 py-0.5 rounded-full">
              Live Updates
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Now */}
            <div className="p-3 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] uppercase font-extrabold text-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Now (Available)
              </span>
              <p className="font-black text-sm text-[#1C1C1E]">{bags} bag{bags !== 1 ? 's' : ''} left</p>
              <p className="text-[10px] text-stone-500 font-medium">Ready for pickup today</p>
            </div>

            {/* Before */}
            <div className="p-3 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] uppercase font-extrabold text-stone-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" />
                Before (Claimed)
              </span>
              <p className="font-black text-sm text-[#1C1C1E]">{listing?.soldCount || listing?.bagsSold || 2} claimed today</p>
              <p className="text-[10px] text-stone-500 font-medium">Rescued by community</p>
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
          <span className="text-xs font-bold text-stone-800">Quantity</span>
          <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-2 py-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-30 font-extrabold text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-black text-sm text-stone-900 w-5 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(prev => Math.min(maxAvailable, prev + 1))}
              disabled={quantity >= maxAvailable}
              className="w-7 h-7 rounded-lg bg-[#2E7D32] hover:bg-[#1b5e20] text-white disabled:opacity-30 font-extrabold flex items-center justify-center transition-colors cursor-pointer"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dual Actions: Add to Bag (Multi-item) + Reserve Now */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => {
              if (onAddToCart) {
                onAddToCart(listing, quantity);
                setJustAdded(true);
                setTimeout(() => setJustAdded(false), 2000);
              }
            }}
            disabled={isSoldOut}
            className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
              isSoldOut
                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-50 text-[#2E7D32] border-emerald-300 font-extrabold'
                : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs active:scale-95'
            }`}
          >
            <Plus className="w-4 h-4 text-[#2E7D32]" />
            <span>{justAdded ? '✓ Added to Bag' : 'Add to Bag'}</span>
          </button>

          <button
            onClick={() => onProceedToCheckout && onProceedToCheckout(quantity, listing)}
            disabled={isSoldOut}
            className={`py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-transform cursor-pointer ${
              isSoldOut
                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                : 'bg-[#1b5e20] hover:bg-[#144919] text-white active:scale-95'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isSoldOut ? 'Sold Out' : 'Reserve Now'}</span>
          </button>
        </div>

        {/* View Bag Quick Link if items exist */}
        {cartItemCount > 0 && (
          <button
            onClick={() => onProceedToCheckout && onProceedToCheckout()}
            className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1b5e20] text-xs font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer border border-emerald-200/60"
          >
            <span>View Bag ({cartItemCount} item{cartItemCount > 1 ? 's' : ''}) & Checkout</span>
            <span>→</span>
          </button>
        )}
      </div>

    </div>
  );
}
