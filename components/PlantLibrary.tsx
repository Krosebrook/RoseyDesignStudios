import React, { useState } from 'react';
import { Plant } from '../types';
import { generatePlantImage } from '../services/gemini';
import { usePlantFiltering } from '../hooks/usePlantFiltering';
import { PlantCard } from './PlantCard';
import { PlantFilters } from './PlantFilters';
import { PlantDetailPopover } from './PlantDetailPopover';
import { Search } from 'lucide-react';

interface PlantLibraryProps {
  onAddToDesign?: (plantName: string) => void;
}

export const PlantLibrary: React.FC<PlantLibraryProps> = ({ onAddToDesign }) => {
  const filters = usePlantFiltering();
  const { filteredPlants, clearFilters } = filters;

  const [showFilters, setShowFilters] = useState(false);

  // State to handle AI generated images overrides
  // Key: Plant ID, Value: Array of base64 image strings
  const [generatedImages, setGeneratedImages] = useState<Record<string, string[]>>({});
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

  // Hover state for Popover
  const [hoveredPlantData, setHoveredPlantData] = useState<{ plant: Plant; rect: DOMRect } | null>(null);

  const handleGenerateAIImage = async (e: React.MouseEvent, plant: Plant) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (generatingIds.has(plant.id)) return;

    setGeneratingIds(prev => new Set(prev).add(plant.id));
    
    try {
        const newImage = await generatePlantImage(plant.name, plant.description);
        setGeneratedImages(prev => {
          const existing = prev[plant.id] || [];
          return { ...prev, [plant.id]: [...existing, newImage] };
        });
    } catch (err) {
        console.error("Failed to generate plant image", err);
    } finally {
        setGeneratingIds(prev => {
            const next = new Set(prev);
            next.delete(plant.id);
            return next;
        });
    }
  };

  const handleMouseEnter = (e: React.MouseEvent, plant: Plant) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredPlantData({ plant, rect });
  };

  const handleMouseLeave = () => {
    setHoveredPlantData(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 w-full relative">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">Plant Database</h2>
        <p className="text-stone-600">Explore our curated collection of garden favorites.</p>
      </div>

      <PlantFilters 
        filters={filters} 
        showFilters={showFilters} 
        toggleFilters={() => setShowFilters(!showFilters)} 
      />

      {/* Results Grid */}
      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map(plant => (
            <div 
              key={plant.id} 
              className="relative"
              onMouseEnter={(e) => handleMouseEnter(e, plant)}
              onMouseLeave={handleMouseLeave}
            >
              <PlantCard 
                plant={plant}
                // Pass the default image plus any generated ones
                images={[plant.imageUrl, ...(generatedImages[plant.id] || [])]}
                isGenerating={generatingIds.has(plant.id)}
                onGenerateAI={handleGenerateAIImage}
                onAddToDesign={onAddToDesign}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
          <div className="bg-stone-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-stone-400" />
          </div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">No plants found</h3>
          <p className="text-stone-500 max-w-xs mx-auto">We couldn't find any plants matching your specific filters.</p>
          <button 
            onClick={clearFilters}
            className="mt-6 px-6 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 font-medium hover:bg-stone-50 transition-colors shadow-sm"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Detail Popover */}
      {hoveredPlantData && (
        <PlantDetailPopover 
          plant={hoveredPlantData.plant} 
          rect={hoveredPlantData.rect} 
        />
      )}
    </div>
  );
};