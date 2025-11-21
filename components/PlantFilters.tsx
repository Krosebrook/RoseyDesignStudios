
import React from 'react';
import { Search, Filter, X, Sun, Droplets, Calendar, Layers } from 'lucide-react';
import { usePlantFiltering } from '../hooks/usePlantFiltering';

interface PlantFiltersProps {
  filters: ReturnType<typeof usePlantFiltering>;
  showFilters: boolean;
  toggleFilters: () => void;
}

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
    clearFilters,
    activeFiltersCount
  } = filters;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 mb-8 sticky top-20 z-30">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="Search plants, furniture, or water features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          />
        </div>
        <button 
          onClick={toggleFilters}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-colors min-w-[120px] justify-center ${
            showFilters || activeFiltersCount > 0
              ? 'bg-primary-50 border-primary-200 text-primary-700' 
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Filter size={18} />
          Filters {activeFiltersCount > 0 && <span className="bg-primary-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center ml-1">{activeFiltersCount}</span>}
        </button>
      </div>

      {/* Expanded Filters Panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
              <Layers size={16} className="text-purple-500" /> Category
            </label>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-stone-200 text-sm focus:border-primary-500 outline-none bg-stone-50 focus:bg-white transition-colors"
            >
              <option value="All">All Items</option>
              <option value="Plant">Plants</option>
              <option value="Furniture">Furniture</option>
              <option value="Water Feature">Water Features</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
              <Sun size={16} className="text-amber-500" /> Sunlight
            </label>
            <select 
              value={sunlightFilter}
              onChange={(e) => setSunlightFilter(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-stone-200 text-sm focus:border-primary-500 outline-none bg-stone-50 focus:bg-white transition-colors"
            >
              <option value="All">Any Sunlight</option>
              <option value="Full Sun">Full Sun</option>
              <option value="Partial Shade">Partial Shade</option>
              <option value="Full Shade">Full Shade</option>
            </select>
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
              <Droplets size={16} className="text-blue-500" /> Water Needs
            </label>
            <select 
              value={waterFilter}
              onChange={(e) => setWaterFilter(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-stone-200 text-sm focus:border-primary-500 outline-none bg-stone-50 focus:bg-white transition-colors"
            >
              <option value="All">Any Water</option>
              <option value="Drought-tolerant">Drought Tolerant</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
              <Calendar size={16} className="text-primary-500" /> Season
            </label>
            <select 
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-stone-200 text-sm focus:border-primary-500 outline-none bg-stone-50 focus:bg-white transition-colors"
            >
              <option value="All">Any Season</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Autumn">Autumn</option>
              <option value="Winter">Winter</option>
            </select>
          </div>
          
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <button 
                  onClick={clearFilters}
                  className="text-sm text-stone-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                  <X size={14} /> Clear all filters
              </button>
          </div>
        </div>
      )}
    </div>
  );
};