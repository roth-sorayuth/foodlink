import React, { useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Trash2,
  Check,
  CheckCircle2,
  Sparkles,
  Minus,
  Plus,
  Clock,
  PiggyBank,
  User,
  Zap,
  Leaf
} from 'lucide-react';

import { publishListing } from '../../services/api';

const CATEGORY_PRESETS = {
  bakery: [
    {
      title: 'Artisan Pastry & Sourdough Surprise Bag',
      description: "Assortment of today's fresh unsold sourdough loaves, flaky croissants, and daily brioche buns. 100% fresh surplus.",
      retailValue: '16.00',
      foodSaverPrice: '4.99',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      dietaryTags: ['vegetarian'],
    },
    {
      title: 'French Almond Croissant & Pain au Chocolat Box',
      description: 'Double-baked buttery almond croissants and rich Belgian chocolate viennoiseries packed fresh at closing.',
      retailValue: '14.00',
      foodSaverPrice: '4.20',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      dietaryTags: ['vegetarian'],
    },
    {
      title: 'Crusty Baguette & Artisan Country Loaf Duo',
      description: 'Twin crusty golden baguettes with a rustic country boule made from slow-fermented organic wild yeast.',
      retailValue: '12.00',
      foodSaverPrice: '3.50',
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
      dietaryTags: ['vegan'],
    },
  ],
  meals: [
    {
      title: "Chef's Surplus Evening Bento & Hot Delights",
      description: 'Hearty evening meal with teriyaki glazed protein, seasoned jasmine rice, crispy gyoza dumplings, and vegetables.',
      retailValue: '18.00',
      foodSaverPrice: '5.99',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      dietaryTags: ['halal'],
    },
    {
      title: 'Gourmet Loaded Burger & Crispy Fries Box',
      description: 'Handcrafted artisan burger with house-cut fries, onion rings, and signature dipping sauces.',
      retailValue: '17.50',
      foodSaverPrice: '5.49',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      dietaryTags: [],
    },
    {
      title: 'Artisan Woodfired Pizza & Garlic Focaccia Bag',
      description: 'Slices of today’s freshly fired stone-hearth pizza with herb garlic breadsticks.',
      retailValue: '16.00',
      foodSaverPrice: '4.99',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      dietaryTags: ['vegetarian'],
    },
  ],
  produce: [
    {
      title: 'Fresh Organic Produce & Seasonal Greens Box',
      description: 'Crisp organic lettuces, heirloom carrots, ripe avocados, vine tomatoes, and seasonal orchard fruits.',
      retailValue: '22.00',
      foodSaverPrice: '6.50',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      dietaryTags: ['organic', 'vegan'],
    },
    {
      title: 'Surplus Ripe Tropical Fruits & Citrus Mystery Pack',
      description: 'Sweet ripe pineapples, mangoes, clementines, and organic berries ready for eating or smoothies.',
      retailValue: '18.00',
      foodSaverPrice: '5.20',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
      dietaryTags: ['organic', 'vegan'],
    },
  ],
  deli: [
    {
      title: 'Artisanal Dairy, Eggs & Farm Cheese Bag',
      description: 'Farm-fresh milk, organic cultured butter, artisan cheeses, and pasture-raised eggs near sell-by date.',
      retailValue: '24.00',
      foodSaverPrice: '7.50',
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80',
      dietaryTags: ['organic', 'vegetarian'],
    },
    {
      title: 'Deli Sliced Cold Cuts & Artisan Panini Bundle',
      description: 'Assorted roasted turkey breast, cured prosciutto, and fresh baked focaccia panini bread.',
      retailValue: '20.00',
      foodSaverPrice: '6.00',
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
      dietaryTags: [],
    },
  ],
};

