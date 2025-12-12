
import React, { useState } from 'react';
import { Plant } from '../types';
import { usePlantFiltering } from '../hooks/usePlantFiltering';
import { usePlantAI } from '../hooks/usePlantAI';
import { useApp } from '../contexts/AppContext';
import { PlantCard } from './PlantCard';
import { PlantFilters } from './PlantFilters';
import { PlantDetailPopover } from './PlantDetailPopover';
import { SeasonalSpotlight } from './SeasonalSpotlight';
import { Search, Sparkles, Loader2 } from 'lucide-react';

export const PlantLibrary: React.FC = () => {
  const { handleAddToDesign } = useApp();
  const filters = usePlantFiltering();
  const { filteredPlants, clearFilters } = filters;
  const [showFilters, setShowFilters] = useState(false);
  
  const [hoveredPlantData, setHoveredPlantData] = useState<{ plant: Plant; rect: DOMRect } | null>(null);
  const [activePopover, setActivePopover] = useState<{ plant: Plant; rect: DOMRect; showOptions: boolean } | null>(null);

  const { 
    generatedImages, 
    generatingIds, 
    enhancedDescriptions, 
    enhancingDescIds, 
    generateImage, 
    enhanceDescription,
    pendingCount
  } = usePlantAI();

  const handleGenerateAIImage = (e?: React.MouseEvent, plant?: Plant, style?: string, lighting?: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const targetPlant = plant || activePopover?.plant || hoveredPlantData?.plant;
    if (targetPlant) {
      generateImage(targetPlant, style, lighting);
    }
  };
  
  const handleGenerateAll = () => {
    // Trigger generation for all visible plants that aren't already generating
    filteredPlants.forEach(plant => {
      if (!generatingIds.has(plant.id)) {
        generateImage(plant);
      }
    });
  };

  const handleEnhanceDescription = (e?: React.MouseEvent, plant?: Plant) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const targetPlant = plant || activePopover?.plant || hoveredPlantData?.plant;
    if (targetPlant) {
      enhanceDescription(targetPlant);
    }
  };

  const handleCustomize = (e: React.MouseEvent, plant: Plant) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setActivePopover({ plant, rect, showOptions: true });
    setHoveredPlantData(null);
  };

  const handleMouseEnter = (e: React.MouseEvent, plant: Plant) => {
    if (!activePopover) {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredPlantData({ plant, rect });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPlantData(null);
  };

  const popoverData = activePopover || (hoveredPlantData ? { ...hoveredPlantData, showOptions: false } : null);

  const isBatchGenerating = pendingCount > 1;

  return (
    <div className="max-w-7xl mx-auto p-6 w-full relative">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">Plant Database</h2>
        <p className="text-stone-600">Explore our curated collection of garden favorites.</p>
      </div>

      <SeasonalSpotlight 
        onAddToDesign={handleAddToDesign}
        generatedImages={generatedImages}
        generatingIds={generatingIds}
        onGenerateAI={handleGenerateAIImage}
      />

      {/* Progress Bar for Batch Generation */}
      {isBatchGenerating && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white shadow-xl rounded-full px-6 py-3 flex items-center gap-4 border border-primary-100 animate-fade-in-up">
              <div className="flex items-center gap-3">
                  <div className="relative">
                     <Loader2 size={24} className="text-primary-600 animate-spin" />
                  </div>
                  <div>
                      <p className="text-sm font-bold text-stone-800">Generating Images...</p>
                      <p className="text-xs text-stone-500">{pendingCount} remaining</p>
                  </div>
              </div>
          </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
            <PlantFilters 
                filters={filters} 
                showFilters={showFilters} 
                toggleFilters={() => setShowFilters(!showFilters)} 
            />
        </div>
        
        {/* Generate All Button */}
        {filteredPlants.length > 0 && (
            <div className="flex-shrink-0 md:mt-0">
               <button 
                  onClick={handleGenerateAll}
                  disabled={isBatchGenerating}
                  className={`w-full md:w-auto px-5 py-3 rounded-2xl font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                    isBatchGenerating 
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 hover:shadow-lg text-white'
                  }`}
                  title="Generate AI images for all visible plants in the list"
               >
                  {isBatchGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {isBatchGenerating ? 'Processing...' : 'Generate All Images'}
               </button>
               {!isBatchGenerating && (
                 <p className="text-[10px] text-stone-500 text-center mt-1">
                   Generating {filteredPlants.length} plants
                 </p>
               )}
            </div>
        )}
      </div>

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
                onAddToDesign={handleAddToDesign}
                isDraggable={true}
                onDragStart={(e, name) => {
                    e.dataTransfer.setData('plantName', name);
                    e.dataTransfer.effectAllowed = 'copy';
                }}
                enhancedDescription={enhancedDescriptions[plant.id]}
                onEnhanceDescription={handleEnhanceDescription}
                isEnhancingDescription={enhancingDescIds.has(plant.id)}
                onCustomize={handleCustomize}
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

      {popoverData && (
        <PlantDetailPopover 
          plant={popoverData.plant} 
          rect={popoverData.rect}
          enhancedDescription={enhancedDescriptions[popoverData.plant.id]}
          isEnhancing={enhancingDescIds.has(popoverData.plant.id)}
          onEnhance={() => handleEnhanceDescription(undefined, popoverData.plant)}
          isGeneratingImage={generatingIds.has(popoverData.plant.id)}
          onGenerateImage={(style, lighting) => handleGenerateAIImage(undefined, popoverData.plant, style, lighting)}
          onAddToDesign={handleAddToDesign}
          defaultShowOptions={popoverData.showOptions}
          onClose={activePopover ? () => setActivePopover(null) : undefined}
        />
      )}
    </div>
  );
};
