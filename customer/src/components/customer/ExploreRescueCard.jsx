import React from 'react';
import { 
  Heart, 
  Star, 
  Clock, 
  ArrowRight, 
  Footprints, 
  MapPin 
} from 'lucide-react';

export default function ExploreRescueCard({
  item,
  onRescue,
  onToggleFavorite,
}) {
  const isDangerStock = item.stockType === 'urgent_danger';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between overflow-hidden group">
      
      {/* Photo Area */}
      <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.packageTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-2xs">
            {item.discount}
          </span>

          <button
            onClick={() => onToggleFavorite(item.id)}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-rose-500 transition-colors shadow-2xs cursor-pointer"
            aria-label="Save to favorites"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                item.isFavorite ? 'text-rose-500 fill-rose-500' : ''
              }`}
            />
          </button>
        </div>

        {/* Bottom Stock Badge inside photo */}
        <div className="absolute bottom-2.5 left-2.5">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold backdrop-blur-md shadow-2xs ${
              isDangerStock
                ? 'bg-rose-600 text-white'
                : 'bg-black/65 text-white'
            }`}
          >
            {item.stockText}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Walking Distance & Star Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1 font-medium truncate text-[11px] text-slate-600">
              <Footprints className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{item.walkDistance} • {item.address}</span>
            </span>

            <span className="flex items-center gap-0.5 font-bold text-[11px] text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100 shrink-0">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              {item.rating}
            </span>
          </div>

          {/* Store & Package Title */}
          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
            {item.store}
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
            {item.packageTitle}
          </p>

          {/* Pickup Window */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 mt-2">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Pickup: <strong className="text-slate-700">{item.pickupWindow}</strong></span>
          </div>
        </div>

        {/* Pricing & Rescue Button */}
        <div className="flex items-end justify-between pt-3 mt-3 border-t border-slate-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                ${item.price.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ${item.originalPrice.toFixed(2)}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">
              {item.khrPrice}
            </span>
          </div>

          <button
            onClick={() => onRescue(item)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-850 bg-[#0d4a36] hover:bg-emerald-800 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
          >
            <span>Rescue Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
