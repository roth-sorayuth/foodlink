import React from 'react';
import { Search, Mic, SlidersHorizontal } from 'lucide-react';

export default function CustomerSearchBar({ searchQuery, setSearchQuery, onOpenFilter }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Search Input Container */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search surplus bakeries, cafes, meals..."
          className="w-full pl-10 pr-10 py-3 bg-white hover:bg-slate-50/80 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 rounded-2xl border border-slate-200/90 shadow-2xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
        />

        {/* Voice Search Mic Icon */}
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Voice search"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Icon Button (Emerald) */}
      <button
        type="button"
        onClick={onOpenFilter}
        className="w-12 h-12 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-sm shadow-emerald-700/20 transition-colors shrink-0 cursor-pointer"
        title="Open filters"
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
}
