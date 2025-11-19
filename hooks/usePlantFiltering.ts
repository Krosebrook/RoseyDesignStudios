
import { useState, useMemo } from 'react';
import { PLANTS } from '../data/plants';
import { SunlightRequirement, WaterRequirement, Season } from '../types';

export const usePlantFiltering = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sunlightFilter, setSunlightFilter] = useState<SunlightRequirement | 'All'>('All');
  const [waterFilter, setWaterFilter] = useState<WaterRequirement | 'All'>('All');
  const [seasonFilter, setSeasonFilter] = useState<Season | 'All'>('All');

  const filteredPlants = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return PLANTS.filter(plant => {
      const matchesSearch = !query || 
                          plant.name.toLowerCase().includes(query) ||
                          plant.description.toLowerCase().includes(query);
                          
      const matchesSunlight = sunlightFilter === 'All' || plant.sunlight === sunlightFilter;
      const matchesWater = waterFilter === 'All' || plant.water === waterFilter;
      const matchesSeason = seasonFilter === 'All' || plant.seasons.includes(seasonFilter as Season);

      return matchesSearch && matchesSunlight && matchesWater && matchesSeason;
    });
  }, [searchQuery, sunlightFilter, waterFilter, seasonFilter]);

  const clearFilters = () => {
    setSunlightFilter('All');
    setWaterFilter('All');
    setSeasonFilter('All');
    setSearchQuery('');
  };

  const activeFiltersCount = [
    sunlightFilter !== 'All',
    waterFilter !== 'All',
    seasonFilter !== 'All'
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
    filteredPlants,
    clearFilters,
    activeFiltersCount
  };
};
