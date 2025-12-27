
import React from 'react';
import { Search, Filter, X, Sun, Droplets, Calendar, Layers, Palette, Check, LayoutGrid, CheckCircle2, Hammer, Sprout, Waves, Armchair, Flower2, Trees, Box } from 'lucide-react';
import { usePlantFiltering } from '../hooks/usePlantFiltering';
import { GardenStyle, ItemCategory } from '../types';

interface PlantFiltersProps {
  filters: ReturnType<typeof usePlantFiltering>;
  showFilters: boolean;
  toggleFilters: () => void;
}

const GARDEN_STYLES: GardenStyle[] = [
  'Cottage', 'Modern', 'Zen', 'Xeriscape', 'Tropical', 'Formal', 'Woodland', 'Minimalist'
];

const CATEGORIES: { value: ItemCategory; label: string; icon: any; color: string; bgColor: string }[] = [
  { value: 'Plant', label: 'Plants', icon: Sprout, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  { value: 'Structure', label: 'Structures', icon: Hammer, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
  { value: 'Furniture', label: 'Furniture', icon: Armchair, color: 'text-amber-500', bgColor: 'bg-amber-50' },
  { value: 'Water Feature', label: 'Water', icon: Waves, color: 'text-blue-500', bgColor: 'bg-blue-50' },
];

export const PlantFilters: React.FC<PlantFiltersProps> = ({ filters, showFilters, toggleFilters }) => {
  const {
    searchQuery,
    setSearchQuery,
    sunlightFilter,
    setSunlightFilter,
    waterFilter,
    setWaterFilter,
    seasonFilter,
    setSeasonFilter,
    categoryFilter,
    setCategoryFilter,
    styleFilters,
    toggleStyleFilter,
    filteredPlants,
    clearFilters,
    activeFiltersCount
  } = filters;

  const hasActiveFilters = activeFiltersCount > 0 || searchQuery !== '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 mb-8 sticky top-20 z-30">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="Search plants, furniture, or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={toggleFilters}
            className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all min-w-[120px] justify-center text-sm ${
              showFilters
                ? 'bg-stone-900 text-white border-stone-900 shadow-md' 
                : activeFiltersCount > 0 
                ? 'bg-primary-50 border-primary-200 text-primary-700'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Filter size={18} />
            {showFilters ? 'Hide Filters' : 'Filter View'}
            {activeFiltersCount > 0 && !showFilters && (
              <span className="bg-primary-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center ml-1 font-black">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          {hasActiveFilters && !showFilters && (
            <button 
              onClick={clearFilters}
              className="p-2.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Clear all filters"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3 animate-fade-in">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest mr-1">Active:</span>
          
          {categoryFilter !== 'All' && (
             <button onClick={() => setCategoryFilter('All')} className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-700 rounded-full text-[10px] font-bold hover:bg-red-50 hover:text-red-600 transition-colors border border-stone-200">
               <Layers size={10} /> {categoryFilter} <X size={10} />
             </button>
          )}

          {sunlightFilter !== 'All' && (
             <button onClick={() => setSunlightFilter('All')} className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold hover:bg-red-50 hover:text-red-600 transition-colors border border-amber-100">
               <Sun size={10} /> {sunlightFilter} <X size={10} />
             </button>
          )}

          {waterFilter !== 'All' && (
             <button onClick={() => setWaterFilter('All')} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold hover:bg-red-50 hover:text-red-600 transition-colors border border-blue-100">
               <Droplets size={10} /> {waterFilter} <X size={10} />
             </button>
          )}

          {seasonFilter !== 'All' && (
             <button onClick={() => setSeasonFilter('All')} className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold hover:bg-red-50 hover:text-red-600 transition-colors border border-emerald-100">
               <Calendar size={10} /> {seasonFilter} <X size={10} />
             </button>
          )}

          {styleFilters.map(style => (
             <button key={style} onClick={() => toggleStyleFilter(style)} className="flex items-center gap-1.5 px-2.5 py-1 bg-pink-50 text-pink-700 rounded-full text-[10px] font-bold hover:bg-red-50 hover:text-red-600 transition-colors border border-pink-100">
               <Palette size={10} /> {style} <X size={10} />
             </button>
          ))}

          {searchQuery && (
             <button onClick={() => setSearchQuery('')} className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold hover:bg-red-50 hover:text-red-600 transition-colors border border-indigo-100">
               <Search size={10} /> "{searchQuery}" <X size={10} />
             </button>
          )}
        </div>
      )}

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div className="mt-5 pt-5 border-t border-stone-100 space-y-8 animate-fade-in">
          {/* Category Selection - Visual Chips */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                <Layers size={14} className="text-purple-500" /> Botanical Categories
              </label>
              <button 
                onClick={() => setCategoryFilter('All')}
                className={`text-[10px] font-black uppercase hover:underline ${categoryFilter === 'All' ? 'text-stone-300 pointer-events-none' : 'text-primary-600'}`}
              >
                Show All
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isActive = categoryFilter === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(isActive ? 'All' : cat.value)}
                    className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 border ${
                      isActive 
                        ? 'bg-stone-900 border-stone-900 text-white shadow-lg scale-105' 
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : cat.color} />
                    {cat.label}
                    {isActive && <Check size={14} className="ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sunlight */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2.5">
                <Sun size={14} className="text-amber-500" /> Exposure Type
              </label>
              <select 
                value={sunlightFilter}
                onChange={(e) => setSunlightFilter(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm font-semibold focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none bg-stone-50 focus:bg-white transition-all cursor-pointer"
              >
                <option value="All">Any Sunlight</option>
                <option value="Full Sun">Full Sun (6h+)</option>
                <option value="Partial Shade">Partial Shade</option>
                <option value="Full Shade">Full Shade</option>
              </select>
            </div>
            
            {/* Water */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2.5">
                <Droplets size={14} className="text-blue-500" /> Irrigation
              </label>
              <select 
                value={waterFilter}
                onChange={(e) => setWaterFilter(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm font-semibold focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none bg-stone-50 focus:bg-white transition-all cursor-pointer"
              >
                <option value="All">Any Water Need</option>
                <option value="Drought-tolerant">Drought Tolerant</option>
                <option value="Moderate">Moderate Needs</option>
                <option value="High">High Moisture</option>
              </select>
            </div>

            {/* Season */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2.5">
                <Calendar size={14} className="text-emerald-500" /> Bloom Period
              </label>
              <select 
                value={seasonFilter}
                onChange={(e) => setSeasonFilter(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm font-semibold focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none bg-stone-50 focus:bg-white transition-all cursor-pointer"
              >
                <option value="All">Any Growing Season</option>
                <option value="Spring">Spring Growth</option>
                <option value="Summer">Summer Peak</option>
                <option value="Autumn">Autumn Transition</option>
                <option value="Winter">Winter Interest</option>
              </select>
            </div>
          </div>

          {/* Garden Style Multi-select Chips */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3.5">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                <Palette size={14} className="text-pink-500" /> Aesthetic Garden Styles
              </label>
              <div className="flex items-center gap-4">
                {styleFilters.length > 0 && (
                   <button 
                    onClick={() => styleFilters.forEach(s => toggleStyleFilter(s))}
                    className="text-[10px] text-red-500 font-black uppercase hover:underline flex items-center gap-1"
                  >
                    Clear Styles
                  </button>
                )}
                <div className="flex items-center gap-1 text-[10px] text-stone-400 font-bold uppercase">
                  <LayoutGrid size={10} /> {styleFilters.length || 'All'} Selected
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {GARDEN_STYLES.map(style => {
                const isActive = styleFilters.includes(style);
                return (
                  <button
                    key={style}
                    onClick={() => toggleStyleFilter(style)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border group ${
                      isActive 
                        ? 'bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-100 scale-105' 
                        : 'bg-white border-stone-200 text-stone-600 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isActive ? 'bg-white border-white' : 'bg-stone-50 border-stone-200 group-hover:border-pink-200'
                    }`}>
                      {isActive ? <Check size={10} className="text-pink-600" /> : <div className="w-1 h-1 rounded-full bg-stone-300 group-hover:bg-pink-300" />}
                    </div>
                    {style}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-stone-100">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-400">
                 <CheckCircle2 size={16} className="text-primary-500" />
                 {filteredPlants.length} items matching current criteria
              </div>
              <button 
                  onClick={clearFilters}
                  className="w-full sm:w-auto px-6 py-2.5 text-[11px] font-black text-stone-400 hover:text-red-500 flex items-center justify-center gap-2 transition-all uppercase tracking-widest border border-stone-100 rounded-xl hover:bg-red-50 hover:border-red-100"
              >
                  <X size={14} /> Reset All Filters
              </button>
          </div>
        </div>
      )}
    </div>
  );
};
