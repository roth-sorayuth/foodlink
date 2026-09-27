import React from 'react';
import { Clock, AlertCircle, ArrowRight } from 'lucide-react';

export default function EndingSoonSection({ 
  items, 
  onClaimItem, 
  onSeeAll,
  limit = 2 
}) {
  const displayedItems = items.slice(0, limit);

  return (
    <section className="rounded-3xl bg-[#fbf4ea] p-4 sm:p-5 border border-[#f3e6d2] shadow-2xs space-y-3.5">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
              Ending Soon
            </h3>
            <p className="text-[11px] text-amber-900/80 font-medium">
              Closing within 45 mins
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {items.length > limit && onSeeAll && (
            <button
              onClick={onSeeAll}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 transition-colors cursor-pointer"
            >
              See all ({items.length}) ›
            </button>
          )}

          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#f1ddc4] text-amber-950 tracking-tight">
            Grab before gone!
          </span>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2.5">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-3 border border-[#f3e6d2]/80 shadow-2xs flex items-center justify-between gap-3 hover:border-amber-400 transition-colors"
          >
            {/* Left Image & Titles */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Thumbnail with countdown badge */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center">
                  <span className="text-[9px] font-bold text-amber-300">
                    {item.timeLeft}
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                  <span className="truncate max-w-[130px] font-medium text-slate-500">
                    {typeof item.store === 'string' ? item.store : item.store?.name || item.storeName || 'CAD Bakery'}
                  </span>
                  <span className="font-semibold text-slate-600 shrink-0">
                    {item.distance}
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {item.title}
                </h4>

                {/* Pricing row */}
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-sm font-extrabold text-slate-900">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-400 line-through">
                    ${item.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700">
                    {item.discountText}
                  </span>
                </div>
              </div>
            </div>

            {/* Claim Action Button */}
            <button
              onClick={() => onClaimItem(item)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Claim
            </button>
          </div>
        ))}
      </div>

      {/* View all urgent deals */}
      {items.length > limit && onSeeAll && (
        <button
          onClick={onSeeAll}
          className="w-full py-2.5 px-3 rounded-2xl bg-white/90 hover:bg-white text-amber-950 border border-[#f3e6d2] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
        >
          <span>See all {items.length} urgent rescues on Explore</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </section>
  );
}
