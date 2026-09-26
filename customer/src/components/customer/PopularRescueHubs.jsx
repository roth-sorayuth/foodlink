import React from 'react';
import { 
  Coffee, 
  Croissant, 
  Cake, 
  Store, 
  CheckCircle, 
  Star 
} from 'lucide-react';

export default function PopularRescueHubs({ hubs, onSelectHub, onSeeAll }) {
  const getHubIcon = (type) => {
    switch (type) {
      case 'coffee':
        return Coffee;
      case 'croissant':
        return Croissant;
      case 'cake':
        return Cake;
      default:
        return Store;
    }
  };

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
            Popular Rescue Hubs
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Top-rated partner stores in Phnom Penh
          </p>
        </div>

        <button
          onClick={onSeeAll}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          See All
        </button>
      </div>

      {/* Hub Cards List */}
      <div className="space-y-2.5">
        {hubs.map((hub) => {
          const Icon = getHubIcon(hub.iconType);

          return (
            <div
              key={hub.id}
              onClick={() => onSelectHub(hub)}
              className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all flex items-center justify-between gap-3 cursor-pointer group"
            >
              {/* Left Brand Icon & Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Square Icon */}
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-slate-900 truncate">
                      {hub.name}
                    </h4>
                    {hub.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-0.5 font-bold text-slate-800">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {hub.rating}
                    </span>
                    <span>•</span>
                    <span className="truncate">{hub.tag}</span>
                    <span>•</span>
                    <span className="shrink-0">{hub.distance}</span>
                  </div>
                </div>
              </div>

              {/* Right: Bundles Badge & From Price */}
              <div className="text-right shrink-0">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 mb-0.5">
                  {hub.bundlesText}
                </span>
                <p className="text-[11px] text-slate-400 font-medium">
                  {hub.fromPriceText}
                </p>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
