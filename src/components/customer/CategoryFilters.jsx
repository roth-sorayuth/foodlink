import React from 'react';
import { 
  Sparkles, 
  Croissant, 
  Salad, 
  Leaf, 
  Cake, 
  Coffee, 
  Apple 
} from 'lucide-react';

export default function CategoryFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  onViewAll,
}) {
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Croissant':
        return Croissant;
      case 'Salad':
        return Salad;
      case 'Leaf':
        return Leaf;
      case 'Cake':
        return Cake;
      case 'Coffee':
        return Coffee;
      case 'Apple':
        return Apple;
      case 'Sparkles':
      default:
        return Sparkles;
    }
  };

  return (
    <section className="space-y-3">
      {/* Title Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
          Categories
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          View all ({categories.length})
        </button>
      </div>

      {/* Horizontal Pill Row */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = getCategoryIcon(cat.icon);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-850 bg-[#0d4a36] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'
              }`}
            >
              {Icon && (
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isSelected ? 'text-emerald-300' : 'text-slate-500'
                  }`}
                />
              )}
              <span>{cat.name}</span>
              <span className={`text-[11px] font-medium ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                ({cat.count})
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
