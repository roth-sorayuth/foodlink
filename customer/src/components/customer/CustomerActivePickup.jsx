import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Navigation,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  Leaf,
  Check,
  Award
} from 'lucide-react';

export default function CustomerActivePickup({
  onBackToHome,
  onNavigateToProfile
}) {
  return (
    <div className="space-y-4 pb-20">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="w-9 h-9 rounded-full bg-white border border-stone-200/90 hover:bg-stone-50 flex items-center justify-center text-stone-700 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-sm shadow-2xs">
            👨‍🍳
          </div>
          <h1 className="font-extrabold text-base text-[#1C1C1E]">Active Pickup Screen</h1>
        </div>

        <button
          onClick={onNavigateToProfile}
          className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#2E7D32]/30 shadow-xs cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Sarah Jenkins"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* Hero Success State Banner */}
      <div className="text-center space-y-2.5 py-2">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-[#2E7D32] mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10 fill-[#2E7D32] text-white" />
          </div>
          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-orange-500 ring-2 ring-white" />
        </div>

        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF7ED] text-[#2E7D32] border border-emerald-200">
            <Leaf className="w-3.5 h-3.5" />
            <span>Surplus Rescued!</span>
          </span>

          <h2 className="text-2xl font-black text-[#1C1C1E] tracking-tight">You Rescued a Surprise Bag!</h2>
          <p className="text-xs text-stone-500 font-medium">Order #FS-84920 · Golden Gate Bakery & Cafe</p>
        </div>
      </div>

      {/* Main Responsive Layout (2 cols on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Digital Pickup Pass */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Digital Pickup Pass Barcode Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-2xs space-y-5 relative overflow-hidden">
            <div className="space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                OFFICIAL DIGITAL PICKUP PASS
              </span>
              <div className="font-mono text-2xl font-black text-[#1C1C1E] tracking-widest">
                SAVER - 7 8 9
              </div>
            </div>

            {/* Barcode Graphic */}
            <div className="p-4 bg-stone-50 rounded-2xl flex flex-col items-center justify-center space-y-2">
              <div className="w-full h-16 flex items-center justify-center gap-1">
                {[4, 2, 6, 2, 8, 3, 2, 5, 2, 7, 3, 4, 2, 6, 2, 8, 2, 4, 3, 5, 2, 7, 4, 2, 6, 3, 5].map((w, i) => (
                  <div key={i} className="h-12 bg-stone-900 rounded-xs" style={{ width: `${w}px` }} />
                ))}
              </div>
              <span className="text-[10px] font-mono text-stone-500 tracking-wider font-semibold">
                SCAN AT COUNTER UPON ARRIVAL
              </span>
            </div>

            {/* Dashed Tear-off Divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-stone-200" />
              </div>
            </div>

            {/* Pickup Window Timestamp */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-500" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Pickup Window</span>
                  <span className="font-extrabold text-stone-900 text-sm">Today, 6:30 PM – 7:30 PM</span>
                </div>
              </div>

              <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Milestone Unlocked Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1b5e20] text-white flex items-center justify-center text-lg shadow-2xs">
                🌱
              </div>
              <div>
                <span className="font-extrabold text-sm text-[#1C1C1E] block">Milestone Unlocked!</span>
                <span className="text-xs text-stone-500">You earned +10 Green Hero points</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#1b5e20] text-white font-black text-xs">
              Level 2
            </span>
          </div>

        </div>

        {/* Right Column: Store Location & Order Summary */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Store Location & Map Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center text-xl shrink-0">
                🏬
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#1C1C1E]">Golden Gate Bakery & Cafe</h3>
                <p className="text-xs text-stone-500">542 Valencia St, San Francisco, CA 94110</p>
              </div>
            </div>

            {/* Map Preview */}
            <div className="relative h-36 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=700&q=80"
                alt="Store directions map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/10" />

              <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-xs text-xs font-bold text-stone-800 shadow-xs flex items-center gap-1.5">
                <span>📍</span>
                <span>0.8 mi away</span>
              </div>
            </div>

            {/* Actions: Add to Calendar & Directions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                className="py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Calendar</span>
              </button>

              <button
                className="py-3 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions</span>
              </button>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#1C1C1E]">Order Summary</span>
              <span className="text-xs font-semibold text-stone-500">1 Item</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=160&q=80"
                  alt="Item"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-xs text-[#1C1C1E]">1× Artisan Pastry & Sourdoug...</h4>
                  <p className="text-[11px] text-stone-500">Golden Gate Bakery & Cafe</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-base text-[#1b5e20] block">$5.90</span>
                <span className="text-[10px] text-stone-400 line-through">$16.91</span>
              </div>
            </div>

            {/* Total Saved */}
            <div className="p-2.5 rounded-xl bg-[#EAF7ED] border border-emerald-200/70 flex items-center justify-between text-xs font-bold text-[#1b5e20]">
              <span className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                <span>Total Saved</span>
              </span>
              <span>$11.01 (65% off)</span>
            </div>

            {/* Remember Tote Alert */}
            <div className="p-3 rounded-2xl bg-[#FFEFE7] border border-orange-200/70 flex items-center gap-2.5 text-xs text-[#8C3A00] leading-relaxed">
              <span className="text-base shrink-0">🛍</span>
              <p>
                <strong className="font-bold">Remember your tote!</strong> Help us stay waste-free by bringing your own reusable bag.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Return to Home CTA */}
      <div className="pt-2 text-center">
        <button
          onClick={onBackToHome}
          className="px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
        >
          ← Back to Discover Rescues
        </button>
      </div>

    </div>
  );
}
