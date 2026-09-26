import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  Bell, 
  Leaf, 
  Check, 
  Utensils,
  Sparkles 
} from 'lucide-react';

export default function CustomerHeader({ user, onSelectLocation, notifCount = 1 }) {
  const [locationOpen, setLocationOpen] = useState(false);

  return (
    <header className="space-y-3.5 pt-1">
      {/* Top Bar: Brand Logo, Location Selector, Notification, Avatar */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
            <Utensils className="w-4 h-4" />
          </div>
          <span className="font-black text-base tracking-tight text-slate-900">
            Food<span className="text-emerald-600">link</span>
          </span>
        </div>

        {/* Location Dropdown */}
        <div className="relative min-w-0">
          <button
            onClick={() => setLocationOpen(!locationOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-slate-100/80 transition-colors text-left cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-0.5">
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[100px] sm:max-w-[140px]">
                  {user.currentLocation.district}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
              <span className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-wider block leading-none">
                {user.currentLocation.type}
              </span>
            </div>
          </button>

          {/* Location Selector Menu */}
          {locationOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select Pickup Location
                </p>
              </div>
              <div className="p-1 space-y-0.5">
                {user.availableLocations.map((loc, idx) => {
                  const isSelected = loc.district === user.currentLocation.district;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectLocation(loc);
                        setLocationOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <p className="font-semibold">{loc.district}, {loc.city}</p>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{loc.type}</span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: Notification & Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notification Bell */}
          <button 
            className="relative p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {notifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
            )}
          </button>

          {/* User Avatar */}
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-white shadow-2xs"
          />
        </div>
      </div>

      {/* Greeting & Personal Impact Badge */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>Good evening, {user.name}</span>
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium truncate">
            Ready to rescue delicious food tonight?
          </p>
        </div>

        {/* Impact Chip */}
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold shadow-2xs shrink-0">
          <Leaf className="w-3 h-3 text-emerald-600 fill-emerald-500/30 shrink-0" />
          <span>{user.savedKg} saved</span>
        </div>
      </div>
    </header>
  );
}
