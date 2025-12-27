
import React, { useState, useEffect, useRef } from 'react';
import { Plant } from '../types';
import { PLANTS } from '../data/plants';
import { usePlantFiltering } from '../hooks/usePlantFiltering';
import { usePlantAI } from '../hooks/usePlantAI';
import { useApp } from '../contexts/AppContext';
import { PlantCard } from './PlantCard';
import { PlantFilters } from './PlantFilters';
import { PlantDetailPopover } from './PlantDetailPopover';
import { SeasonalSpotlight } from './SeasonalSpotlight';
import { Search, Sparkles, Loader2, Wand2 } from 'lucide-react';

export const PlantLibrary: React.FC = () => {
  const { handleAddToDesign } = useApp();
  const filters = usePlantFiltering();
  const { filteredPlants, clearFilters } = filters;
  const [showFilters, setShowFilters] = useState(false);
  
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

  // Robustly trigger background tasks for missing AI content
  const hasCheckedAutoVisuals = useRef(false);
  useEffect(() => {
    if (hasCheckedAutoVisuals.current) return;
    
    let visualTriggers = 0;
    let descTriggers = 0;

    PLANTS.forEach(plant => {
      // Trigger images (max 3 at once for background)
      const hasImages = generatedImages[plant.id] && generatedImages[plant.id].length > 0;
      if (!hasImages && !generatingIds.has(plant.id) && visualTriggers < 3) {
        generateImage(plant);
        visualTriggers++;
      }

      // Trigger descriptions (max 5 at once for background)
      const hasEnhancedDesc = !!enhancedDescriptions[plant.id];
      if (!hasEnhancedDesc && !enhancingDescIds.has(plant.id) && descTriggers < 5) {
        enhanceDescription(plant);
        descTriggers++;
      }
    });
    
    hasCheckedAutoVisuals.current = true;
  }, [generateImage, enhanceDescription, generatedImages, generatingIds, enhancedDescriptions, enhancingDescIds]);

  const handleGenerateAIImage = (e?: React.MouseEvent, plant?: Plant, style?: string, lighting?: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const targetPlant = plant || activePopover?.plant;
    if (targetPlant) {
      generateImage(targetPlant, style, lighting);
    }
  };
  
  const handleGenerateAllVisuals = () => {
    filteredPlants.forEach(plant => {
      const hasImages = generatedImages[plant.id] && generatedImages[plant.id].length > 0;
      if (!generatingIds.has(plant.id) && !hasImages) {
        generateImage(plant);
      }
    });
  };

  const handleEnhanceAllDescriptions = () => {
    filteredPlants.forEach(plant => {
      if (!enhancedDescriptions[plant.id] && !enhancingDescIds.has(plant.id)) {
        enhanceDescription(plant);
      }
    });
  };

  const handleEnhanceDescription = (e?: React.MouseEvent, plant?: Plant) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const targetPlant = plant || activePopover?.plant;
    if (targetPlant) {
      enhanceDescription(targetPlant);
    }
  };

  const handleCustomize = (e: React.MouseEvent, plant: Plant) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setActivePopover({ plant, rect, showOptions: true });
  };

  const isBatchGenerating = pendingCount > 0;

  return (
    <div className="max-w-7xl mx-auto p-6 w-full relative">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-stone-800 mb-2 text-balance">Botanical Intelligence Library</h2>
        <p className="text-stone-600">Our collection is continuously enhanced by Gemini with expert knowledge and unique AI variations.</p>
      </div>

      <SeasonalSpotlight 
        onAddToDesign={handleAddToDesign}
        generatedImages={generatedImages}
        generatingIds={generatingIds}
        onGenerateAI={handleGenerateAIImage}
      />

      {/* Progress Bar for Batch Generation */}
      {isBatchGenerating && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur shadow-2xl rounded-full px-6 py-4 flex items-center gap-4 border border-primary-100 animate-fade-in-up">
              <div className="flex items-center gap-4">
                  <div className="relative">
                     <div className="absolute inset-0 bg-primary-200 rounded-full animate-ping opacity-25"></div>
                     <Loader2 size={24} className="text-primary-600 animate-spin relative" />
                  </div>
                  <div>
                      <p className="text-sm font-bold text-stone-800">Processing Library...</p>
                      <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest">{pendingCount} AI tasks remaining</p>
                  </div>
              </div>
          </div>
      )}

      <div className="flex flex-col xl:flex-row gap-4 mb-8">
        <div className="flex-grow">
            <PlantFilters 
                filters={filters} 
                showFilters={showFilters} 
                toggleFilters={() => setShowFilters(!showFilters)} 
            />
        </div>
        
        {filteredPlants.length > 0 && (
            <div className="flex-shrink-0 flex flex-wrap gap-2 md:gap-3">
               <button 
                  onClick={handleEnhanceAllDescriptions}
                  disabled={isBatchGenerating}
                  className={`flex-1 md:flex-none px-5 py-3 rounded-2xl font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                    isBatchGenerating 
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                  title="Generate expert botanical descriptions for the entire view"
               >
                  {isBatchGenerating ? <Loader2 size={18} className="animate-spin text-stone-300" /> : <Wand2 size={18} className="text-indigo-500" />}
                  Refine Descriptions
               </button>

               <button 
                  onClick={handleGenerateAllVisuals}
                  disabled={isBatchGenerating}
                  className={`flex-1 md:flex-none px-5 py-3 rounded-2xl font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                    isBatchGenerating 
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg text-white'
                  }`}
                  title="Generate unique AI variations for all missing visuals"
               >
                  {isBatchGenerating ? <Loader2 size={18} className="animate-spin text-white/50" /> : <Sparkles size={18} />}
                  Visualize Library
               </button>
            </div>
        )}
      </div>

      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map(plant => (
            <div 
              key={plant.id} 
              className="relative"
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
          <h3 className="text-xl font-bold text-stone-800 mb-2">No items match</h3>
          <p className="text-stone-500 max-w-xs mx-auto">Try adjusting your filters to explore our botanical collection.</p>
          <button 
            onClick={clearFilters}
            className="mt-6 px-6 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 font-medium hover:bg-stone-50 transition-colors shadow-sm"
          >
            Clear all filters
          </button>
        </div>
      )}

      {activePopover && (
        <PlantDetailPopover 
          plant={activePopover.plant} 
          rect={activePopover.rect}
          enhancedDescription={enhancedDescriptions[activePopover.plant.id]}
          isEnhancing={enhancingDescIds.has(activePopover.plant.id)}
          onEnhance={() => handleEnhanceDescription(undefined, activePopover.plant)}
          isGeneratingImage={generatingIds.has(activePopover.plant.id)}
          onGenerateImage={(style, lighting) => handleGenerateAIImage(undefined, activePopover.plant, style, lighting)}
          onAddToDesign={handleAddToDesign}
          defaultShowOptions={activePopover.showOptions}
          onClose={() => setActivePopover(null)}
        />
      )}
    </div>
  );
};
