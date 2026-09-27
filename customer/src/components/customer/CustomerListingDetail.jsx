import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  Clock,
  Flame,
  ShoppingBag,
  Leaf,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Navigation,
  Check
} from 'lucide-react';

export default function CustomerListingDetail({
  listing,
  onBack,
  onProceedToCheckout,
  onNavigateToProfile
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 14, seconds: 43 });

  // Dynamic listing properties with high-fidelity defaults
  const title = listing?.title || 'Artisan Pastry & Sourdough Surprise Bag';
  const storeName = listing?.store || listing?.storeName || listing?.store?.name || 'CAD Bakery';
  const category = listing?.category || 'Bakery & Pastries';
  const image = listing?.image || listing?.photoUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80';
  const price = typeof listing?.price === 'number' ? `$${listing.price.toFixed(2)}` : listing?.price || '$4.99';
  const originalPrice = typeof listing?.originalPrice === 'number' ? `$${listing.originalPrice.toFixed(2)}` : listing?.originalPrice || '$16.00';
  const discount = listing?.discount || 'Save 69%';
  const bags = listing?.remaining !== undefined ? listing.remaining : (listing?.bagsAvailable || 3);
  const address = listing?.address || listing?.store?.address || '422 St 178, Daun Penh';
  const distance = listing?.distance || listing?.store?.distance || '0.4 mi (8 min walk)';
  const rating = listing?.rating || listing?.store?.rating || '4.9';
  const pickupTime = listing?.pickupTime || `${listing?.pickupStart || '6:30 PM'} – ${listing?.pickupEnd || '7:30 PM'}`;
  const description = listing?.description || "Help us prevent delicious food from going to waste! You will receive an assortment of today's unsold fresh artisan bakery surplus. Contents vary daily based on surplus.";

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (n) => String(n).padStart(2, '0');

  return (
    <div className="space-y-4 pb-28">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-stone-200/90 hover:bg-stone-50 flex items-center justify-center text-stone-700 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-sm shadow-2xs">
            👨‍🍳
          </div>
          <h1 className="font-extrabold text-base text-[#1C1C1E]">Listing Details</h1>
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

      {/* Responsive Grid Layout (2 cols on lg, 1 col on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Hero Media, Info, Gallery & Reviews         */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Hero Image Banner */}
          <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden bg-stone-100 shadow-xs group">
            <img
              src={image}
              alt={storeName}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

            {/* Top Badges */}
            <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/95 text-stone-800 text-xs font-bold shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                  <span>🥐</span>
                  <span>{category}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-[#1b5e20]/90 text-white text-xs font-bold shadow-xs flex items-center gap-1 backdrop-blur-xs">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>Eco Champion</span>
                </span>
              </div>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-xs text-stone-700 hover:text-rose-500 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Bottom Floating Partner Badges */}
            <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#1b5e20] text-white text-xs font-bold shadow-xs flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Verified Partner</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-xs font-bold shadow-xs">
                🥐 2,410+ Bags Rescued
              </span>
            </div>
          </div>

          {/* Store Name & Location Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1C1C1E] tracking-tight">
                  {storeName}
                </h2>
                <p className="text-xs text-stone-500 font-medium">Artisanal Bakery & Sustainable Cafe</p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-[#2E7D32] text-xs font-black flex items-center gap-1 shrink-0">
                <Star className="w-3.5 h-3.5 fill-[#2E7D32] text-[#2E7D32]" />
                <span>{rating}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-600">
              <span className="text-[#D96B1C] flex items-center gap-1">
                🏆 Top Rated Rescue (342 reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-stone-500 font-normal">
                <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>{distance}</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs">
              <span className="text-stone-700 font-medium">{address}</span>
              <button className="font-bold text-[#2E7D32] hover:underline flex items-center gap-1">
                <span>View Map</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Urgency Alert Countdown */}
          <div className="bg-[#FFEFE7] border border-orange-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-[#8C3A00]">Hurry! Only {bags} bags left today</h4>
                <p className="text-[11px] text-[#8C3A00]/80">High rescue demand nearby</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Closes in</span>
              <span className="font-mono font-black text-sm text-[#8C3A00]">
                {formatDigits(timeLeft.hours)}:{formatDigits(timeLeft.minutes)}:{formatDigits(timeLeft.seconds)}
              </span>
            </div>
          </div>

          {/* Surplus Mystery Offer Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-emerald-800">
                <ShoppingBag className="w-4 h-4 text-[#2E7D32]" />
                <span>SURPLUS MYSTERY OFFER</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-orange-100 text-[#D96B1C] text-xs font-bold">
                {discount}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-[#1C1C1E]">{title}</h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {description}
              </p>
            </div>

            {/* 3-Photo Gallery Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="h-24 rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80"
                  alt="Bread assortment"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-24 rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=300&q=80"
                  alt="Sourdough round"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative h-24 rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80"
                  alt="Daily mix"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                  + Daily mix
                </div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 font-semibold flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Vegetarian Friendly</span>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 font-semibold flex items-center gap-1.5">
                <span>🥖</span>
                <span>Freshly Baked Today</span>
              </span>
              <span className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>100% Edible Surplus</span>
              </span>
            </div>
          </div>

          {/* Rescuer Reviews Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#1C1C1E]">Rescuer Reviews</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
                  <span>4.9</span>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                </span>
              </div>
              <button className="text-xs font-bold text-[#2E7D32] hover:underline">See all 342</button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Review 1 */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center text-[10px]">
                      M
                    </span>
                    <span className="font-bold text-stone-800">Marcus L.</span>
                    <span className="text-stone-400 font-normal">· Yesterday</span>
                  </div>
                  <div className="text-amber-400">★★★★★</div>
                </div>
                <p className="text-stone-600 leading-relaxed italic">
                  "Always delicious! Got 2 warm baguettes and 4 pastries worth way over $20. Staff is super warm and quick."
                </p>
              </div>

              {/* Review 2 */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-200 text-orange-950 font-bold flex items-center justify-center text-[10px]">
                      S
                    </span>
                    <span className="font-bold text-stone-800">Sarah T.</span>
                    <span className="text-stone-400 font-normal">· 3 days ago</span>
                  </div>
                  <div className="text-amber-400">★★★★★</div>
                </div>
                <p className="text-stone-600 leading-relaxed italic">
                  "The sourdough loaf was still crusty and kept wonderfully for days. Rescuing food here has become my weekly ritual!"
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Logistics, Location Map, and Reservation   */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          
          {/* Pickup Logistics Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 font-extrabold text-sm text-[#1C1C1E]">
              <Clock className="w-4 h-4 text-stone-600" />
              <span>Pickup Logistics</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2E7D32] block">
                SCHEDULED WINDOW
              </span>
              <div className="font-black text-base text-[#1C1C1E]">{pickupWindow}</div>
              <p className="text-xs text-stone-500 flex items-center gap-1 pt-0.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Window closes promptly at end of time</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-start gap-2 text-xs text-stone-600 leading-relaxed">
              <span className="text-base leading-none">ℹ️</span>
              <p>
                Show your digital pickup pass at the main counter. <strong className="text-stone-800">Bring your own reusable tote bag</strong> to save an additional paper bag!
              </p>
            </div>
          </div>

          {/* Store Location Map Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#1C1C1E]">Store Location</span>
              <span className="text-xs font-semibold text-stone-500">{storeName}</span>
            </div>

            {/* Map Canvas Preview */}
            <div className="relative h-40 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=700&q=80"
                alt="Store map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/10" />

              {/* Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1b5e20] text-white flex items-center justify-center shadow-lg ring-4 ring-white animate-pulse">
                <MapPin className="w-4 h-4" />
              </div>

              {/* Bottom Address Button */}
              <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between p-2 rounded-xl bg-white/95 backdrop-blur-md shadow-xs text-xs">
                <span className="font-bold text-stone-800 truncate">{address}</span>
                <span className="font-extrabold text-[#2E7D32] text-[11px] shrink-0 ml-1">Open Navigation</span>
              </div>
            </div>
          </div>

          {/* Environmental Impact Banner */}
          <div className="p-3.5 rounded-2xl bg-[#EAF7ED] border border-emerald-200/80 flex items-center gap-3 shadow-2xs text-xs">
            <div className="w-10 h-10 rounded-2xl bg-[#1b5e20] text-white flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <span className="font-black text-sm text-[#1C1C1E] block">2.5 kg CO₂e saved per bag</span>
              <span className="text-[11px] text-stone-600">Every rescue directly prevents methane emissions from landfill waste.</span>
            </div>
          </div>

          {/* Desktop Summary & Action */}
          <div className="hidden lg:block bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-[#1C1C1E]">{price}</span>
                <span className="text-xs text-stone-400 line-through ml-2">{originalPrice} value</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#D96B1C] text-xs font-bold">
                {discount}
              </span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-4 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Reserve 1 Surprise Bag</span>
            </button>
            <p className="text-[11px] text-stone-400 text-center">
              ✔ Pay now • Free cancellation up to 2 hours before pickup
            </p>
          </div>

        </div>

      </div>

      {/* Sticky Bottom Action Bar (Mobile view) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-4 py-3 z-50">
        <div className="max-w-md mx-auto space-y-2">
          
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#1C1C1E]">{price}</span>
              <span className="text-xs text-stone-400 line-through">{originalPrice} value</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-100 text-[#D96B1C] text-[10px] font-bold">
                {discount}
              </span>
            </div>

            <span className="text-[11px] font-bold text-orange-600">🔥 Only {bags} left</span>
          </div>

          <button
            onClick={onProceedToCheckout}
            className="w-full py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Reserve 1 Surprise Bag</span>
          </button>

          <p className="text-[10px] text-stone-400 text-center">
            ✔ Pay now • Free cancellation up to 2 hours before pickup
          </p>

        </div>
      </div>

    </div>
  );
}
