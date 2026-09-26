import React from 'react';
import { 
  Clock, 
  Navigation, 
  Heart, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function DealsNearYou({
  deals,
  locationName = 'Toul Kork',
  onSelectDeal,
  onToggleFavorite,
  onSeeAll,
  onSeeMap,
  limit = 3,
}) {
  const displayedDeals = deals.slice(0, limit);

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            Deals Near You
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100/70 text-emerald-800">
            {locationName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onSeeMap && (
            <button
              onClick={onSeeMap}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer hidden sm:inline-block"
            >
              See map
            </button>
          )}

          <button
            onClick={onSeeAll}
            className="flex items-center gap-0.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            <span>See all ({deals.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel on Mobile / Responsive Grid on Desktop */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 overflow-x-auto sm:overflow-x-visible no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 snap-x snap-mandatory">
        {displayedDeals.map((deal) => {
          const isUrgentStock = deal.stockType === 'urgent';

          return (
            <div
              key={deal.id}
              className="w-[230px] sm:w-auto shrink-0 snap-start bg-white rounded-3xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group"
            >
              {/* Photo Area with Badges */}
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                  {/* Discount Badge */}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-2xs">
                    {deal.discount}
                  </span>

                  {/* Favorite Heart Button */}
                  <button
                    onClick={() => onToggleFavorite(deal.id)}
                    className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-rose-500 transition-colors shadow-2xs cursor-pointer"
                    aria-label="Save to favorites"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        deal.isFavorite ? 'text-rose-500 fill-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Pickup Window Time Pill */}
                <div className="absolute bottom-2 left-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/65 text-white backdrop-blur-md">
                    <Clock className="w-2.5 h-2.5 text-amber-300" />
                    <span>{deal.time}</span>
                  </span>
                </div>
              </div>

              {/* Details & Info */}
              <div className="pt-2.5 px-0.5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Store Name & Distance */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-slate-700 truncate max-w-[130px] text-[11px]">
                      {deal.store}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700">
                      <Navigation className="w-2.5 h-2.5" />
                      <span>{deal.distance}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug truncate">
                    {deal.displayTitle || deal.title}
                  </h4>
                </div>

                {/* Pricing & Rescue Action */}
                <div className="flex items-end justify-between pt-2.5 mt-2 border-t border-slate-100">
                  <div>
                    <span className="block text-[10px] text-slate-400 line-through leading-none mb-0.5">
                      ${deal.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm sm:text-base font-black text-slate-900 leading-none">
                      ${deal.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        isUrgentStock
                          ? 'text-rose-600 bg-rose-50'
                          : 'text-teal-700 bg-teal-50'
                      }`}
                    >
                      {deal.stockText}
                    </span>

                    <button
                      onClick={() => onSelectDeal(deal)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Rescue
                    </button>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* "See all deals on Explore" Action Button */}
      {deals.length > limit && (
        <div className="pt-1">
          <button
            onClick={onSeeAll}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white hover:bg-emerald-50 text-[#0d4a36] border border-emerald-200/80 font-extrabold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <span>See all {deals.length} deals on Explore</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </section>
  );
}
