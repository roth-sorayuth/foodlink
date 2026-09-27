import React, { useState } from 'react';
import {
  Leaf,
  Award,
  Share2,
  Settings,
  ShieldCheck,
  Download,
  MapPin,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Check,
  CheckCircle2,
  Lock,
  Sprout,
  Trees,
  Clock,
  AlertTriangle,
  HelpCircle,
  FileText,
  LogOut,
  Utensils,
  PiggyBank,
  Cloud,
  Eye,
  Globe,
  SlidersHorizontal,
  X,
  CreditCard,
  RotateCcw,
  Sparkles,
  Store,
  Menu
} from 'lucide-react';

export default function MerchantProfile({ onNavigateToDashboard }) {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showOlderRescues, setShowOlderRescues] = useState(false);

  // Interactive Preferences
  const [radarRadius, setRadarRadius] = useState(2.0);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [selectedTags, setSelectedTags] = useState(['Vegetarian', 'Vegan', 'Nut Allergy Alert']);
  
  // Modals & Feedback
  const [toastMessage, setToastMessage] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [receiptModalOrder, setReceiptModalOrder] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Mock Orders data matching screenshot
  const initialOrders = [
    {
      id: 'FS-8842',
      store: 'CAD Bakery',
      category: 'bakeries',
      status: 'Completed',
      time: 'Today 6:45 PM',
      isRecent: true,
      iconBg: 'bg-amber-100 text-amber-700',
      iconText: '🥐',
      itemTitle: 'Artisan Pastry & Sourdough Surprise Bag',
      co2: '2.5 kg CO₂ saved',
      verifiedPickup: true,
      price: '$4.99',
      originalPrice: '$16.00',
      savedText: 'Saved $11.01 (69%)'
    },
    {
      id: 'FS-8791',
      store: 'Green Leaf Organic Deli',
      category: 'recent',
      status: 'Completed',
      time: 'Oct 24, 7:15 PM',
      isRecent: true,
      iconBg: 'bg-emerald-100 text-emerald-700',
      iconText: '🥗',
      itemTitle: 'Fresh Prepared Lunch & Sandwich Box',
      co2: '3.0 kg CO₂ saved',
      verifiedPickup: false,
      price: '$5.49',
      originalPrice: '$18.00',
      savedText: 'Saved $12.51 (70%)'
    },
    {
      id: 'FS-8620',
      store: 'La Petite Patisserie',
      category: 'bakeries',
      status: 'Completed',
      time: 'Oct 19, 8:10 PM',
      isRecent: false,
      iconBg: 'bg-rose-100 text-rose-700',
      iconText: '🧁',
      itemTitle: 'French Macarons & Seasonal Tartlets',
      co2: '1.8 kg CO₂ saved',
      verifiedPickup: false,
      price: '$3.99',
      originalPrice: '$14.00',
      savedText: 'Saved $10.01 (71%)'
    },
    {
      id: 'FS-8419',
      store: 'Mission Sourdough Co.',
      category: 'bakeries',
      status: 'Completed',
      time: 'Oct 12, 6:00 PM',
      isRecent: false,
      iconBg: 'bg-stone-200 text-stone-700',
      iconText: '🍞',
      itemTitle: 'Rustic Baguette & Country Loaves',
      co2: '2.2 kg CO₂ saved',
      verifiedPickup: false,
      price: '$4.50',
      originalPrice: '$14.00',
      savedText: 'Saved $9.50 (68%)'
    },
  ];

  const olderOrders = [
    {
      id: 'FS-8120',
      store: 'Tartine Eco Bakery',
      category: 'bakeries',
      status: 'Completed',
      time: 'Sep 28, 5:30 PM',
      isRecent: false,
      iconBg: 'bg-orange-100 text-orange-700',
      iconText: '🥖',
      itemTitle: 'Evening Baker Assortment & Buns',
      co2: '2.1 kg CO₂ saved',
      verifiedPickup: true,
      price: '$5.00',
      originalPrice: '$15.50',
      savedText: 'Saved $10.50 (68%)'
    },
    {
      id: 'FS-7988',
      store: 'Urban Harvest Greens',
      category: 'recent',
      status: 'Completed',
      time: 'Sep 15, 6:00 PM',
      isRecent: false,
      iconBg: 'bg-teal-100 text-teal-700',
      iconText: '🥑',
      itemTitle: 'Seasonal Organic Veggie Bundle',
      co2: '3.4 kg CO₂ saved',
      verifiedPickup: true,
      price: '$6.50',
      originalPrice: '$20.00',
      savedText: 'Saved $13.50 (67%)'
    }
  ];

  const allOrdersList = showOlderRescues ? [...initialOrders, ...olderOrders] : initialOrders;

  // Filtered orders
  const filteredOrders = allOrdersList.filter(order => {
    if (activeFilter === 'recent' && !order.isRecent) return false;
    if (activeFilter === 'bakeries' && order.category !== 'bakeries') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchStore = order.store.toLowerCase().includes(q);
      const matchItem = order.itemTitle.toLowerCase().includes(q);
      const matchId = order.id.toLowerCase().includes(q);
      return matchStore || matchItem || matchId;
    }
    return true;
  });

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-[#1C1C1E] flex flex-col font-sans antialiased selection:bg-[#2E7D32] selection:text-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 inset-x-4 max-w-sm mx-auto z-50 bg-[#1C1C1E] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3 transition-shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={onNavigateToDashboard}>
              <div className="w-9 h-9 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center text-[#2E7D32]">
                <Leaf className="w-5 h-5 fill-[#2E7D32]/20" />
              </div>
              <span className="font-bold text-lg text-[#1C1C1E] tracking-tight">FoodSaver</span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-stone-600">
              <button 
                onClick={onNavigateToDashboard}
                className="px-3.5 py-1.5 rounded-lg hover:text-[#1C1C1E] hover:bg-stone-100 transition-colors"
              >
                Dashboard
              </button>
              <button className="px-3.5 py-1.5 rounded-lg hover:text-[#1C1C1E] hover:bg-stone-100 transition-colors">
                Explore
              </button>
              <button className="px-3.5 py-1.5 rounded-lg hover:text-[#1C1C1E] hover:bg-stone-100 transition-colors">
                Map
              </button>
              <button className="px-3.5 py-1.5 rounded-lg hover:text-[#1C1C1E] hover:bg-stone-100 transition-colors">
                My Orders
              </button>
              <button className="px-3.5 py-1.5 rounded-lg text-[#2E7D32] bg-[#2E7D32]/10 font-semibold transition-colors">
                Profile & Impact
              </button>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Location selector */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100/80 hover:bg-stone-200/70 border border-stone-200/60 text-xs font-medium text-[#1C1C1E] cursor-pointer transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Mission District, SF</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </div>

            {/* Search icon button */}
            <button 
              onClick={() => showToast('Quick search activated')}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification bell with live badge */}
            <button 
              onClick={() => showToast('You have 3 active surplus alerts in Mission District')}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#FF8A3D] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-stone-200 cursor-pointer group">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" 
                  alt="Sarah Jenkins"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#2E7D32]/30"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-1.5 ring-white" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-[#1C1C1E] group-hover:text-[#2E7D32] transition-colors leading-tight">Sarah Jenkins</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </div>
                <span className="text-[10px] text-stone-500 font-medium">Level 3 Hero</span>
              </div>
            </div>

            {/* Mobile Menu Hamburger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-stone-700 hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-2 border-t border-stone-100 mt-2 space-y-1">
            <button onClick={onNavigateToDashboard} className="w-full text-left px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg">
              Dashboard
            </button>
            <button className="w-full text-left px-3 py-2 text-sm font-medium text-[#2E7D32] bg-[#2E7D32]/10 rounded-lg">
              Profile & Impact
            </button>
            <button className="w-full text-left px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg">
              Explore Rescues
            </button>
            <button className="w-full text-left px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg">
              Map View
            </button>
            <button className="w-full text-left px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg">
              My Orders
            </button>
            <div className="pt-2 border-t border-stone-100 px-3 flex items-center gap-2 text-xs text-stone-600">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Mission District, SF</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Top Profile Header Card */}
        <section className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-7 shadow-xs relative overflow-hidden">
          {/* Subtle warm background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-100/35 via-emerald-50/20 to-transparent rounded-full pointer-events-none -mr-20 -mt-20 blur-2xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left: Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              
              {/* Profile Image with verified badge */}
              <div className="relative shrink-0">
                <img 
                  src="/cad-bakery-logo.png" 
                  alt="CAD Bakery Logo"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-contain p-1 bg-white ring-4 ring-[#2E7D32]/20 shadow-sm"
                />
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#2E7D32] rounded-full flex items-center justify-center text-white ring-2 ring-white shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1C1C1E] tracking-tight">CAD Bakery</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20">
                    <Leaf className="w-3 h-3" /> Artisan Bakery
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF8A3D]/15 text-[#D96B1C] border border-[#FF8A3D]/30">
                    <Award className="w-3 h-3" /> Verified Partner
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 font-medium text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" /> 422 St 178, Daun Penh
                  </span>
                  <span>•</span>
                  <span>Handcrafted Daily</span>
                  <span className="hidden sm:inline">|</span>
                  <span className="text-stone-500">Established 2023</span>
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-medium text-stone-600">
                  <button 
                    onClick={() => showToast('Showing all 7 sustainability badges')}
                    className="inline-flex items-center gap-1 text-[#2E7D32] hover:underline cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View All 7 Badges</span>
                  </button>
                  <span className="text-stone-300">•</span>
                  <button 
                    onClick={() => showToast('Public rescue profile link copied to clipboard!')}
                    className="inline-flex items-center gap-1 text-stone-600 hover:text-[#1C1C1E] hover:underline cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-stone-500" />
                    <span>Public Rescue Profile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
              <button 
                onClick={() => showToast('Impact summary link ready to share!')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-semibold transition-all border border-stone-200/80 active:scale-[0.98]"
              >
                <Share2 className="w-3.5 h-3.5 text-stone-600" />
                <span>Share Impact</span>
              </button>

              <button 
                onClick={() => setShowCertificateModal(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-semibold transition-all border border-stone-200/80 active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>2024 Certificate</span>
              </button>

              <button 
                onClick={() => showToast('Settings opened')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </div>

          </div>
        </section>

        {/* 3 Impact Stat Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          {/* Card 1: MEALS SAVED */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3 hover:border-emerald-200 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">MEALS SAVED</span>
              <div className="w-8 h-8 rounded-full bg-[#2E7D32]/10 flex items-center justify-center text-[#2E7D32]">
                <Utensils className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#1C1C1E] tracking-tight">28</span>
                <span className="text-xs font-semibold text-stone-500">bags</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">Surplus fresh foods rescued</p>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2E7D32] rounded-full w-[75%]" />
            </div>
          </div>

          {/* Card 2: POCKET SAVED */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3 hover:border-amber-200 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">POCKET SAVED</span>
              <div className="w-8 h-8 rounded-full bg-[#FF8A3D]/15 flex items-center justify-center text-[#FF8A3D]">
                <PiggyBank className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#1C1C1E] tracking-tight">$312</span>
                <span className="text-xs font-semibold text-stone-500">Saved</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">Avg 68% off regular retail prices</p>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#FF8A3D] rounded-full w-[85%]" />
            </div>
          </div>

          {/* Card 3: CO2e AVOIDED */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3 sm:col-span-2 md:col-span-1 hover:border-teal-200 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">CO₂e AVOIDED</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                <Cloud className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#1C1C1E] tracking-tight">70</span>
                <span className="text-xs font-semibold text-stone-500">kg</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">≈ 175 miles car driving offset</p>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2E7D32] rounded-full w-[65%]" />
            </div>
          </div>

        </section>

        {/* Milestone Banner (Tree Planter) */}
        <section className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#1C1C1E]">Tree Planter Milestone</h3>
                <p className="text-xs text-stone-500">Just 2 meals away from unlocking your Golden Sprout Badge!</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="font-bold text-sm text-[#1C1C1E]">28 / 30 Meals</span>
              <span className="text-xs font-semibold text-[#2E7D32] ml-1.5">(93%)</span>
            </div>
          </div>

          {/* Large Progress Bar */}
          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2E7D32] rounded-full w-[93%] transition-all duration-700 ease-out" />
          </div>

          {/* Level Markers */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 text-[#2E7D32] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Level 2: Seedling (15)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#2E7D32] font-bold">
              <Sprout className="w-3.5 h-3.5" />
              <span>Level 3: Sapling (25)</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Level 4: Ancient Oak (50)</span>
            </div>
          </div>
        </section>

        {/* Main 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Order History & Rescues (2 cols on lg)     */}
          {/* ======================================================== */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Section Header with Search & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#1C1C1E]">Order History & Rescues</h2>
                <p className="text-xs text-stone-500">6 active & completed surplus pickups to date</p>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                {/* Search input */}
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-stone-100/90 focus:bg-white border border-stone-200 rounded-xl text-xs text-[#1C1C1E] placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200/80 text-xs font-medium">
                  {['all', 'recent', 'bakeries'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveFilter(tab)}
                      className={`px-3 py-1 rounded-lg capitalize transition-all ${
                        activeFilter === tab
                          ? 'bg-white text-[#1C1C1E] font-semibold shadow-2xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List of Orders */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200/80 p-8 text-center space-y-2">
                  <p className="text-sm font-semibold text-stone-700">No orders matching your criteria</p>
                  <p className="text-xs text-stone-400">Try adjusting your search terms or filter selection.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                    className="mt-2 text-xs font-semibold text-[#2E7D32] hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-xs hover:border-stone-300 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Store & Item Info */}
                      <div className="flex items-start gap-3.5">
                        <div className={`w-11 h-11 rounded-2xl ${order.iconBg} flex items-center justify-center text-xl shrink-0 shadow-2xs`}>
                          {order.iconText}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-sm text-[#1C1C1E] leading-snug">{order.store}</h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2E7D32]/10 text-[#2E7D32]">
                              {order.status}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FFF8F0] border border-amber-200/60 text-[#D96B1C]">
                              {order.time}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 font-medium">{order.itemTitle}</p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                            <span className="inline-flex items-center gap-1 text-[#2E7D32]">
                              <Leaf className="w-3 h-3" /> {order.co2}
                            </span>
                            <span>•</span>
                            <span>Order #{order.id}</span>
                            {order.verifiedPickup && (
                              <>
                                <span>•</span>
                                <span className="text-stone-600 font-medium">Pickup verified</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pricing & Buttons */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 gap-1.5 shrink-0">
                        <div className="text-left sm:text-right">
                          <div className="flex items-baseline gap-1.5 sm:justify-end">
                            <span className="text-base font-extrabold text-[#2E7D32]">{order.price}</span>
                            <span className="text-xs text-stone-400 line-through">{order.originalPrice}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-[#FF8A3D] block">{order.savedText}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <button 
                            onClick={() => setReceiptModalOrder(order)}
                            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-semibold transition-colors"
                          >
                            Receipt
                          </button>
                          <button 
                            onClick={() => showToast(`Opening ${order.store} store profile`)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-semibold shadow-2xs transition-colors"
                          >
                            {order.category === 'bakeries' ? 'Reorder' : 'Store Profile'}
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Show older rescues button */}
            <button
              onClick={() => {
                setShowOlderRescues(!showOlderRescues);
                showToast(showOlderRescues ? 'Showing current rescues' : 'Loaded 2 older rescues from September 2024');
              }}
              className="w-full py-3 rounded-2xl bg-stone-100/90 hover:bg-stone-200/80 text-stone-700 text-xs font-semibold transition-colors text-center cursor-pointer border border-stone-200/60"
            >
              {showOlderRescues ? 'Show Fewer Rescues' : 'Show 2 Older Rescues (September 2024)'}
            </button>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Sidebar (Certificate, Preferences, Radar)   */}
          {/* ======================================================== */}
          <div className="space-y-4">
            
            {/* Card 1: Official Rescue Certificate */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
                  <h3 className="font-bold text-sm text-[#1C1C1E]">Rescue Certificate</h3>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                  Official 2024
                </span>
              </div>

              {/* Certificate Inner Preview */}
              <div className="p-4 rounded-xl bg-[#FFF8F0]/70 border border-amber-200/60 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-[#2E7D32] font-semibold uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> FOODSAVER OFFICIAL REGISTRY
                  </span>
                  <span className="text-stone-500 font-mono">ID: #FS-CA-2490</span>
                </div>
                <h4 className="font-bold text-sm text-[#1C1C1E]">Sarah Jenkins</h4>
                <p className="text-[11px] text-stone-500">Validated Environmental Contribution:</p>
                <div className="text-lg font-extrabold text-[#2E7D32] tracking-tight">
                  70.0 kg CO₂e Diverted
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-amber-200/40">
                  <span>San Francisco Bay Area</span>
                  <span className="font-mono">SHA256: 9b2d...f7</span>
                </div>
              </div>

              <button 
                onClick={() => setShowCertificateModal(true)}
                className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Download Certificate PDF</span>
              </button>
            </div>

            {/* Card 2: Rescue Preferences */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#1C1C1E]">Rescue Preferences</h3>
                <button 
                  onClick={() => showToast('Preference editor opened')}
                  className="text-xs font-semibold text-[#2E7D32] hover:underline"
                >
                  Edit All
                </button>
              </div>

              {/* Dietary Tags */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">Dietary Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    onClick={() => toggleTag('Vegetarian')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedTags.includes('Vegetarian')
                        ? 'bg-[#2E7D32]/10 border-[#2E7D32]/30 text-[#2E7D32]'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                    Vegetarian
                  </button>

                  <button 
                    onClick={() => toggleTag('Vegan')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedTags.includes('Vegan')
                        ? 'bg-[#2E7D32]/10 border-[#2E7D32]/30 text-[#2E7D32]'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                    Vegan
                  </button>

                  <button 
                    onClick={() => toggleTag('Nut Allergy Alert')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedTags.includes('Nut Allergy Alert')
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    Nut Allergy Alert
                  </button>
                </div>
              </div>

              {/* Radar Radius Slider */}
              <div className="space-y-2 pt-1 border-t border-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700">Rescue Radar Radius</span>
                  <span className="font-bold text-[#2E7D32]">{radarRadius} miles</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="10.0" 
                  step="0.5"
                  value={radarRadius}
                  onChange={(e) => setRadarRadius(parseFloat(e.target.value))}
                  className="w-full accent-[#2E7D32] cursor-pointer"
                />
                <p className="text-[11px] text-stone-500">Covers Mission District, Castro & Potrero Hill</p>
              </div>

              {/* Default Payment */}
              <div className="space-y-2 pt-1 border-t border-stone-100">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">Default Payment</span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100/80 border border-stone-200/80 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-4 bg-stone-800 rounded text-white flex items-center justify-center text-[9px] font-bold">
                      
                    </div>
                    <span className="text-stone-800">Apple Pay (•••• 4242)</span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Default</span>
                </div>
              </div>

              {/* Pickup Reminders Toggle */}
              <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                <div>
                  <span className="text-xs font-semibold text-[#1C1C1E] block">Pickup Reminders</span>
                  <span className="text-[11px] text-stone-500">Alert 15 mins before bag closes</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRemindersEnabled(!remindersEnabled);
                    showToast(remindersEnabled ? 'Pickup alerts disabled' : 'Pickup alerts enabled (15m before close)');
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    remindersEnabled ? 'bg-[#2E7D32]' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      remindersEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* Card 3: Mission District Radar Leaderboard */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-[#FF8A3D] flex items-center justify-center text-xs">
                    ⚡
                  </div>
                  <h3 className="font-bold text-sm text-[#1C1C1E]">Mission District Radar</h3>
                </div>
                <span className="text-xs font-bold text-[#FF8A3D] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  #3 SF
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Together with <strong className="text-stone-900">418 conscious neighbors</strong>, you diverted <strong className="text-emerald-700">1,420 kg</strong> of surplus food this month.
              </p>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg text-stone-600 hover:bg-stone-50">
                  <span>1. Hayes Valley</span>
                  <span className="font-semibold text-stone-900">1,890 kg</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg text-stone-600 hover:bg-stone-50">
                  <span>2. Richmond District</span>
                  <span className="font-semibold text-stone-900">1,540 kg</span>
                </div>
                {/* Active user highlight */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#2E7D32]/10 text-[#2E7D32] font-semibold border border-[#2E7D32]/20">
                  <div className="flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                    <span>3. Mission District (You)</span>
                  </div>
                  <span>1,420 kg</span>
                </div>
              </div>
            </div>

            {/* Card 4: Help, Policies & Sign out */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-xs space-y-1 text-xs font-medium text-stone-700">
              <button 
                onClick={() => showToast('Customer Help & FAQ opened')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-stone-500" />
                  <span>Customer Help & FAQs</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              <button 
                onClick={() => showToast('Refund & Bag Policy page opened')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-stone-500" />
                  <span>Refund & Bag Policies</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              <button 
                onClick={() => showToast('Signed out of account session')}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out of Sarah's account</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Footer Matching Screenshot */}
      <footer className="mt-12 bg-white border-t border-stone-200/80 pt-10 pb-8 px-4 sm:px-8 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Intro */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#2E7D32]" />
                <span className="font-bold text-base text-[#1C1C1E]">FoodSaver</span>
              </div>
              <p className="text-stone-500 text-xs leading-relaxed">
                Connecting conscious eaters with local bakeries, markets, and kitchens to eliminate urban food surplus.
              </p>
            </div>

            {/* Column 1 */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#1C1C1E]">Customer Portal</h4>
              <ul className="space-y-1.5 text-stone-500">
                <li className="hover:text-[#1C1C1E] cursor-pointer">Surplus Listings</li>
                <li className="hover:text-[#1C1C1E] cursor-pointer">Neighborhood Radar</li>
                <li className="hover:text-[#1C1C1E] cursor-pointer">Active Pickups</li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#1C1C1E]">Community</h4>
              <ul className="space-y-1.5 text-stone-500">
                <li className="hover:text-[#1C1C1E] cursor-pointer">Impact Calculator</li>
                <li className="hover:text-[#1C1C1E] cursor-pointer">Partner Stores</li>
                <li className="hover:text-[#1C1C1E] cursor-pointer">Food Rescue Guidelines</li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#1C1C1E]">Account</h4>
              <ul className="space-y-1.5 text-stone-500">
                <li className="hover:text-[#1C1C1E] cursor-pointer">Sarah's Preferences</li>
                <li className="hover:text-[#1C1C1E] cursor-pointer">Payment & Receipts</li>
                <li className="hover:text-[#1C1C1E] cursor-pointer">Help Center</li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright & Legal */}
          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
            <p>© 2024 FoodSaver Cooperative Inc. Rescuing meals daily.</p>
            <div className="flex items-center gap-4">
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span className="hover:underline cursor-pointer">Terms of Service</span>
              <span className="hover:underline cursor-pointer">Sustainability Disclosures</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ======================================================== */}
      {/* MODAL 1: Official Certificate PDF Preview Modal          */}
      {/* ======================================================== */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
                <h3 className="font-bold text-base text-[#1C1C1E]">Official 2024 Impact Certificate</h3>
              </div>
              <button 
                onClick={() => setShowCertificateModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Canvas Graphic */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#FFF8F0] to-white border-2 border-[#2E7D32]/30 text-center space-y-3 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-xl text-[#1C1C1E]">Certificate of Food Rescue Excellence</h4>
              <p className="text-xs text-stone-500">This certifies that</p>
              <p className="text-lg font-bold text-[#2E7D32]">Sarah Jenkins</p>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                has successfully diverted <strong>70.0 kg of CO₂e</strong> and saved <strong>28 fresh surplus meal bags</strong> from urban waste streams.
              </p>
              <div className="pt-4 border-t border-amber-200/50 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                <span>REGISTRY #FS-CA-2490</span>
                <span>VERIFIED 2024</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setShowCertificateModal(false);
                  showToast('Official PDF Certificate downloaded to your device!');
                }}
                className="flex-1 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Save PDF Certificate</span>
              </button>
              <button 
                onClick={() => setShowCertificateModal(false)}
                className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: Receipt View Modal                             */}
      {/* ======================================================== */}
      {receiptModalOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Rescue Receipt</span>
                <h3 className="font-bold text-sm text-[#1C1C1E]">{receiptModalOrder.id}</h3>
              </div>
              <button 
                onClick={() => setReceiptModalOrder(null)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Store</span>
                <span className="font-semibold text-stone-900">{receiptModalOrder.store}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Item</span>
                <span className="font-semibold text-stone-900 text-right">{receiptModalOrder.itemTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Time</span>
                <span className="text-stone-700">{receiptModalOrder.time}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">CO₂ Avoided</span>
                <span className="font-bold text-[#2E7D32]">{receiptModalOrder.co2}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold border-t border-stone-200">
                <span>Total Paid</span>
                <span className="text-[#2E7D32]">{receiptModalOrder.price}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setReceiptModalOrder(null);
                showToast(`Receipt for ${receiptModalOrder.id} downloaded!`);
              }}
              className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Digital Receipt</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
