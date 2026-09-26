import React, { useState } from 'react';
import {
  Store,
  ChevronDown,
  User,
  Clock,
  X,
  Leaf,
  Package,
  TrendingUp,
  DollarSign,
  Plus,
  QrCode,
  Edit2,
  CheckCircle2,
  ArrowUpRight,
  Flame,
  LayoutGrid,
  ClipboardList,
  BarChart3,
  Check,
  Search,
  AlertCircle
} from 'lucide-react';

export default function MerchantDashboard({ onNavigateToProfile }) {
  // Store Operational State
  const [isOpen, setIsOpen] = useState(true);
  const [acceptingRescues, setAcceptingRescues] = useState(true);
  const [showAlertBanner, setShowAlertBanner] = useState(true);
  const [activeBottomTab, setActiveBottomTab] = useState('dashboard');
  
  // Modals & Feedback
  const [toastMessage, setToastMessage] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [claimCodeInput, setClaimCodeInput] = useState('');
  const [editModalItem, setEditModalItem] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Listings State
  const [listings, setListings] = useState([
    {
      id: 'lst-1',
      title: 'Artisan Pastry & Sourdough Surprise Bag',
      description: "Assortment of today's crusty boules, daily brioche, and sweet morning pastries.",
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
      status: 'Active',
      tagText: '2 left!',
      tagColor: 'bg-amber-500 text-white',
      pickupWindow: 'Pickup 6:30 PM - 7:30 PM',
      price: '$4.99',
      originalValue: '$16.00 value',
      soldCount: 8,
      totalCount: 10,
      claimedPercent: 80,
      progressColor: 'bg-amber-500'
    },
    {
      id: 'lst-2',
      title: 'Assorted Croissant & Brioche Bundle',
      description: 'Classic French croissants, almond pain au chocolat, and custard brioche buns.',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80',
      status: 'Active',
      tagText: '2 left',
      tagColor: 'bg-stone-800 text-white',
      pickupWindow: 'Pickup 7:00 PM - 8:00 PM',
      price: '$3.99',
      originalValue: '$14.00 value',
      soldCount: 6,
      totalCount: 8,
      claimedPercent: 75,
      progressColor: 'bg-[#2E7D32]'
    }
  ]);

  // Reservations State
  const [reservations, setReservations] = useState([
    {
      id: 'res-1',
      code: '#SAVER-789',
      customerName: 'Marcus L.',
      avatarColor: 'bg-emerald-200 text-emerald-900',
      initials: 'ML',
      items: '1x Artisan Pastry & Sourdough',
      paidAmount: '$4.99',
      status: 'Ready for Pickup',
      eta: 'Arriving ~6:35 PM'
    },
    {
      id: 'res-2',
      code: '#SAVER-412',
      customerName: 'Sarah T.',
      avatarColor: 'bg-orange-200 text-orange-950',
      initials: 'ST',
      items: '1x Croissant & Brioche Bundle',
      paidAmount: '$3.99',
      status: 'Ready for Pickup',
      eta: 'Arriving ~7:10 PM'
    }
  ]);

  // Create Listing Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('4.50');
  const [newTotal, setNewTotal] = useState('5');
  const [newPickup, setNewPickup] = useState('6:30 PM - 7:30 PM');

  const handleCreateBag = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBag = {
      id: `lst-${Date.now()}`,
      title: newTitle,
      description: newDesc || "Fresh baker's assortment prepared before end of business.",
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=700&q=80',
      status: 'Active',
      tagText: `${newTotal} left`,
      tagColor: 'bg-emerald-600 text-white',
      pickupWindow: `Pickup ${newPickup}`,
      price: `$${parseFloat(newPrice).toFixed(2)}`,
      originalValue: `$${(parseFloat(newPrice) * 3).toFixed(2)} value`,
      soldCount: 0,
      totalCount: parseInt(newTotal, 10),
      claimedPercent: 0,
      progressColor: 'bg-[#2E7D32]'
    };

    setListings([newBag, ...listings]);
    setCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    showToast(`Created new surplus listing: "${newBag.title}"!`);
  };

  const handleScanClaim = (e) => {
    e.preventDefault();
    if (!claimCodeInput.trim()) return;

    const code = claimCodeInput.trim().toUpperCase();
    const found = reservations.find(r => r.code.toUpperCase().includes(code) || code.includes(r.code.replace('#', '')));

    if (found) {
      showToast(`Verified pickup for ${found.customerName} (${found.code})!`);
      setScanModalOpen(false);
      setClaimCodeInput('');
    } else {
      showToast(`Code "${code}" verified as valid Foodlink pickup claim.`);
      setScanModalOpen(false);
      setClaimCodeInput('');
    }
  };

  return (
    <div className="space-y-3.5">


        {/* ======================================================== */}
        {/* 2. ACCEPTING RESCUES TODAY CARD                         */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/90 text-[#2E7D32] flex items-center justify-center text-lg shrink-0">
              🏬
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-[#1C1C1E]">Accepting Rescues Today</h3>
                <span className="w-2 h-2 rounded-full bg-stone-300" />
              </div>
              <p className="text-xs text-stone-500">Live on FoodSaver discovery feed</p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => {
              setAcceptingRescues(!acceptingRescues);
              showToast(acceptingRescues ? 'Paused listings on discovery feed' : 'Resumed listings on discovery feed');
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              acceptingRescues ? 'bg-[#1b5e20]' : 'bg-stone-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                acceptingRescues ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* ======================================================== */}
        {/* 3. URGENT PICKUP ALERT BANNER (Dismissable)             */}
        {/* ======================================================== */}
        {showAlertBanner && (
          <div className="bg-[#FFEFE7] border border-orange-200/80 rounded-2xl p-3.5 sm:p-4 flex items-start sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF8A3D] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-[#8C3A00]">Pickup starts in 45m</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#8C3A00] text-white text-[10px] font-bold uppercase tracking-wider">
                    Window Prep
                  </span>
                </div>
                <p className="text-xs text-[#8C3A00]/80">First window begins at 6:30 PM. 14 bags packed.</p>
              </div>
            </div>

            <button
              onClick={() => setShowAlertBanner(false)}
              className="w-7 h-7 rounded-full hover:bg-orange-200/60 flex items-center justify-center text-[#8C3A00] shrink-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. ECO VICTORY TODAY BANNER                             */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-r from-[#1b5e20] to-[#2E7D32] rounded-2xl p-3.5 sm:p-4 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Eco Victory Today</h3>
              <p className="text-xs text-white/85">35 kg CO₂ saved • 14 fresh meals diverted</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white/20 text-[11px] font-bold text-white tracking-wide shrink-0">
            Top 5%
          </span>
        </div>

        {/* ======================================================== */}
        {/* 5. DAILY HIGHLIGHTS (3 Stat Cards)                      */}
        {/* ======================================================== */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-bold text-base text-[#1C1C1E]">Daily Highlights</h2>
            <span className="text-xs text-stone-400">Updated 2m ago</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Card 1: Bags Listed */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-600">Bags Listed</span>
                <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200/60 text-teal-700 flex items-center justify-center">
                  <Package className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#1C1C1E]">18</span>
                  <span className="text-xs text-stone-500 font-medium">total</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#2E7D32]">
                  <TrendingUp className="w-3 h-3" /> +4 vs yesterday
                </span>
              </div>
            </div>

            {/* Card 2: Bags Sold */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-600">Bags Sold</span>
                <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200/60 text-orange-600 flex items-center justify-center">
                  <Flame className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#1C1C1E]">14</span>
                  <span className="text-xs text-stone-500 font-medium">reserved</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#D96B1C]">
                  <Clock className="w-3 h-3" /> 78% sold out
                </span>
              </div>
            </div>

            {/* Card 3: Today's Revenue */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-600">Today's Revenue</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-[#1C1C1E]">$69.86</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600">
                  ⌛ $14.20 pending
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* 6. PRIMARY CALL-TO-ACTION BUTTONS                       */}
        {/* ======================================================== */}
        <div className="space-y-2.5 pt-1">
          {/* Create New Bag button */}
          <button
            onClick={() => {
              if (onOpenCreate) onOpenCreate();
              else setCreateModalOpen(true);
            }}
            className="w-full py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Create New Bag</span>
          </button>

          {/* Scan Pickup Code button */}
          <button
            onClick={() => {
              if (onOpenVerify) onOpenVerify();
              else setScanModalOpen(true);
            }}
            className="w-full py-3 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm flex items-center justify-center gap-2 border border-stone-200/80 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-stone-600" />
            <span>Scan Pickup Code</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 7. TODAY'S ACTIVE LISTINGS                              */}
        {/* ======================================================== */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-[#1C1C1E]">Today's Active Listings</h2>
              <span className="px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700 text-xs font-semibold">
                {listings.length} live
              </span>
            </div>
            <button 
              onClick={() => showToast('Opening all 3 listings management')}
              className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-0.5"
            >
              <span>View All (3)</span>
              <span className="text-sm">›</span>
            </button>
          </div>

          {/* Listing Cards */}
          <div className="space-y-3.5">
            {listings.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow"
              >
                {/* Image Banner */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-stone-100">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#2E7D32] text-xs font-bold shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                      <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                      Active
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-xs flex items-center gap-1 ${item.tagColor}`}>
                      {item.tagText}
                    </span>
                  </div>

                  {/* Edit Pencil Button */}
                  <button 
                    onClick={() => setEditModalItem(item)}
                    className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white text-stone-800 shadow-md flex items-center justify-center hover:bg-stone-50 active:scale-95 transition-all"
                  >
                    <Edit2 className="w-4 h-4 text-stone-700" />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-[#1C1C1E]">{item.title}</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.description}</p>
                  </div>

                  {/* Pickup Window & Pricing */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>{item.pickupWindow}</span>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-[#2E7D32]">{item.price}</span>
                      <span className="text-xs text-stone-400 line-through">{item.originalValue}</span>
                    </div>
                  </div>

                  {/* Progress Claim Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-stone-700">{item.soldCount} sold <span className="text-stone-400 font-normal">/ {item.totalCount} total</span></span>
                      <span className={item.claimedPercent >= 80 ? 'text-[#D96B1C]' : 'text-[#2E7D32]'}>
                        {item.claimedPercent}% claimed
                      </span>
                    </div>

                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.progressColor} transition-all duration-500`}
                        style={{ width: `${item.claimedPercent}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 8. RECENT RESERVATIONS                                  */}
        {/* ======================================================== */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-base text-[#1C1C1E]">Recent Reservations</h2>
              <span className="w-2 h-2 rounded-full bg-[#FF8A3D] animate-ping" />
            </div>
            <button 
              onClick={() => showToast('Opening all reservations list')}
              className="text-xs font-bold text-[#2E7D32] hover:underline"
            >
              Manage All
            </button>
          </div>

          <div className="space-y-2.5">
            {reservations.map((res) => (
              <div 
                key={res.id}
                className="bg-white rounded-2xl border border-stone-200/80 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-2xs hover:border-stone-300 transition-colors"
              >
                {/* Left: Avatar + Details */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${res.avatarColor} font-black text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
                    {res.initials}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-[#1C1C1E]">{res.customerName}</h4>
                      <span className="text-[10px] font-mono text-stone-500 font-semibold">{res.code}</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      {res.items} • Paid <span className="font-semibold text-stone-800">{res.paidAmount}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Status Pill & ETA */}
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#2E7D32]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                    {res.status}
                  </span>
                  <p className="text-[10px] text-stone-500 font-medium mt-1">{res.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>


      {/* ======================================================== */}
      {/* MODAL 1: CREATE NEW BAG                                 */}
      {/* ======================================================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-[#1C1C1E]">Create New Surplus Bag</h3>
                <p className="text-xs text-stone-500">List remaining fresh items before closing</p>
              </div>
              <button 
                onClick={() => setCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBag} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-stone-700">Listing Title</label>
                <input
                  type="text"
                  placeholder="e.g. Evening Baker Surprise Bundle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#2E7D32] focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-700">Description</label>
                <textarea
                  placeholder="Describe assortment (e.g. 2 rustic loaves + daily sweet pastries)..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#2E7D32] focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-700">Discounted Price ($)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#2E7D32] focus:bg-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-stone-700">Quantity (Bags)</label>
                  <input
                    type="number"
                    min="1"
                    value={newTotal}
                    onChange={(e) => setNewTotal(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#2E7D32] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-700">Pickup Window</label>
                <input
                  type="text"
                  value={newPickup}
                  onChange={(e) => setNewPickup(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-1 focus:ring-[#2E7D32] focus:bg-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs shadow-xs"
                >
                  Publish Listing Now
                </button>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: SCAN PICKUP CODE                               */}
      {/* ======================================================== */}
      {scanModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#2E7D32]" />
                <h3 className="font-bold text-base text-[#1C1C1E]">Verify Customer Claim</h3>
              </div>
              <button 
                onClick={() => setScanModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* QR Camera View Simulator */}
            <div className="h-44 rounded-2xl bg-stone-950 flex flex-col items-center justify-center text-white relative overflow-hidden p-4 text-center">
              <div className="w-32 h-32 border-2 border-emerald-400 rounded-2xl relative flex items-center justify-center">
                <div className="w-full h-0.5 bg-emerald-400 absolute animate-pulse shadow-[0_0_8px_#34d399]" />
                <QrCode className="w-16 h-16 text-stone-600" />
              </div>
              <p className="text-[10px] text-stone-400 mt-2">Point scanner at customer's Foodlink QR</p>
            </div>

            <form onSubmit={handleScanClaim} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-stone-600 font-semibold">Or enter code manually</label>
                <input
                  type="text"
                  placeholder="e.g. SAVER-789"
                  value={claimCodeInput}
                  onChange={(e) => setClaimCodeInput(e.target.value)}
                  className="w-full p-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs uppercase font-mono tracking-wider text-center focus:bg-white focus:ring-1 focus:ring-[#2E7D32] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs shadow-xs"
              >
                Confirm Pickup Claim
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: EDIT LISTING                                   */}
      {/* ======================================================== */}
      {editModalItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-sm text-[#1C1C1E]">Edit Surplus Listing</h3>
              <button onClick={() => setEditModalItem(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-stone-800">{editModalItem.title}</p>
              <div className="space-y-1">
                <label className="text-stone-600">Update Remaining Count</label>
                <input 
                  type="number" 
                  defaultValue={editModalItem.totalCount - editModalItem.soldCount} 
                  className="w-full p-2 bg-stone-100 border border-stone-200 rounded-lg text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-600">Price</label>
                <input 
                  type="text" 
                  defaultValue={editModalItem.price} 
                  className="w-full p-2 bg-stone-100 border border-stone-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <button
              onClick={() => {
                showToast(`Updated "${editModalItem.title}"!`);
                setEditModalItem(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#2E7D32] text-white font-bold text-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
