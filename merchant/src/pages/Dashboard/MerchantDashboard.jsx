import React, { useState, useEffect } from 'react';
import {
  Store,
  ChevronDown,
  User,
  Clock,
  X,
  Leaf,
  Package,
  TrendingUp,
  DollarSign,
  Plus,
  QrCode,
  Edit2,
  CheckCircle2,
  ArrowUpRight,
  Flame,
  LayoutGrid,
  ClipboardList,
  BarChart3,
  Check,
  Search,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Bell
} from 'lucide-react';
import {
  getMerchantListings,
  updateMerchantListing,
  verifyOrderPickup,
  notifyCustomerNewListing,
  DEFAULT_MERCHANT_LISTINGS
} from '../../services/api';
import { socket } from '../../services/socket';

export default function MerchantDashboard({ onNavigateToProfile, onOpenCreate, onOpenVerify, onEditListing, newListing, onNavigateToListings }) {
  // Store Operational State
  const [isOpen, setIsOpen] = useState(true);
  const [acceptingRescues, setAcceptingRescues] = useState(true);
  const [activeBottomTab, setActiveBottomTab] = useState('dashboard');
  
  // Real-time Order Alert State
  const [newOrderAlert, setNewOrderAlert] = useState(null);

  // Modals & Feedback
  const [toastMessage, setToastMessage] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [claimCodeInput, setClaimCodeInput] = useState('');
  const [editModalItem, setEditModalItem] = useState(null);
  const [editRemainingCount, setEditRemainingCount] = useState(0);
  const [editPrice, setEditPrice] = useState('4.99');
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Helper to normalize DB listing to dashboard card shape
  const normalizeDashboardItem = (item) => {
    const origPriceNum = typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(item.originalPrice) || 16.0;
    const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 4.99;
    const remaining = item.remaining !== undefined
      ? Number(item.remaining)
      : (item.bagsAvailable !== undefined 
          ? Number(item.bagsAvailable) 
          : (item.remainingCount !== undefined ? Number(item.remainingCount) : 0));
    const sold = item.bagsSold !== undefined 
      ? Number(item.bagsSold) 
      : (item.soldCount !== undefined ? Number(item.soldCount) : 0);
    const total = remaining + sold;
    const claimedPercent = total > 0 ? Math.round((sold / total) * 100) : 100;
    const isSoldOut = remaining <= 0;

    return {
      id: item.id,
      title: item.title,
      description: item.description || "Assortment of today's fresh surplus food items.",
      image: item.photoUrl || item.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
      status: isSoldOut ? 'Sold Out' : (item.status === 'PAUSED' ? 'Paused' : 'Active'),
      isSoldOut,
      remainingCount: remaining,
      tagText: isSoldOut ? 'Sold Out' : (remaining <= 2 ? `${remaining} left!` : `${remaining} left`),
      tagColor: isSoldOut ? 'bg-stone-900 text-stone-300' : (remaining <= 2 ? 'bg-amber-500 text-white' : 'bg-stone-800 text-white'),
      pickupWindow: `Pickup ${item.pickupStart || '6:30 PM'} - ${item.pickupEnd || '7:30 PM'}`,
      price: `$${priceNum.toFixed(2)}`,
      originalValue: `$${origPriceNum.toFixed(2)} value`,
      soldCount: sold,
      totalCount: total,
      claimedPercent,
      progressColor: isSoldOut ? 'bg-stone-300' : (claimedPercent >= 75 ? 'bg-amber-500' : 'bg-[#2E7D32]'),
      raw: item,
    };
  };

  const handleOpenEditModal = (item) => {
    setEditModalItem(item);
    setEditRemainingCount(item.remainingCount !== undefined ? item.remainingCount : (item.totalCount - item.soldCount));
    setEditPrice(item.price ? String(item.price).replace(/[^0-9.]/g, '') : '4.99');
  };

  const handleSaveEditModal = async () => {
    if (!editModalItem) return;
    const count = Math.max(0, parseInt(editRemainingCount, 10) || 0);
    const priceVal = parseFloat(String(editPrice).replace(/[^0-9.]/g, '')) || 4.99;
    const isNowSoldOut = count <= 0;

    setListings((prev) =>
      prev.map((item) => {
        if (item.id === editModalItem.id) {
          const nextTotal = (item.soldCount || 0) + count;
          const nextClaimed = nextTotal > 0 ? Math.round(((item.soldCount || 0) / nextTotal) * 100) : 100;
          return {
            ...item,
            remainingCount: count,
            totalCount: nextTotal,
            claimedPercent: nextClaimed,
            price: `$${priceVal.toFixed(2)}`,
            status: isNowSoldOut ? 'Sold Out' : 'Active',
            isSoldOut: isNowSoldOut,
            tagText: isNowSoldOut ? 'Sold Out' : (count <= 2 ? `${count} left!` : `${count} left`),
            tagColor: isNowSoldOut ? 'bg-stone-900 text-stone-300' : (count <= 2 ? 'bg-amber-500 text-white' : 'bg-stone-800 text-white'),
            progressColor: isNowSoldOut ? 'bg-stone-300' : (nextClaimed >= 75 ? 'bg-amber-500' : 'bg-[#2E7D32]'),
            raw: {
              ...(item.raw || item),
              bagsAvailable: count,
              price: priceVal,
              status: isNowSoldOut ? 'SOLD_OUT' : 'ACTIVE',
            },
          };
        }
        return item;
      })
    );

    const prevBags = Number(editModalItem.remaining || editModalItem.bagsAvailable || 0);
    const isRestock = count > prevBags;
    showToast(isRestock ? `🔥 Restocked & notified customers (${count} bags)!` : `Updated "${editModalItem.title}" stock to ${count}!`);
    const idToUpdate = editModalItem.id;
    const itemSnapshot = { ...editModalItem };
    setEditModalItem(null);

    try {
      await updateMerchantListing(idToUpdate, {
        bagsAvailable: count,
        price: priceVal,
        status: count > 0 ? 'ACTIVE' : 'SOLD_OUT',
        restocked: isRestock,
      });

      if (isRestock) {
        notifyCustomerNewListing({
          ...itemSnapshot,
          id: idToUpdate,
          title: itemSnapshot.title,
          price: priceVal,
          bagsAvailable: count,
          remaining: count,
          storeName: itemSnapshot.store || 'CAD Bakery',
        }, true);
      }
    } catch (err) {
      console.error('Failed to sync edit listing:', err);
    }
  };

  // Fetch initial listings from database
  const loadDashboardListings = async () => {
    setIsLoading(true);
    try {
      const data = await getMerchantListings();
      if (Array.isArray(data) && data.length > 0) {
        setListings(data.map(normalizeDashboardItem));
      }
    } catch (err) {
      console.error('Failed to load dashboard listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardListings();
  }, []);

  // Prepend or update listing immediately if received via prop
  useEffect(() => {
    if (newListing && newListing.id) {
      setListings((prev) => {
        const exists = prev.some((l) => l.id === newListing.id);
        if (!exists) {
          return [normalizeDashboardItem(newListing.raw || newListing), ...prev];
        }
        return prev.map((l) => (l.id === newListing.id ? normalizeDashboardItem(newListing.raw || newListing) : l));
      });
    }
  }, [newListing]);

  // Real-time listener for incoming orders & newly created listings
  useEffect(() => {
    const handleOrderCreated = (data) => {
      const order = data?.order || data;
      setNewOrderAlert(order);
      showToast(`🔔 New Order! ${order.user?.name || 'Customer'} ordered "${order.listing?.title || 'Surplus Item'}" (${order.pickupCode || ''})`);
    };

    const handleNewListing = (data) => {
      const item = data?.listing || data;
      setListings((prev) => [normalizeDashboardItem(item), ...prev.filter((l) => l.id !== item.id)]);
    };

    const handleListingUpdated = (data) => {
      const item = data?.listing || data;
      if (item && item.id) {
        setListings((prev) => prev.map((l) => (l.id === item.id ? normalizeDashboardItem(item) : l)));
      }
    };

    socket.on('ORDER_CREATED', handleOrderCreated);
    socket.on('NEW_LISTING', handleNewListing);
    socket.on('LISTING_UPDATED', handleListingUpdated);

    return () => {
      socket.off('ORDER_CREATED', handleOrderCreated);
      socket.off('NEW_LISTING', handleNewListing);
      socket.off('LISTING_UPDATED', handleListingUpdated);
    };
  }, []);

  // Listings State - starts empty, filled by API fetch
  const [listings, setListings] = useState([]);

  // Reservations State - starts empty, filled by real orders
  const [reservations, setReservations] = useState([]);

  // Create Listing Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('4.50');
  const [newTotal, setNewTotal] = useState('5');
  const [newPickup, setNewPickup] = useState('6:30 PM - 7:30 PM');

  const handleCreateBag = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBag = {
      id: `lst-${Date.now()}`,
      title: newTitle,
      description: newDesc || "Fresh baker's assortment prepared before end of business.",
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=700&q=80',
      status: 'Active',
      tagText: `${newTotal} left`,
      tagColor: 'bg-emerald-600 text-white',
      pickupWindow: `Pickup ${newPickup}`,
      price: `$${parseFloat(newPrice).toFixed(2)}`,
      originalValue: `$${(parseFloat(newPrice) * 3).toFixed(2)} value`,
      soldCount: 0,
      totalCount: parseInt(newTotal, 10),
      claimedPercent: 0,
      progressColor: 'bg-[#2E7D32]'
    };

    setListings([newBag, ...listings]);
    setCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    showToast(`Created new surplus listing: "${newBag.title}"!`);
  };

  const handleScanClaim = async (e) => {
    e.preventDefault();
    if (!claimCodeInput.trim()) return;

    const code = claimCodeInput.trim().toUpperCase();
    try {
      const result = await verifyOrderPickup(code);
      showToast(`Verified pickup: ${result.order?.orderNumber || code} (${result.order?.user?.name || 'Customer'})!`);
      setScanModalOpen(false);
      setClaimCodeInput('');
      setNewOrderAlert(null);
    } catch (err) {
      showToast(`Verification result: ${err.message}`);
      setScanModalOpen(false);
      setClaimCodeInput('');
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Real-time Incoming Order Alert Banner */}
      {newOrderAlert && (
        <div className="bg-[#EAF7ED] border-2 border-emerald-500 rounded-2xl p-4 flex items-start sm:items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#1C1C1E]">
                  New Customer Order Placed!
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                <span className="font-bold text-stone-900">{newOrderAlert.user?.name || 'Customer'}</span> reserved 1x{' '}
                <span className="font-semibold text-stone-800">{newOrderAlert.listing?.title || 'Surplus Item'}</span> • Pickup Code:{' '}
                <span className="font-mono font-black text-[#2E7D32] bg-white px-1.5 py-0.5 rounded border border-emerald-300">
                  {newOrderAlert.pickupCode}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (onOpenVerify) onOpenVerify();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Confirm Now
            </button>
            <button
              onClick={() => setNewOrderAlert(null)}
              className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ACCEPTING RESCUES TODAY CARD                         */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/90 overflow-hidden flex items-center justify-center shrink-0 p-0.5 shadow-2xs">
              <img src="/cad-bakery-logo.png" alt="CAD Bakery Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-[#1C1C1E]">CAD Bakery • Accepting Rescues</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs text-stone-500">Live on FoodLink customer discovery feed</p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => {
              setAcceptingRescues(!acceptingRescues);
              showToast(acceptingRescues ? 'Paused listings on discovery feed' : 'Resumed listings on discovery feed');
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              acceptingRescues ? 'bg-[#1b5e20]' : 'bg-stone-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                acceptingRescues ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* ======================================================== */}
        {/* 5. DAILY HIGHLIGHTS (3 Stat Cards)                      */}
        {/* ======================================================== */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-bold text-base text-[#1C1C1E]">Daily Highlights</h2>
            <span className="text-xs text-stone-400">Updated 2m ago</span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            
            {/* Card 1: Bags Listed */}
            <div className="group bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-3 sm:p-4 shadow-2xs hover:shadow-md hover:-translate-y-1 hover:border-[#2E7D32]/40 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between space-y-2 sm:space-y-2.5">
              <div className="flex items-start justify-between gap-1">
                <span className="text-[11px] sm:text-xs font-semibold text-stone-600 leading-tight">Bags Listed</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#EAF7ED] border border-emerald-200/60 text-[#2E7D32] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-lg font-black text-[#1C1C1E] group-hover:text-[#2E7D32] tracking-tight transition-colors duration-200">18</span>
                  <span className="text-[10px] sm:text-xs text-stone-500 font-medium">total</span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-[#EAF7ED] text-[#2E7D32] group-hover:bg-emerald-100 transition-colors">
                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> +4 vs yesterday
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Bags Sold */}
            <div className="group bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-3 sm:p-4 shadow-2xs hover:shadow-md hover:-translate-y-1 hover:border-orange-300 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between space-y-2 sm:space-y-2.5">
              <div className="flex items-start justify-between gap-1">
                <span className="text-[11px] sm:text-xs font-semibold text-stone-600 leading-tight">Bags Sold</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FFF3E8] border border-orange-200/60 text-[#FF8A3D] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-lg font-black text-[#1C1C1E] group-hover:text-[#FF8A3D] tracking-tight transition-colors duration-200">14</span>
                  <span className="text-[10px] sm:text-xs text-stone-500 font-medium">reserved</span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-[#FFF1E6] text-[#D96B1C] group-hover:bg-orange-100 transition-colors">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> 78% sold out
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Today's Revenue */}
            <div className="group bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-3 sm:p-4 shadow-2xs hover:shadow-md hover:-translate-y-1 hover:border-[#2E7D32]/40 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between space-y-2 sm:space-y-2.5">
              <div className="flex items-start justify-between gap-1">
                <span className="text-[11px] sm:text-xs font-semibold text-stone-600 leading-tight">Today's Revenue</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#EAF7ED] border border-emerald-200/60 text-[#2E7D32] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-lg font-black text-[#1C1C1E] group-hover:text-[#2E7D32] tracking-tight transition-colors duration-200">$69.86</span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-stone-100 text-stone-600 group-hover:bg-stone-200/80 transition-colors">
                    <span>⌛</span> $14.20 pending
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* 6. PRIMARY CALL-TO-ACTION BUTTONS                       */}
        {/* ======================================================== */}
        <div className="space-y-2.5 pt-1">
          {/* Create New Bag button */}
          <button
            onClick={() => {
              if (onOpenCreate) onOpenCreate();
              else setCreateModalOpen(true);
            }}
            className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New Bag</span>
          </button>

          {/* Scan Pickup Code button */}
          <button
            onClick={() => {
              if (onOpenVerify) onOpenVerify();
              else setScanModalOpen(true);
            }}
            className="w-full py-3 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm flex items-center justify-center gap-2 border border-stone-200/80 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-stone-600" />
            <span>Scan Pickup Code</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 7. TODAY'S ACTIVE LISTINGS                              */}
        {/* ======================================================== */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-[#1C1C1E]">Today's Active Listings</h2>
              <span className="px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700 text-xs font-semibold">
                {listings.length} live
              </span>
            </div>
            <button 
              onClick={() => {
                if (onNavigateToListings) onNavigateToListings();
                else if (onOpenCreate) onOpenCreate();
              }}
              className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All ({listings.length})</span>
              <span className="text-sm">›</span>
            </button>
          </div>

          {/* Listing Cards */}
          <div className="space-y-3.5">
            {listings.map((item, idx) => (
              <div 
                key={item.id}
                style={{ animationDelay: `${idx * 80}ms` }}
                className={`bg-white rounded-3xl border overflow-hidden interactive-card group shadow-2xs transition-all duration-300 cursor-pointer ${
                  item.isSoldOut
                    ? 'border-stone-300/80 bg-stone-50/60'
                    : 'border-stone-200/80 hover:border-emerald-300/80'
                }`}
              >
                {/* Image Banner */}
                <div className={`relative h-44 sm:h-52 w-full overflow-hidden bg-stone-100 transition-all duration-300 ${item.isSoldOut ? 'grayscale contrast-75' : ''}`}>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {!item.isSoldOut ? (
                      <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#2E7D32] text-xs font-bold shadow-xs flex items-center gap-1.5 backdrop-blur-xs group-hover:scale-105 transition-transform">
                        <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-stone-900/90 text-stone-200 text-xs font-bold shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                        <span className="w-2 h-2 rounded-full bg-stone-400" />
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-xs flex items-center gap-1 ${item.tagColor}`}>
                      {item.tagText}
                    </span>
                  </div>

                  {/* Edit Pencil Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEditListing) {
                        onEditListing(item);
                      } else {
                        handleOpenEditModal(item);
                      }
                    }}
                    className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white text-stone-800 shadow-md flex items-center justify-center hover:bg-stone-50 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4 text-stone-700" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-[#1C1C1E]">{item.title}</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.description}</p>
                  </div>

                  {/* Pickup Window & Pricing */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>{item.pickupWindow}</span>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-[#2E7D32]">{item.price}</span>
                      <span className="text-xs text-stone-400 line-through">{item.originalValue}</span>
                    </div>
                  </div>

                  {/* Progress Claim Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-700">{item.soldCount} sold <span className="text-stone-400 font-normal">/ {item.totalCount} total</span></span>
                      <span className={item.claimedPercent >= 80 ? 'text-[#D96B1C]' : 'text-[#2E7D32]'}>
                        {item.claimedPercent}% claimed
                      </span>
                    </div>

                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.progressColor} transition-all duration-500`}
                        style={{ width: `${item.claimedPercent}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 8. RECENT RESERVATIONS                                  */}
        {/* ======================================================== */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-base text-[#1C1C1E]">Recent Reservations</h2>
              <span className="w-2 h-2 rounded-full bg-[#FF8A3D] animate-ping" />
            </div>
            <button 
              onClick={() => showToast('Opening all reservations list')}
              className="text-xs font-bold text-[#2E7D32] hover:underline"
            >
              Manage All
            </button>
          </div>

          <div className="space-y-2.5">
            {reservations.map((res, idx) => (
              <div 
                key={res.id}
                style={{ animationDelay: `${idx * 60}ms` }}
                className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-2xs interactive-card hover:border-emerald-300/80 cursor-pointer"
              >
                {/* Left: Avatar + Details */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${res.avatarColor} font-black text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                    {res.initials}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-[#1C1C1E]">{res.customerName}</h4>
                      <span className="text-[10px] font-mono text-stone-500 font-semibold bg-stone-100 px-1.5 py-0.5 rounded">{res.code}</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      {res.items} • Paid <span className="font-semibold text-stone-800">{res.paidAmount}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Status Pill & ETA */}
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#2E7D32]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
                    {res.status}
                  </span>
                  <p className="text-[10px] text-stone-500 font-medium mt-1">{res.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>


      {/* ======================================================== */}
      {/* MODAL 1: CREATE NEW BAG                                 */}
      {/* ======================================================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-[#1C1C1E]">Create New Surplus Bag</h3>
                <p className="text-xs text-stone-500">List remaining fresh items before closing</p>
              </div>
              <button 
                onClick={() => setCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBag} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-stone-700">Listing Title</label>
                <input
                  type="text"
                  placeholder="e.g. Evening Baker Surprise Bundle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#2E7D32] focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-700">Description</label>
                <textarea
                  placeholder="Describe assortment (e.g. 2 rustic loaves + daily sweet pastries)..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#2E7D32] focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-700">Discounted Price ($)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#2E7D32] focus:bg-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700">Quantity (Bags)</label>
                  <input
                    type="number"
                    min="1"
                    value={newTotal}
                    onChange={(e) => setNewTotal(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#2E7D32] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-700">Pickup Window</label>
                <input
                  type="text"
                  value={newPickup}
                  onChange={(e) => setNewPickup(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#2E7D32] focus:bg-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs shadow-xs"
                >
                  Publish Listing Now
                </button>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: SCAN PICKUP CODE                               */}
      {/* ======================================================== */}
      {scanModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#2E7D32]" />
                <h3 className="font-bold text-base text-[#1C1C1E]">Verify Customer Claim</h3>
              </div>
              <button 
                onClick={() => setScanModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* QR Camera View Simulator */}
            <div className="h-44 rounded-2xl bg-stone-950 flex flex-col items-center justify-center text-white relative overflow-hidden p-4 text-center">
              <div className="w-32 h-32 border-2 border-emerald-400 rounded-2xl relative flex items-center justify-center">
                <div className="w-full h-0.5 bg-emerald-400 absolute animate-pulse shadow-[0_0_8px_#34d399]" />
                <QrCode className="w-16 h-16 text-stone-600" />
              </div>
              <p className="text-[10px] text-stone-400 mt-2">Point scanner at customer's Foodlink QR</p>
            </div>

            <form onSubmit={handleScanClaim} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-stone-600 font-semibold">Or enter code manually</label>
                <input
                  type="text"
                  placeholder="e.g. SAVER-789"
                  value={claimCodeInput}
                  onChange={(e) => setClaimCodeInput(e.target.value)}
                  className="w-full p-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs uppercase font-mono tracking-wider text-center focus:bg-white focus:ring-1 focus:ring-[#2E7D32] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs shadow-xs"
              >
                Confirm Pickup Claim
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: EDIT LISTING                                   */}
      {/* ======================================================== */}
      {editModalItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-sm text-[#1C1C1E]">Edit Surplus Listing</h3>
              <button onClick={() => setEditModalItem(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-stone-800">{editModalItem.title}</p>
              <div className="space-y-1">
                <label className="text-stone-600">Update Remaining Count</label>
                <input 
                  type="number" 
                  min="0"
                  value={editRemainingCount} 
                  onChange={(e) => setEditRemainingCount(e.target.value)}
                  className="w-full p-2 bg-stone-100 border border-stone-200 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-600">Price ($)</label>
                <input 
                  type="text" 
                  value={editPrice} 
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full p-2 bg-stone-100 border border-stone-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleSaveEditModal}
              className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
