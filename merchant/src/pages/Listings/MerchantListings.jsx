import React, { useState, useEffect } from 'react';
import {
  Plus,
  Leaf,
  TrendingUp,
  Clock,
  DollarSign,
  Minus,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Package,
  User,
  X,
  RefreshCw
} from 'lucide-react';
import {
  getMerchantListings,
  updateMerchantListing,
  deleteMerchantListing,
  DEFAULT_MERCHANT_LISTINGS
} from '../../services/api';

export default function MerchantListings({
  onOpenCreate,
  onNavigateToProfile,
  onEditListing,
  newListing
}) {
  const [activeFilter, setActiveFilter] = useState('active');
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Helper to normalize DB listing to merchant card shape
  const normalizeMerchantItem = (item) => {
    const origPriceNum = typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(item.originalPrice) || 15.0;
    const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 4.99;
    const remaining = item.bagsAvailable !== undefined ? item.bagsAvailable : (item.remainingCount || 2);
    const sold = item.bagsSold !== undefined ? item.bagsSold : (item.soldCount || 4);
    const total = remaining + sold;
    const isSoldOut = remaining <= 0 || item.status === 'SOLD_OUT';

    return {
      id: item.id,
      title: item.title,
      subtitle: item.description ? item.description.slice(0, 40) + '...' : 'Surprise mixed daily selection',
      image: item.photoUrl || item.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
      price: `$${priceNum.toFixed(2)}`,
      originalPrice: `$${origPriceNum.toFixed(2)}`,
      status: isSoldOut ? 'sold-out' : 'active',
      liveTag: isSoldOut ? `Sold Out (${sold}/${total})` : (remaining <= 2 ? 'Live • Selling Fast' : 'Live'),
      stockTag: remaining <= 2 && !isSoldOut ? `Only ${remaining} left` : null,
      soldCount: sold,
      remainingCount: remaining,
      totalCount: total,
      earned: `$${(sold * priceNum).toFixed(2)}`,
      pickupWindow: `${item.pickupStart || '6:30'} – ${item.pickupEnd || '7:30 PM'}`,
      isPaused: item.status === 'PAUSED',
      raw: item
    };
  };

  // Listings State
  const [listings, setListings] = useState(() => {
    try {
      const stored = localStorage.getItem('foodlink_merchant_listings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeMerchantItem);
        }
      }
    } catch (e) {}
    return DEFAULT_MERCHANT_LISTINGS.map(normalizeMerchantItem);
  });

  // Fetch initial listings from database
  const loadListings = async () => {
    setIsLoading(true);
    try {
      const data = await getMerchantListings();
      if (Array.isArray(data) && data.length > 0) {
        setListings(data.map(normalizeMerchantItem));
      }
    } catch (err) {
      console.error('Failed to load merchant listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  // Prepend newly created listing immediately if received via prop
  useEffect(() => {
    if (newListing && newListing.id) {
      setListings((prev) => {
        const exists = prev.some((l) => l.id === newListing.id);
        if (!exists) {
          return [normalizeMerchantItem(newListing.raw || newListing), ...prev];
        }
        return prev;
      });
    }
  }, [newListing]);

  const updateRemaining = async (id, delta) => {
    const current = listings.find((l) => l.id === id);
    if (!current) return;
    const nextRemaining = Math.max(0, current.remainingCount + delta);

    // Optimistic UI update
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isSoldOut = nextRemaining === 0;
          return {
            ...item,
            remainingCount: nextRemaining,
            totalCount: item.soldCount + nextRemaining,
            status: isSoldOut ? 'sold-out' : 'active',
          };
        }
        return item;
      })
    );

    showToast(`Updated "${current.title}" stock to ${nextRemaining}`);

    // Sync to backend DB
    try {
      await updateMerchantListing(id, {
        bagsAvailable: nextRemaining,
        status: nextRemaining === 0 ? 'SOLD_OUT' : 'ACTIVE',
      });
    } catch (err) {
      console.error('Failed to sync stock update:', err);
    }
  };

  const togglePause = async (id) => {
    const current = listings.find((l) => l.id === id);
    if (!current) return;
    const nextPaused = !current.isPaused;

    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPaused: nextPaused } : item))
    );

    showToast(nextPaused ? `Paused "${current.title}"` : `Resumed "${current.title}" on discovery feed`);

    try {
      await updateMerchantListing(id, {
        status: nextPaused ? 'PAUSED' : 'ACTIVE',
      });
    } catch (err) {
      console.error('Failed to pause/resume listing:', err);
    }
  };

  const relistItem = (item) => {
    showToast(`Relisted "${item.title}" for tomorrow!`);
  };

  const filteredListings = listings.filter((item) => {
    if (activeFilter === 'active') return true; // Show all items in main management feed; sold out ones appear in black & white
    if (activeFilter === 'sold-out') return item.remainingCount <= 0 || item.status === 'sold-out';
    if (activeFilter === 'scheduled') return false;
    return true;
  });

  const activeCount = listings.filter((l) => l.remainingCount > 0 && l.status !== 'sold-out').length;
  const soldOutCount = listings.filter((l) => l.remainingCount <= 0 || l.status === 'sold-out').length;

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

      {/* Top Section Header: Surplus Bags + Add Bag Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold text-[#1C1C1E] tracking-tight">Surplus Bags</h1>
          <p className="text-xs text-stone-500">Manage today's inventory & rescue revenue</p>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Bag</span>
        </button>
      </div>

      {/* Hero Rescue Impact Banner */}
      <div className="bg-[#EAF7ED] border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1b5e20] text-white flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block">
              TODAY'S RESCUE IMPACT
            </span>
            <div className="font-extrabold text-sm text-[#1C1C1E] tracking-tight">
              24 Bags Rescued • $98.76
            </div>
          </div>
        </div>

        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#2E7D32]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+18%</span>
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
        <button
          onClick={() => setActiveFilter('active')}
          className={`px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
            activeFilter === 'active'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
          }`}
        >
          All Items ({listings.length})
        </button>

        <button
          onClick={() => setActiveFilter('scheduled')}
          className={`px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
            activeFilter === 'scheduled'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
          }`}
        >
          Scheduled 1
        </button>

        <button
          onClick={() => setActiveFilter('sold-out')}
          className={`px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
            activeFilter === 'sold-out'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
          }`}
        >
          Sold Out ({soldOutCount})
        </button>

        <button
          onClick={() => setActiveFilter('past')}
          className={`px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
            activeFilter === 'past'
              ? 'bg-[#1b5e20] text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
          }`}
        >
          Past
        </button>
      </div>

      {/* Listings List */}
      <div className="space-y-4">
        {filteredListings.map((item, idx) => {
          const isSoldOut = item.remainingCount <= 0 || item.status === 'sold-out';
          return (
            <div
              key={item.id}
              style={{ animationDelay: `${idx * 80}ms` }}
              className={`bg-white rounded-3xl border overflow-hidden interactive-card group shadow-2xs transition-all duration-300 ${
                isSoldOut
                  ? 'border-stone-300/80 bg-stone-50/60'
                  : 'border-stone-200/80 hover:border-emerald-300/80'
              }`}
            >
              {/* Banner Image with Overlays */}
              <div className={`relative h-44 sm:h-52 w-full overflow-hidden bg-stone-100 transition-all duration-300 ${isSoldOut ? 'grayscale contrast-75' : ''}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Status badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {!isSoldOut ? (
                    <span className="px-2.5 py-1 rounded-full bg-[#1b5e20] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{item.liveTag}</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-stone-900/90 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                      <span className="w-2 h-2 rounded-full bg-stone-400" />
                      <span>Sold Out • Edit to Restock</span>
                    </span>
                  )}
                </div>

                {item.stockTag && !isSoldOut && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white text-xs font-bold shadow-xs flex items-center gap-1">
                      🔥 {item.stockTag}
                    </span>
                  </div>
                )}

                {/* Floating Bottom Details on Image */}
                <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white drop-shadow-md">
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg leading-tight text-white">{item.title}</h3>
                    <p className="text-xs text-white/90 font-medium">{item.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-xl text-white block leading-tight">{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-white/80 line-through">{item.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Inner Content */}
              <div className="p-4 sm:p-5 space-y-3">
                {/* Stock remaining meter */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1 text-stone-700">
                      <Package className="w-3.5 h-3.5 text-stone-500" />
                      <span>Stock: {item.soldCount} Sold</span>
                    </div>
                    <span className={isSoldOut ? 'text-stone-500 font-bold' : (item.remainingCount <= 2 ? 'text-[#D96B1C] font-bold' : 'text-stone-600')}>
                      {isSoldOut ? '0 remaining (Sold Out)' : `${item.remainingCount} of ${item.totalCount} remaining`}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isSoldOut ? 'bg-stone-300' : (item.remainingCount <= 2 ? 'bg-[#FF8A3D]' : 'bg-[#2E7D32]')
                      }`}
                      style={{ width: isSoldOut ? '100%' : `${(item.soldCount / item.totalCount) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Row: Earned & Pickup Window */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isSoldOut ? 'bg-stone-200 text-stone-600' : 'bg-emerald-100 text-[#2E7D32]'}`}>
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block font-medium">Earned</span>
                      <span className="font-extrabold text-xs text-[#1C1C1E]">{item.earned}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isSoldOut ? 'bg-stone-200 text-stone-600' : 'bg-orange-100 text-[#D96B1C]'}`}>
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block font-medium">Pickup Today</span>
                      <span className="font-bold text-xs text-[#1C1C1E]">{item.pickupWindow}</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Stepper Row - ALWAYS ACCESSIBLE */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  {/* Stepper with + to restock */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateRemaining(item.id, -1)}
                      disabled={item.remainingCount <= 0}
                      className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                      title="Decrease stock"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className={`font-extrabold text-sm w-5 text-center ${isSoldOut ? 'text-stone-400 font-mono' : 'text-[#1C1C1E]'}`}>
                      {item.remainingCount}
                    </span>
                    <button
                      onClick={() => updateRemaining(item.id, 1)}
                      className="w-8 h-8 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-[#2E7D32] flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                      title="Increase stock / Restock"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>

                  {/* Pause, Edit, Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => togglePause(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                        item.isPaused
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isPaused ? 'bg-amber-600' : 'bg-[#2E7D32]'}`} />
                      <span>{item.isPaused ? 'Paused' : 'Pause'}</span>
                    </button>

                    <button
                      onClick={() => onEditListing && onEditListing(item)}
                      className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit bag details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={async () => {
                        const confirmDelete = window.confirm(`Are you sure you want to remove "${item.title}"?`);
                        if (!confirmDelete) return;
                        try {
                          await deleteMerchantListing(item.id);
                          setListings((prev) => prev.filter((l) => l.id !== item.id));
                          showToast(`Removed "${item.title}"`);
                        } catch (err) {
                          showToast(`Failed to delete listing: ${err.message}`);
                        }
                      }}
                      className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-stone-200 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete bag"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