export default function CreateListingPage({ onBack, onSave, onNavigateToProfile }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
  );
  const [selectedCategory, setSelectedCategory] = useState('bakery');
  const [bagName, setBagName] = useState('Artisan Pastry & Sourdough Surprise Bag');
  const [description, setDescription] = useState(
    "Assortment of today's fresh unsold sourdough loaves, flaky croissants, and daily brioche buns. 100% fresh and edible surplus."
  );
  const [dietaryTags, setDietaryTags] = useState(['vegetarian']);
  const [bagsAvailable, setBagsAvailable] = useState(10);
  const [retailValue, setRetailValue] = useState('16.00');
  const [foodSaverPrice, setFoodSaverPrice] = useState('4.99');
  const [pickupDate, setPickupDate] = useState('today');
  const [startTime, setStartTime] = useState('6:30 PM');
  const [endTime, setEndTime] = useState('7:30 PM');
  const [presetToast, setPresetToast] = useState(null);

  // Apply a category preset when merchant clicks "+"
  const handleApplyPreset = (preset) => {
    setBagName(preset.title);
    setDescription(preset.description);
    setRetailValue(preset.retailValue);
    setFoodSaverPrice(preset.foodSaverPrice);
    setPhotoUrl(preset.image);
    if (preset.dietaryTags) setDietaryTags(preset.dietaryTags);
    setPresetToast(`Loaded preset: "${preset.title}"!`);
    setTimeout(() => setPresetToast(null), 3000);
  };

  // Computed values
  const retailNum = parseFloat(retailValue) || 16.0;
  const priceNum = parseFloat(foodSaverPrice) || 4.99;
  const savings = Math.max(0, retailNum - priceNum);
  const discountPercent = retailNum > 0 ? Math.round((savings / retailNum) * 100) : 69;
  const fee = 0.89;
  const merchantPayout = Math.max(0, priceNum - fee);

  const toggleTag = (tag) => {
    setDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        title: bagName,
        description,
        photoUrl,
        category: selectedCategory,
        originalPrice: retailNum,
        price: priceNum,
        discount: `${discountPercent}% OFF`,
        bagsAvailable,
        pickupDate: pickupDate === 'today' ? 'Today' : 'Tomorrow',
        pickupStart: startTime,
        pickupEnd: endTime,
        dietaryTags,
        storeId: 'st_cad',
        storeName: 'CAD Bakery',
      };

      const result = await publishListing(payload);

      const listingForState = {
        id: result?.listing?.id || `lst-${Date.now()}`,
        title: bagName,
        description,
        image: photoUrl,
        status: 'Active',
        tagText: `${bagsAvailable} left!`,
        tagColor: 'bg-amber-500 text-white',
        pickupWindow: `Pickup ${startTime} - ${endTime}`,
        price: `$${priceNum.toFixed(2)}`,
        originalValue: `$${retailNum.toFixed(2)} value`,
        soldCount: 0,
        totalCount: bagsAvailable,
        claimedPercent: 0,
        progressColor: 'bg-[#2E7D32]',
      };

      onSave(listingForState);
    } catch (err) {
      console.error('Failed to publish listing:', err);
      alert(`Failed to publish listing: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1C1C1E] flex flex-col font-sans pb-28 antialiased selection:bg-[#2E7D32] selection:text-white relative">
      
      {/* Toast Alert for Preset Loading */}
      {presetToast && (
        <div className="fixed top-4 inset-x-4 max-w-sm mx-auto z-50 bg-[#1C1C1E] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{presetToast}</span>
          </div>
          <button onClick={() => setPresetToast(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3">
        <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-white border border-stone-200/90 overflow-hidden flex items-center justify-center shadow-2xs p-0.5">
              <img src="/cad-bakery-logo.png" alt="CAD Bakery Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-bold text-base text-[#1C1C1E]">Create Listing</h1>
          </div>

          <button
            onClick={onNavigateToProfile}
            className="w-8 h-8 rounded-full bg-[#1b5e20] text-white flex items-center justify-center shadow-xs"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="max-w-md sm:max-w-xl mx-auto w-full px-4 py-4 space-y-4">
        
        {/* Step Indicator & Auto-saved Badge */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">STEP 1 OF 2</span>
            <h2 className="text-xl font-extrabold text-[#1C1C1E] tracking-tight">Surplus Bag Details</h2>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-[#2E7D32] border border-emerald-300/40">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Draft Auto-saved</span>
          </span>
        </div>

        {/* 1. Listing Photo Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-sm text-[#1C1C1E]">
              <Camera className="w-4 h-4 text-[#2E7D32]" />
              <span>Listing Photo</span>
            </div>
            <span className="text-xs text-stone-400">High resolution adds +40% sales</span>
          </div>

          {/* Photo Display Banner */}
          <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-stone-100 group">
            <img src={photoUrl} alt="Listing preview" className="w-full h-full object-cover" />

            {/* Top Badge: Photo Added */}
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#2E7D32] text-xs font-bold shadow-xs flex items-center gap-1 backdrop-blur-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Photo Added</span>
              </span>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
              <label className="px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-stone-800 text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer backdrop-blur-xs transition-colors">
                <Camera className="w-3.5 h-3.5 text-stone-600" />
                <span>Change Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhotoUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  const defaultImg = (CATEGORY_PRESETS[selectedCategory] || CATEGORY_PRESETS.bakery)[0].image;
                  setPhotoUrl(defaultImg);
                  setPresetToast('Restored default category image');
                  setTimeout(() => setPresetToast(null), 2500);
                }}
                className="px-3 py-2 rounded-xl bg-white/90 hover:bg-white text-stone-700 text-xs font-bold shadow-md backdrop-blur-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Keep Default</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Category Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
          <div>
            <h3 className="font-bold text-sm text-[#1C1C1E]">Category</h3>
            <p className="text-xs text-stone-500">Helps nearby rescue foodies find your offer quickly.</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Bakery & Pastries */}
            <button
              type="button"
              onClick={() => setSelectedCategory('bakery')}
              className={`p-3.5 rounded-2xl flex items-center justify-between text-left transition-all ${
                selectedCategory === 'bakery'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🥐</span>
                <span className="text-xs font-bold leading-tight">Bakery &<br />Pastries</span>
              </div>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedCategory === 'bakery' ? 'bg-white text-[#1b5e20]' : 'border border-stone-300'}`}>
                {selectedCategory === 'bakery' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>

            {/* Prepared Meals */}
            <button
              type="button"
              onClick={() => setSelectedCategory('meals')}
              className={`p-3.5 rounded-2xl flex items-center justify-between text-left transition-all ${
                selectedCategory === 'meals'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🍱</span>
                <span className="text-xs font-bold leading-tight">Prepared<br />Meals</span>
              </div>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedCategory === 'meals' ? 'bg-white text-[#1b5e20]' : 'border border-stone-300'}`}>
                {selectedCategory === 'meals' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>

            {/* Groceries & Produce */}
            <button
              type="button"
              onClick={() => setSelectedCategory('produce')}
              className={`p-3.5 rounded-2xl flex items-center justify-between text-left transition-all ${
                selectedCategory === 'produce'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🥑</span>
                <span className="text-xs font-bold leading-tight">Groceries &<br />Produce</span>
              </div>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedCategory === 'produce' ? 'bg-white text-[#1b5e20]' : 'border border-stone-300'}`}>
                {selectedCategory === 'produce' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>

            {/* Dairy & Deli */}
            <button
              type="button"
              onClick={() => setSelectedCategory('deli')}
              className={`p-3.5 rounded-2xl flex items-center justify-between text-left transition-all ${
                selectedCategory === 'deli'
                  ? 'bg-[#1b5e20] text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🧀</span>
                <span className="text-xs font-bold leading-tight">Dairy &<br />Deli</span>
              </div>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedCategory === 'deli' ? 'bg-white text-[#1b5e20]' : 'border border-stone-300'}`}>
                {selectedCategory === 'deli' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </button>
          </div>
        </div>

        {/* Quick Food Suggestions for Selected Category with + Button */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-sm text-[#1C1C1E]">
              <Sparkles className="w-4 h-4 text-[#2E7D32]" />
              <span className="capitalize">{selectedCategory} Quick Presets</span>
            </div>
            <span className="text-[11px] font-bold text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Click + to autofill
            </span>
          </div>

          <p className="text-xs text-stone-500">
            Tap the <span className="font-bold text-[#2E7D32]">+ button</span> to instantly fill name, description, retail price, and image.
          </p>

          <div className="space-y-2.5">
            {(CATEGORY_PRESETS[selectedCategory] || CATEGORY_PRESETS.bakery).map((preset, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-stone-50 hover:bg-stone-100/90 border border-stone-200/80 flex items-center justify-between gap-3 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={preset.image}
                    alt={preset.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-[#1C1C1E] truncate group-hover:text-[#2E7D32] transition-colors">
                      {preset.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                      ${preset.foodSaverPrice} <span className="text-stone-400 line-through text-[10px]">${preset.retailValue}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="w-8 h-8 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white flex items-center justify-center shrink-0 shadow-xs active:scale-90 transition-all cursor-pointer"
                  title={`Use "${preset.title}"`}
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Bag Name Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-2">
          <label className="font-bold text-sm text-[#1C1C1E] block">Bag Name</label>
          <input
            type="text"
            value={bagName}
            onChange={(e) => setBagName(e.target.value)}
            className="w-full p-3 bg-stone-50 border border-stone-200/80 rounded-2xl text-xs font-semibold text-[#1C1C1E] focus:bg-white focus:ring-1 focus:ring-[#2E7D32] outline-none"
            placeholder="e.g. Artisan Pastry & Sourdough Surprise Bag"
          />
        </div>

        {/* 4. Description & Highlights Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-bold text-sm text-[#1C1C1E]">Description & Highlights</label>
            <span className="text-xs text-stone-400 font-mono">{description.length} / 300</span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
            rows={3}
            className="w-full p-3 bg-stone-50 border border-stone-200/80 rounded-2xl text-xs text-stone-700 leading-relaxed focus:bg-white focus:ring-1 focus:ring-[#2E7D32] outline-none"
          />

          {/* Dietary & Allergen Tags */}
          <div className="space-y-2 pt-1 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-600 block">Dietary & Allergen Tags</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => toggleTag('vegetarian')}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                  dietaryTags.includes('vegetarian')
                    ? 'bg-emerald-50 border-emerald-300 text-[#2E7D32] font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${dietaryTags.includes('vegetarian') ? 'bg-[#2E7D32] text-white' : 'border border-stone-400'}`}>
                  {dietaryTags.includes('vegetarian') && <Check className="w-2.5 h-2.5" />}
                </div>
                <span>Vegetarian friendly</span>
              </button>

              <button
                type="button"
                onClick={() => toggleTag('vegan')}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                  dietaryTags.includes('vegan')
                    ? 'bg-emerald-50 border-emerald-300 text-[#2E7D32] font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${dietaryTags.includes('vegan') ? 'bg-[#2E7D32] text-white' : 'border border-stone-400'}`}>
                  {dietaryTags.includes('vegan') && <Check className="w-2.5 h-2.5" />}
                </div>
                <span>Vegan</span>
              </button>

              <button
                type="button"
                onClick={() => toggleTag('nut-free')}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                  dietaryTags.includes('nut-free')
                    ? 'bg-emerald-50 border-emerald-300 text-[#2E7D32] font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${dietaryTags.includes('nut-free') ? 'bg-[#2E7D32] text-white' : 'border border-stone-400'}`}>
                  {dietaryTags.includes('nut-free') && <Check className="w-2.5 h-2.5" />}
                </div>
                <span>Nut-free</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5. Inventory & Pricing Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#1C1C1E]">Inventory & Pricing</h3>
              <p className="text-xs text-stone-500">Standard rescue discount is 50–70% off retail</p>
            </div>
            <PiggyBank className="w-5 h-5 text-emerald-600" />
          </div>

          {/* Stepper: Bags Available */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div>
              <span className="font-bold text-xs text-[#1C1C1E] block">Bags Available</span>
              <span className="text-[11px] text-stone-400">Batch prepared for today</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBagsAvailable(Math.max(1, bagsAvailable - 1))}
                className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100 shadow-2xs active:scale-95"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-base text-[#1C1C1E] w-6 text-center">{bagsAvailable}</span>
              <button
                type="button"
                onClick={() => setBagsAvailable(bagsAvailable + 1)}
                className="w-8 h-8 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shadow-xs active:scale-95 hover:bg-[#256629]"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Pricing Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-600">Retail Value ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.50"
                  value={retailValue}
                  onChange={(e) => setRetailValue(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 bg-stone-50 border border-stone-200/80 rounded-2xl text-sm font-bold text-[#1C1C1E] focus:bg-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-600">FoodSaver Price ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">$</span>
                <input
                  type="number"
                  step="0.10"
                  value={foodSaverPrice}
                  onChange={(e) => setFoodSaverPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 bg-stone-50 border border-stone-200/80 rounded-2xl text-sm font-bold text-[#2E7D32] focus:bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Discount Pill Banner */}
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-between text-xs font-bold text-[#2E7D32]">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{discountPercent}% Off • Customer saves ${savings.toFixed(2)}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#1b5e20] text-white text-[10px] font-extrabold uppercase">
              Top Value
            </span>
          </div>

          {/* Merchant Payout Preview */}
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-stone-700 block">Estimated Merchant Payout</span>
              <span className="text-[10px] text-stone-400">After FoodSaver platform fee ($0.89)</span>
            </div>
            <div className="text-right">
              <span className="font-black text-base text-[#2E7D32]">${merchantPayout.toFixed(2)}</span>
              <span className="text-[10px] text-stone-400 block">per bag</span>
            </div>
          </div>
        </div>

        {/* 6. Pickup Window Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#1C1C1E]">Pickup Window</h3>
              <p className="text-xs text-stone-500">Customers must retrieve bags during this window</p>
            </div>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>

          {/* Date Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPickupDate('today')}
              className={`py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                pickupDate === 'today'
                  ? 'bg-[#1b5e20] text-white'
                  : 'bg-stone-50 text-stone-700 border border-stone-200'
              }`}
            >
              <span>📅 Today, Oct 24</span>
            </button>

            <button
              type="button"
              onClick={() => setPickupDate('tomorrow')}
              className={`py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                pickupDate === 'tomorrow'
                  ? 'bg-[#1b5e20] text-white'
                  : 'bg-stone-50 text-stone-700 border border-stone-200'
              }`}
            >
              <span>📅 Tomorrow, Oct 25</span>
            </button>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-600">Start Time</label>
              <div className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200/80 rounded-2xl">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs font-bold text-[#1C1C1E] bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-600">End Time</label>
              <div className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200/80 rounded-2xl">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs font-bold text-[#1C1C1E] bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Alert Note */}
          <div className="p-3 rounded-2xl bg-[#FFEFE7] border border-orange-200/70 flex items-center gap-2 text-xs font-medium text-[#8C3A00]">
            <Clock className="w-4 h-4 text-[#D96B1C] shrink-0" />
            <span>1 hour pickup window • Ideal for evening closing rush</span>
          </div>
        </div>

      </main>

      {/* Sticky Bottom Publish Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-4 py-3 z-50">
        <div className="max-w-md sm:max-w-xl mx-auto flex items-center gap-2.5">
          <button
            onClick={handlePublish}
            disabled={isSubmitting}
            className={`flex-1 py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing to FoodLink network...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Publish Listing (${priceNum.toFixed(2)} • {bagsAvailable} bags)</span>
              </>
            )}
          </button>

          <button
            onClick={onBack}
            className="px-5 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
          >
            Draft
          </button>
        </div>
      </div>

    </div>
  );
}
