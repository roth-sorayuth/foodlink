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
  Sparkles,
  Plus,
  Minus,
  QrCode,
  X
} from 'lucide-react';

export default function CustomerCheckoutFlow({
  listing,
  quantity: initialQuantity = 1,
  listing,
  onBack,
  onConfirmPayment,
  onNavigateToProfile
}) {
  const [bringTote, setBringTote] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(580); // 09:40

  const title = listing?.title || 'Artisan Pastry & Sourdough Surprise Bag';
  const storeName = listing?.store || listing?.storeName || listing?.store?.name || 'CAD Bakery';
  const image = listing?.image || listing?.photoUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80';
  const address = listing?.address || listing?.store?.address || '422 St 178, Daun Penh';
  const pickupWindow = listing?.pickupTime || `${listing?.pickupStart || '6:30 PM'} – ${listing?.pickupEnd || '7:30 PM'}`;

  const priceNum = typeof listing?.price === 'number'
    ? listing.price
    : parseFloat(String(listing?.price || '4.99').replace(/[^0-9.]/g, '')) || 4.99;
  const origPriceNum = typeof listing?.originalPrice === 'number'
    ? listing.originalPrice
    : parseFloat(String(listing?.originalPrice || '16.00').replace(/[^0-9.]/g, '')) || 16.00;
  const savingsNum = Math.max(0, origPriceNum - priceNum);
  const discount = listing?.discount || (origPriceNum > 0 ? `${Math.round((savingsNum / origPriceNum) * 100)}% off` : '69% off');
  const fee = 0.49;
  const tax = Number((priceNum * 0.085).toFixed(2));
  const total = (priceNum + fee + tax).toFixed(2);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

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

  // Dynamic calculations based on quantity
  const unitPrice = 4.99;
  const unitOrigValue = 16.00;
  const unitSavings = 11.01;
  const platformFee = 0.49;
  const taxPerUnit = 0.42;

  const bagSubtotal = unitPrice * quantity;
  const origTotal = unitOrigValue * quantity;
  const totalSavings = unitSavings * quantity;
  const totalTax = taxPerUnit * quantity;
  const totalDue = bagSubtotal + platformFee + totalTax;

  const handlePayClick = () => {
    setShowQrModal(true);
  };

  const handleFinalizePayment = () => {
    setShowQrModal(false);
    if (onConfirmPayment) {
      onConfirmPayment({ quantity, totalDue: totalDue.toFixed(2) });
    }
  };

  return (
    <div className="space-y-4 pb-28 relative">

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
          <span>Held for {formatTimer(timerSeconds)} • {quantity} Bag{quantity > 1 ? 's' : ''} reserved</span>
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
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#1b5e20] text-white text-[8px] font-black uppercase">
                  RESCUE
                </span>
              </div>

              <div className="space-y-0.5 flex-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> SURPLUS RESCUE
                </span>
                <h3 className="font-extrabold text-base text-[#1C1C1E]">Golden Gate Bakery & Cafe</h3>
                <div className="flex items-center justify-between pt-0.5">
                  <p className="text-xs font-bold text-stone-800">{quantity}× Pastry & Sourdough Surprise Bag</p>

                  {/* Quantity Adjustment Buttons */}
                  <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-200 rounded-lg px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="w-5 h-5 rounded bg-white text-stone-700 font-bold flex items-center justify-center disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-xs w-4 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => Math.min(5, prev + 1))}
                      disabled={quantity >= 5}
                      className="w-5 h-5 rounded bg-[#2E7D32] text-white font-bold flex items-center justify-center disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 flex items-center gap-1 pt-1">
                  <MapPin className="w-3 h-3 text-[#2E7D32]" />
                  <span>{address}</span>
                </p>
              </div>
            </div>

            {/* Pickup Time Window Card */}
            <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-amber-200/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">Pickup Time</span>
                  <span className="font-extrabold text-stone-900">{pickupWindow}</span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#D96B1C] text-[11px] font-bold">
                Today
              </span>
            </div>

            {/* Eco Impact Banner */}
            <div className="p-3 rounded-2xl bg-[#EAF7ED] border border-emerald-200/80 flex items-center gap-2 text-xs font-bold text-[#1b5e20]">
              <Leaf className="w-4 h-4 fill-emerald-600/30" />
              <span>{(2.5 * quantity).toFixed(1)} kg CO₂ emissions prevented by rescuing this bundle today!</span>
            </div>

            {/* Price Breakdown Table */}
            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Standard Store Value ({quantity}×)</span>
                <span className="line-through">${origTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[#2E7D32] font-bold">
                <span>Surplus Rescue Savings (69% off)</span>
                <span>-${totalSavings.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-stone-900">
                <span>Bag Price ({quantity}× ${unitPrice.toFixed(2)})</span>
                <span>${bagSubtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-stone-500">
                <span className="flex items-center gap-1">
                  <span>Platform & Climate Fee</span>
                  <Info className="w-3 h-3 text-stone-400" />
                </span>
                <span>${platformFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-stone-500">
                <span>Estimated Sales Tax</span>
                <span>${totalTax.toFixed(2)}</span>
              </div>

              <div className="flex items-baseline justify-between pt-3 border-t border-stone-200">
                <div>
                  <span className="font-extrabold text-base text-[#1C1C1E] block">Total Due Now</span>
                  <span className="text-[10px] text-amber-700 font-semibold">Guaranteed fresh or credited</span>
                </div>
                <span className="text-2xl font-black text-[#1b5e20]">${totalDue.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Tote Bag, Payment, Mini Map & Guarantee */}
        <div className="lg:col-span-5 space-y-4">

          {/* Reusable Tote Bag Incentive Card */}
          <div
            onClick={() => setBringTote(!bringTote)}
            className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-2xs ${bringTote
                ? 'bg-emerald-50/50 border-emerald-300'
                : 'bg-white border-stone-200/80 hover:bg-stone-50'
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${bringTote ? 'bg-[#1b5e20] text-white' : 'border-2 border-stone-300'
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
              <span className="text-xs font-bold text-[#2E7D32]">KHQR / Bakong / Card</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-6 bg-red-600 text-white rounded-md flex items-center justify-center font-black text-[9px] shadow-2xs">
                  KHQR
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <span>Bakong / KHQR Instant Pay</span>
                  </div>
                  <span className="text-[11px] text-stone-500">Scan or direct click to pay</span>
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
              onClick={handlePayClick}
              className="w-full py-4 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Confirm & Pay ${totalDue.toFixed(2)}</span>
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
            onClick={handlePayClick}
            className="w-full py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Confirm & Pay ${totalDue.toFixed(2)}</span>
          </button>
          <p className="text-[10px] text-stone-400 text-center">
            🔒 256-bit Encrypted Checkout • Instant Confirmation
          </p>
        </div>
      </div>

      {/* Small UI Logic: QR Code Modal with Direct Pay Button (No scan required!) */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden my-auto p-5 text-center space-y-4">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px] uppercase tracking-wider">
                  KHQR
                </span>
                <span className="text-xs font-bold text-stone-800">Instant Payment QR</span>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Total Price */}
            <div>
              <span className="text-xs text-stone-500 font-medium">Total Payment Amount</span>
              <div className="text-3xl font-black text-[#1b5e20] mt-0.5">${totalDue.toFixed(2)}</div>
              <span className="text-[11px] text-stone-400 font-medium">
                {quantity} Surprise Bag{quantity > 1 ? 's' : ''} · Golden Gate Bakery
              </span>
            </div>

            {/* Styled QR Code Box */}
            <div className="relative mx-auto w-48 h-48 p-3 bg-white rounded-2xl border-2 border-red-500 shadow-xs flex flex-col items-center justify-center">
              <div className="absolute top-1.5 left-2 text-[9px] font-black text-red-600 tracking-widest">
                KHQR
              </div>
              <div className="absolute top-1.5 right-2 text-[9px] font-bold text-stone-400">
                BAKONG
              </div>

              <div className="w-36 h-36 bg-stone-950 p-2 rounded-xl flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                  <rect x="5" y="5" width="28" height="28" fill="white" rx="4" />
                  <rect x="9" y="9" width="20" height="20" fill="black" rx="2" />
                  <rect x="13" y="13" width="12" height="12" fill="white" rx="1" />

                  <rect x="67" y="5" width="28" height="28" fill="white" rx="4" />
                  <rect x="71" y="9" width="20" height="20" fill="black" rx="2" />
                  <rect x="75" y="13" width="12" height="12" fill="white" rx="1" />

                  <rect x="5" y="67" width="28" height="28" fill="white" rx="4" />
                  <rect x="9" y="71" width="20" height="20" fill="black" rx="2" />
                  <rect x="13" y="75" width="12" height="12" fill="white" rx="1" />

                  <rect x="38" y="10" width="8" height="8" fill="white" />
                  <rect x="50" y="10" width="8" height="8" fill="white" />
                  <rect x="38" y="22" width="6" height="6" fill="white" />
                  <rect x="48" y="22" width="10" height="6" fill="white" />

                  <rect x="10" y="38" width="12" height="6" fill="white" />
                  <rect x="26" y="38" width="8" height="8" fill="white" />
                  <rect x="40" y="36" width="18" height="18" fill="white" />
                  <rect x="65" y="38" width="12" height="8" fill="white" />

                  <rect x="38" y="66" width="8" height="10" fill="white" />
                  <rect x="50" y="66" width="6" height="6" fill="white" />
                  <rect x="62" y="68" width="12" height="8" fill="white" />
                </svg>

                <div className="absolute inset-0 m-auto w-8 h-8 rounded-md bg-red-600 border-2 border-white flex items-center justify-center text-white font-black text-[8px]">
                  KHQR
                </div>
              </div>
            </div>

            {/* Note stating no scan needed */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>No scan needed! Just click pay below</span>
            </div>

            {/* Direct Click to Pay Button */}
            <button
              onClick={handleFinalizePayment}
              className="w-full py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Pay ${totalDue.toFixed(2)}</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
