
import React, { useState, useEffect, memo, useCallback } from 'react';
import { Plant } from '../types';
import { Sun, Droplets, Calendar, Sparkles, PlusCircle, ChevronLeft, ChevronRight, GripVertical, Download, CheckCircle2, Armchair, Droplet, Settings2, Flower } from 'lucide-react';
import { createDragGhost } from '../utils/ui';

interface PlantCardProps {
  plant: Plant;
  images: string[];
  isGenerating: boolean;
  onGenerateAI: (e: React.MouseEvent, plant: Plant) => void;
  onAddToDesign?: (plantName: string) => void;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent, plantName: string) => void;
  mini?: boolean;
  enhancedDescription?: string;
  onEnhanceDescription?: (e: React.MouseEvent, plant: Plant) => void;
  isEnhancingDescription?: boolean;
  onCustomize?: (e: React.MouseEvent, plant: Plant) => void;
}

/**
 * PlantCard displays individual plant details and handles image variation interactions.
 * Optimized with React.memo for high-performance rendering within long lists.
 */
export const PlantCard: React.FC<PlantCardProps> = memo(({
  plant,
  images,
  isGenerating,
  onGenerateAI,
  onAddToDesign,
  isDraggable = false,
  onDragStart,
  mini = false,
  enhancedDescription,
  onEnhanceDescription,
  isEnhancingDescription,
  onCustomize
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBeingDragged, setIsBeingDragged] = useState(false);

  useEffect(() => {
    if (images.length > 0) {
      setCurrentIndex(images.length - 1);
    }
  }, [images.length]);

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const selectDot = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentIndex(index);
  }, []);

  const handleDragStartInternal = useCallback((e: React.DragEvent) => {
    if (onDragStart) {
      setIsBeingDragged(true);
      onDragStart(e, plant.name);
      const currentSrc = images[currentIndex] || images[0];
      createDragGhost(e, currentSrc, mini ? 36 : 72);
    }
  }, [onDragStart, plant.name, images, currentIndex, mini]);

  const handleDragEnd = useCallback(() => {
    setIsBeingDragged(false);
  }, []);

  if (mini) {
    return (
      <div 
        draggable={isDraggable}
        onDragStart={handleDragStartInternal}
        onDragEnd={handleDragEnd}
        onClick={() => onAddToDesign && onAddToDesign(plant.name)}
        className={`group cursor-grab active:cursor-grabbing relative rounded-xl border border-stone-200 overflow-hidden transition-all bg-white select-none
          ${isBeingDragged ? 'shadow-xl ring-2 ring-primary-400 opacity-50 scale-95 grayscale' : 'hover:shadow-md hover:border-primary-300'}
        `}
      >
        <div className="aspect-square overflow-hidden relative">
          <img 
            src={images[0]} 
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none"
          />
          {onAddToDesign && (
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
               <div className="bg-white text-primary-600 p-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 duration-200">
                 <PlusCircle size={20} />
               </div>
            </div>
          )}
        </div>
        <div className="p-2 flex items-center justify-between gap-2">
          <div className="min-w-0 pointer-events-none">
            <p className="font-bold text-stone-800 text-[11px] truncate">{plant.name}</p>
            <p className="text-[9px] text-stone-500 truncate">{plant.scientificName}</p>
          </div>
          <div className="text-stone-300 group-hover:text-stone-500 transition-colors">
            <GripVertical size={14} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      draggable={isDraggable}
      onDragStart={handleDragStartInternal}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-[2rem] overflow-hidden transition-all duration-500 border border-stone-100 group flex flex-col h-full relative 
        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isBeingDragged ? 'shadow-2xl ring-2 ring-primary-400 opacity-50 scale-[0.98] grayscale-[0.5]' : 'shadow-sm hover:shadow-2xl hover:-translate-y-2'}
      `}
    >
      <div className="relative h-56 overflow-hidden bg-stone-100 group/image">
        <img 
          src={images[currentIndex] || images[0]} 
          alt={`${plant.name} variation`}
          className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${isGenerating ? 'opacity-80 blur-sm' : ''}`}
          loading="lazy"
        />
        
        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-bold z-20 flex items-center gap-1.5 border border-white/10 shadow-lg">
            <Sparkles size={10} className="text-amber-400" />
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {images.length > 1 && !isGenerating && !isBeingDragged && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-2 rounded-full shadow-xl z-30 opacity-0 group-hover/image:opacity-100 transition-all hover:scale-110 active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-2 rounded-full shadow-xl z-30 opacity-0 group-hover/image:opacity-100 transition-all hover:scale-110 active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 p-1.5 rounded-full bg-black/30 backdrop-blur-sm">
              {images.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={(e) => selectDot(e, idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/70'}`} 
                  aria-label={`Select image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            {plant.water && (
                <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5 ${
                    plant.water === 'High' ? 'bg-blue-500/90 text-white' : 
                    plant.water === 'Moderate' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                }`}>
                    <Droplets size={10} /> {plant.water === 'Drought-tolerant' ? 'Xeriscape' : plant.water}
                </span>
            )}
        </div>

        {/* AI Quick Actions Overlay */}
        <div className="absolute bottom-4 right-4 z-30 flex gap-2 translate-y-4 group-hover/image:translate-y-0 opacity-0 group-hover/image:opacity-100 transition-all duration-500">
           {onCustomize && (
             <button
               onClick={(e) => onCustomize(e, plant)}
               disabled={isGenerating}
               className="bg-white hover:bg-stone-50 text-stone-600 hover:text-primary-600 p-2.5 rounded-full shadow-2xl transition-all hover:scale-110 border border-stone-100"
               title="Generation Settings"
             >
               <Settings2 size={16} />
             </button>
           )}

           <button
             onClick={(e) => onGenerateAI(e, plant)}
             disabled={isGenerating}
             className="bg-primary-600 hover:bg-primary-700 text-white p-2.5 rounded-full shadow-2xl transition-all hover:scale-110 border border-primary-500"
             title="Generate Variation"
           >
             {isGenerating ? (
                 <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
             ) : (
                 <Sparkles size={16} />
             )}
           </button>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
            <h3 className="font-bold text-xl text-stone-900 leading-tight mb-1">{plant.name}</h3>
            <p className="text-xs text-stone-400 italic font-medium tracking-wide uppercase">{plant.scientificName}</p>
        </div>
        
        <div className="relative mb-6 flex-grow">
          <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
            {enhancedDescription || plant.description}
          </p>
          
          {!enhancedDescription && onEnhanceDescription && (
            <button
              onClick={(e) => onEnhanceDescription(e, plant)}
              disabled={isEnhancingDescription}
              className="mt-2 text-[10px] text-primary-600 hover:text-primary-800 font-bold flex items-center gap-1.5 transition-all group/enhance"
            >
              {isEnhancingDescription ? <div className="animate-spin h-2 w-2 border border-primary-600 border-t-transparent rounded-full" /> : <Sparkles size={10} className="group-hover/enhance:rotate-12 transition-transform" />}
              {isEnhancingDescription ? 'AI WRITING...' : 'ENHANCE WITH GEMINI AI'}
            </button>
          )}
        </div>
        
        {plant.category === 'Plant' && plant.sunlight && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-[11px] mb-6">
              <div className="flex items-center gap-2 text-stone-500 font-medium">
                <Sun size={14} className="text-amber-500" />
                <span className="truncate">{plant.sunlight}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 font-medium">
                <Calendar size={14} className="text-emerald-500" />
                <span className="truncate">{plant.seasons?.join(', ') || 'Year-round'}</span>
              </div>
            </div>
        )}

        {onAddToDesign && (
          <button
            onClick={() => onAddToDesign(plant.name)}
            className="w-full py-3.5 px-6 bg-stone-900 hover:bg-black text-white rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <PlusCircle size={18} />
            Add to Design
          </button>
        )}
      </div>
    </div>
  );
});

PlantCard.displayName = 'PlantCard';
