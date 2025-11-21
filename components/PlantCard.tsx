
import React, { useState, useEffect } from 'react';
import { Plant } from '../types';
import { Sun, Droplets, Calendar, Sparkles, PlusCircle, ChevronLeft, ChevronRight, GripVertical, Download, CheckCircle2, Armchair, Droplet } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
  images: string[]; // Array of image URLs (original + generated)
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

  // Automatically switch to the newest image when array length increases (new generation added)
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

  const selectDot = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const handleDragStartInternal = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(e, plant.name);
      
      // Create a custom drag ghost image
      const ghost = document.createElement('div');
      ghost.style.width = '64px';
      ghost.style.height = '64px';
      ghost.style.borderRadius = '50%';
      ghost.style.overflow = 'hidden';
      ghost.style.border = '3px solid #22c55e'; // primary-500
      ghost.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      ghost.style.position = 'absolute';
      ghost.style.top = '-1000px'; // Hide from view initially
      ghost.style.backgroundColor = 'white';
      ghost.style.zIndex = '9999';
      
      const ghostImg = document.createElement('img');
      ghostImg.src = images[0];
      ghostImg.style.width = '100%';
      ghostImg.style.height = '100%';
      ghostImg.style.objectFit = 'cover';
      ghost.appendChild(ghostImg);
      
      document.body.appendChild(ghost);
      
      // Set the custom drag image centered on the cursor
      e.dataTransfer.setDragImage(ghost, 32, 32);
      
      // Cleanup the DOM element after a short delay
      setTimeout(() => {
          document.body.removeChild(ghost);
      }, 0);
    }
  };

  if (mini) {
    return (
      <div 
        draggable={isDraggable}
        onDragStart={handleDragStartInternal}
        onClick={() => onAddToDesign && onAddToDesign(plant.name)}
        className="group cursor-grab active:cursor-grabbing relative rounded-lg border border-stone-200 overflow-hidden hover:shadow-md hover:border-primary-300 transition-all bg-white select-none"
      >
        <div className="aspect-square overflow-hidden relative">
          <img 
            src={images[0]} 
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 pointer-events-none"
          />
          {/* Add to Garden Hover Button */}
          {onAddToDesign && (
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   onAddToDesign(plant.name);
                 }}
                 className="bg-white text-primary-600 hover:text-primary-700 p-2 rounded-full shadow-lg hover:scale-110 transition-all cursor-pointer transform translate-y-2 group-hover:translate-y-0 duration-200"
                 title="Add to Design"
               >
                 <PlusCircle size={20} />
               </button>
            </div>
          )}
        </div>
        <div className="p-2 flex items-center justify-between gap-2">
          <div className="min-w-0 pointer-events-none">
            <p className="font-medium text-stone-800 text-sm truncate">{plant.name}</p>
            <p className="text-[10px] text-stone-500 truncate">{plant.scientificName}</p>
          </div>
          <div className="text-stone-300 group-hover:text-stone-500 transition-colors flex-shrink-0">
            <GripVertical size={16} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-stone-100 group flex flex-col h-full relative">
      <div className="relative h-48 overflow-hidden bg-stone-200 group/image">
        <img 
          src={images[currentIndex] || images[0]} 
          alt={`${plant.name} variation ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isGenerating ? 'opacity-90 blur-[1px]' : ''}`}
          loading="lazy"
        />
        
        {/* Image Counter / Variation Badge */}
        {images.length > 1 && (
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-medium z-20 flex items-center gap-1 border border-white/10 shadow-sm">
            <Sparkles size={10} className="text-amber-400" />
            Variation {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Download Button for current variation */}
        <a 
          href={images[currentIndex]} 
          download={`${plant.name}-variation-${currentIndex + 1}.png`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 lg:right-auto lg:left-28 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-1.5 rounded-full lg:opacity-0 lg:group-hover/image:opacity-100 transition-opacity z-20"
          title="Download this variation"
        >
          <Download size={14} />
        </a>
        
        {/* Carousel Controls - Always visible on mobile, hover on desktop */}
        {images.length > 1 && !isGenerating && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full lg:opacity-0 lg:group-hover/image:opacity-100 transition-opacity backdrop-blur-sm z-30"
              title="Previous variation"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full lg:opacity-0 lg:group-hover/image:opacity-100 transition-opacity backdrop-blur-sm z-30"
              title="Next variation"
            >
              <ChevronRight size={18} />
            </button>
            
            {/* Dot Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 p-1 rounded-full bg-black/20 backdrop-blur-[1px]">
              {images.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={(e) => selectDot(e, idx)}
                  className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300 ${idx === currentIndex ? 'bg-white w-3 scale-110' : 'bg-white/50 hover:bg-white/80'}`} 
                  aria-label={`Select variation ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Water Badge - Only show for Plants */}
        {plant.category === 'Plant' && plant.water && (
            <div className="absolute top-2 right-2 z-10 pointer-events-none">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full backdrop-blur-md bg-white/90 shadow-sm ${
                    plant.water === 'High' ? 'text-blue-700' : 
                    plant.water === 'Moderate' ? 'text-blue-600' : 'text-amber-600'
                }`}>
                    {plant.water === 'Drought-tolerant' ? 'Drought Tolerant' : plant.water}
                </span>
            </div>
        )}

        {/* Category Badge for Non-Plants */}
        {plant.category !== 'Plant' && (
            <div className="absolute top-2 right-2 z-10 pointer-events-none">
                 <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full backdrop-blur-md bg-white/90 shadow-sm text-stone-700 flex items-center gap-1">
                    {plant.category === 'Furniture' ? <Armchair size={10} /> : <Droplet size={10} />}
                    {plant.category}
                 </span>
            </div>
        )}

        {/* Generate AI Button */}
        <button
          onClick={(e) => onGenerateAI(e, plant)}
          disabled={isGenerating}
          className="absolute bottom-10 right-2 lg:bottom-2 bg-white/90 hover:bg-white text-primary-600 p-2 rounded-full shadow-lg transition-all hover:scale-110 z-30 lg:opacity-0 lg:group-hover/image:opacity-100 border border-primary-100"
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
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/20 backdrop-blur-[2px]">
                <div className="bg-white/90 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                   <div className="animate-spin h-3 w-3 border-2 border-primary-600 border-t-transparent rounded-full" />
                   <span className="text-xs font-bold text-primary-900">Creating variation...</span>
                </div>
            </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
            <div className="flex items-start justify-between gap-2">
               <h3 className="font-bold text-lg text-stone-800 group-hover:text-primary-700 transition-colors leading-tight">{plant.name}</h3>
               {images.length > 1 && (
                 <span className="text-[10px] bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded border border-primary-100 whitespace-nowrap flex items-center gap-1">
                    <CheckCircle2 size={10} /> Selected
                 </span>
               )}
            </div>
            <p className="text-xs text-stone-500 italic">{plant.scientificName}</p>
        </div>
        <p className="text-sm text-stone-600 mb-4 flex-grow line-clamp-3 leading-relaxed">{plant.description}</p>
        
        {plant.category === 'Plant' && plant.sunlight && plant.water && plant.seasons ? (
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
        ) : (
            <div className="pt-4 border-t border-stone-100 text-xs text-stone-500">
                {plant.category === 'Furniture' && 'Perfect for patios and seating areas.'}
                {plant.category === 'Water Feature' && 'Adds movement and tranquility.'}
            </div>
        )}

        {onAddToDesign && (
          <button
            onClick={() => onAddToDesign(plant.name)}
            className="w-full mt-4 py-2.5 px-4 bg-stone-50 hover:bg-primary-50 hover:text-primary-700 text-stone-600 hover:border-primary-200 border border-stone-200 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow"
          >
            <PlusCircle size={16} className="text-primary-500 group-hover/btn:scale-110 transition-transform" />
            Add to Design
          </button>
        )}
      </div>
    </div>
  );
};