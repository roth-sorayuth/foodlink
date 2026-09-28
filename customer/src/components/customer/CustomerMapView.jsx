import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Navigation,
  MapPin,
  Utensils,
  Car,
  Star,
  Clock,
  ChevronRight,
  ShoppingBag,
  X
} from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';

export default function CustomerMapView({ listings = [], onSelectListing, onBackToDiscover }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPin, setSelectedPin] = useState(null);

  const pins = [
    {
      id: 'pin-1',
      name: 'One More Restaurant',
      category: 'Meals & Asian Cuisine',
      price: '$1.80',
      origPrice: '$3.60',
      time: '10:00 AM - 9:00 PM',
      rating: '4.7',
      distance: '1.2 km',
      street: 'Street 544, Khan Tuol Kouk',
      x: '68%',
      y: '22%',
      type: 'restaurant',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'pin-2',
      name: 'Golden Gate Bakery',
      category: 'Artisanal Bakery & Cafe',
      price: '$4.99',
      origPrice: '$16.00',
      time: '6:30 PM - 7:30 PM',
      rating: '4.9',
      distance: '0.4 km',
      street: 'Street 315, Tuek L\'ak',
      x: '46%',
      y: '51%',
      type: 'bakery',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'pin-3',
      name: 'Wwww Courier',
      category: 'Active Courier',
      x: '64%',
      y: '72%',
      type: 'courier',
    },
  ];

  const filteredPins = pins.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.street?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative w-full h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] rounded-3xl overflow-hidden bg-[#162130] text-white shadow-xl flex flex-col font-sans select-none">
      
      {/* Top Floating Search Bar (Matching Screenshot 2) */}
      <div className="absolute top-4 inset-x-4 z-30 max-w-md mx-auto">
        <div className="relative flex items-center bg-white rounded-full px-4 py-3 shadow-lg border border-stone-200">
          <Search className="w-5 h-5 text-[#2E7D32] shrink-0" />
          <input
            type="text"
            placeholder="Search for stores or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-8 text-xs sm:text-sm font-medium text-stone-800 placeholder:text-stone-400 outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stylized Dark Vector Map Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#162130]">
        
        {/* Dark Blue Grid and Road Network (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="city-blocks" width="120" height="90" patternUnits="userSpaceOnUse">
              <rect width="114" height="84" fill="#1C283A" rx="4" />
            </pattern>
          </defs>

          {/* District block base */}
          <rect width="100%" height="100%" fill="url(#city-blocks)" />

          {/* Large Zone Highlights */}
          <rect x="25%" y="42%" width="28%" height="16%" fill="#101824" rx="6" />
          <rect x="62%" y="15%" width="24%" height="18%" fill="#192333" rx="6" />
          <rect x="15%" y="68%" width="40%" height="22%" fill="#131B28" rx="6" />

          {/* Main Diagonal Boulevards */}
          <path d="M-50,220 L800,-40" stroke="#33465E" strokeWidth="14" strokeLinecap="round" />
          <path d="M-50,220 L800,-40" stroke="#486282" strokeWidth="6" strokeLinecap="round" />

          <path d="M-20,400 L850,280" stroke="#2B3C52" strokeWidth="12" strokeLinecap="round" />
          <path d="M-20,400 L850,280" stroke="#3F5573" strokeWidth="5" strokeLinecap="round" />

          {/* Vertical and Horizontal Connecting Streets */}
          <path d="M220,-20 L220,800" stroke="#2B3C52" strokeWidth="8" />
          <path d="M480,-20 L480,800" stroke="#344863" strokeWidth="10" />
          <path d="M480,-20 L480,800" stroke="#4B658A" strokeWidth="4" />

          <path d="M-20,180 L800,180" stroke="#2B3C52" strokeWidth="7" />
          <path d="M-20,380 L800,380" stroke="#2B3C52" strokeWidth="7" />
          <path d="M-20,540 L800,540" stroke="#2B3C52" strokeWidth="8" />

          {/* Secondary streets */}
          <line x1="80" y1="0" x2="80" y2="800" stroke="#233144" strokeWidth="4" />
          <line x1="340" y1="0" x2="340" y2="800" stroke="#233144" strokeWidth="4" />
          <line x1="640" y1="0" x2="640" y2="800" stroke="#233144" strokeWidth="4" />
          <line x1="0" y1="90" x2="800" y2="90" stroke="#233144" strokeWidth="3" />
          <line x1="0" y1="270" x2="800" y2="270" stroke="#233144" strokeWidth="3" />
          <line x1="0" y1="460" x2="800" y2="460" stroke="#233144" strokeWidth="3" />
          <line x1="0" y1="640" x2="800" y2="640" stroke="#233144" strokeWidth="3" />
        </svg>

        {/* Street Name Labels (Matching Screenshot 2) */}
        <div className="absolute top-[8%] left-[4%] text-[9px] font-mono text-stone-500 tracking-wider">
          STREET 1958
        </div>
        <div className="absolute top-[16%] left-[30%] text-[9px] font-mono text-stone-500 tracking-wider rotate-[320deg]">
          STREET 570
        </div>
        <div className="absolute top-[12%] right-[22%] text-[9px] font-mono text-stone-500 tracking-wider">
          STREET 544
        </div>
        <div className="absolute top-[26%] left-[34%] text-[9px] font-mono text-stone-500 tracking-wider">
          STREET 313
        </div>
        <div className="absolute top-[48%] left-[50%] text-[11px] font-bold text-stone-300 tracking-tight">
          TUEK L'AK TI MUOY
        </div>
        <div className="absolute top-[52%] right-[10%] text-[11px] font-extrabold text-stone-400 tracking-tight">
          KHAN TUOL KOUK
        </div>
        <div className="absolute top-[59%] left-[48%] text-[9px] font-mono text-stone-500">
          STREET 138
        </div>
        <div className="absolute top-[67%] right-[12%] text-[10px] font-bold text-stone-400">
          BOENG SALANG
        </div>

        {/* Map Pins */}

        {/* 1. User Blue Pulsing GPS Dot (Matching Screenshot 2) */}
        <div className="absolute top-[50%] left-[49%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 animate-ping absolute" />
          <div className="w-6 h-6 rounded-full bg-blue-500/40 flex items-center justify-center relative">
            <div className="w-3.5 h-3.5 rounded-full bg-[#1877F2] ring-2 ring-white shadow-lg" />
          </div>
        </div>

        {/* 2. Restaurant Pin: One More Restaurant (Screenshot 2) */}
        <button
          onClick={() => setSelectedPin(pins[0])}
          style={{ top: pins[0].y, left: pins[0].x }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-full bg-[#FF8A3D] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ring-2 ring-white/80">
            <Utensils className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#FF8A3D] text-white text-[10px] font-extrabold shadow-md whitespace-nowrap">
            One More Restaurant
          </span>
        </button>

        {/* 3. Bakery Pin: Golden Gate Bakery */}
        <button
          onClick={() => setSelectedPin(pins[1])}
          style={{ top: pins[1].y, left: pins[1].x }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ring-2 ring-white/80">
            <span>🥐</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#2E7D32] text-white text-[10px] font-extrabold shadow-md whitespace-nowrap">
            Golden Gate Bakery • $4.99
          </span>
        </button>

        {/* 4. Courier Vehicle Pin: Wwww (Screenshot 2) */}
        <div
          style={{ top: pins[2].y, left: pins[2].x }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1 bg-amber-400/90 text-stone-900 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-md"
        >
          <span>🚗</span>
          <span>Wwww</span>
        </div>

        {/* Mapbox / Apple Maps attribution tag bottom left */}
        <div className="absolute bottom-3 left-4 text-[10px] text-stone-500 font-bold flex items-center gap-1">
          <span> Maps</span>
          <span className="text-[9px] text-stone-600">Legal</span>
        </div>
      </div>

      {/* Selected Store Bottom Overlay Card */}
      {selectedPin && (
        <div className="absolute bottom-4 inset-x-4 z-40 max-w-sm sm:max-w-md mx-auto bg-white text-stone-900 rounded-3xl p-4 shadow-2xl border border-stone-200 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-stone-100 shadow-2xs">
                <OptimizedImage
                  src={selectedPin.image}
                  alt={selectedPin.name}
                  width={112}
                  height={112}
                  quality={70}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#1C1C1E]">{selectedPin.name}</h4>
                <p className="text-xs text-stone-500">{selectedPin.street}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-stone-600">
                  <span className="text-amber-500 flex items-center gap-0.5">★ {selectedPin.rating}</span>
                  <span>•</span>
                  <span>{selectedPin.distance}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPin(null)}
              className="text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100">
            <div>
              <span className="font-black text-base text-[#1C1C1E]">{selectedPin.price}</span>
              <span className="text-xs text-stone-400 line-through ml-1.5">{selectedPin.origPrice}</span>
            </div>

            <button
              onClick={() => {
                if (onSelectListing) onSelectListing(selectedPin);
              }}
              className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Reserve Bag
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
