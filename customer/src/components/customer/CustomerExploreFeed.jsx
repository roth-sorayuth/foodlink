import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Map,
  List,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  Heart,
  Sparkles,
  Leaf,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export default function CustomerExploreFeed({
  onSelectListing,
  onOpenMap,
  onNavigateToProfile,
  onNavigateToOrders
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [sortBy, setSortBy] = useState('closest');
  const [favorites, setFavorites] = useState(['gg-bakery']);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const categories = [
    { id: 'all', label: 'All', icon: null },
    { id: 'baked', label: 'Baked Goods', icon: '🥐' },
    { id: 'meals', label: 'Meals', icon: '🍱' },
    { id: 'groceries', label: 'Groceries', icon: '🛒' },
  ];

  const rescueItems = [
    {
      id: 'gg-bakery',
      store: 'Golden Gate Bakery & Cafe',
      title: 'Artisan Pastry & Sourdough Surprise Bag',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      reviewCount: '340+',
      distance: '0.4 mi',
      badgeText: 'Only 2 bags left',
      badgeColor: 'bg-orange-500 text-white',
      pickupTime: 'Today, 6:30 PM – 7:30 PM',
      price: '$4.99',
      originalPrice: '$16.00',
      discount: '70% OFF',
      buttonColor: 'bg-[#2E7D32] hover:bg-[#256629]'
    },
    {
      id: 'green-leaf',
      store: 'Green Leaf Organic Deli',
      title: 'Fresh Prepared Lunch & Salad Bag',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
      rating: '4.8',
      reviewCount: '190',
      distance: '0.8 mi',
      badgeText: '3 bags left',
      badgeColor: 'bg-orange-500 text-white',
      pickupTime: 'Today, 7:00 PM – 8:00 PM',
      price: '$5.49',
      originalPrice: '$18.00',
      discount: '69% OFF',
      buttonColor: 'bg-[#2E7D32] hover:bg-[#256629]'
    },
    {
      id: 'la-petite',
      store: 'La Petite Patisserie',
      title: 'French Macarons & Tartlets Bag',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80',
      rating: '4.9',
      reviewCount: '512',
      distance: '1.2 mi',
      badgeText: '1 bag left!',
      badgeColor: 'bg-orange-500 text-white',
      pickupTime: 'Today, 8:00 PM – 8:45 PM',
      price: '$3.99',
      originalPrice: '$14.00',
      discount: '72% OFF',
      buttonColor: 'bg-[#FF8A3D] hover:bg-[#e07328]'
    }
  ];

  return (
    <div className="space-y-4">
      
      {/* Top Search Bar with Filter Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search bakeries, cafes, groceries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200/90 rounded-2xl text-xs sm:text-sm font-medium text-[#1C1C1E] placeholder:text-stone-400 shadow-2xs focus:bg-white focus:ring-1 focus:ring-[#2E7D32] outline-none transition-all"
          />
        </div>

        <button
          className="w-10 h-10 rounded-2xl bg-white border border-stone-200/90 flex items-center justify-center text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#1b5e20] text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {cat.icon && <span>{cat.icon}</span>}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Mini Map Toggle Card (Mission District, SF) */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-2xs bg-stone-100 h-40 sm:h-48 group">
        {/* Map Illustration Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/40" />

        {/* Location Pill Top Left */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-stone-800 shadow-xs flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#2E7D32]" />
            <span>Mission District, SF</span>
          </span>
        </div>

        {/* Floating Price Pins */}
        <div className="absolute top-8 left-14 animate-bounce">
          <span className="px-2.5 py-0.5 rounded-full bg-white text-stone-900 text-[10px] font-extrabold shadow-md flex items-center gap-1 border border-stone-200">
            🥐 $4.99
          </span>
        </div>

        <div className="absolute top-12 right-20">
          <span className="px-2.5 py-0.5 rounded-full bg-white text-stone-900 text-[10px] font-extrabold shadow-md flex items-center gap-1 border border-stone-200">
            🥗 $5.49
          </span>
        </div>

        <div className="absolute bottom-10 right-12">
          <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-extrabold shadow-md flex items-center gap-1">
            🧁 $3.99
          </span>
        </div>

        {/* User Green Dot */}
        <div className="absolute top-16 left-32 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white shadow-md animate-pulse" />

        {/* Bottom Map/List Toggle Control */}
        <div className="absolute bottom-3 right-3">
          <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-md border border-stone-200 text-xs font-bold text-stone-700">
            <button
              onClick={onOpenMap}
              className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition-colors ${
                viewMode === 'map' ? 'bg-[#1b5e20] text-white' : 'hover:text-stone-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-stone-100 text-stone-900' : 'hover:text-stone-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Community Impact Banner */}
      <div 
        onClick={onNavigateToProfile}
        className="p-3.5 rounded-2xl bg-[#EAF7ED] border border-emerald-200/80 flex items-center justify-between text-xs font-medium text-stone-800 cursor-pointer hover:bg-emerald-100/70 transition-colors shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1b5e20] text-white flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4 fill-white/20" />
          </div>
          <div>
            <span className="font-extrabold text-[#1C1C1E] block">14,230 meals saved in SF</span>
            <span className="text-[11px] text-stone-600">42.8 tons CO₂ prevented this month</span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-stone-400" />
      </div>

      {/* Rescues Nearby Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-extrabold text-[#1C1C1E]">Rescues Nearby</h2>
          <span className="text-xs font-semibold text-stone-500">18 available</span>
        </div>

        <button className="flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900">
          <span>Closest</span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </button>
      </div>

      {/* Rescue Deal Cards (Responsive: 1 col on mobile, 2 on tablet, 3 on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rescueItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectListing(item)}
            className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
          >
            {/* Image Container with Badges */}
            <div className="relative h-48 w-full overflow-hidden bg-stone-100">
              <img
                src={item.image}
                alt={item.store}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Urgency Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-xs ${item.badgeColor}`}>
                  {item.badgeText}
                </span>
              </div>

              {/* Heart Favorite Button */}
              <button
                onClick={(e) => toggleFavorite(item.id, e)}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs text-stone-600 hover:text-rose-500 transition-colors"
              >
                <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Rating & Distance Badges */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-bold text-stone-900 shadow-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                  <span className="text-stone-400 font-normal">({item.reviewCount})</span>
                </span>

                <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-bold text-stone-700 shadow-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#2E7D32]" />
                  <span>{item.distance}</span>
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-bold text-base text-[#1C1C1E]">{item.store}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{item.title}</p>
                
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mt-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{item.pickupTime}</span>
                </div>
              </div>

              {/* Price & Reserve Button */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-black text-lg text-[#1C1C1E]">{item.price}</span>
                  <span className="text-xs text-stone-400 line-through">{item.originalPrice}</span>
                  <span className="text-[11px] font-bold text-[#2E7D32] bg-emerald-50 px-1.5 py-0.5 rounded">
                    {item.discount}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectListing(item);
                  }}
                  className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs transition-transform active:scale-95 ${item.buttonColor}`}
                >
                  Reserve
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
