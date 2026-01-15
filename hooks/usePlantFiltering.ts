
import { useState, useMemo } from 'react';
import { PLANTS } from '../data/plants';
import { SunlightRequirement, WaterRequirement, Season, ItemCategory, GardenStyle } from '../types';

export const usePlantFiltering = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sunlightFilter, setSunlightFilter] = useState<SunlightRequirement | 'All'>('All');
  const [waterFilter, setWaterFilter] = useState<WaterRequirement | 'All'>('All');
  const [seasonFilter, setSeasonFilter] = useState<Season | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'All'>('All');
  const [styleFilters, setStyleFilters] = useState<GardenStyle[]>([]);

  const filteredPlants = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return PLANTS.filter(plant => {
      const matchesSearch = !query || 
                          plant.name.toLowerCase().includes(query) ||
                          plant.description.toLowerCase().includes(query) ||
                          plant.category.toLowerCase().includes(query);
      
      const matchesCategory = categoryFilter === 'All' || plant.category === categoryFilter;
      const matchesSunlight = sunlightFilter === 'All' || plant.sunlight === sunlightFilter;
      const matchesWater = waterFilter === 'All' || plant.water === waterFilter;
      
      // Check seasons safely
      const matchesSeason = seasonFilter === 'All' || (plant.seasons && plant.seasons.includes(seasonFilter as Season));

      // Style filtering (Multi-select: Match if plant has any of the selected styles)
      const matchesStyle = styleFilters.length === 0 || 
                          (plant.styles && plant.styles.some(s => styleFilters.includes(s)));

      return matchesSearch && matchesCategory && matchesSunlight && matchesWater && matchesSeason && matchesStyle;
    });
  }, [searchQuery, sunlightFilter, waterFilter, seasonFilter, categoryFilter, styleFilters]);

  // Calculate counts for categories based on OTHER active filters (so you see what's available)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const query = searchQuery.toLowerCase();
    
    PLANTS.forEach(plant => {
      // Check all filters EXCEPT category
      const matchesSearch = !query || 
                          plant.name.toLowerCase().includes(query) ||
                          plant.description.toLowerCase().includes(query) ||
                          plant.category.toLowerCase().includes(query);
      
      const matchesSunlight = sunlightFilter === 'All' || plant.sunlight === sunlightFilter;
      const matchesWater = waterFilter === 'All' || plant.water === waterFilter;
      const matchesSeason = seasonFilter === 'All' || (plant.seasons && plant.seasons.includes(seasonFilter as Season));
      const matchesStyle = styleFilters.length === 0 || (plant.styles && plant.styles.some(s => styleFilters.includes(s)));

      if (matchesSearch && matchesSunlight && matchesWater && matchesSeason && matchesStyle) {
        counts[plant.category] = (counts[plant.category] || 0) + 1;
      }
    });
    return counts;
  }, [searchQuery, sunlightFilter, waterFilter, seasonFilter, styleFilters]);

  const toggleStyleFilter = (style: GardenStyle) => {
    setStyleFilters(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style) 
        : [...prev, style]
    );
  };

  const clearFilters = () => {
    setSunlightFilter('All');
    setWaterFilter('All');
    setSeasonFilter('All');
    setCategoryFilter('All');
    setStyleFilters([]);
    setSearchQuery('');
  };

  const activeFiltersCount = [
    sunlightFilter !== 'All',
    waterFilter !== 'All',
    seasonFilter !== 'All',
    categoryFilter !== 'All',
    styleFilters.length > 0
  ].filter(Boolean).length;

  return {
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
    activeFiltersCount,
    categoryCounts
  };
};
