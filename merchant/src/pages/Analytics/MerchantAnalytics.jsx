import React, { useState } from 'react';
import {
  Calendar,
  SlidersHorizontal,
  Package,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Leaf,
  Cloud,
  Utensils,
  Clock,
  Download,
  Lock,
  ChevronDown,
  X
} from 'lucide-react';

export default function MerchantAnalytics({ onNavigateToProfile }) {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const days = [
    { day: 'Mon', sold: 11, expired: 2, height: '65%', isPeak: false },
    { day: 'Tue', sold: 13, expired: 2, height: '75%', isPeak: false },
    { day: 'Wed', sold: 14, expired: 1, height: '80%', isPeak: false },
    { day: 'Thu', sold: 12, expired: 3, height: '70%', isPeak: false },
    { day: 'Fri', sold: 16, expired: 0, height: '95%', isPeak: true },
    { day: 'Sat', sold: 14, expired: 1, height: '82%', isPeak: false },
    { day: 'Sun', sold: 8, expired: 5, height: '50%', isPeak: false },
  ];

  return (
    <div className="space-y-4">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 max-w-sm mx-auto z-50 bg-[#1C1C1E] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Title & Filter Icon */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold text-[#1C1C1E] tracking-tight">Analytics & Impact</h1>
          <p className="text-xs text-stone-500">Performance metrics for CAD Bakery</p>
        </div>

        <button
          onClick={() => showToast('Analytics filters opened')}
          className="w-9 h-9 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Time Range Selector */}
      <div>
        <button
          onClick={() => showToast('Date range selector opened')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-800 shadow-2xs hover:bg-stone-50 transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-stone-500" />
          <span>This Week (Nov 8 – Nov 14)</span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
        </button>
      </div>

      {/* 3 Top Stat Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        
        {/* Bags Listed */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-3 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Bags...</span>
            <Package className="w-3.5 h-3.5 text-stone-500" />
          </div>
          <div className="text-lg font-black text-[#1C1C1E]">86</div>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#2E7D32]">
            <TrendingUp className="w-3 h-3" /> +18%
          </span>
        </div>

        {/* Net Revenue */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-3 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Net...</span>
            <DollarSign className="w-3.5 h-3.5 text-stone-500" />
          </div>
          <div className="text-lg font-black text-[#1C1C1E]">$424<span className="text-xs">.50</span></div>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#2E7D32]">
            <TrendingUp className="w-3 h-3" /> +$68.00
          </span>
        </div>

        {/* Claim Rate */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-3 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Claim Rate</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-[#1C1C1E]">94%</div>
          <span className="text-[10px] text-stone-400 font-medium block">86 of 92</span>
        </div>

      </div>



      {/* Weekly Rescue Volume (Bar Chart) */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#1C1C1E]">Weekly Rescue Volume</h3>
            <p className="text-xs text-stone-500">Daily distribution of surplus bags claimed</p>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-sm text-[#1C1C1E]">86 <span className="text-stone-400 font-normal">/ 92</span></span>
            <span className="text-[10px] text-stone-400 block">Sold vs Listed</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-stone-500 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#1b5e20]" />
            <span>Sold (Peak)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#78C982]" />
            <span>Sold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-stone-200" />
            <span>Expired</span>
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="pt-4 pb-2 px-1">
          <div className="h-40 flex items-end justify-between gap-2 border-b border-stone-100 pb-2">
            {days.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                {d.isPeak && (
                  <div className="flex flex-col items-center mb-1">
                    <span className="px-1.5 py-0.5 rounded-md bg-orange-100 text-[#D96B1C] text-[9px] font-extrabold uppercase">
                      ★ PEAK
                    </span>
                    <span className="text-xs font-black text-[#1b5e20]">{d.sold}</span>
                  </div>
                )}
                
                {/* Stacked bar */}
                <div className="w-full max-w-[28px] h-full flex flex-col justify-end">
                  {/* Expired part */}
                  {d.expired > 0 && (
                    <div
                      className="w-full bg-stone-200 rounded-t-sm"
                      style={{ height: `${d.expired * 5}px` }}
                    />
                  )}
                  {/* Sold part */}
                  <div
                    className={`w-full rounded-b-md ${d.isPeak ? 'bg-[#1b5e20]' : 'bg-[#78C982]'}`}
                    style={{ height: `${d.sold * 6.5}px` }}
                  />
                </div>

                <span className={`text-[11px] font-bold mt-1 ${d.isPeak ? 'text-[#1b5e20]' : 'text-stone-500'}`}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Bags */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#1C1C1E]">Top Performing Bags</h3>
          <button onClick={() => showToast('Viewing all categories')} className="text-xs font-semibold text-[#2E7D32] hover:underline">
            All categories
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Item 1 */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=160&q=80"
                alt="Pastry"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-xs text-[#1C1C1E]">Artisan Pastry & Sou...</h4>
                <p className="text-[11px] text-stone-500">48 bags sold • $4.99 avg rescue</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#2E7D32]">
                98% rate
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">~12 min claim</span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=160&q=80"
                alt="Croissant"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-xs text-[#1C1C1E]">Croissant & Brioche ...</h4>
                <p className="text-[11px] text-stone-500">26 bags sold • $3.99 avg rescue</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#2E7D32]">
                92% rate
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">~20 min claim</span>
            </div>
          </div>

          {/* Item 3 */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=160&q=80"
                alt="Baguette"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-xs text-[#1C1C1E]">Rustic Baguettes & R...</h4>
                <p className="text-[11px] text-stone-500">12 bags sold • $3.50 avg rescue</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-700">
                88% rate
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">~35 min claim</span>
            </div>
          </div>
        </div>
      </div>

      {/* Peak Pickup Rush Banner */}
      <div className="bg-[#FFEFE7] border border-orange-200/80 rounded-3xl p-4 flex items-center gap-3 shadow-2xs">
        <div className="w-10 h-10 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-[#8C3A00]">Peak Pickup Rush: 6:45 PM – 7:15 PM</h4>
          <p className="text-[11px] text-[#8C3A00]/85 mt-0.5 leading-relaxed">
            74% of customers collect their bags within the first 30 minutes of closing window.
          </p>
        </div>
      </div>

      {/* Report Download Button */}
      <div className="space-y-2 pt-1">
        <button
          onClick={() => showToast('Weekly Tax & Waste Report PDF generated and downloaded!')}
          className="w-full py-3.5 rounded-2xl bg-[#1b5e20] hover:bg-[#144919] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Weekly Tax & Waste Report (PDF)</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <Lock className="w-3 h-3 text-stone-400" />
          <span>Compliant with USDA & CalRecycle SB 1383 donation reporting</span>
        </div>
      </div>

    </div>
  );
}
