import React, { useState } from 'react';
import {
  Leaf,
  Award,
  Share2,
  Settings,
  ShieldCheck,
  Download,
  MapPin,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Check,
  CheckCircle2,
  Lock,
  Sprout,
  Clock,
  AlertTriangle,
  HelpCircle,
  FileText,
  LogOut,
  Utensils,
  PiggyBank,
  Cloud,
  Eye,
  Globe,
  X
} from 'lucide-react';

export default function CustomerProfile({ onBackToHome }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showOlderRescues, setShowOlderRescues] = useState(false);
  const [radarRadius, setRadarRadius] = useState(2.0);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [selectedTags, setSelectedTags] = useState(['Vegetarian', 'Vegan', 'Nut Allergy Alert']);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const initialOrders = [
    {
      id: 'FS-8842',
      store: 'Golden Gate Bakery & Cafe',
      category: 'bakeries',
      status: 'Completed',
      time: 'Today 6:45 PM',
      iconText: '🥐',
      iconBg: 'bg-amber-100 text-amber-700',
      itemTitle: 'Artisan Pastry & Sourdough Surprise Bag',
      co2: '2.5 kg CO₂ saved',
      verifiedPickup: true,
      price: '$4.99',
      originalPrice: '$16.00',
      savedText: 'Saved $11.01 (69%)'
    },
    {
      id: 'FS-8791',
      store: 'Green Leaf Organic Deli',
      category: 'recent',
      status: 'Completed',
      time: 'Oct 24, 7:15 PM',
      iconText: '🥗',
      iconBg: 'bg-emerald-100 text-emerald-700',
      itemTitle: 'Fresh Prepared Lunch & Sandwich Box',
      co2: '3.0 kg CO₂ saved',
      verifiedPickup: false,
      price: '$5.49',
      originalPrice: '$18.00',
      savedText: 'Saved $12.51 (70%)'
    },
    {
      id: 'FS-8620',
      store: 'La Petite Patisserie',
      category: 'bakeries',
      status: 'Completed',
      time: 'Oct 19, 8:10 PM',
      iconText: '🧁',
      iconBg: 'bg-rose-100 text-rose-700',
      itemTitle: 'French Macarons & Seasonal Tartlets',
      co2: '1.8 kg CO₂ saved',
      verifiedPickup: false,
      price: '$3.99',
      originalPrice: '$14.00',
      savedText: 'Saved $10.01 (71%)'
    },
    {
      id: 'FS-8419',
      store: 'Mission Sourdough Co.',
      category: 'bakeries',
      status: 'Completed',
      time: 'Oct 12, 6:00 PM',
      iconText: '🍞',
      iconBg: 'bg-stone-200 text-stone-700',
      itemTitle: 'Rustic Baguette & Country Loaves',
      co2: '2.2 kg CO₂ saved',
      verifiedPickup: false,
      price: '$4.50',
      originalPrice: '$14.00',
      savedText: 'Saved $9.50 (68%)'
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      
      {toastMessage && (
        <div className="fixed top-5 inset-x-4 max-w-sm mx-auto z-50 bg-[#1C1C1E] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Profile Header Card */}
      <section className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-100/35 via-emerald-50/20 to-transparent rounded-full pointer-events-none -mr-20 -mt-20 blur-2xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=260&q=80" 
                alt="Sarah Jenkins"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-[#2E7D32]/15 shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#2E7D32] rounded-full flex items-center justify-center text-white ring-2 ring-white shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1C1C1E] tracking-tight">Sarah Jenkins</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/20">
                  <Leaf className="w-3 h-3" /> Level 3 Rescuer
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF8A3D]/15 text-[#D96B1C] border border-[#FF8A3D]/30">
                  <Award className="w-3 h-3" /> Top 5% SF
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 font-medium text-stone-700">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" /> Eco Champion
                </span>
                <span>•</span>
                <span>Mission District Hub</span>
                <span className="hidden sm:inline">|</span>
                <span className="text-stone-500">Member since March 2024</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-medium text-stone-600">
                <span className="inline-flex items-center gap-1 text-[#2E7D32]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View All 7 Badges</span>
                </span>
                <span className="text-stone-300">•</span>
                <span className="inline-flex items-center gap-1 text-stone-600">
                  <Globe className="w-3.5 h-3.5 text-stone-500" />
                  <span>Public Rescue Profile</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button onClick={() => showToast('Shared impact summary!')} className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Impact</span>
            </button>
            <button onClick={() => showToast('Certificate downloaded!')} className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              <span>2024 Certificate</span>
            </button>
            <button onClick={() => showToast('Settings opened')} className="px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-semibold flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 Impact Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">MEALS SAVED</span>
            <div className="w-8 h-8 rounded-full bg-[#2E7D32]/10 flex items-center justify-center text-[#2E7D32]">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#1C1C1E]">28</span>
              <span className="text-xs font-semibold text-stone-500">bags</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">Surplus fresh foods rescued</p>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2E7D32] rounded-full w-[75%]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">POCKET SAVED</span>
            <div className="w-8 h-8 rounded-full bg-[#FF8A3D]/15 flex items-center justify-center text-[#FF8A3D]">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#1C1C1E]">$312</span>
              <span className="text-xs font-semibold text-stone-500">Saved</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">Avg 68% off regular retail prices</p>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#FF8A3D] rounded-full w-[85%]" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">CO₂e AVOIDED</span>
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
              <Cloud className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-[#1C1C1E]">70</span>
              <span className="text-xs font-semibold text-stone-500">kg</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">≈ 175 miles car driving offset</p>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2E7D32] rounded-full w-[65%]" />
          </div>
        </div>
      </section>

      {/* Milestone Card */}
      <section className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1C1C1E]">Tree Planter Milestone</h3>
              <p className="text-xs text-stone-500">Just 2 meals away from unlocking your Golden Sprout Badge!</p>
            </div>
          </div>
          <span className="font-bold text-sm text-[#1C1C1E]">28 / 30 Meals <span className="text-[#2E7D32]">(93%)</span></span>
        </div>

        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#2E7D32] rounded-full w-[93%]" />
        </div>
      </section>

      {/* Orders List & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-base font-bold text-[#1C1C1E]">Order History & Rescues</h2>
          <div className="space-y-3">
            {initialOrders.map((ord) => (
              <div key={ord.id} className="p-4 bg-white rounded-2xl border border-stone-200/80 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl ${ord.iconBg} flex items-center justify-center text-xl shrink-0`}>
                    {ord.iconText}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1C1C1E]">{ord.store}</h3>
                    <p className="text-xs text-stone-600">{ord.itemTitle}</p>
                    <span className="text-[11px] text-stone-400">{ord.co2} • {ord.time}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-[#2E7D32] block">{ord.price}</span>
                  <span className="text-[10px] text-[#FF8A3D] font-bold">{ord.savedText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#1C1C1E]">Rescue Certificate</h3>
            <div className="p-3 bg-[#FFF8F0] border border-amber-200/70 rounded-xl space-y-1">
              <span className="text-[10px] text-[#2E7D32] font-bold block">FOODSAVER OFFICIAL REGISTRY</span>
              <p className="font-bold text-sm text-stone-900">Sarah Jenkins</p>
              <p className="text-xs font-extrabold text-[#2E7D32]">70.0 kg CO₂e Diverted</p>
            </div>
            <button onClick={() => showToast('Certificate downloaded')} className="w-full py-2.5 rounded-xl bg-[#2E7D32] text-white text-xs font-bold">
              Download Certificate PDF
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
