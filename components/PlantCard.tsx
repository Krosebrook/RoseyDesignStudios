import React, { useState, useEffect } from 'react';
import { Plant } from '../types';
import { Sun, Droplets, Calendar, Sparkles, PlusCircle, Move, ChevronLeft, ChevronRight } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
  images: string[]; // Changed from single displayImageUrl to array
  isGenerating: boolean;
  onGenerateAI: (e: React.MouseEvent, plant: Plant) => void;
  onAddToDesign?: (plantName: string) => void;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent, plantName: string) => void;
  mini?: boolean; // For the sidebar view
}

export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  images,
  isGenerating,
  onGenerateAI,
  onAddToDesign,
  isDraggable = false,
  onDragStart,
  mini = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically switch to the newest image when array length increases
  useEffect(() => {
    if (images.length > 0) {
      setCurrentIndex(images.length - 1);
    }
  }, [images.length]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (mini) {
    return (
      <div 
        draggable={isDraggable}
        onDragStart={(e) => onDragStart && onDragStart(e, plant.name)}
        onClick={() => onAddToDesign && onAddToDesign(plant.name)}
        className="group cursor-grab active:cursor-grabbing relative rounded-lg border border-stone-200 overflow-hidden hover:shadow-md hover:border-primary-300 transition-all bg-white"
      >
        <div className="aspect-square overflow-hidden relative">
          <img 
            src={images[0]} 
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Move className="text-white opacity-0 group-hover:opacity-100 drop-shadow-lg transform scale-75" />
          </div>
        </div>
        <div className="p-2">
          <p className="font-medium text-stone-800 text-sm truncate">{plant.name}</p>
          <p className="text-[10px] text-stone-500 truncate">{plant.scientificName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-stone-100 group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-stone-200 group/image">
        <img 
          src={images[currentIndex] || images[0]} 
          alt={`${plant.name} view ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isGenerating ? 'opacity-50 blur-sm' : ''}`}
          loading="lazy"
        />
        
        {/* Carousel Controls */}
        {images.length > 1 && !isGenerating && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1.5 h-1.5 rounded-full shadow-sm ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`} 
                />
              ))}
            </div>
          </>
        )}

        {/* Water Badge */}
        <div className="absolute top-2 right-2 z-10 pointer-events-none">
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full backdrop-blur-sm bg-white/90 shadow-sm ${
                plant.water === 'High' ? 'text-blue-700' : 
                plant.water === 'Moderate' ? 'text-blue-600' : 'text-amber-600'
            }`}>
                {plant.water === 'Drought-tolerant' ? 'Drought Tolerant' : plant.water}
            </span>
        </div>

        {/* AI Generator Button */}
        <button
          onClick={(e) => onGenerateAI(e, plant)}
          disabled={isGenerating}
          className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-primary-600 p-2 rounded-full shadow-md transition-all hover:scale-105 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          title="Generate new unique variation"
        >
          {isGenerating ? (
              <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full" />
          ) : (
              <Sparkles size={16} />
          )}
        </button>

        {/* Loading Overlay */}
        {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center z-0">
                <p className="text-xs font-bold text-stone-800 bg-white/80 px-2 py-1 rounded-md">Generating variation...</p>
            </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
            <h3 className="font-bold text-lg text-stone-800 group-hover:text-primary-700 transition-colors">{plant.name}</h3>
            <p className="text-xs text-stone-500 italic">{plant.scientificName}</p>
        </div>
        <p className="text-sm text-stone-600 mb-4 flex-grow line-clamp-3 leading-relaxed">{plant.description}</p>
        
        <div className="space-y-2 pt-4 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2 text-stone-600">
            <Sun size={14} className="text-amber-500 shrink-0" />
            <span className="truncate">{plant.sunlight}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <Droplets size={14} className="text-blue-500 shrink-0" />
            <span className="truncate">{plant.water === 'Drought-tolerant' ? 'Low water needs' : `${plant.water} water`}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <Calendar size={14} className="text-primary-500 shrink-0" />
            <span className="truncate">{plant.seasons.join(', ')}</span>
          </div>
        </div>

        {onAddToDesign && (
          <button
            onClick={() => onAddToDesign(plant.name)}
            className="w-full mt-4 py-2 px-4 bg-stone-50 hover:bg-primary-50 hover:text-primary-700 text-stone-600 hover:border-primary-200 border border-stone-200 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 group/btn"
          >
            <PlusCircle size={16} className="text-primary-500 group-hover/btn:scale-110 transition-transform" />
            Add to Garden
          </button>
        )}
      </div>
    </div>
  );
};