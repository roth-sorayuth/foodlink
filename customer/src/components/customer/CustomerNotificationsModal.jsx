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
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'listings'

  if (!isOpen) return null;

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'unread') return !item.isRead;
    if (activeTab === 'listings') return item.type === 'NEW_LISTING';
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
    if (item.listing && onSelectListing) {
      onSelectListing(item.listing);
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
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 font-medium">
                  Real-time surplus food alerts & order passes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && onMarkAllAsRead && (
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
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'listings'
                  ? 'bg-[#2E7D32] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Surplus Drops
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
              const isListing = item.type === 'NEW_LISTING';
              const listing = item.listing;
              const photo = listing?.photoUrl || listing?.image;
              const price = typeof listing?.price === 'number' ? `$${listing.price.toFixed(2)}` : listing?.price;
              const origPrice = typeof listing?.originalPrice === 'number' ? `$${listing.originalPrice.toFixed(2)}` : listing?.originalPrice;

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
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs">
                          <OptimizedImage
                            src={photo}
                            alt=""
                            width={88}
                            height={88}
                            quality={70}
                            className="w-full h-full object-cover"
                            containerClassName="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isListing ? 'bg-emerald-100 text-[#2E7D32]' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {isListing ? <Sparkles className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                        </div>
                      )}
                      {!item.isRead && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>

                    {/* Notification Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                          {isListing ? (
                            <>
                              <Sparkles className="w-3 h-3 text-[#2E7D32]" />
                              <span>JUST LISTED SURPLUS</span>
                            </>
                          ) : (
                            <span>ORDER UPDATE</span>
                          )}
                        </span>
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
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-black text-xs text-stone-900">{price || '$4.99'}</span>
                            {origPrice && (
                              <span className="text-[10px] text-stone-400 line-through">{origPrice}</span>
                            )}
                            {listing.discount && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-orange-100 text-[#D96B1C]">
                                {listing.discount}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(item);
                            }}
                            className="px-3 py-1 rounded-lg bg-[#2E7D32] hover:bg-[#256629] text-white text-[11px] font-extrabold flex items-center gap-1 shadow-2xs transition-transform active:scale-95 cursor-pointer shrink-0"
                          >
                            <span>View Bag</span>
                            <ChevronRight className="w-3 h-3" />
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
