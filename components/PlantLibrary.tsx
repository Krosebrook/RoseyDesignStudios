
import React, { useState } from 'react';
import { Plant } from '../types';
import { usePlantFiltering } from '../hooks/usePlantFiltering';
import { usePlantAI } from '../hooks/usePlantAI';
import { PlantCard } from './PlantCard';
import { PlantFilters } from './PlantFilters';
import { PlantDetailPopover } from './PlantDetailPopover';
import { SeasonalSpotlight } from './SeasonalSpotlight';
import { Search } from 'lucide-react';

interface PlantLibraryProps {
  onAddToDesign?: (plantName: string) => void;
}

export const PlantLibrary: React.FC<PlantLibraryProps> = ({ onAddToDesign }) => {
  const filters = usePlantFiltering();
  const { filteredPlants, clearFilters } = filters;
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredPlantData, setHoveredPlantData] = useState<{ plant: Plant; rect: DOMRect } | null>(null);

  // Use the new custom hook for AI operations
  const { 
    generatedImages, 
    generatingIds, 
    enhancedDescriptions, 
    enhancingDescIds, 
    generateImage, 
    enhanceDescription 
  } = usePlantAI();

  const handleGenerateAIImage = (e?: React.MouseEvent, plant?: Plant, style?: string, lighting?: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const targetPlant = plant || hoveredPlantData?.plant;
    if (targetPlant) {
      generateImage(targetPlant, style, lighting);
    }
  };

  const handleEnhanceDescription = (e?: React.MouseEvent, plant?: Plant) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const targetPlant = plant || hoveredPlantData?.plant;
    if (targetPlant) {
      enhanceDescription(targetPlant);
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

      {/* Seasonal Spotlight Section */}
      <SeasonalSpotlight 
        onAddToDesign={onAddToDesign}
        generatedImages={generatedImages}
        generatingIds={generatingIds}
        onGenerateAI={handleGenerateAIImage}
      />

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
                images={[plant.imageUrl, ...(generatedImages[plant.id] || [])]}
                isGenerating={generatingIds.has(plant.id)}
                onGenerateAI={handleGenerateAIImage}
                onAddToDesign={onAddToDesign}
                isDraggable={true}
                onDragStart={(e, name) => {
                    e.dataTransfer.setData('plantName', name);
                    e.dataTransfer.effectAllowed = 'copy';
                }}
                enhancedDescription={enhancedDescriptions[plant.id]}
                onEnhanceDescription={handleEnhanceDescription}
                isEnhancingDescription={enhancingDescIds.has(plant.id)}
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
          enhancedDescription={enhancedDescriptions[hoveredPlantData.plant.id]}
          isEnhancing={enhancingDescIds.has(hoveredPlantData.plant.id)}
          onEnhance={() => handleEnhanceDescription(undefined, hoveredPlantData.plant)}
          isGeneratingImage={generatingIds.has(hoveredPlantData.plant.id)}
          onGenerateImage={(style, lighting) => handleGenerateAIImage(undefined, hoveredPlantData.plant, style, lighting)}
          onAddToDesign={onAddToDesign}
        />
      )}
    </div>
  );
};
