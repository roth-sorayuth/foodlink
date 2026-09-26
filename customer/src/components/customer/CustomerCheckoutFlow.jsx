import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Lock,
  Clock,
  Check,
  CheckCircle2,
  MapPin,
  Leaf,
  Info,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function CustomerCheckoutFlow({
  onBack,
  onConfirmPayment,
  onNavigateToProfile
}) {
  const [bringTote, setBringTote] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(580); // 09:40

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 pb-28">
      
      {/* Top Header */}
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
          <h1 className="font-extrabold text-base text-[#1C1C1E]">Checkout Flow</h1>
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

      {/* Review & Reserve Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">CHECKOUT</span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1C1C1E] tracking-tight">Review & Reserve</h2>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
          <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
          <span>Step 2 of 2</span>
        </div>
      </div>

      {/* Reservation Hold Countdown Banner */}
      <div className="p-3.5 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-between text-xs font-bold shadow-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 animate-spin-slow" />
          <span>Held for {formatTimer(timerSeconds)} • Bag is reserved</span>
        </div>
        <Lock className="w-3.5 h-3.5" />
      </div>

      {/* Responsive Two-Column Layout (on desktop lg:grid-cols-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Order Summary & Item Card */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-2xs space-y-4">
            
            {/* Store & Item Identity */}
            <div className="flex items-start gap-3.5">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-2xs border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80"
                  alt="Item"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#1b5e20] text-white text-[8px] font-black uppercase">
                  RESCUE
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> ARTISAN BAKERY
                </span>
                <h3 className="font-extrabold text-base text-[#1C1C1E]">Golden Gate Bakery & C...</h3>
                <p className="text-xs font-semibold text-stone-700">1× Pastry & Sourdough Surprise Bag</p>
                <p className="text-[11px] text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#2E7D32]" />
                  <span>542 Valencia St, Mission District</span>
                </p>
              </div>
            </div>

            {/* Pickup Time Window Card */}
            <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-amber-200/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Pickup Time</span>
                  <span className="font-extrabold text-stone-900">Today, 6:30 PM – 7:30 PM</span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#D96B1C] text-[11px] font-bold">
                In 2 hrs
              </span>
            </div>

            {/* Eco Impact Banner */}
            <div className="p-3 rounded-2xl bg-[#EAF7ED] border border-emerald-200/80 flex items-center gap-2 text-xs font-bold text-[#1b5e20]">
              <Leaf className="w-4 h-4 fill-emerald-600/30" />
              <span>2.5 kg CO₂ emissions prevented by rescuing this bundle today!</span>
            </div>

            {/* Price Breakdown Table */}
            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Standard Store Value</span>
                <span className="line-through">$16.00</span>
              </div>

              <div className="flex justify-between text-[#2E7D32] font-bold">
                <span>Surplus Rescue Savings (69% off)</span>
                <span>-$11.01</span>
              </div>

              <div className="flex justify-between font-bold text-stone-900">
                <span>Bag Price</span>
                <span>$4.99</span>
              </div>

              <div className="flex justify-between text-stone-500">
                <span className="flex items-center gap-1">
                  <span>Platform & Climate Fee</span>
                  <Info className="w-3 h-3 text-stone-400" />
                </span>
                <span>$0.49</span>
              </div>

              <div className="flex justify-between text-stone-500">
                <span>Estimated Sales Tax</span>
                <span>$0.42</span>
              </div>

              <div className="flex items-baseline justify-between pt-3 border-t border-stone-200">
                <div>
                  <span className="font-extrabold text-base text-[#1C1C1E] block">Total Due Now</span>
                  <span className="text-[10px] text-amber-700 font-semibold">Guaranteed fresh or credited</span>
                </div>
                <span className="text-2xl font-black text-[#1b5e20]">$5.90</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Tote Bag, Payment, Mini Map & Guarantee */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Reusable Tote Bag Incentive Card */}
          <div
            onClick={() => setBringTote(!bringTote)}
            className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-2xs ${
              bringTote
                ? 'bg-emerald-50/50 border-emerald-300'
                : 'bg-white border-stone-200/80 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                bringTote ? 'bg-[#1b5e20] text-white' : 'border-2 border-stone-300'
              }`}>
                {bringTote && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#1C1C1E]">I'll bring my own tote bag</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#2E7D32] text-[10px] font-extrabold">
                    +10 pts
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Help eliminate single-use takeaway paper and unlock our Green Hero tier.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#1C1C1E]">Payment Method</span>
              <button className="text-xs font-bold text-[#2E7D32] hover:underline">Change</button>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-6 bg-black text-white rounded-md flex items-center justify-center font-bold text-[10px] shadow-2xs">
                  Pay
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <span>Apple Pay</span>
                    <span>•</span>
                    <span className="text-stone-400 font-normal">Default</span>
                  </div>
                  <span className="text-[11px] text-stone-500">Card ending in •••• 4242</span>
                </div>
              </div>

              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Zero-Risk Reservation Note */}
          <div className="flex items-start gap-2.5 text-xs text-stone-600 px-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong className="text-stone-800">Zero-risk reservation:</strong> Free cancellation until 4:30 PM (2 hours before pickup window).
            </p>
          </div>

          {/* Mini Map Location */}
          <div className="relative h-28 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-2xs">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=700&q=80"
              alt="San Francisco Map"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-900/15" />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-bold text-stone-800 shadow-xs">
              San Francisco
            </div>
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xs text-[11px] font-bold text-stone-800 shadow-xs flex items-center gap-1">
              <span>🚶</span>
              <span>0.4 mi away (8 min walk)</span>
            </div>
          </div>

          {/* Desktop Confirm CTA */}
          <div className="hidden lg:block space-y-2 pt-2">
            <button
              onClick={onConfirmPayment}
              className="w-full py-4 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Confirm & Pay $5.90</span>
            </button>
            <p className="text-[11px] text-stone-400 text-center">
              🔒 256-bit Encrypted Checkout • Instant Confirmation
            </p>
          </div>

        </div>

      </div>

      {/* Sticky Bottom Action Bar (Mobile view) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-4 py-3 z-50">
        <div className="max-w-md mx-auto space-y-1.5">
          <button
            onClick={onConfirmPayment}
            className="w-full py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Confirm & Pay $5.90</span>
          </button>
          <p className="text-[10px] text-stone-400 text-center">
            🔒 256-bit Encrypted Checkout • Instant Confirmation
          </p>
        </div>
      </div>

    </div>
  );
}
