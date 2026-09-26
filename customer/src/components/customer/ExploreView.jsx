import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  Search, 
  SlidersHorizontal, 
  Map as MapIcon, 
  List, 
  Crosshair, 
  Leaf, 
  Sparkles, 
  Zap, 
  Croissant, 
  Salad, 
  Cake, 
  Star, 
  Menu 
} from 'lucide-react';
import ExploreMapCard from './ExploreMapCard';
import ExploreRescueCard from './ExploreRescueCard';

export default function ExploreView({
  user,
  tags,
  mapPins,
  rescues,
  onRescueItem,
  onToggleFavorite,
  onOpenFilter,
}) {
  const [selectedTag, setSelectedTag] = useState('all');
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [radius, setRadius] = useState('2 km');
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusMenuOpen, setRadiusMenuOpen] = useState(false);

  // Filter items
  const filteredRescues = rescues.filter((item) => {
    if (selectedTag === 'ending' && !item.stockType.includes('urgent')) return false;
    if (selectedTag === 'pastries' && item.category !== 'pastries') return false;
    if (selectedTag === 'salad' && item.category !== 'salad') return false;
    if (selectedTag === 'healthy' && item.category !== 'healthy') return false;
    if (selectedTag === 'cake' && item.category !== 'cake') return false;
    if (selectedTag === 'top_rated' && item.rating < 4.8) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.store.toLowerCase().includes(q) ||
        item.packageTitle.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTagIcon = (iconName) => {
    switch (iconName) {
      case 'Zap':
        return Zap;
      case 'Croissant':
        return Croissant;
      case 'Salad':
        return Salad;
      case 'Cake':
        return Cake;
      case 'Leaf':
        return Leaf;
      case 'Star':
        return Star;
      default:
        return Sparkles;
    }
  };

  const getTagCount = (tagId) => {
    switch (tagId) {
      case 'ending':
        return rescues.filter((r) => r.stockType.includes('urgent')).length;
      case 'pastries':
        return rescues.filter((r) => r.category === 'pastries').length;
      case 'salad':
        return rescues.filter((r) => r.category === 'salad').length;
      case 'healthy':
        return rescues.filter((r) => r.category === 'healthy').length;
      case 'cake':
        return rescues.filter((r) => r.category === 'cake').length;
      case 'top_rated':
        return rescues.filter((r) => r.rating >= 4.8).length;
      case 'all':
      default:
        return rescues.length;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      
      {/* 1. Header: Location & Avatar */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-none mb-0.5">
            PICKUP AROUND
          </span>
          <div className="flex items-center gap-1.5 cursor-pointer">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-extrabold text-slate-900 truncate">
              {user.currentLocation.district}, PP
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Right Menu & Avatar */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={onOpenFilter}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Filter options"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-2xs"
          />
        </div>
      </div>

      {/* 2. Search Input with Filter Trigger */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cafes, bakeries, or dish..."
          className="w-full pl-10 pr-10 py-3 bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs outline-none transition-all"
        />
        <button
          onClick={onOpenFilter}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* 3. View Mode Toggle & Radius Pill */}
      <div className="flex items-center justify-between gap-3">
        {/* Segmented View Toggle */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-emerald-850 bg-[#0d4a36] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-emerald-850 bg-[#0d4a36] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
        </div>

        {/* Radius Selector */}
        <div className="relative">
          <button
            onClick={() => setRadiusMenuOpen(!radiusMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200/90 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-700" />
            <span>Radius: {radius}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {radiusMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              {['1 km', '2 km', '5 km', '10 km'].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRadius(r);
                    setRadiusMenuOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-semibold cursor-pointer ${
                    radius === r ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Within {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Horizontal Filter Tag Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        {tags.map((tag) => {
          const isSelected = selectedTag === tag.id;
          const Icon = getTagIcon(tag.icon);
          const count = getTagCount(tag.id);
          const labelTitle = tag.label.split(' (')[0];

          return (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-850 bg-[#0d4a36] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
              }`}
            >
              {Icon && (
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isSelected ? 'text-emerald-300' : 'text-slate-500'
                  }`}
                />
              )}
              <span>{tag.name || labelTitle}</span>
              <span className={`text-[11px] font-medium ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* 5. Interactive Toul Kork Map Visualizer (Conditional on Map View) */}
      {viewMode === 'map' && (
        <ExploreMapCard
          pins={mapPins}
          onSelectPin={(pin) => {
            setSearchQuery(pin.store);
          }}
        />
      )}

      {/* 6. Community Impact Banner */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-2xs">
        <div className="p-1 rounded-lg bg-emerald-600 text-white shrink-0">
          <Leaf className="w-3.5 h-3.5" />
        </div>
        <p className="leading-snug">
          <strong>162 kg rescued in Toul Kork this week!</strong> Join your fellow students fighting food waste.
        </p>
      </div>

      {/* 7. Live Rescues Grid (1 col mobile, 2 cols tablet, 3 cols desktop) */}
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
              Live Rescues Nearby
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Ready for pickup within walking distance
            </p>
          </div>

          <button className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer">
            See All ({filteredRescues.length})
          </button>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 cols on tablet (md:), 3 cols on desktop (lg:) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredRescues.map((item) => (
            <ExploreRescueCard
              key={item.id}
              item={item}
              onRescue={onRescueItem}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
