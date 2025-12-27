
import React, { useState, useEffect, memo, useCallback } from 'react';
import { Plant, PlantIconType } from '../types';
import { Sun, Droplets, Calendar, Sparkles, PlusCircle, ChevronLeft, ChevronRight, GripVertical, Info, Wand2, Settings2, X, Image as ImageIcon, Leaf, Flower, TreePine, Sprout, Armchair, Waves, Box, Palette, Hammer, Trees, Flower2, Clover, Wind, Loader2 } from 'lucide-react';
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

const getPlantIcon = (type?: PlantIconType, size: number = 18) => {
  switch (type) {
    case 'leaf': return <Leaf size={size} />;
    case 'flower': return <Flower size={size} />;
    case 'cactus': return <Sprout size={size} />;
    case 'shrub': return <Trees size={size} />;
    case 'tree': return <TreePine size={size} />;
    case 'grass': return <Wind size={size} />;
    case 'herb': return <Flower2 size={size} />;
    case 'succulent': return <Clover size={size} />;
    case 'vine': return <Wind size={size} />;
    case 'furniture': return <Armchair size={size} />;
    case 'water': return <Waves size={size} />;
    case 'structure': return <Hammer size={size} />;
    case 'feature': return <Box size={size} />;
    default: return <Sprout size={size} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Plant': return 'text-emerald-500 bg-emerald-50';
    case 'Structure': return 'text-indigo-500 bg-indigo-50';
    case 'Furniture': return 'text-amber-500 bg-amber-50';
    case 'Water Feature': return 'text-blue-500 bg-blue-50';
    default: return 'text-stone-500 bg-stone-50';
  }
};

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
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (images.length > 1) {
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

  const hasAIVisual = images.length > 1;

  const categoryColor = getCategoryColor(plant.category);

  // Rich Tooltip UI
  const RichTooltip = () => (
    <div 
      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 bg-stone-900/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/10 z-[60] pointer-events-none transition-all duration-300 ${showTooltip ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl text-primary-400">
            {getPlantIcon(plant.iconType, 20)}
          </div>
          <div>
            <h4 className="font-bold text-white text-base leading-tight">{plant.name}</h4>
            <p className="text-[11px] text-stone-400 italic font-serif tracking-wide">{plant.scientificName}</p>
          </div>
        </div>
        <div className="p-1.5 bg-white/10 rounded-lg">
          <Info size={14} className="text-primary-400" />
        </div>
      </div>
      
      <p className="text-[11px] text-stone-300 leading-relaxed mb-5 line-clamp-6">
        {enhancedDescription || plant.description}
      </p>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 rounded-lg">
              <Sun size={14} className="text-amber-400" />
            </div>
            <div>
              <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Sunlight</p>
              <p className="text-[10px] font-bold text-white">{plant.sunlight || 'Any'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <Droplets size={14} className="text-blue-400" />
            </div>
            <div>
              <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Water</p>
              <p className="text-[10px] font-bold text-white">{plant.water === 'Drought-tolerant' ? 'Low' : plant.water}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg shrink-0">
            <Calendar size={14} className="text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Active Seasons</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {plant.seasons?.map(s => (
                <span key={s} className="text-[9px] font-bold text-emerald-300 px-2 py-0.5 bg-emerald-500/5 rounded-full border border-emerald-500/20">{s}</span>
              )) || <span className="text-[10px] font-bold text-stone-400">Year-round</span>}
            </div>
          </div>
        </div>

        {plant.styles && plant.styles.length > 0 && (
          <div className="flex items-start gap-2">
            <div className="p-1.5 bg-pink-500/10 rounded-lg shrink-0">
              <Palette size={14} className="text-pink-400" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Suitable Styles</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {plant.styles.map(s => (
                  <span key={s} className="text-[9px] font-bold text-pink-300 px-2 py-0.5 bg-pink-500/5 rounded-full border border-pink-500/20">{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-stone-900/95" />
    </div>
  );

  if (mini) {
    return (
      <div 
        draggable={isDraggable}
        onDragStart={handleDragStartInternal}
        onDragEnd={handleDragEnd}
        onClick={() => onAddToDesign && onAddToDesign(plant.name)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`group cursor-grab active:cursor-grabbing relative rounded-xl border border-stone-200 overflow-visible transition-all bg-white select-none
          ${isBeingDragged ? 'shadow-xl ring-2 ring-primary-400 opacity-50 scale-95 grayscale' : 'hover:shadow-md hover:border-primary-300'}
        `}
      >
        <RichTooltip />
        <div className="aspect-square overflow-hidden relative rounded-t-xl">
          <img 
            src={images[currentIndex] || images[0]} 
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <div className="bg-white/95 text-primary-600 p-1.5 rounded-full shadow-lg transform translate-y-1 group-hover:translate-y-0 transition-all">
               <PlusCircle size={18} />
             </div>
          </div>
        </div>
        <div className="p-2 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 truncate">
            <span className={`shrink-0 p-1 rounded-md ${categoryColor.split(' ')[0]}`}>
               {getPlantIcon(plant.iconType, 12)}
            </span>
            <p className="font-bold text-stone-800 text-[10px] truncate">{plant.name}</p>
          </div>
          <GripVertical size={12} className="text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div 
      draggable={isDraggable}
      onDragStart={handleDragStartInternal}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`bg-white rounded-[2rem] transition-all duration-500 border border-stone-100 group flex flex-col h-full relative 
        ${isBeingDragged ? 'shadow-2xl ring-2 ring-primary-400 opacity-50 scale-[0.98] grayscale-[0.5]' : 'shadow-sm hover:shadow-2xl hover:-translate-y-2'}
      `}
    >
      <RichTooltip />
      <div className="relative h-56 overflow-hidden bg-stone-100 group/image rounded-t-[2rem]">
        <img 
          src={images[currentIndex] || images[0]} 
          alt={`${plant.name} variation`}
          className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${isGenerating ? 'opacity-80 blur-md scale-105' : ''}`}
          loading="lazy"
        />
        
        {/* Visualize with AI Indicator for stock images */}
        {!hasAIVisual && !isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity z-20 pointer-events-none">
             <button 
               onClick={(e) => onGenerateAI(e, plant)}
               className="pointer-events-auto bg-primary-600 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl border border-primary-500 flex items-center gap-2 hover:bg-primary-700 hover:scale-105 transition-all"
             >
               <Sparkles size={16} />
               Visualize with AI
             </button>
          </div>
        )}

        {/* Loading overlay for AI generation */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center z-40 animate-pulse">
             <div className="bg-white p-3 rounded-full shadow-xl mb-3">
                <Wand2 size={24} className="text-primary-600 animate-bounce" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-900">Dreaming up visual...</p>
          </div>
        )}

        {images.length > 1 && !isGenerating && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-2 rounded-full shadow-xl z-30 opacity-0 group-hover/image:opacity-100 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-2 rounded-full shadow-xl z-30 opacity-0 group-hover/image:opacity-100 transition-all"
            >
              <ChevronRight size={18} />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 p-1.5 rounded-full bg-black/30 backdrop-blur-sm">
              {images.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40'}`} 
                />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            {!hasAIVisual && !isGenerating && (
              <span className="text-[9px] uppercase tracking-widest font-black px-2 py-1 rounded-md bg-white/80 backdrop-blur shadow-sm text-stone-500 flex items-center gap-1 border border-stone-200">
                <ImageIcon size={10} /> Stock Photo
              </span>
            )}
            <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1.5 ${
                plant.water === 'High' ? 'bg-blue-500/90 text-white' : 
                plant.water === 'Moderate' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
            }`}>
                <Droplets size={10} /> {plant.water === 'Drought-tolerant' ? 'Xeriscape' : plant.water}
            </span>
        </div>

        {/* AI Quick Actions Overlay */}
        <div className="absolute bottom-4 right-4 z-30 flex gap-2 translate-y-4 group-hover/image:translate-y-0 opacity-0 group-hover/image:opacity-100 transition-all duration-500">
           {onCustomize && (
             <button
               onClick={(e) => onCustomize(e, plant)}
               disabled={isGenerating}
               className="bg-white hover:bg-stone-50 text-stone-600 hover:text-primary-600 p-2.5 rounded-full shadow-2xl transition-all border border-stone-100"
               title="Image Settings"
             >
               <Settings2 size={16} />
             </button>
           )}

           <button
             onClick={(e) => onGenerateAI(e, plant)}
             disabled={isGenerating}
             className="bg-primary-600 hover:bg-primary-700 text-white p-2.5 rounded-full shadow-2xl transition-all border border-primary-500"
             title={hasAIVisual ? "Generate Variation" : "Generate First AI Render"}
           >
             {isGenerating ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Sparkles size={16} />}
           </button>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className={`p-1.5 rounded-xl shadow-sm ${categoryColor}`}>
                {getPlantIcon(plant.iconType, 20)}
              </span>
              <h3 className="font-bold text-xl text-stone-900 leading-tight">{plant.name}</h3>
            </div>
            <p className="text-[10px] text-stone-400 italic font-medium tracking-widest uppercase">{plant.scientificName}</p>
        </div>
        
        <div className="relative mb-6 flex-grow">
          <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
            {enhancedDescription || plant.description}
          </p>
          
          <div className="flex items-center gap-2 mt-3">
             {!enhancedDescription && onEnhanceDescription && (
                <button
                  onClick={(e) => onEnhanceDescription(e, plant)}
                  disabled={isEnhancingDescription}
                  className="text-[10px] text-primary-600 hover:text-primary-800 font-black flex items-center gap-1.5 transition-all group/enhance"
                >
                  {isEnhancingDescription ? <div className="animate-spin h-2 w-2 border border-primary-600 border-t-transparent rounded-full" /> : <Wand2 size={10} className="group-hover/enhance:rotate-12 transition-transform" />}
                  {isEnhancingDescription ? 'AI EXPANDING...' : 'ENHANCE WITH AI'}
                </button>
             )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-[11px] mb-6">
          <div className="flex items-center gap-2 text-stone-500 font-medium">
            <Sun size={14} className="text-amber-500" />
            <span className="truncate">{plant.sunlight || 'All Lighting'}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-500 font-medium">
            <Calendar size={14} className="text-emerald-500" />
            <span className="truncate">{plant.seasons?.join(', ') || 'Year-round'}</span>
          </div>
        </div>

        <div className="space-y-2 mt-auto">
          {/* Dedicated AI Generation Button when visual is missing */}
          {!hasAIVisual && (
            <button
              onClick={(e) => onGenerateAI(e, plant)}
              disabled={isGenerating}
              className={`w-full py-3 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm border-2 ${
                isGenerating 
                  ? 'bg-stone-50 text-stone-400 border-stone-100 cursor-not-allowed' 
                  : 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200'
              }`}
            >
              {isGenerating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} className="text-indigo-500" />
              )}
              {isGenerating ? 'Dreaming...' : 'Generate AI Visual'}
            </button>
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
    </div>
  );
});

PlantCard.displayName = 'PlantCard';
