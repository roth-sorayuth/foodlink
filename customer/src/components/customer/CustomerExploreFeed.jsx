import React, { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  Heart,
  MapPin,
  Star,
  ChevronRight,
  Bell,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  ExternalLink,
  X,
} from 'lucide-react';
import { socket, getActiveListings, playNotificationSound } from '../../services/api';

export default function CustomerExploreFeed({
  onSelectListing,
  onOpenMap,
  onNavigateToProfile,
  onNavigateToOrders,
  onOpenNotifications,
  unreadCount = 0,
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(['mori-bistro']);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [justAddedIds, setJustAddedIds] = useState(new Set());
  const [liveBannerListing, setLiveBannerListing] = useState(null);

  const categories = [
    { id: 'All', label: 'All' },
    { id: 'Pastry', label: 'Pastry' },
    { id: 'Asian', label: 'Asian' },
    { id: 'Italian', label: 'Italian' },
    { id: 'Healthy', label: 'Healthy' },
    { id: 'Food', label: 'Food' },
    { id: 'Dessert', label: 'Dessert' },
    { id: 'Drinks', label: 'Drinks' },
  ];

  // Helper to normalize listings into the UMAMI card shape from the screenshot
  const normalizeListing = (item) => {
    const origPriceNum = typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(item.originalPrice) || 3.60;
    const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 1.80;
    const remaining = item.bagsAvailable !== undefined ? item.bagsAvailable : (item.remainingCount || 3);

    return {
      id: item.id,
      store: item.storeName || item.store?.name || item.store || 'Mori Bistro',
      storeLogo: item.store?.logoUrl || (item.storeName?.includes('CAD') || item.title?.includes('CAD') ? '/cad-bakery-logo.png' : null) || item.photoUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80',
      title: item.title,
      description: item.description,
      image: item.photoUrl || item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      rating: item.store?.rating ? String(item.store.rating) : '4.7',
      distance: item.store?.distance || '1.7 km',
      pickupTime: item.pickupStart ? `${item.pickupStart}–${item.pickupEnd}` : '10:00 AM–9:00 PM',
      address: item.store?.address || '58 Street R8, Daun Penh',
      price: `$${priceNum.toFixed(2)}`,
      originalPrice: `$${origPriceNum.toFixed(2)}`,
      remaining,
      category: item.category || 'Meals',
      raw: item,
    };
  };

  // Curated demo listings highlighting CAD Bakery for demo
  const fallbackListings = [
    {
      id: 'cad-sourdough-box',
      store: 'CAD Bakery',
      storeLogo: '/cad-bakery-logo.png',
      title: 'Artisan Sourdough & Croissant Surprise Box',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      rating: '4.9',
      distance: '0.4 km',
      pickupTime: '6:30 PM–7:30 PM',
      address: '422 St 178, Daun Penh',
      price: '$4.99',
      originalPrice: '$16.00',
      remaining: 4,
      category: 'Pastry',
      description: 'Artisanal European sourdough loaves, buttery croissants, and morning viennoiserie baked fresh today.',
    },
    {
      id: 'cad-croissant-bundle',
      store: 'CAD Bakery',
      storeLogo: '/cad-bakery-logo.png',
      title: 'French Butter Croissant & Viennoiserie Bag',
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
      rating: '4.9',
      distance: '0.4 km',
      pickupTime: '6:00 PM–7:30 PM',
      address: '422 St 178, Daun Penh',
      price: '$3.99',
      originalPrice: '$13.50',
      remaining: 5,
      category: 'Pastry',
      description: 'Pure French butter croissants, almond escargot pastries, chocolate swirls, and brioche rolls.',
    },
    {
      id: 'cad-rustic-breads',
      store: 'CAD Bakery',
      storeLogo: '/cad-bakery-logo.png',
      title: 'Rustic Country Sourdough & Baguette Pack',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      rating: '4.9',
      distance: '0.4 km',
      pickupTime: '6:30 PM–8:00 PM',
      address: '422 St 178, Daun Penh',
      price: '$3.50',
      originalPrice: '$12.00',
      remaining: 3,
      category: 'Pastry',
      description: 'Two full-size artisan sourdough boules and crispy European baguettes freshly baked with organic wheat flour.',
    },
    {
      id: 'cad-sweet-dessert-box',
      store: 'CAD Bakery',
      storeLogo: '/cad-bakery-logo.png',
      title: 'Sweet Tartlets, Cakes & Danish Treats',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      rating: '4.9',
      distance: '0.4 km',
      pickupTime: '7:00 PM–8:30 PM',
      address: '422 St 178, Daun Penh',
      price: '$4.50',
      originalPrice: '$15.00',
      remaining: 3,
      category: 'Dessert',
      description: 'Fresh fruit tarts, custard brioches, cinnamon glazed knots, and seasonal pastry slices from today.',
    },
    {
      id: 'cad-savory-focaccia',
      store: 'CAD Bakery',
      storeLogo: '/cad-bakery-logo.png',
      title: 'Savory Focaccia & Stuffed Brioche Box',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
      rating: '4.9',
      distance: '0.4 km',
      pickupTime: '6:00 PM–7:30 PM',
      address: '422 St 178, Daun Penh',
      price: '$4.20',
      originalPrice: '$14.00',
      remaining: 2,
      category: 'Food',
      description: 'Rosemary sea salt focaccia squares, ham and gruyere melt twists, and savory olive rolls.',
    },
    {
      id: 'cad-coffee-pastry-pair',
      store: 'CAD Bakery',
      storeLogo: '/cad-bakery-logo.png',
      title: 'Barista Cold Brew & Afternoon Pastry Pair',
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
      rating: '4.9',
      distance: '0.4 km',
      pickupTime: '5:30 PM–7:00 PM',
      address: '422 St 178, Daun Penh',
      price: '$2.90',
      originalPrice: '$9.00',
      remaining: 6,
      category: 'Drinks',
      description: 'Bottled organic cold brew coffee or iced matcha latte paired with two fresh breakfast pastries.',
    },
    {
      id: 'mori-bistro',
      store: 'Mori Bistro',
      title: 'Japanese Donburi & Bento Surprise Bag',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      rating: '4.7',
      distance: '1.7 km',
      pickupTime: '10:00 AM–9:00 PM',
      address: '58 Street R8, Daun Penh',
      price: '$1.80',
      originalPrice: '$3.60',
      remaining: 3,
      category: 'Food',
      description: 'Fresh teriyaki chicken, katsu curry, or daily sushi roll surplus prepared today.',
    },
    {
      id: 'aus-bake',
      store: 'AusBake Pastries',
      title: 'Baking Pastries in Cambodia Since 2003',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      rating: '4.8',
      distance: '2.1 km',
      pickupTime: '11:00 AM–8:30 PM',
      address: '32 St 113, Boeng Keng Kang',
      price: '$2.50',
      originalPrice: '$5.00',
      remaining: 5,
      category: 'Pastry',
      description: 'Assortment of fresh meat pies, sausage rolls, spinach feta parcels and sweet danishes.',
    },
    {
      id: 'green-earth',
      store: 'Green Earth Grocers',
      title: 'Fresh Organic Produce & Dairy Box',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      rating: '4.8',
      distance: '0.8 km',
      pickupTime: '7:00 PM–8:30 PM',
      address: '890 Market St, Tuol Kouk',
      price: '$6.50',
      originalPrice: '$22.00',
      remaining: 2,
      category: 'Healthy',
      description: 'Assorted seasonal organic vegetables, fruit basket, and dairy surplus items.',
    },
  ];

  // 1. Fetch live listings from backend DB
  const loadListings = async () => {
    setIsLoading(true);
    try {
      const data = await getActiveListings(activeCategory === 'All' ? 'all' : activeCategory.toLowerCase(), searchQuery);
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeListing);
        // Combine with fallback to ensure full rich visual layout
        const combined = [...normalized];
        fallbackListings.forEach((fb) => {
          if (!combined.some((c) => c.title === fb.title || c.id === fb.id)) {
            combined.push(fb);
          }
        });
        setListings(combined);
      } else {
        setListings(fallbackListings);
      }
    } catch (err) {
      console.error('Failed to load listings:', err);
      setListings(fallbackListings);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [activeCategory]);

  // 2. Real-Time Socket.io listener for new listings
  useEffect(() => {
    const handleNewListing = (data) => {
      const item = data?.listing || data;
      const normalized = normalizeListing(item);

      // Play chime sound
      playNotificationSound();

      // Show live drop notification banner on dashboard
      setLiveBannerListing(normalized);

      // Instantly prepend to listings feed
      setListings((prev) => [normalized, ...prev.filter((l) => l.id !== normalized.id)]);
      setJustAddedIds((prev) => new Set(prev).add(normalized.id));

      setTimeout(() => {
        setJustAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(normalized.id);
          return next;
        });
      }, 15000);
    };

    socket.on('NEW_LISTING', handleNewListing);

    return () => {
      socket.off('NEW_LISTING', handleNewListing);
    };
  }, []);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Comprehensive, instant filtering based on active category & search query
  const filteredListings = listings.filter((item) => {
    // 1. Category filter
    const itemCat = (item.category || '').toLowerCase();
    const itemTitle = (item.title || '').toLowerCase();
    const activeCatLower = activeCategory.toLowerCase();

    let matchesCategory = true;
    if (activeCategory !== 'All') {
      matchesCategory =
        itemCat === activeCatLower ||
        itemCat.includes(activeCatLower) ||
        (activeCatLower === 'pastry' && (itemCat.includes('bak') || itemTitle.includes('pastry') || itemTitle.includes('bread') || itemTitle.includes('croissant'))) ||
        (activeCatLower === 'food' && (itemCat.includes('meal') || itemCat.includes('food') || itemCat.includes('bento'))) ||
        (activeCatLower === 'asian' && (itemTitle.includes('donburi') || itemTitle.includes('bento') || itemCat.includes('asian') || itemCat.includes('japanese')));
    }

    if (!matchesCategory) return false;

    // 2. Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (item.store || '').toLowerCase().includes(q) ||
      (item.title || '').toLowerCase().includes(q) ||
      (item.address || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 pb-24 font-sans text-stone-900">
      
      {/* 1. TOP SEARCH BAR + NOTIFICATION BELL */}
      <div className="flex items-center gap-3 pt-1">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#2E7D32]" />
          <input
            type="text"
            placeholder="Search by location, station, store name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-white border border-stone-200/90 rounded-full text-xs sm:text-sm font-medium text-[#1C1C1E] placeholder:text-stone-400 shadow-xs focus:ring-1 focus:ring-[#2E7D32] outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Notification Bell with Real-Time Badge */}
        <button
          onClick={() => {
            if (onOpenNotifications) {
              onOpenNotifications();
            } else if (onNavigateToOrders) {
              onNavigateToOrders();
            }
          }}
          className="relative w-11 h-11 rounded-full bg-white border border-stone-200/90 flex items-center justify-center text-[#2E7D32] hover:bg-[#EAF7ED]/50 transition-all shadow-xs shrink-0 cursor-pointer hover:scale-105 active:scale-95"
          title="Open Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 ? (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white shadow-sm animate-bounce">
              {unreadCount}
            </span>
          ) : (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#2E7D32] ring-2 ring-white" />
          )}
        </button>
      </div>

      {/* Search results counter when searching */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs">
          <div className="flex items-center gap-2 text-[#1b5e20] font-bold">
            <Search className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>
              Found {filteredListings.length} surplus bag{filteredListings.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-[11px] font-extrabold text-[#2E7D32] hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Live Surplus Drop Announcement Banner */}
      {liveBannerListing && (
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 border border-emerald-500/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/50 px-2 py-0.5 rounded text-white border border-white/20">
                  JUST LISTED NOW
                </span>
                <span className="text-xs font-bold truncate">
                  {liveBannerListing.store}
                </span>
              </div>
              <p className="text-xs font-medium text-emerald-100 truncate mt-0.5">
                {liveBannerListing.title} • <strong className="text-white font-extrabold">{liveBannerListing.price}</strong> ({liveBannerListing.remaining} left)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                onSelectListing(liveBannerListing);
                setLiveBannerListing(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-white text-[#2E7D32] font-black text-xs hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer flex items-center gap-1"
            >
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLiveBannerListing(null)}
              className="p-1 text-white/70 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        {/* Category Pills */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 shadow-2xs cursor-pointer active:scale-95 ${
              activeCategory === cat.id
                ? 'bg-[#2E7D32] text-white shadow-sm shadow-emerald-900/20 scale-102 font-extrabold'
                : 'bg-white border border-stone-200/80 text-stone-700 hover:bg-emerald-50/50 hover:border-emerald-200 hover:scale-102'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4. SECTION: "New on FoodLink" (Horizontal Carousel) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg sm:text-xl font-black text-[#1C1C1E] tracking-tight">
            New on FoodLink
          </h2>
          <button 
            onClick={() => setActiveCategory('All')}
            className="text-xs font-extrabold text-[#2E7D32] hover:text-[#256629] flex items-center gap-0.5 cursor-pointer hover:underline"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Card Carousel */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          {filteredListings.slice(0, 4).map((item, idx) => {
            const isJustAdded = justAddedIds.has(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onSelectListing(item)}
                style={{ animationDelay: `${idx * 80}ms` }}
                className={`w-[290px] sm:w-[320px] shrink-0 bg-white rounded-3xl overflow-hidden border food-card shadow-xs cursor-pointer flex flex-col group relative ${
                  isJustAdded ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/30' : 'border-stone-200/80 hover:border-emerald-500/50'
                }`}
              >
                {/* Hero Image Container */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.store}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Just Added Glowing Badge */}
                  {isJustAdded && (
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg ring-2 ring-white animate-pulse">
                      <Sparkles className="w-3 h-3 fill-amber-300 text-amber-300" />
                      <span>JUST LISTED</span>
                    </div>
                  )}

                  {/* Dark Discount Price Badge (strikethrough + bold price) */}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-white flex items-center gap-1.5 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <span className="text-[11px] text-stone-300 line-through font-normal">{item.originalPrice}</span>
                    <span className="text-base font-black text-white">{item.price}</span>
                  </div>

                  {/* Overhanging Store Logo Avatar on bottom left */}
                  <div className="absolute -bottom-3 left-4 w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-white shadow-md flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <img
                      src={item.storeLogo || item.image}
                      alt={item.store}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 pt-5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-base text-stone-900 truncate group-hover:text-[#2E7D32] transition-colors duration-200">
                      {item.store}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-black text-[#FF8A3D] shrink-0 group-hover:scale-105 transition-transform">
                      <span>★</span>
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  {/* Pickup Hours & Distance */}
                  <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#2E7D32] transition-colors" />
                      <span>Pick up: {item.pickupTime}</span>
                    </div>
                    <span className="text-stone-500 font-semibold">{item.distance}</span>
                  </div>

                  {/* Location & Heart Favorite Action */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                    <div className="flex items-center gap-1 text-xs text-stone-500 truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className="p-1.5 text-stone-400 hover:text-rose-500 active:scale-125 transition-all duration-200 cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all duration-200 ${
                          favorites.includes(item.id) ? 'fill-rose-500 text-rose-500 scale-110 heart-pop' : 'hover:scale-115'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SECTION: "All bags near you" */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg sm:text-xl font-black text-[#1C1C1E] tracking-tight">
            All bags near you
          </h2>
          <span className="text-xs font-bold text-stone-500">
            {filteredListings.length} surplus bags ready
          </span>
        </div>

        {/* Vertical Feed Cards */}
        {isLoading ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-stone-500">Loading nearby surplus bags...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-stone-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#1C1C1E]">No surplus bags found</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                {searchQuery ? `No results matching "${searchQuery}". Try searching for another store, bakery, or dish.` : 'No bags currently available in this category.'}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              Clear Search & Reset
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((item, idx) => {
              const isJustAdded = justAddedIds.has(item.id);
              return (
              <div
                key={item.id}
                onClick={() => onSelectListing(item)}
                style={{ animationDelay: `${Math.min(idx, 6) * 60}ms` }}
                className={`bg-white rounded-3xl overflow-hidden border food-card shadow-xs cursor-pointer flex flex-col group relative transition-all duration-300 ${
                  isJustAdded ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/40 shadow-md' : 'border-stone-200/80 hover:border-emerald-500/50'
                }`}
              >
                {/* Hero Image Banner */}
                <div className="relative h-48 sm:h-56 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.store}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  />

                  {/* Just Added Glowing Badge */}
                  {isJustAdded && (
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider shadow-lg ring-2 ring-white animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      <span>JUST LISTED</span>
                    </div>
                  )}

                  {/* Dark Discount Price Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white flex items-center gap-1.5 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <span className="text-xs text-stone-300 line-through font-normal">{item.originalPrice}</span>
                    <span className="text-lg font-black text-white">{item.price}</span>
                  </div>

                  {/* Overhanging Store Logo Avatar on bottom left */}
                  <div className="absolute -bottom-3 left-4 w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-white shadow-md flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <img
                      src={item.storeLogo || item.image}
                      alt={item.store}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 sm:p-5 pt-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-stone-900 group-hover:text-[#2E7D32] transition-colors duration-200">
                        {item.store}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">{item.title}</p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-black text-[#FF8A3D] shrink-0 group-hover:scale-105 transition-transform">
                      <span>★</span>
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  {/* Pickup Hours & Distance */}
                  <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#2E7D32] transition-colors" />
                      <span>Pick up: {item.pickupTime}</span>
                    </div>
                    <span className="text-stone-500 font-semibold">{item.distance}</span>
                  </div>

                  {/* Address & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-1 text-xs text-stone-500 truncate max-w-[240px]">
                      <MapPin className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className="p-1.5 text-stone-400 hover:text-rose-500 active:scale-125 transition-all duration-200 cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 transition-all duration-200 ${
                            favorites.includes(item.id) ? 'fill-rose-500 text-rose-500 scale-110 heart-pop' : 'hover:scale-115'
                          }`}
                        />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectListing(item);
                        }}
                        className="px-4 py-1.5 rounded-full bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold shadow-xs hover:shadow-md hover:shadow-emerald-900/20 active:scale-95 hover:scale-105 transition-all duration-200 cursor-pointer"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
