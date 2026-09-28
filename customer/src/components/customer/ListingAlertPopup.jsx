import React, { useEffect, useState } from 'react';
import { Bell, Sparkles, X, ChevronRight, ShoppingBag, Clock, ShieldCheck } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';

export default function ListingAlertPopup({ alertData, onView, onClose }) {
  const [progress, setProgress] = useState(100);

  const listing = alertData?.listing || alertData;
  const storeName = listing?.storeName || listing?.store?.name || 'Artisan Bakery & Cafe';
  const title = listing?.title || 'New Surplus Food Item';
  const price = typeof listing?.price === 'number' ? `$${listing.price.toFixed(2)}` : listing?.price || '$4.99';
  const originalPrice = typeof listing?.originalPrice === 'number' ? `$${listing.originalPrice.toFixed(2)}` : listing?.originalPrice || '$16.00';
  const discount = listing?.discount || '70% OFF';
  const bags = listing?.bagsAvailable || 5;
  const photoUrl = listing?.photoUrl || listing?.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80';

  const isRestock = Boolean(
    alertData?.isRestocked ||
    alertData?.notification?.title?.includes('Restock') ||
    alertData?.notification?.message?.includes('restocked')
  );

  useEffect(() => {
    // 8-second auto-dismiss with progress countdown
    const duration = 8000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <aside 
      aria-label="New Surplus Food Notification"
      className={`fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-24px)] sm:w-auto bg-white/95 backdrop-blur-xl border ${
        isRestock ? 'border-orange-500/30' : 'border-emerald-500/30'
      } rounded-3xl shadow-2xl p-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRestock ? 'bg-orange-400' : 'bg-emerald-400'} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRestock ? 'bg-orange-500' : 'bg-emerald-500'}`} />
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black ${
            isRestock ? 'bg-orange-100 text-[#D96B1C]' : 'bg-[#EAF7ED] text-[#2E7D32]'
          }`}>
            <Sparkles className={`w-3 h-3 ${isRestock ? 'fill-[#D96B1C]' : 'fill-[#2E7D32]'}`} />
            <span>{isRestock ? 'SURPLUS RESTOCKED' : 'JUST LISTED SURPLUS'}</span>
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Listing Content */}
      <div className="flex items-center gap-3.5 py-3">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80 shadow-xs">
          <OptimizedImage
            src={photoUrl}
            alt={title}
            width={160}
            height={160}
            quality={70}
            priority={true}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />
          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-stone-900/80 text-white text-[9px] font-bold z-10">
            {bags} left
          </span>
        </div>

        {/* Text Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-[11px] font-bold text-stone-500 truncate flex items-center gap-1">
            <span>{storeName}</span>
            <ShieldCheck className="w-3 h-3 text-[#2E7D32] shrink-0" />
          </p>

          <h4 className="font-extrabold text-sm text-[#1C1C1E] line-clamp-1 leading-tight">
            {title}
          </h4>

          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
            <span className="font-black text-base text-[#1C1C1E]">{price}</span>
            <span className="text-xs text-stone-400 line-through">{originalPrice}</span>
            <span className="text-[10px] font-extrabold text-[#2E7D32] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {discount}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold shadow-xs flex items-center gap-0.5">
              🔥 {bags <= 2 ? `Only ${bags} left` : `${bags} left`}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center gap-2">
        <button
          onClick={() => {
            onView(listing);
            onClose();
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl ${
            isRestock ? 'bg-[#D96B1C] hover:bg-[#B85714]' : 'bg-[#2E7D32] hover:bg-[#256629]'
          } text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/10 active:scale-98 transition-all cursor-pointer`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{isRestock ? 'View Restocked Bag' : 'View & Reserve Bag'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onClose}
          className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
        >
          Dismiss
        </button>
      </div>

      {/* Auto-dismiss progress line */}
      <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden mt-3">
        <div
          className="bg-[#2E7D32] h-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </aside>
  );
}
