import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Heart,
  Share2,
  CheckCircle2,
  Star,
  Clock,
  MapPin,
  Phone,
  Navigation,
  Bell,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Zap,
  Leaf,
  Coffee,
  Check,
  Compass,
  ArrowRight,
  Wifi,
  Signal,
  Battery,
  Search,
  ChevronDown,
  ShieldCheck,
  Award,
  MessageCircle,
  ExternalLink,
  Home,
  ChevronRight,
  HelpCircle,
  Send,
  Utensils
} from 'lucide-react';
import BakeryKhqrModal from './BakeryKhqrModal';
import { BROWN_COFFEE_BAKERY_DATA } from '../../data/bakeryMockData';

export default function BakeryDetailPage({
  onBack,
  onShowToast,
  currentUser,
}) {
  const bakery = BROWN_COFFEE_BAKERY_DATA;

  // State for quantities of packages
  const [quantities, setQuantities] = useState({
    'pkg-1': 1, // Assorted Fresh Pastry & Donut Bag (1 bag selected in mock)
    'pkg-2': 0, // Gourmet Ciabatta & Quiche Box
    'pkg-3': 0, // Sold out
  });

  const [isFavorite, setIsFavorite] = useState(false);
  const [isKhqrOpen, setIsKhqrOpen] = useState(false);
  const [notifiedPkg3, setNotifiedPkg3] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState('popular');
  const [searchFilter, setSearchFilter] = useState('');

  // Live Countdown timer (00 : 42 : 12 in the mock)
  const [secondsRemaining, setSecondsRemaining] = useState(42 * 60 + 12);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hours).padStart(2, '0')} : ${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
  };

  // Price calculations
  const bag1Qty = quantities['pkg-1'] || 0;
  const bag2Qty = quantities['pkg-2'] || 0;
  const totalBags = bag1Qty + bag2Qty;

  const pkg1 = bakery.surplusPackages[0];
  const pkg2 = bakery.surplusPackages[1];

  const originalTotal = (bag1Qty * pkg1.originalPrice) + (bag2Qty * pkg2.originalPrice);
  const totalPrice = (bag1Qty * pkg1.price) + (bag2Qty * pkg2.price);
  const savings = Math.max(0, originalTotal - totalPrice);
  const khrTotal = Math.round(totalPrice * 4100).toLocaleString();
  const carbonPrevented = ((bag1Qty * 1.4) + (bag2Qty * 1.8)).toFixed(1);

  const handleUpdateQuantity = (pkgId, delta, maxStock = 2) => {
    setQuantities((prev) => {
      const current = prev[pkgId] || 0;
      const next = Math.max(0, Math.min(maxStock, current + delta));
      return { ...prev, [pkgId]: next };
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onShowToast) {
      onShowToast(!isFavorite ? 'Saved Brown Coffee & Bakery to favorites!' : 'Removed from favorites');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    if (onShowToast) {
      onShowToast('Store link copied to clipboard!');
    }
  };

  const handleNotifyTomorrow = () => {
    setNotifiedPkg3(true);
    if (onShowToast) {
      onShowToast("Notification set! We'll alert you at 16:30 tomorrow for Cold Brew surplus.");
    }
  };

  const handleClaimKhqr = () => {
    if (totalBags === 0) {
      if (onShowToast) onShowToast('Please select at least 1 surplus bag.');
      return;
    }
    setIsKhqrOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white pb-16 lg:pb-0">
      
      {/* ========================================================================= */}
      {/* 1. DESKTOP / LAPTOP GLOBAL NAVIGATION BAR (Hidden on Mobile)               */}
      {/* ========================================================================= */}
      <nav className="hidden lg:block bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo + Location Selector + Search */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            {/* Brand Logo */}
            <button 
              onClick={onBack}
              className="flex items-center gap-2 cursor-pointer group"
              title="Return to FoodLink Home"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0d4a36] text-emerald-300 flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 stroke-[2.4]" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Food<span className="text-[#0d4a36]">Link</span>
              </span>
            </button>

            {/* Location Selector Dropdown Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Toul Kork, Phnom Penh</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Quick Search Input */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search surplus ba..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
              />
            </div>
          </div>

          {/* Center/Right Nav Links */}
          <div className="flex items-center gap-1 xl:gap-2">
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Explore & Map
            </button>
            <button
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#0d4a36] text-white shadow-2xs cursor-pointer"
            >
              Popular Hubs
            </button>
            <button
              onClick={() => onShowToast && onShowToast('FoodLink rescues fresh surplus food daily from Phnom Penh cafes!')}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => onShowToast && onShowToast('You have earned +45 Eco-Karma points this week!')}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Impact & Karma
            </button>
          </div>

          {/* Far Right: Notification, Basket, User Avatar */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <button
              onClick={() => onShowToast && onShowToast('No new notifications')}
              className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            </button>

            {/* Rescue Basket Badge */}
            <button
              onClick={handleClaimKhqr}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/80 text-[#0d4a36] border border-emerald-200/80 text-xs font-black transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{totalBags}</span>
            </button>

            {/* Profile Avatar */}
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-700/20 cursor-pointer hover:border-emerald-600 transition-colors">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. MOBILE TOP APP BAR & STATUS BAR (Hidden on Desktop)                    */}
      {/* ========================================================================= */}
      <div className="lg:hidden bg-white border-b border-slate-100 sticky top-0 z-30">
        {/* Mobile Status Bar */}
        <div className="pt-2 px-5 pb-1 flex items-center justify-between text-xs font-semibold text-slate-900 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 text-slate-800">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Mobile Nav Header */}
        <header className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-[#0d4a36] text-emerald-300 flex items-center justify-center font-black text-xs shadow-xs">
                FL
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900">
                Food<span className="text-[#0d4a36]">Link</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN WRAPPER CONTAINER (Desktop: 7xl centered, Mobile: max-w-md)       */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 lg:py-5 space-y-4 lg:space-y-6">
        
        {/* Desktop Breadcrumbs Bar */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button onClick={onBack} className="hover:text-emerald-800 flex items-center gap-1 cursor-pointer">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="hover:text-emerald-800 cursor-pointer">Phnom Penh</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="hover:text-emerald-800 cursor-pointer">Toul Kork</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-bold text-slate-800">Brown Coffee & Bakery (RUPP Hub)</span>
        </div>

        {/* ======================================================================= */}
        {/* 4. HERO BANNER & STORE IDENTITY HEADER                                  */}
        {/* ======================================================================= */}
        <section className="bg-white rounded-3xl lg:rounded-4xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Hero Image with Floating Pickup Badge */}
          <div className="relative w-full h-52 sm:h-72 lg:h-80 bg-slate-900 overflow-hidden">
            <img
              src={bakery.heroImage}
              alt={bakery.name}
              className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Desktop Top-Right Pill: Pickup Ready Today */}
            <div className="absolute top-4 right-4 z-10">
              <div className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-black shadow-md border border-white/80 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Pickup Ready Today: 18:00 – 20:00</span>
              </div>
            </div>

            {/* Mobile Overlays */}
            <div className="lg:hidden absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-emerald-900 text-[11px] font-extrabold shadow-sm flex items-center gap-1.5">
                <span>🌱</span>
                <span>{bakery.mealsRescuedCount}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-extrabold shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{bakery.closingTimeText}</span>
              </div>
            </div>
          </div>

          {/* Store Info Bar below Hero */}
          <div className="p-4 sm:p-6 lg:p-7 space-y-4">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Left Logo + Title + Badges */}
              <div className="flex items-start gap-4">
                {/* Store Square Logo Badge */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-slate-200/90 shadow-sm flex items-center justify-center shrink-0 p-2 overflow-hidden -mt-10 lg:-mt-12 z-20">
                  <div className="w-full h-full rounded-xl bg-amber-50 text-amber-900 flex flex-col items-center justify-center font-black text-center leading-none border border-amber-200/70">
                    <Coffee className="w-6 h-6 stroke-[2.5] text-amber-800 mb-0.5" />
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-950">Brown</span>
                  </div>
                  {/* Verified checkmark badge in corner */}
                  <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center ring-2 ring-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Title and metadata */}
                <div className="space-y-1 min-w-0">
                  {/* Top Partner Pills */}
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                      RUPP Campus Partner
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-600" />
                      High-Demand Hub
                    </span>
                  </div>

                  {/* Store Name */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Brown Coffee & Bakery
                    </h1>
                    <span className="text-sm font-semibold text-slate-400">
                      (Toul Kork Hub)
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Pastries, Specialty Single-Origin Coffee, Artisan Sourdough & Savory Paninis
                  </p>

                  {/* Metadata line */}
                  <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1 font-bold text-slate-900">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      4.9 <span className="text-slate-400 font-normal">(428 reviews)</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <span>🚶</span> 400m from RUPP Gate 2 (5 min walk)
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                      840+ meals saved
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Action Buttons (Favorite, Share Hub, Directions) */}
              <div className="flex items-center gap-2 pt-2 lg:pt-0 self-start lg:self-center shrink-0">
                <button
                  onClick={handleToggleFavorite}
                  className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    isFavorite 
                      ? 'bg-rose-50 border-rose-200 text-rose-600' 
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>Favorite</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Hub</span>
                </button>

                <button
                  onClick={() => window.open(bakery.locationInfo.directionsUrl, '_blank')}
                  className="px-4 py-2 rounded-2xl bg-[#eaf5ef] hover:bg-[#d8ede1] border border-emerald-200/80 text-[#0d4a36] text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Navigation className="w-4 h-4 stroke-[2.2]" />
                  <span>Directions</span>
                </button>
              </div>

            </div>

            {/* Student Eco Perk Banner */}
            <div className="p-3 rounded-2xl bg-[#ebf7f1] border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#0d4a36] font-semibold">
                <span className="text-base">🌱</span>
                <span>
                  <strong>Student Eco Perk:</strong> Bring your own tumbler/tupperware for a bonus -10% on future visits!
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-emerald-800 font-bold shrink-0">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Instant Bakong KHQR
                </span>
                <span className="text-emerald-300">•</span>
                <span>No Reservation Fee</span>
              </div>
            </div>

          </div>

        </section>

        {/* ======================================================================= */}
        {/* 5. TWO-COLUMN RESPONSIVE GRID LAYOUT                                    */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ===================================================================== */}
          {/* LEFT MAIN COLUMN: BUNDLES, PROTOCOL, MAP, FEEDBACK (cols 8 on desktop) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* A. Pickup Countdown Bar */}
            <div className="p-4 rounded-3xl bg-[#fff7ed] border border-amber-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-700 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-amber-950">
                      Pickup Starts in 42 Mins
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-2xs">
                      3 Left Total
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/80 font-medium mt-0.5">
                    Brown Toul Kork counter opens rescue pickup precisely at 18:00 until 20:00 tonight.
                  </p>
                </div>
              </div>

              {/* Dynamic Live Countdown Pill */}
              <div className="px-3.5 py-1.5 rounded-full bg-white border border-amber-300 text-amber-900 font-mono font-bold text-xs shadow-2xs flex items-center gap-1.5 shrink-0">
                <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>{formatCountdown(secondsRemaining)}</span>
              </div>
            </div>

            {/* B. Today's Surplus Bundles Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Today's Surplus Bundles
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Refreshed 4m ago
                </span>
              </div>

              <div className="space-y-3.5">
                
                {/* 1. Assorted Fresh Pastry & Donut Bag */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left Thumbnail Image with badges */}
                  <div className="relative w-full sm:w-36 h-36 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80"
                      alt="Assorted Pastry Bag"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-[10px] shadow-sm">
                      -58% OFF
                    </span>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white font-bold text-[10px]">
                      2 bags left
                    </span>
                  </div>

                  {/* Middle Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                        SURPLUS MYSTERY BAG
                      </span>
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                      Assorted Fresh Pastry & Donut Bag
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      Surplus from today's 14:00 bake. Typically includes 3–4 items: Butter croissant, almond danish, cinnamon swirl, or artisanal glazed donut.
                    </p>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-black text-slate-900">$2.50</span>
                      <span className="text-xs text-slate-400 line-through">$6.00</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        ≈ 10,250 KHR (Bakong fixed)
                      </span>
                    </div>
                  </div>

                  {/* Right Actions: Stepper + Rescue Bag */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Pill Stepper: [-] 1 [+] */}
                    <div className="flex items-center gap-2 bg-[#f0fdf4] border border-emerald-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                      <button
                        onClick={() => handleUpdateQuantity('pkg-1', -1, 2)}
                        className="w-6 h-6 rounded-full bg-white text-[#0d4a36] shadow-2xs hover:bg-emerald-50 flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90 transition-transform"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <span className="w-5 text-center font-black text-xs text-[#0d4a36]">
                        {bag1Qty}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity('pkg-1', 1, 2)}
                        className="w-6 h-6 rounded-full bg-[#0d4a36] text-white shadow-2xs hover:bg-[#083526] flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90 transition-transform"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                    <button
                      onClick={handleClaimKhqr}
                      className="px-4 py-2 rounded-2xl bg-[#0d4a36] hover:bg-[#083526] text-white font-extrabold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 cursor-pointer active:scale-98 transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span>Rescue Bag</span>
                    </button>
                  </div>
                </div>

                {/* 2. Gourmet Ciabatta & Quiche Box */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left Thumbnail */}
                  <div className="relative w-full sm:w-36 h-36 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80"
                      alt="Gourmet Ciabatta Box"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white font-black text-[10px] shadow-sm">
                      -57% OFF
                    </span>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px]">
                      🔴 Only 1 left!
                    </span>
                  </div>

                  {/* Middle Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                        SAVORY DELIGHTS BOX
                      </span>
                      <Utensils className="w-3.5 h-3.5 text-amber-600" />
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                      Gourmet Ciabatta & Quiche Box
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      1x Smoked ham & emmental panini on rustic sourdough ciabatta plus a generous wedge of roasted pumpkin or spinach-gruyère quiche.
                    </p>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-black text-slate-900">$3.00</span>
                      <span className="text-xs text-slate-400 line-through">$7.00</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        ≈ 12,300 KHR
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {bag2Qty === 0 ? (
                      <button
                        onClick={() => handleUpdateQuantity('pkg-2', 1, 1)}
                        className="px-5 py-2.5 rounded-2xl bg-[#e6f4ed] hover:bg-[#d5eee0] text-[#0d4a36] font-extrabold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Claim Box</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-[#f0fdf4] border border-emerald-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                        <button
                          onClick={() => handleUpdateQuantity('pkg-2', -1, 1)}
                          className="w-6 h-6 rounded-full bg-white text-[#0d4a36] shadow-2xs hover:bg-emerald-50 flex items-center justify-center font-bold text-xs cursor-pointer active:scale-90 transition-transform"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                        <span className="w-5 text-center font-black text-xs text-[#0d4a36]">
                          {bag2Qty}
                        </span>
                        <button
                          disabled
                          className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs cursor-not-allowed"
                          aria-label="Max stock reached"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Cold Brew & Sponge Slice Combo (Sold Out) */}
                <div className="bg-white/70 rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-75">
                  {/* Left Thumbnail (Monochrome) */}
                  <div className="relative w-full sm:w-36 h-36 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-slate-200 border border-slate-200 grayscale contrast-75">
                    <img
                      src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80"
                      alt="Cold Brew Combo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                      <span className="px-2.5 py-1 rounded-md bg-slate-950/80 text-white font-black text-[10px]">
                        SOLD OUT (17:15)
                      </span>
                    </div>
                  </div>

                  {/* Middle Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        SOLD OUT TODAY
                      </span>
                      <span className="text-xs text-slate-400 line-through">$4.80</span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-700 leading-snug">
                      Cold Brew & Sponge Slice Combo
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      Brown Signature Cold Drip bottle (250ml) & Dark Chocolate Chiffon Slice. All 4 bags claimed in 18 minutes by IFL students.
                    </p>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-xs font-semibold text-slate-400">
                        Was $2.20 (-55%)
                      </span>
                    </div>
                  </div>

                  {/* Right Actions: Notify Tomorrow */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      onClick={handleNotifyTomorrow}
                      disabled={notifiedPkg3}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        notifiedPkg3
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{notifiedPkg3 ? 'Notified!' : 'Notify Tomorrow'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* C. How Toul Kork Hub Pickup Works (3 Cards Grid) */}
            <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  How Toul Kork Hub Pickup Works
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-[#f8faf9] border border-slate-200/70 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#0d4a36] font-black text-xs flex items-center justify-center">
                    1
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900">
                    Reserve via Bakong
                  </h4>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed">
                    Scan KHQR instantly with any Cambodian banking app (ABA, Wing, ACLEDA, Bakong) to lock your bag.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-[#f8faf9] border border-slate-200/70 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#0d4a36] font-black text-xs flex items-center justify-center">
                    2
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900">
                    Arrive 18:00 – 20:00
                  </h4>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed">
                    Walk to Brown Toul Kork express pickup counter. Flash your in-app FoodLink 4-digit code.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-[#fffbeb] border border-amber-200/70 space-y-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
                    3
                  </div>
                  <h4 className="font-extrabold text-xs text-amber-950">
                    Bring Your Box / Bag
                  </h4>
                  <p className="text-[11.5px] text-amber-900/80 leading-relaxed">
                    Avert single-use plastic. Earn <strong>+15 Student Karma points</strong> directly toward free drinks.
                  </p>
                </div>
              </div>
            </section>

            {/* D. Hub Location & Campus Proximity */}
            <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Hub Location & Campus Proximity
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                  Open until 20:30
                </span>
              </div>

              {/* Illustrated Interactive Map View */}
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner flex items-center justify-center">
                {/* SVG Vector Map of Toul Kork / Phnom Penh */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#e8ece9" />
                  {/* Rivers: Tonle Sap curve */}
                  <path d="M 460,-20 Q 520,120 480,300" fill="none" stroke="#b4d3e8" strokeWidth="36" strokeLinecap="round" opacity="0.8" />
                  
                  {/* Primary Roads Grid */}
                  <line x1="-10" y1="90" x2="700" y2="90" stroke="#ffffff" strokeWidth="12" />
                  <line x1="-10" y1="180" x2="700" y2="180" stroke="#ffffff" strokeWidth="8" />
                  <line x1="140" y1="-10" x2="140" y2="320" stroke="#ffffff" strokeWidth="12" />
                  <line x1="320" y1="-10" x2="320" y2="320" stroke="#fcd34d" strokeWidth="8" />
                  <line x1="240" y1="-10" x2="240" y2="320" stroke="#ffffff" strokeWidth="6" />
                  <line x1="0" y1="0" x2="400" y2="280" stroke="#ffffff" strokeWidth="5" strokeDasharray="4 4" />

                  {/* Campus & Mall Blocks */}
                  <rect x="40" y="110" width="75" height="50" rx="8" fill="#c7ebd3" opacity="0.95" />
                  <text x="50" y="140" fontSize="10" fill="#0f766e" fontWeight="bold">RUPP Campus</text>

                  <rect x="160" y="30" width="85" height="40" rx="8" fill="#d1fae5" opacity="0.9" />
                  <text x="170" y="55" fontSize="10" fill="#047857" fontWeight="bold">TK Avenue Mall</text>
                  
                  <text x="360" y="180" fontSize="16" fill="#94a3b8" fontWeight="bold" opacity="0.4">Phnom Penh</text>
                </svg>

                {/* Main Store Pin on Map */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-black shadow-xl flex items-center gap-1.5 border border-slate-700">
                    <Coffee className="w-3.5 h-3.5 text-amber-400" />
                    <span>Brown Coffee Toul Kork</span>
                  </div>
                  <div className="w-3 h-3 bg-slate-950 rotate-45 -mt-1.5 shadow-md"></div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500/30 animate-ping absolute -bottom-1"></div>
                </div>

                {/* Proximity Chips Over Map */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
                  <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow-sm border border-slate-200">
                    🎓 RUPP Campus 1: 4 min walk
                  </span>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow-sm border border-slate-200">
                    🎓 IFL Main Gate: 6 min walk
                  </span>
                </div>
              </div>

              {/* Map Footer Bar with Phone & Directions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div>
                  <p className="font-extrabold text-xs text-slate-900">
                    Corner St. 598 & St. 315, Toul Kork, Phnom Penh
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Rescue pickup window: 18:00 – 20:00 (Store standard hours: 06:30 – 20:30)
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => window.open(`tel:${bakery.locationInfo.phone}`)}
                    className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>+855 23 888 123</span>
                  </button>

                  <button
                    onClick={() => window.open(bakery.locationInfo.directionsUrl, '_blank')}
                    className="px-4 py-2 rounded-2xl bg-[#0d4a36] hover:bg-[#083526] text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Navigation className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Open in Maps</span>
                  </button>
                </div>
              </div>
            </section>

            {/* E. Student Rescue Community Feedback */}
            <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Student Rescue Community Feedback
                  </h2>
                </div>
                <span className="text-xs font-black text-emerald-700">
                  98% Positive Impact
                </span>
              </div>

              {/* Rating Summary + Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 items-center">
                {/* Score */}
                <div className="sm:col-span-4 text-center sm:text-left sm:border-r border-slate-200/80 sm:pr-4">
                  <div className="text-4xl font-black text-slate-900 leading-none">4.9</div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 my-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Based on 428 student pickups
                  </p>
                </div>

                {/* Bars */}
                <div className="sm:col-span-8 space-y-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-10 text-slate-500 font-bold text-[11px]">5 Star</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full w-[92%]"></div>
                    </div>
                    <span className="w-8 text-right font-bold text-slate-700 text-[11px]">92%</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-10 text-slate-500 font-bold text-[11px]">4 Star</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[7%]"></div>
                    </div>
                    <span className="w-8 text-right font-bold text-slate-700 text-[11px]">7%</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-10 text-slate-500 font-bold text-[11px]">3 Star</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full w-[1%]"></div>
                    </div>
                    <span className="w-8 text-right font-bold text-slate-700 text-[11px]">1%</span>
                  </div>
                </div>
              </div>

              {/* Review Cards */}
              <div className="space-y-3">
                {/* Review 1 */}
                <div className="p-4 rounded-2xl bg-[#f8faf9] border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 font-black text-xs flex items-center justify-center shrink-0">
                        SL
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-xs text-slate-900">Sophea Leng</h4>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                            RUPP CS '25
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Rescued 14 bags from this hub</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">Yesterday 19:10</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    "Got 2 croissants and a double chocolate donut for just $2.50. Brown pastries are still flaky and super fresh when reheated in the toaster. Staff even let me fill my water bottle!"
                  </p>
                </div>

                {/* Review 2 */}
                <div className="p-4 rounded-2xl bg-[#f8faf9] border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                        DR
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-xs text-slate-900">Dara Roth</h4>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                            IFL French Dept
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Rescued 8 bags</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">3 days ago</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    "The savory ciabatta box is a complete dinner for $3. Saves so much money after evening lectures compared to standard café menu prices."
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* ===================================================================== */}
          {/* RIGHT SIDEBAR: STICKY RESCUE BASKET & ECO RANK (cols 4 on desktop)     */}
          {/* ===================================================================== */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20 z-20">
            
            {/* 1. "Your Rescue Basket" Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-md space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-black text-base text-slate-900">
                    Your Rescue Basket
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-[#0d4a36] border border-emerald-200">
                  1 Hub Active
                </span>
              </div>

              {/* Hub Info Banner */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-0.5">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  <span>Brown Coffee Toul Kork (RUPP)</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Pickup: Today between <strong>18:00 – 20:00</strong>
                </p>
              </div>

              {/* Items List in Basket */}
              <div className="space-y-3 divide-y divide-slate-100">
                {bag1Qty > 0 && (
                  <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&auto=format&fit=crop&q=80"
                        alt="Pastry"
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 truncate">Assorted Pastry Bag</p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Qty: {bag1Qty} × $2.50
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-slate-900">${(bag1Qty * 2.50).toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 line-through">${(bag1Qty * 6.00).toFixed(2)}</p>
                    </div>
                  </div>
                )}

                {bag2Qty > 0 && (
                  <div className="pt-2 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=120&auto=format&fit=crop&q=80"
                        alt="Ciabatta"
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 truncate">Ciabatta & Quiche Box</p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Qty: {bag2Qty} × $3.00
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-slate-900">${(bag2Qty * 3.00).toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400 line-through">${(bag2Qty * 7.00).toFixed(2)}</p>
                    </div>
                  </div>
                )}

                {totalBags === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400 space-y-1">
                    <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
                    <p className="font-bold text-slate-600">Your basket is empty</p>
                    <p className="text-[11px]">Select a surplus bag to rescue above</p>
                  </div>
                )}
              </div>

              {/* Financial & Environmental Breakdown */}
              {totalBags > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Original Bakery Retail Value</span>
                    <span className="line-through">${originalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 font-semibold">
                    <span>FoodLink Student Rescue Price</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-extrabold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Direct Savings ({Math.round((savings / (originalTotal || 1)) * 100)}%)</span>
                    </span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-teal-800 font-bold pt-1.5 border-t border-slate-200/60 text-[11.5px]">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-teal-600" />
                      <span>Carbon Footprint Prevented</span>
                    </span>
                    <span>{carbonPrevented} kg CO₂e 🌱</span>
                  </div>
                </div>
              )}

              {/* Total Summary Row */}
              <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
                <div>
                  <p className="font-extrabold text-sm text-slate-900">Total to Pay</p>
                  <p className="text-[11px] text-slate-400">No platform fee for students</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#0d4a36]">
                    ${totalPrice.toFixed(2)}
                  </p>
                  <p className="text-xs font-bold text-slate-400">
                    ≈ {khrTotal} KHR
                  </p>
                </div>
              </div>

              {/* Payment Option: Bakong KHQR */}
              <div className="p-3 rounded-2xl border-2 border-emerald-600/40 bg-emerald-50/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[9px] tracking-wider">
                    KHQR
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-900">Bakong Universal QR</p>
                    <p className="text-[10px] text-slate-500">Zero merchant fee settlement</p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 fill-emerald-100" />
              </div>

              {/* Reserve via Bakong KHQR Button */}
              <button
                onClick={handleClaimKhqr}
                disabled={totalBags === 0}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                  totalBags > 0
                    ? 'bg-[#0d4a36] hover:bg-[#083526] text-white shadow-emerald-950/20 cursor-pointer active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                <span>Reserve via Bakong KHQR • ${totalPrice.toFixed(2)}</span>
              </button>

              {/* Guarantee Note */}
              <div className="p-2.5 rounded-xl bg-slate-50 text-[10.5px] text-slate-500 leading-snug flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>FoodLink Quality Guarantee:</strong> Brown Coffee guarantees standard food safety and same-day production freshness. Full refund if item unavailable at pickup.
                </span>
              </div>

              {/* Support Link */}
              <div className="text-center pt-1">
                <button
                  onClick={() => onShowToast && onShowToast('Contacting Telegram support: @FoodLinkPP')}
                  className="text-[11px] font-semibold text-slate-500 hover:text-emerald-800 transition-colors flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <Send className="w-3 h-3 text-emerald-600" />
                  <span>Need support with this hub? Telegram @FoodLinkPP</span>
                </button>
              </div>

            </div>

            {/* 2. Student Eco-Rank Card */}
            <div className="p-4 rounded-3xl bg-[#0d4a36] text-white shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center shrink-0 border border-white/10">
                  <Award className="w-5 h-5 stroke-[2.4]" />
                </div>
                <div>
                  <p className="font-extrabold text-xs text-white">Student Eco-Rank: Tier 3</p>
                  <p className="text-[11px] text-emerald-200/80 mt-0.5">
                    Rescue 1 more bag to unlock free coffee
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-black shrink-0 border border-white/10">
                +15 pts
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. DESKTOP GLOBAL FOOTER                                                  */}
      {/* ========================================================================= */}
      <footer className="hidden lg:block mt-16 bg-white border-t border-slate-200/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-black text-slate-800">
            <div className="w-6 h-6 rounded-lg bg-[#0d4a36] text-white flex items-center justify-center text-[10px]">
              FL
            </div>
            <span>FoodLink Phnom Penh</span>
          </div>

          <div className="flex items-center flex-wrap gap-6 font-semibold">
            <button onClick={() => onShowToast && onShowToast('Eatery partner portal')} className="hover:text-emerald-800 cursor-pointer">
              Partner with Us (Eateries)
            </button>
            <button onClick={() => onShowToast && onShowToast('Bakong instant settlement info')} className="hover:text-emerald-800 cursor-pointer">
              KHQR & Bakong Settlement
            </button>
            <button onClick={() => onShowToast && onShowToast('Ambassador program info')} className="hover:text-emerald-800 cursor-pointer">
              University Ambassadors
            </button>
            <button onClick={() => onShowToast && onShowToast('Help & FAQ')} className="hover:text-emerald-800 cursor-pointer">
              Support & FAQ
            </button>
          </div>

          <p className="text-slate-400">
            © 2024 FoodLink Cambodia. Rescuing food daily.
          </p>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 7. MOBILE STICKY BOTTOM CLAIM BAR (Hidden on Desktop)                      */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 z-30 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold text-slate-500">
            {totalBags} bag{totalBags !== 1 ? 's' : ''} selected
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">
              ${totalPrice.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {khrTotal} KHR
            </span>
          </div>
        </div>

        <button
          onClick={handleClaimKhqr}
          disabled={totalBags === 0}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
            totalBags > 0
              ? 'bg-[#0d4a36] hover:bg-[#083526] text-white shadow-emerald-950/20 cursor-pointer active:scale-98'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
          <span>Claim via KHQR</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 8. BAKONG KHQR CHECKOUT SHEET (Full interactive modal)                    */}
      {/* ========================================================================= */}
      <BakeryKhqrModal
        isOpen={isKhqrOpen}
        onClose={() => setIsKhqrOpen(false)}
        storeName={bakery.name}
        totalPrice={totalPrice}
        khrPrice={`${khrTotal} KHR`}
        onSuccessfulClaim={({ pickupCode }) => {
          if (onShowToast) {
            onShowToast(`Order locked with code ${pickupCode}! Pick up at ${bakery.name}.`);
          }
        }}
      />

    </div>
  );
}
