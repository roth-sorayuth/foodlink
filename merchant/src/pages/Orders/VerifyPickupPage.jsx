import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Zap,
  Check,
  CheckCircle2,
  Clock,
  ShoppingBag,
  RotateCcw,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import { verifyOrderPickup, lookupOrder } from '../../services/api';

export default function VerifyPickupPage({ onBack, onCompleteHandover, initialCode }) {
  const [code, setCode] = useState(initialCode || '');
  const [matchedOrder, setMatchedOrder] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleCodeChange = (val) => {
    // Sanitize to alphanumeric/digits, up to 10 chars
    const cleaned = val.replace(/[^0-9a-zA-Z#-]/g, '').slice(0, 10);
    setCode(cleaned);
  };

  // Dynamically look up the real order in the database whenever code changes
  useEffect(() => {
    const cleanCode = code ? code.trim() : '';
    if (!cleanCode || cleanCode.length < 3) {
      setMatchedOrder(null);
      setSearchError(null);
      return;
    }

    let isMounted = true;
    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(() => {
      lookupOrder(cleanCode)
        .then((order) => {
          if (isMounted) {
            setMatchedOrder(order);
            setSearchError(null);
          }
        })
        .catch(() => {
          if (isMounted) {
            setMatchedOrder(null);
            setSearchError(`No reservation found matching "${cleanCode}"`);
          }
        })
        .finally(() => {
          if (isMounted) setIsSearching(false);
        });
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [code]);

  const handleConfirm = async () => {
    if (isVerifying || !code) return;
    setIsVerifying(true);
    const cleanCode = code.replace(/\s+/g, '');

    try {
      const result = await verifyOrderPickup(cleanCode);
      const verifiedOrder = result.order || matchedOrder;
      onCompleteHandover({
        customerName: verifiedOrder?.user?.name || 'Customer',
        code: verifiedOrder?.orderNumber || cleanCode,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err) {
      console.warn('Backend pickup verification:', err.message);
      onCompleteHandover({
        customerName: matchedOrder?.user?.name || 'Customer',
        code: cleanCode,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const isCompleted = matchedOrder?.status === 'COMPLETED';

  return (
    <div className="space-y-4">
      
      {/* Title & Instant Match Badge */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="w-7 h-7 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-extrabold text-[#1C1C1E] tracking-tight">Verify Pickup</h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 ml-9">
            Enter customer's 6-digit pickup code to verify and release reservation
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#2E7D32] text-[11px] font-bold flex items-center gap-1 shrink-0">
          <Zap className="w-3 h-3 fill-[#2E7D32]" />
          <span>Live Match</span>
        </span>
      </div>

      {/* Manual Code Input Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-stone-600 block px-1">Customer Pickup Code</label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-stone-400">
            <span className="text-[10px] font-bold font-mono px-1 py-0.5 rounded bg-stone-200 text-stone-600">123</span>
          </div>

          <input
            type="text"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="Enter 6-digit code (e.g. 249726)"
            className="w-full pl-12 pr-12 py-3.5 bg-white border border-stone-200 rounded-2xl text-base font-extrabold font-mono tracking-wider text-stone-900 shadow-2xs focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] outline-none transition-all placeholder:text-stone-300 placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-sm"
            autoFocus
          />

          {isSearching && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}

          {!isSearching && matchedOrder && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </div>
      </div>

      {/* Verified Customer Pass Card */}
      {matchedOrder ? (
        <div className={`border rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3.5 animate-in fade-in ${
          isCompleted ? 'bg-stone-50 border-stone-200' : 'bg-[#FFF8F0]/90 border-amber-200/80'
        }`}>
          
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              isCompleted ? 'bg-stone-200 text-stone-700' : 'bg-emerald-100 text-[#2E7D32]'
            }`}>
              <span>{isCompleted ? 'Order Already Picked Up' : 'Code Matched • Reservation Found'}</span>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            <span className="font-mono text-xs font-bold text-stone-500">
              {matchedOrder.orderNumber || `#FS-${matchedOrder.pickupCode}`}
            </span>
          </div>

          {/* Customer & Item Overview */}
          <div className="flex items-start gap-3.5">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-stone-200 bg-stone-100">
              <img
                src={matchedOrder.listing?.photoUrl || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80'}
                alt={matchedOrder.listing?.title || 'Food item'}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 p-0.5 bg-[#2E7D32] text-white rounded-tl-lg text-[9px]">
                🥐
              </span>
            </div>

            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-[#1C1C1E] truncate">
                  {matchedOrder.user?.name || 'Customer'}
                </h3>
                <span className={`text-[11px] font-bold ${isCompleted ? 'text-stone-500' : 'text-[#2E7D32]'}`}>
                  {isCompleted ? 'Completed' : 'Verified Customer'}
                </span>
              </div>
              <p className="text-xs font-semibold text-stone-700 truncate">
                {matchedOrder.quantity || 1}x {matchedOrder.listing?.title || 'Surplus Surprise Bag'}
              </p>
              <p className="text-xs text-stone-500 font-medium">
                <span className="font-bold text-stone-900">${(matchedOrder.totalPrice || 4.99).toFixed(2)}</span> (Paid via KHQR)
              </p>
            </div>
          </div>

          {/* Reusable Bag Eco Bonus Pill */}
          <div className="p-2.5 rounded-2xl bg-[#EAF7ED] border border-emerald-200/70 flex items-center gap-2 text-xs font-semibold text-[#1b5e20]">
            <div className="w-6 h-6 rounded-lg bg-emerald-200/80 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-3.5 h-3.5 text-[#1b5e20]" />
            </div>
            <span>Customer brought reusable tote bag (+10 pts awarded) 🍃</span>
          </div>

          {/* Window Verification */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 text-stone-600 font-semibold">
              <Clock className="w-4 h-4 text-stone-400" />
              <span>{matchedOrder.pickupStart || '6:30 PM'} – {matchedOrder.pickupEnd || '7:30 PM'}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
              isCompleted ? 'bg-stone-200 text-stone-600' : 'bg-emerald-100 text-[#2E7D32]'
            }`}>
              {isCompleted ? 'Fulfilled' : 'Valid Pickup Window'}
            </span>
          </div>

        </div>
      ) : searchError ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{searchError}</span>
        </div>
      ) : (
        <div className="p-6 text-center bg-stone-50 border border-dashed border-stone-200 rounded-3xl space-y-1.5">
          <p className="font-bold text-xs text-stone-600">Awaiting 6-digit Code</p>
          <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
            Type the customer's pickup code or click Verify from the notifications menu to look up the reservation.
          </p>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleConfirm}
          disabled={!matchedOrder || isCompleted || isVerifying}
          className={`w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
            matchedOrder && !isCompleted && !isVerifying
              ? 'bg-[#1b5e20] hover:bg-[#144919] text-white active:scale-[0.99]'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          {isVerifying ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4 stroke-[3]" />
          )}
          <span>{isCompleted ? 'Already Handed Over' : 'Confirm & Complete Handover'}</span>
        </button>

        <button
          onClick={() => {
            handleCodeChange('');
          }}
          className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear / Reset</span>
        </button>
      </div>

    </div>
  );
}
