import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  QrCode,
  ShoppingBag,
  Sparkles,
  User,
  X,
  CheckCheck,
  PlusCircle
} from 'lucide-react';
import {
  getNotifications,
  getMerchantOrders,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  createRealOrder
} from '../../services/api';
import { socket } from '../../services/socket';

export default function OrderNotificationMenu({ onNavigateToOrders, onOpenVerify, showToast, hasPendingPickups = true, onNewOrder, refreshTrigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNewAlert, setHasNewAlert] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Load orders & notifications from server
  const loadOrderNotifications = async () => {
    try {
      setIsLoading(true);
      const [notifsData, ordersData] = await Promise.all([
        getNotifications(),
        getMerchantOrders()
      ]);

      const formatted = [];

      // Add DB orders as primary order notifications
      if (Array.isArray(ordersData) && ordersData.length > 0) {
        ordersData.forEach((order) => {
          formatted.push({
            id: `order-${order.id}`,
            orderId: order.id,
            type: 'ORDER_CONFIRMED',
            customerName: order.user?.name || 'Customer',
            customerAvatar: order.user?.avatarUrl || null,
            itemTitle: order.listing?.title || 'Surplus Surprise Bag',
            orderNumber: order.orderNumber || `#FS-${order.id.slice(-5)}`,
            pickupCode: order.pickupCode || 'SAVER-100',
            price: `$${(order.totalPrice || 4.99).toFixed(2)}`,
            quantity: order.quantity || 1,
            status: order.status || 'PENDING',
            time: order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
            timestamp: order.createdAt ? new Date(order.createdAt).getTime() : Date.now(),
            isRead: order.status === 'COMPLETED',
          });
        });
      }

      // Add any additional notifications not already in orders
      if (Array.isArray(notifsData) && notifsData.length > 0) {
        notifsData.forEach((notif) => {
          const alreadyExists = formatted.some((f) => f.orderId === notif.orderId);
          if (!alreadyExists && notif.type === 'ORDER_CONFIRMED') {
            formatted.push({
              id: notif.id,
              orderId: notif.orderId,
              type: notif.type,
              customerName: notif.message?.split(' just claimed')[0] || 'Customer',
              customerAvatar: null,
              itemTitle: notif.message?.split('1x ')[1]?.split(' (')[0] || notif.title,
              orderNumber: `#FS-${notif.id.slice(-5)}`,
              pickupCode: notif.message?.includes('(') ? notif.message.split('(')[1].replace(')', '') : 'SAVER-789',
              price: '$4.99',
              quantity: 1,
              status: 'PENDING',
              time: notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today',
              timestamp: notif.createdAt ? new Date(notif.createdAt).getTime() : Date.now(),
              isRead: notif.isRead || false,
            });
          }
        });
      }

      // Sort: Pending orders first, then newest first
      formatted.sort((a, b) => {
        const aPending = a.status !== 'COMPLETED';
        const bPending = b.status !== 'COMPLETED';
        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;
        return b.timestamp - a.timestamp;
      });

      setNotifications(formatted);
      const unread = formatted.filter((item) => !item.isRead && item.status !== 'COMPLETED').length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error loading order notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch whenever menu is opened or trigger updates
  useEffect(() => {
    if (isOpen) {
      loadOrderNotifications();
    }
  }, [isOpen, refreshTrigger]);

  useEffect(() => {
    loadOrderNotifications();

    // Listen to real-time ORDER_CREATED socket broadcast
    const handleNewOrder = (data) => {
      console.log('⚡ [Merchant Notification] New Order Received:', data);
      
      const newOrder = data.order || data;
      const listing = data.listing || {};
      const newNotification = {
        id: `live-${Date.now()}`,
        orderId: newOrder.id,
        type: 'ORDER_CONFIRMED',
        customerName: newOrder.user?.name || data.customerName || 'Customer',
        customerAvatar: newOrder.user?.avatarUrl || null,
        itemTitle: listing.title || newOrder.itemTitle || 'Surplus Food Bag',
        orderNumber: newOrder.orderNumber || `#FS-${Math.floor(10000 + Math.random() * 90000)}`,
        pickupCode: newOrder.pickupCode || data.pickupCode || 'SAVER-888',
        price: `$${(newOrder.totalPrice || listing.price || 4.99).toFixed(2)}`,
        quantity: newOrder.quantity || 1,
        status: 'PENDING',
        time: 'Just now',
        timestamp: Date.now(),
        isRead: false,
        isNewLive: true,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setHasNewAlert(true);
      if (onNewOrder) {
        onNewOrder();
      }

      if (showToast) {
        showToast(`🔔 New Order! ${newNotification.customerName} claimed ${newNotification.itemTitle} (${newNotification.pickupCode})`);
      }
    };

    // Listen to real-time PICKUP_VERIFIED socket broadcast
    const handlePickupVerified = (data) => {
      console.log('⚡ [Merchant Notification] Pickup Verified:', data);
      const inDigits = String(data?.orderNumber || data?.pickupCode || data?.verifiedCode || '').replace(/\D/g, '');

      setNotifications((prev) =>
        prev.map((item) => {
          const itemDigits = String(item.orderNumber || item.pickupCode || '').replace(/\D/g, '');
          const isMatch =
            (data?.orderId && item.orderId === data.orderId) ||
            (data?.pickupCode && (item.pickupCode === data.pickupCode || item.orderNumber === data.pickupCode)) ||
            (data?.orderNumber && item.orderNumber === data.orderNumber) ||
            (inDigits && itemDigits && (inDigits === itemDigits || inDigits.includes(itemDigits) || itemDigits.includes(inDigits)));
          return isMatch ? { ...item, status: 'COMPLETED', isRead: true } : item;
        })
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const handleNotificationRemoved = (data) => {
      console.log('⚡ [Merchant Notification] Notification Removed:', data);
      setNotifications((prev) =>
        prev.filter((item) => {
          if (data?.orderId && item.orderId === data.orderId) return false;
          if (data?.pickupCode && (item.pickupCode === data.pickupCode || item.orderNumber === data.pickupCode)) return false;
          return true;
        })
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    socket.on('ORDER_CREATED', handleNewOrder);
    socket.on('PICKUP_VERIFIED', handlePickupVerified);
    socket.on('NOTIFICATION_REMOVED', handleNotificationRemoved);

    return () => {
      socket.off('ORDER_CREATED', handleNewOrder);
      socket.off('PICKUP_VERIFIED', handlePickupVerified);
      socket.off('NOTIFICATION_REMOVED', handleNotificationRemoved);
    };
  }, [onNewOrder]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      // non-fatal
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    setHasNewAlert(false);
  };

  const handleSelectOrder = (item) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setIsOpen(false);

    if (onNavigateToOrders) {
      onNavigateToOrders();
    }
  };

  const handleVerifyCode = (code, e) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onOpenVerify) {
      onOpenVerify(code);
    }
  };

  // Create a real customer order in the backend database
  const handleSimulateDemoOrder = async () => {
    const demoCustomers = [
      { name: 'Sophea Chan', email: 'sophea.chan@demo.foodlink', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
      { name: 'Kosal Meng', email: 'kosal.meng@demo.foodlink', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
      { name: 'Chanda Vicheka', email: 'chanda.vicheka@demo.foodlink', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
    ];
    const picked = demoCustomers[Math.floor(Math.random() * demoCustomers.length)];
    try {
      const res = await createRealOrder({
        customerName: picked.name,
        customerEmail: picked.email,
        avatarUrl: picked.avatar,
        storeId: 'st_cad',
        listingId: 'list_01',
        quantity: 1,
      });

      if (res?.order) {
        if (showToast) {
          showToast(`🔔 Real Order Placed! ${picked.name} (Pickup Code: ${res.order.pickupCode})`);
        }
        await loadOrderNotifications();
      }
    } catch (err) {
      console.warn('Real order creation error:', err.message);
    }
  };

  const pendingOrders = notifications.filter((n) => n.status !== 'COMPLETED');
  const completedOrders = notifications.filter((n) => n.status === 'COMPLETED');
  const hasPending = pendingOrders.length > 0;

  const filteredList = notifications.filter((n) => {
    if (activeFilter === 'pending') return n.status !== 'COMPLETED';
    if (activeFilter === 'completed') return n.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="relative" ref={menuRef}>
      
      {/* 1. Header Trigger Pill Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        aria-label="View customer order notifications"
        className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer ${
          isOpen
            ? 'bg-[#2E7D32] text-white ring-2 ring-[#2E7D32]/30 shadow-sm'
            : hasPending
            ? 'bg-emerald-50 text-[#2E7D32] border border-emerald-300 hover:bg-emerald-100/80'
            : 'bg-white text-stone-700 border border-stone-200/90 hover:bg-stone-50'
        }`}
      >
        {/* Bell Icon with Real-Time Ping */}
        <div className="relative">
          <Bell className={`w-4 h-4 ${isOpen ? 'text-white' : 'text-[#2E7D32]'}`} />
          {hasPending && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8A3D] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF8A3D] ring-2 ring-white shadow-xs" />
            </span>
          )}
        </div>

        <span>Orders</span>
      </button>

      {/* 2. Order Notifications Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          
          {/* Popover Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-50/60 via-stone-50 to-white border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100/80 flex items-center justify-center text-[#2E7D32]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-[#1C1C1E]">Customer Orders</h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-[#2E7D32] text-[9px] font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  {pendingOrders.length > 0
                    ? `${pendingOrders.length} order${pendingOrders.length > 1 ? 's' : ''} awaiting pickup`
                    : 'All pickups completed'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="p-1.5 text-stone-400 hover:text-[#2E7D32] rounded-lg transition-colors cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-stone-100 bg-stone-50/60">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#2E7D32] text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-[#2E7D32] text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              Awaiting ({pendingOrders.length})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                activeFilter === 'completed'
                  ? 'bg-[#2E7D32] text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              Picked Up ({completedOrders.length})
            </button>
          </div>

          {/* Orders Feed */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100 scrollbar-thin">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-stone-400 font-medium">
                Loading live customer orders...
              </div>
            ) : filteredList.length === 0 ? (
              <div className="py-10 px-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="font-bold text-xs text-stone-700">
                  {activeFilter === 'pending' ? 'No Pending Pickups' : 'No Orders Found'}
                </p>
                <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
                  {activeFilter === 'pending'
                    ? 'All customer orders have been verified and picked up!'
                    : 'When a customer reserves surplus food from CAD Bakery, their order and pickup code appear here instantly.'}
                </p>
              </div>
            ) : (
              filteredList.map((item) => {
                const isCompleted = item.status === 'COMPLETED';
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectOrder(item)}
                    className={`p-3.5 hover:bg-stone-50 transition-colors cursor-pointer flex items-start gap-3 relative ${
                      !item.isRead && !isCompleted ? 'bg-emerald-50/30' : isCompleted ? 'opacity-85' : ''
                    }`}
                  >
                    {/* Unread indicator bar */}
                    {!item.isRead && !isCompleted && (
                      <span className="absolute left-1 top-4 bottom-4 w-1 bg-[#2E7D32] rounded-full" />
                    )}

                    {/* Customer Avatar */}
                    <div className={`w-9 h-9 rounded-full border overflow-hidden flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isCompleted ? 'bg-stone-100 border-stone-200 text-stone-600' : 'bg-emerald-100 border-emerald-200/80 text-[#2E7D32]'
                    }`}>
                      {item.customerAvatar ? (
                        <img src={item.customerAvatar} alt={item.customerName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{item.customerName.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="font-bold text-xs text-stone-900 truncate">
                            {item.customerName}
                          </h4>
                          {isCompleted && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                              Picked Up
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400 whitespace-nowrap">
                          {item.time}
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-600 font-medium truncate">
                        {item.quantity}x {item.itemTitle}
                      </p>

                      {/* Order Code & Price Pill */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-mono font-bold">
                            {item.pickupCode}
                          </span>
                          <span className="text-[11px] font-bold text-[#2E7D32]">
                            {item.price}
                          </span>
                        </div>

                        {/* Quick Verify button or Completed badge */}
                        {isCompleted ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#2E7D32] text-[10px] font-bold shadow-2xs flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Picked Up</span>
                          </span>
                        ) : (
                          <button
                            onClick={(e) => handleVerifyCode(item.pickupCode, e)}
                            className="px-2.5 py-1 rounded-full bg-[#2E7D32] hover:bg-[#256629] text-white text-[10px] font-bold shadow-2xs flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                          >
                            <QrCode className="w-3 h-3" />
                            <span>Verify</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Popover Footer: Quick Actions */}
          <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              onClick={handleSimulateDemoOrder}
              className="text-[11px] font-bold text-[#FF8A3D] hover:text-[#d96e23] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Simulate Order</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                if (onNavigateToOrders) onNavigateToOrders();
              }}
              className="text-[11px] font-extrabold text-[#2E7D32] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All in Orders</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
