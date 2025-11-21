
import React, { useState, useRef, useEffect } from 'react';
import { Plant } from '../types';
import { Sprout, Sun, Droplets, Calendar, Sparkles, ImagePlus, Armchair, Droplet } from 'lucide-react';

interface PlantDetailPopoverProps {
  plant: Plant;
  rect: DOMRect;
  enhancedDescription?: string;
  isEnhancing?: boolean;
  onEnhance?: () => void;
  onGenerateImage?: () => void;
  isGeneratingImage?: boolean;
}

export const PlantDetailPopover: React.FC<PlantDetailPopoverProps> = ({ 
  plant, 
  rect,
  enhancedDescription,
  isEnhancing,
  onEnhance,
  onGenerateImage,
  isGeneratingImage
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!popoverRef.current) return;
    
    const popoverWidth = 320; 
    const gap = 16;
    const padding = 16;
    
    // Calculate horizontal position
    let left = rect.right + gap;
    // Check if it overflows the right edge of the viewport
    if (left + popoverWidth + padding > window.innerWidth) {
      left = rect.left - popoverWidth - gap;
    }
    if (left < padding) left = padding;

    // Calculate vertical position
    let top = rect.top;
    const popoverHeight = popoverRef.current.offsetHeight || 400;
    
    // Check bottom overflow
    if (top + popoverHeight + padding > window.innerHeight) {
      top = window.innerHeight - popoverHeight - padding;
    }
    if (top < padding) top = padding;

    setPosition({ top, left });
  }, [rect, enhancedDescription]); 

  return (
    <div 
      ref={popoverRef}
      className="fixed z-50 w-80 bg-white rounded-xl shadow-2xl border border-stone-200 p-5 animate-fade-in pointer-events-none"
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg text-stone-900">{plant.name}</h3>
          <p className="text-sm text-stone-500 italic font-serif">{plant.scientificName}</p>
        </div>
        <div className="bg-primary-50 p-2 rounded-full text-primary-600">
           {plant.category === 'Furniture' ? <Armchair size={18} /> : 
            plant.category === 'Water Feature' ? <Droplet size={18} /> : 
            <Sprout size={18} />}
        </div>
      </div>
      
      <div className="relative group mb-4 pb-4 border-b border-stone-100 min-h-[80px]">
        <p className="text-stone-600 text-sm leading-relaxed">
          {enhancedDescription || plant.description}
        </p>
        
        {/* AI Actions Row */}
        <div className="mt-3 flex gap-2 pointer-events-auto">
           {!enhancedDescription && onEnhance && (
             <button 
               onClick={onEnhance}
               disabled={isEnhancing}
               className="text-[10px] flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-medium transition-colors"
             >
               {isEnhancing ? <span className="animate-spin">⏳</span> : <Sparkles size={10} />}
               {isEnhancing ? 'Writing...' : 'Enhance Description'}
             </button>
           )}
           
           {onGenerateImage && (
             <button 
               onClick={onGenerateImage}
               disabled={isGeneratingImage}
               className="text-[10px] flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-medium transition-colors"
             >
                {isGeneratingImage ? <span className="animate-spin">⏳</span> : <ImagePlus size={10} />}
                {isGeneratingImage ? 'Generating...' : 'New Image'}
             </button>
           )}
        </div>
      </div>
      
      {plant.category === 'Plant' && plant.sunlight && plant.water && plant.seasons ? (
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                <Sun size={12} /> Sunlight
              </div>
              <div className="text-sm text-stone-800">{plant.sunlight}</div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                <Droplets size={12} /> Water
              </div>
              <div className="text-sm text-stone-800">
                 {plant.water === 'Drought-tolerant' ? 'Drought Tolerant (Low)' : 
                  plant.water === 'Moderate' ? 'Moderate Water' : 'High Water Needs'}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                <Calendar size={12} /> Bloom Season
              </div>
              <div className="flex flex-wrap gap-1">
                {plant.seasons.map(s => (
                  <span key={s} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
      ) : (
          <div className="space-y-3">
             <div>
                 <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Category</div>
                 <div className="text-sm text-stone-800">{plant.category}</div>
             </div>
             <div>
                 <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Material/Type</div>
                 <div className="text-sm text-stone-800">{plant.scientificName}</div>
             </div>
          </div>
      )}
    </div>
  );
};
