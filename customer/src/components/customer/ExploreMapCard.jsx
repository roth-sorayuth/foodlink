import React, { useState } from 'react';
import { 
  Navigation, 
  Layers, 
  MapPin, 
  LocateFixed, 
  Compass, 
  Sparkles 
} from 'lucide-react';

export default function ExploreMapCard({ pins, onSelectPin }) {
  const [activePinId, setActivePinId] = useState('pin-1');

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-[#e4ede6] border border-[#d2e2d6] shadow-2xs">
      
      {/* Stylized Vector Map Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Land & Green Spaces */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-[#dbe8de]"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-[#d2e2d7] rounded-full blur-2xl opacity-60"></div>
        
        {/* Road Lines */}
        <svg className="w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
          {/* Main Boulevards */}
          <line x1="0" y1="90" x2="100%" y2="170" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
          <line x1="0" y1="180" x2="100%" y2="120" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
          <line x1="180" y1="0" x2="260" y2="100%" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
          <line x1="380" y1="0" x2="340" y2="100%" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          
          {/* Connecting Streets */}
          <line x1="80" y1="40" x2="300" y2="220" stroke="#ffffff" strokeWidth="6" />
          <line x1="280" y1="40" x2="480" y2="180" stroke="#ffffff" strokeWidth="6" />
          
          {/* Dashed Transit line */}
          <line x1="0" y1="120" x2="100%" y2="100" stroke="#86efac" strokeWidth="3" strokeDasharray="6 4" />
        </svg>

        {/* Neighborhood Labels */}
        <div className="absolute top-20 right-28 px-2 py-0.5 rounded bg-slate-700/60 backdrop-blur-xs text-[9px] font-extrabold text-white tracking-wide uppercase">
          Toul Kork Central
        </div>

        <div className="absolute bottom-20 left-1/3 px-2 py-0.5 rounded bg-slate-700/60 backdrop-blur-xs text-[9px] font-extrabold text-white tracking-wide uppercase">
          RUPP Campus
        </div>
      </div>

      {/* Top Left Active Status Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-slate-800 border border-slate-200/80 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>8 rescue hubs active now</span>
        </span>
      </div>

      {/* Map Pins */}
      {pins.map((pin) => {
        const isSelected = activePinId === pin.id;
        const isPrimary = pin.variant === 'primary' || isSelected;
        const isUrgent = pin.variant === 'urgent';

        return (
          <div
            key={pin.id}
            onClick={() => {
              setActivePinId(pin.id);
              onSelectPin(pin);
            }}
            className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            {/* Pill Price Label */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black shadow-md border transition-all ${
                isPrimary
                  ? 'bg-emerald-900 text-white border-emerald-950 ring-2 ring-emerald-400/40'
                  : isUrgent
                  ? 'bg-amber-600 text-white border-amber-700'
                  : 'bg-white/95 text-slate-800 border-slate-200'
              }`}
            >
              <span>{pin.price}</span>
              <span className={`text-[9px] font-medium ${isPrimary ? 'text-emerald-200' : 'text-slate-500'}`}>
                • {pin.left}
              </span>
            </div>

            {/* Locator pointer ring (for primary) */}
            {isPrimary && (
              <div className="w-3 h-3 rounded-full bg-emerald-700 border-2 border-white shadow-xs mx-auto -mt-0.5"></div>
            )}
          </div>
        );
      })}

      {/* User Current Position Dot */}
      <div className="absolute bottom-20 left-28 z-10 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-md animate-ping absolute"></div>
        <div className="w-3 h-3 rounded-full bg-emerald-800 border-2 border-white shadow-md z-10"></div>
      </div>

      {/* Floating Map Controls on Right */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => setActivePinId('pin-1')}
          className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer"
          title="Recenter location"
        >
          <LocateFixed className="w-4 h-4 text-emerald-700" />
        </button>
        <button
          className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer"
          title="Toggle map layers"
        >
          <Layers className="w-4 h-4 text-slate-600" />
        </button>
      </div>

    </div>
  );
}
