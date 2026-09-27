import React, { useState } from 'react';
import {
  ArrowLeft,
  QrCode,
  Zap,
  Check,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Leaf,
  RotateCcw,
  Sparkles,
  Camera,
  Flashlight
} from 'lucide-react';

import { verifyOrderPickup } from '../../services/api';

export default function VerifyPickupPage({ onBack, onCompleteHandover, initialCode }) {
  const [code, setCode] = useState(initialCode || 'SAVER - 7 8 9');
  const [torchOn, setTorchOn] = useState(false);
  const [verified, setVerified] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleConfirm = async () => {
    if (isVerifying) return;
    setIsVerifying(true);
    const cleanCode = code.replace(/\s+/g, '');

    try {
      const result = await verifyOrderPickup(cleanCode);
      onCompleteHandover({
        customerName: result.order?.user?.name || 'Customer',
        code: result.order?.orderNumber || cleanCode,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err) {
      console.warn('Backend pickup verification:', err.message);
      onCompleteHandover({
        customerName: 'Sarah Jenkins',
        code: cleanCode,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Title & Instant Match Badge */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="w-7 h-7 rounded-full hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-extrabold text-[#1C1C1E] tracking-tight">Verify Pickup</h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 ml-9">
            Scan QR code from customer's app or enter 6-digit pickup code
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-[#D96B1C] text-[11px] font-bold flex items-center gap-1 shrink-0">
          <Zap className="w-3 h-3 fill-[#D96B1C]" />
          <span>Instant Match</span>
        </span>
      </div>

      {/* Camera Viewfinder Scanner */}
      <div className="relative h-64 sm:h-72 rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border border-stone-800 flex flex-col items-center justify-center text-white overflow-hidden shadow-md">
        
        {/* Top Camera Controls */}
        <div className="absolute top-3.5 inset-x-4 flex items-center justify-between z-20">
          <span className="px-2.5 py-1 rounded-full bg-stone-800/80 backdrop-blur-md text-[10px] font-bold text-stone-300 border border-stone-700">
            Camera Active
          </span>

          <button
            onClick={() => setTorchOn(!torchOn)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              torchOn ? 'bg-amber-400 text-stone-900' : 'bg-stone-800/80 text-stone-300'
            }`}
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Target Frame */}
        <div className="relative w-44 h-44 border-2 border-emerald-400/80 rounded-3xl flex items-center justify-center">
          {/* Animated Scan Line */}
          <div className="absolute inset-x-2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" />
          <QrCode className="w-24 h-24 text-stone-600/60" />
        </div>

        {/* Bottom Alignment Helper Pill */}
        <div className="absolute bottom-3.5 z-20">
          <span className="px-3.5 py-1 rounded-full bg-stone-900/90 backdrop-blur-md text-[11px] font-semibold text-stone-300 border border-stone-800">
            Align customer's QR code within frame
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="relative text-center py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200" />
        </div>
        <span className="relative bg-[#F5F5F7] px-3 text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
          OR ENTER MANUALLY
        </span>
      </div>

      {/* Manual Code Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-stone-600 block px-1">Customer Pickup Code</label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-stone-400">
            <span className="text-[10px] font-bold font-mono px-1 py-0.5 rounded bg-stone-200 text-stone-600">123</span>
          </div>

          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setVerified(true);
            }}
            className="w-full pl-12 pr-12 py-3 bg-white border border-stone-200 rounded-2xl text-sm font-extrabold font-mono tracking-wider text-stone-900 shadow-2xs focus:ring-1 focus:ring-[#2E7D32] outline-none"
          />

          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Verified Customer Pass Card */}
      {verified && (
        <div className="bg-[#FFF8F0]/90 border border-amber-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3.5 animate-in fade-in">
          
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#2E7D32]">
              <span>Verified Customer Pass</span>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            <span className="font-mono text-xs font-bold text-stone-500">#FS-84920</span>
          </div>

          {/* Customer & Item Overview */}
          <div className="flex items-start gap-3.5">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-amber-200">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80"
                alt="Item thumbnail"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 p-0.5 bg-[#2E7D32] text-white rounded-tl-lg text-[9px]">
                🥐
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-[#1C1C1E]">Marcus L.</h3>
                <span className="text-[11px] font-bold text-[#2E7D32]">Top Rescuer</span>
              </div>
              <p className="text-xs font-semibold text-stone-700">1x Artisan Pastry & Sourdough Surprise Bag</p>
              <p className="text-xs text-stone-500 font-medium">
                <span className="font-bold text-stone-900">$5.90</span> (Paid via Apple Pay)
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
              <span>6:30 PM – 7:30 PM</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#2E7D32] font-bold text-[10px]">
              Valid Window
            </span>
          </div>

        </div>
      )}

      {/* Bottom Actions */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleConfirm}
          className="w-full py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Confirm & Complete Handover</span>
        </button>

        <button
          onClick={() => {
            setCode('');
            setVerified(false);
          }}
          className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear / Scan Another</span>
        </button>
      </div>

    </div>
  );
}
