import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  X,
  CheckCheck,
  ChevronRight,
  Clock,
  Store,
  ExternalLink,
  ShieldCheck,
  Filter
} from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';

export default function CustomerNotificationsModal({
  isOpen,
  onClose,
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectListing,
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'

  if (!isOpen) return null;

  // Strictly filter out any order updates, claims, or pickup confirmations
  const customerFoodNotifications = (notifications || []).filter((item) => {
    if (!item) return false;
    // Exclude any order updates, pickup confirmations, or merchant order claims
    if (item.type && item.type !== 'NEW_LISTING') return false;
    const title = (item.title || '').toLowerCase();
    const msg = (item.message || '').toLowerCase();
    if (title.includes('order') || title.includes('pickup') || title.includes('claim')) return false;
    if (msg.includes('claimed') || msg.includes('verified') || msg.includes('code:')) return false;
    return true;
  });

  // Deduplicate notifications so there is strictly ONE card per food product & sort by quantity descending
  const deduplicatedNotifications = (() => {
    const seenListingIds = new Set();
    const result = [];
    for (const item of customerFoodNotifications) {
      const listingId = item.listingId || item.listing?.id;
      if (listingId) {
        if (seenListingIds.has(listingId)) continue;
        seenListingIds.add(listingId);
      }
      result.push(item);
    }
    return result.sort((a, b) => {
      const getBags = (notif) => {
        if (notif.listing?.bagsAvailable !== undefined && notif.listing?.bagsAvailable !== null) return Number(notif.listing.bagsAvailable);
        if (notif.listing?.remaining !== undefined && notif.listing?.remaining !== null) return Number(notif.listing.remaining);
        const match = notif.message?.match(/\((\d+)\s*(?:bags|available)/i) || notif.message?.match(/Only\s*(\d+)\s*left/i);
        return match ? parseInt(match[1], 10) : 0;
      };
      return getBags(b) - getBags(a);
    });
  })();

  const unreadCountComputed = deduplicatedNotifications.filter((n) => !n.isRead).length;

  // Filter notifications based on tab
  const filteredNotifications = deduplicatedNotifications.filter((item) => {
    if (activeTab === 'unread') return !item.isRead;
    return true;
  });

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 45) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const handleNotificationClick = (item) => {
    if (!item.isRead && onMarkAsRead) {
      onMarkAsRead(item.id);
    }
    const targetListing = item.listing;

    if (targetListing && onSelectListing) {
      onSelectListing(targetListing);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer / Modal Container */}
      <aside
        aria-label="Customer Notifications Center"
        className="relative z-10 w-full sm:max-w-md max-h-[92vh] sm:max-h-[85vh] bg-white rounded-b-3xl sm:rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden animate-in slide-in-from-top-6 sm:slide-in-from-right-6 duration-250"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center shadow-xs">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-black text-base sm:text-lg text-stone-900 tracking-tight">
                    Notifications
                  </h2>
                  {unreadCountComputed > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                      New
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 font-medium">
                  Real-time surplus food alerts & drops
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCountComputed > 0 && onMarkAllAsRead && (
                <button
                  onClick={onMarkAllAsRead}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-200/60">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              All ({deduplicatedNotifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Unread ({unreadCountComputed})
            </button>
          </div>
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2 sm:p-3 space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-stone-800">No notifications found</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                  {activeTab === 'unread'
                    ? "You're all caught up! No unread surplus alerts."
                    : 'When bakeries and restaurants list surprise surplus bags, you will be notified instantly here.'}
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const listing = item.listing;
              if (!listing) return null;

              const isRestock = Boolean(item.title?.includes('Restock') || item.message?.includes('restocked'));
              const photo = listing.photoUrl || listing.image;
              const priceNum = typeof listing.price === 'number' ? listing.price : parseFloat(listing.price) || 0;
              const price = `$${priceNum.toFixed(2)}`;
              const origPrice = listing.originalPrice ? (typeof listing.originalPrice === 'number' ? `$${listing.originalPrice.toFixed(2)}` : listing.originalPrice) : null;

              const bagsCount = listing.bagsAvailable !== undefined
                ? Number(listing.bagsAvailable)
                : (listing.remaining !== undefined ? Number(listing.remaining) : 0);

              const isItemSoldOut = bagsCount <= 0 || listing.status === 'SOLD_OUT';
              const stockBadgeText = isItemSoldOut ? 'Sold Out' : (bagsCount <= 2 ? `Only ${bagsCount} left` : `${bagsCount} left`);

              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 rounded-2xl transition-all duration-200 cursor-pointer border ${
                    !item.isRead
                      ? 'bg-emerald-50/60 border-emerald-200/80 hover:bg-emerald-50'
                      : 'bg-white border-stone-100 hover:bg-stone-50/80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon or Store Logo */}
                    <div className="relative shrink-0">
                      {photo ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs">
                          <OptimizedImage
                            src={photo}
                            alt=""
                            width={96}
                            height={96}
                            quality={70}
                            className="w-full h-full object-cover"
                            containerClassName="w-full h-full"
                          />
                          {bagsCount !== null && bagsCount > 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-stone-900/80 text-white text-[8px] font-black text-center py-0.5 leading-none">
                              {bagsCount} left
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isRestock ? 'bg-orange-100 text-[#D96B1C]' : 'bg-emerald-100 text-[#2E7D32]'
                        }`}>
                          <Sparkles className="w-5 h-5" />
                        </div>
                      )}
                      {!item.isRead && (
                        <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${isRestock ? 'bg-orange-500' : 'bg-emerald-500'} ring-2 ring-white`} />
                      )}
                    </div>

                    {/* Notification Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                            isRestock ? 'text-orange-700' : 'text-emerald-800'
                          }`}>
                            <Sparkles className={`w-3 h-3 ${isRestock ? 'fill-[#D96B1C] text-[#D96B1C]' : 'text-[#2E7D32]'}`} />
                            <span>{isRestock ? 'SURPLUS RESTOCKED' : 'JUST LISTED SURPLUS'}</span>
                          </span>

                          {/* Orange stock pill badge matching user's request */}
                          {listing && stockBadgeText && (
                            <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold shadow-xs flex items-center gap-0.5">
                              🔥 {stockBadgeText}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-bold text-stone-400 shrink-0">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 mt-0.5 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                      {/* Embedded Preview Card if listing is present */}
                      {listing && (
                        <div className="mt-2.5 p-2 rounded-xl bg-white/90 border border-stone-200/80 flex items-center justify-between gap-2 shadow-2xs">
                          <div className="flex items-center gap-2 min-w-0 flex-wrap">
                            <span className="font-black text-xs text-stone-900">{price || '$4.99'}</span>
                            {origPrice && (
                              <span className="text-[10px] text-stone-400 line-through">{origPrice}</span>
                            )}
                            {listing.discount && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-orange-100 text-[#D96B1C]">
                                {listing.discount}
                              </span>
                            )}
                            {stockBadgeText && (
                              <span className={`px-2 py-0.5 rounded-full ${
                                isItemSoldOut ? 'bg-stone-800 text-stone-300' : 'bg-orange-500 text-white'
                              } text-[10px] font-bold shadow-xs flex items-center gap-0.5`}>
                                {isItemSoldOut ? 'Sold Out' : `🔥 ${stockBadgeText}`}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isItemSoldOut) handleNotificationClick(item);
                            }}
                            disabled={isItemSoldOut}
                            className={`px-3 py-1 rounded-lg ${
                              isItemSoldOut
                                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                                : 'bg-[#2E7D32] hover:bg-[#256629] text-white shadow-2xs transition-transform active:scale-95 cursor-pointer'
                            } text-[11px] font-extrabold flex items-center gap-1 shrink-0`}
                          >
                            <span>{isItemSoldOut ? 'Sold Out' : 'View Bag'}</span>
                            {!isItemSoldOut && <ChevronRight className="w-3 h-3" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-100 text-center">
          <p className="text-[11px] text-stone-400 font-medium">
            FoodLink Realtime • Instant Surplus Food Dispatch
          </p>
        </div>
      </aside>
    </div>
  );
}
