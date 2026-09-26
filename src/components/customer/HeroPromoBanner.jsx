import React from 'react';
import { ArrowRight, Sprout } from 'lucide-react';

export default function HeroPromoBanner({ onExploreDeals }) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-850 to-emerald-900 text-white overflow-hidden shadow-sm">
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-0 right-1/3 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-row items-stretch justify-between">
        
        {/* Left Content Area */}
        <div className="w-7/12 sm:w-8/12 p-4 sm:p-7 flex flex-col justify-between z-10">
          <div>
            {/* Tag */}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] sm:text-[11px] font-bold tracking-wide uppercase text-emerald-200 mb-2">
              <Sprout className="w-3 h-3 text-emerald-300 shrink-0" />
              <span>SAVE FOOD & MONEY</span>
            </div>

            {/* Headline */}
            <h2 className="text-sm sm:text-2xl font-black text-white tracking-tight leading-tight">
              Save up to 50% on bakery & cafe favorites
            </h2>

            {/* Subheading */}
            <p className="text-[10px] sm:text-xs text-emerald-100/90 mt-1 sm:mt-2 font-medium leading-normal line-clamp-2">
              Fresh surplus bundles prepared daily right before closing.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-3 sm:pt-4">
            <button
              onClick={onExploreDeals}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white text-slate-900 hover:bg-emerald-50 text-[11px] sm:text-xs font-black shadow-xs transition-all cursor-pointer"
            >
              <span>Explore Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Photo Area */}
        <div className="w-5/12 sm:w-4/12 relative min-h-[140px] sm:min-h-[180px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80"
            alt="Bakery favorites"
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay to merge into green */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-emerald-900 to-transparent"></div>
        </div>

      </div>
    </div>
  );
}
