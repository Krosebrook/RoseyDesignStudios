import React, { useState } from 'react';
import { Plant } from '../types';
import { generatePlantImage, generatePlantDescription } from '../services/gemini';
import { usePlantFiltering } from '../hooks/usePlantFiltering';
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

  // State to handle AI generated images overrides
  // Key: Plant ID, Value: Array of base64 image strings
  const [generatedImages, setGeneratedImages] = useState<Record<string, string[]>>({});
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

  // State for enhanced descriptions
  const [enhancedDescriptions, setEnhancedDescriptions] = useState<Record<string, string>>({});
  const [enhancingDescIds, setEnhancingDescIds] = useState<Set<string>>(new Set());

  // Hover state for Popover
  const [hoveredPlantData, setHoveredPlantData] = useState<{ plant: Plant; rect: DOMRect } | null>(null);

  const handleGenerateAIImage = async (e?: React.MouseEvent, plant?: Plant, style?: string, lighting?: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const targetPlant = plant || hoveredPlantData?.plant;
    if (!targetPlant) return;

    if (generatingIds.has(targetPlant.id)) return;

    setGeneratingIds(prev => new Set(prev).add(targetPlant.id));
    
    try {
        const newImage = await generatePlantImage(targetPlant.name, targetPlant.description, style, lighting);
        setGeneratedImages(prev => {
          const existing = prev[targetPlant.id] || [];
          return { ...prev, [targetPlant.id]: [...existing, newImage] };
        });
    } catch (err) {
        console.error("Failed to generate plant image", err);
    } finally {
        setGeneratingIds(prev => {
            const next = new Set(prev);
            next.delete(targetPlant.id);
            return next;
        });
    }
  };

  const handleEnhanceDescription = async (plant: Plant) => {
    if (enhancingDescIds.has(plant.id)) return;

    setEnhancingDescIds(prev => new Set(prev).add(plant.id));

    try {
      const newDesc = await generatePlantDescription(plant.name, plant.description);
      setEnhancedDescriptions(prev => ({ ...prev, [plant.id]: newDesc }));
    } catch (err) {
      console.error("Failed to generate description", err);
    } finally {
      setEnhancingDescIds(prev => {
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
                // Pass the default image plus any generated ones to enable carousel
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
          enhancedDescription={enhancedDescriptions[hoveredPlantData.plant.id]}
          isEnhancing={enhancingDescIds.has(hoveredPlantData.plant.id)}
          onEnhance={() => handleEnhanceDescription(hoveredPlantData.plant)}
          isGeneratingImage={generatingIds.has(hoveredPlantData.plant.id)}
          onGenerateImage={() => handleGenerateAIImage(undefined, hoveredPlantData.plant)}
        />
      )}
    </div>
  );
};