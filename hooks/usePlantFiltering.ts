
import { useState, useMemo } from 'react';
import { PLANTS } from '../data/plants';
import { SunlightRequirement, WaterRequirement, Season, ItemCategory } from '../types';

export const usePlantFiltering = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sunlightFilter, setSunlightFilter] = useState<SunlightRequirement | 'All'>('All');
  const [waterFilter, setWaterFilter] = useState<WaterRequirement | 'All'>('All');
  const [seasonFilter, setSeasonFilter] = useState<Season | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'All'>('All');

  const filteredPlants = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return PLANTS.filter(plant => {
      const matchesSearch = !query || 
                          plant.name.toLowerCase().includes(query) ||
                          plant.description.toLowerCase().includes(query) ||
                          plant.category.toLowerCase().includes(query);
      
      const matchesCategory = categoryFilter === 'All' || plant.category === categoryFilter;
      
      // For non-plants, these specific filters should maybe be ignored or strictly matched if fields exist?
      // For now, if a filter is active but the item doesn't have that field, it won't match (which is correct behavior for "Sunlight: Full Sun" -> don't show furniture)
      // But if Filter is 'All', it passes.
      
      const matchesSunlight = sunlightFilter === 'All' || plant.sunlight === sunlightFilter;
      const matchesWater = waterFilter === 'All' || plant.water === waterFilter;
      
      // Check seasons safely
      const matchesSeason = seasonFilter === 'All' || (plant.seasons && plant.seasons.includes(seasonFilter as Season));

      return matchesSearch && matchesCategory && matchesSunlight && matchesWater && matchesSeason;
    });
  }, [searchQuery, sunlightFilter, waterFilter, seasonFilter, categoryFilter]);

  const clearFilters = () => {
    setSunlightFilter('All');
    setWaterFilter('All');
    setSeasonFilter('All');
    setCategoryFilter('All');
    setSearchQuery('');
  };

  const activeFiltersCount = [
    sunlightFilter !== 'All',
    waterFilter !== 'All',
    seasonFilter !== 'All',
    categoryFilter !== 'All'
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
    filteredPlants,
    clearFilters,
    activeFiltersCount
  };
};
