import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Copy, 
  ArrowRight,
  Store,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function BakeryKhqrModal({
  isOpen,
  onClose,
  storeName = 'Brown Coffee & Bakery',
  selectedBags = [],
  totalPrice = 2.50,
  khrPrice = '10,250 KHR',
  onSuccessfulClaim,
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(599); // 10 minutes
  const [isPaid, setIsPaid] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const pickupCode = 'FL-BC-9482';

  useEffect(() => {
    if (!isOpen) {
      setIsPaid(false);
      setSecondsRemaining(599);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSimulatePayment = () => {
    setIsPaid(true);
    if (onSuccessfulClaim) {
      onSuccessfulClaim({
        pickupCode,
        storeName,
        totalPrice,
      });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(pickupCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-4">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {/* Bakong Tag */}
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px] tracking-wider uppercase">
              KHQR
            </span>
            <span className="text-xs font-bold text-slate-700">Bakong Instant Scan</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isPaid ? (
          /* SCAN STATE */
          <div className="p-5 text-center space-y-4">
            
            {/* Countdown Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Expires in {timeFormatted}</span>
            </div>

            {/* Price Tag */}
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Amount to Lock Bundle</p>
              <div className="flex items-baseline justify-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900">${totalPrice.toFixed(2)}</span>
                <span className="text-xs font-semibold text-slate-500">≈ {khrPrice}</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                Payee: FOODLINK • {storeName}
              </p>
            </div>

            {/* QR Code Container */}
            <div className="relative mx-auto w-52 h-52 p-3 bg-white rounded-2xl border-2 border-red-500 shadow-sm flex flex-col items-center justify-center">
              {/* Bakong Red Corner Markings */}
              <div className="absolute top-1.5 left-2 text-[9px] font-black tracking-widest text-red-600">
                KHQR
              </div>
              <div className="absolute top-1.5 right-2 text-[9px] font-bold text-slate-400">
                BAKONG
              </div>

              {/* Styled QR graphic */}
              <div className="w-40 h-40 bg-slate-950 p-2 rounded-xl flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                  {/* Outer Frame & Targets */}
                  <rect x="5" y="5" width="28" height="28" fill="white" rx="4"/>
                  <rect x="9" y="9" width="20" height="20" fill="black" rx="2"/>
                  <rect x="13" y="13" width="12" height="12" fill="white" rx="1"/>

                  <rect x="67" y="5" width="28" height="28" fill="white" rx="4"/>
                  <rect x="71" y="9" width="20" height="20" fill="black" rx="2"/>
                  <rect x="75" y="13" width="12" height="12" fill="white" rx="1"/>

                  <rect x="5" y="67" width="28" height="28" fill="white" rx="4"/>
                  <rect x="9" y="71" width="20" height="20" fill="black" rx="2"/>
                  <rect x="13" y="75" width="12" height="12" fill="white" rx="1"/>

                  {/* QR Matrix Elements */}
                  <rect x="38" y="10" width="8" height="8" fill="white"/>
                  <rect x="50" y="10" width="8" height="8" fill="white"/>
                  <rect x="38" y="22" width="6" height="6" fill="white"/>
                  <rect x="48" y="22" width="10" height="6" fill="white"/>

                  <rect x="10" y="38" width="12" height="6" fill="white"/>
                  <rect x="26" y="38" width="8" height="8" fill="white"/>
                  <rect x="40" y="36" width="18" height="18" fill="white"/>
                  <rect x="65" y="38" width="12" height="8" fill="white"/>
                  <rect x="82" y="38" width="8" height="6" fill="white"/>

                  <rect x="10" y="48" width="6" height="12" fill="white"/>
                  <rect x="22" y="50" width="12" height="6" fill="white"/>
                  <rect x="64" y="52" width="8" height="8" fill="white"/>
                  <rect x="78" y="50" width="12" height="10" fill="white"/>

                  <rect x="38" y="66" width="8" height="10" fill="white"/>
                  <rect x="50" y="66" width="6" height="6" fill="white"/>
                  <rect x="62" y="68" width="12" height="8" fill="white"/>
                  <rect x="80" y="66" width="10" height="6" fill="white"/>

                  <rect x="38" y="80" width="10" height="10" fill="white"/>
                  <rect x="54" y="78" width="14" height="12" fill="white"/>
                  <rect x="74" y="78" width="8" height="12" fill="white"/>
                  <rect x="86" y="78" width="6" height="12" fill="white"/>
                </svg>

                {/* Central KHQR mini badge */}
                <div className="absolute inset-0 m-auto w-9 h-9 rounded-lg bg-red-600 border-2 border-white flex items-center justify-center text-white font-black text-[9px] shadow-sm">
                  KHQR
                </div>
              </div>

              <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-slate-500 font-medium">
                <span>Scan with ABA, Wing, Acleda, Bakong</span>
              </div>
            </div>

            {/* Guarantee note */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-left flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-900 leading-snug">
                <strong>Zero Transaction Fee</strong>. Your surplus package is instantly secured upon scan confirmation.
              </p>
            </div>

            {/* Simulate Scan Button for demo */}
            <button
              onClick={handleSimulatePayment}
              className="w-full py-3 px-4 rounded-2xl bg-[#0d4a36] hover:bg-[#093527] text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Simulate Instant KHQR Scan Lock</span>
            </button>

          </div>
        ) : (
          /* SUCCESS VOUCHER STATE */
          <div className="p-5 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Surplus Bundle Locked!</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Paid via Bakong KHQR • Pick up today at counter
              </p>
            </div>

            {/* Pickup Pass Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Pickup Pass Code</p>
                  <p className="text-base font-black text-[#0d4a36] tracking-wider">{pickupCode}</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2">
                  <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">{storeName} (Toul Kork)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Today, <strong>18:00 – 20:00</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-emerald-800 font-medium">Show this code at counter</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/70 text-[11px] text-amber-900 text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Remember to bring your own clean box or tote bag to earn <strong>+15 Eco-Karma points</strong>!
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#0d4a36] text-white font-bold text-xs shadow-xs cursor-pointer hover:bg-[#093527] transition-colors"
            >
              Done & Return to Store
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
