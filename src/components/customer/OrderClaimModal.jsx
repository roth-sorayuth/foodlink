import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Leaf, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag 
} from 'lucide-react';

export default function OrderClaimModal({ isOpen, onClose, item, onConfirmOrder }) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !item) return null;

  const totalPrice = (item.price * quantity).toFixed(2);
  const totalOriginal = ((item.originalPrice || item.price * 2) * quantity).toFixed(2);
  const totalSavings = (totalOriginal - totalPrice).toFixed(2);

  const handleConfirm = () => {
    onConfirmOrder({
      item,
      quantity,
      totalPrice: parseFloat(totalPrice),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Image */}
        <div className="relative h-44 w-full bg-slate-100">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 mb-1 inline-block">
              {item.discount || item.discountText || 'SURPLUS DEAL'}
            </span>
            <h3 className="font-extrabold text-base leading-snug drop-shadow-sm">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4">
          
          {/* Store & Pickup Schedule */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
            <div>
              <p className="font-bold text-slate-900">{item.store}</p>
              <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {item.distance} away
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.time || item.timeLeft || 'Today'}
              </span>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-xs text-slate-600 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-2 border-y border-slate-100">
            <span className="text-xs font-bold text-slate-700">Quantity to Rescue</span>
            <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-white font-bold text-sm text-slate-800 shadow-2xs hover:bg-slate-200 transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-extrabold text-slate-900 w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-white font-bold text-sm text-slate-800 shadow-2xs hover:bg-slate-200 transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Original Value</span>
              <span className="line-through">${totalOriginal}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Rescue Savings</span>
              <span>-${totalSavings}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-100">
              <span>Total Pickup Price</span>
              <span className="text-base text-emerald-800">${totalPrice}</span>
            </div>
          </div>

          {/* Eco Impact Banner */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-2.5 text-emerald-900 text-xs">
            <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Rescuing this prevents <strong>~{(0.6 * quantity).toFixed(1)} kg CO2e</strong>!</span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfirm}
            className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Confirm Rescue & Reserve (${totalPrice})</span>
          </button>
        </div>

      </div>
    </div>
  );
}
