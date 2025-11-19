import React, { useState, useRef, useEffect } from 'react';
import { Plant } from '../types';
import { Sprout, Sun, Droplets, Calendar } from 'lucide-react';

interface PlantDetailPopoverProps {
  plant: Plant;
  rect: DOMRect;
}

export const PlantDetailPopover: React.FC<PlantDetailPopoverProps> = ({ plant, rect }) => {
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
  }, [rect]);

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
          <Sprout size={18} />
        </div>
      </div>
      
      <p className="text-stone-600 text-sm leading-relaxed mb-4 border-b border-stone-100 pb-4">
        {plant.description}
      </p>
      
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
    </div>
  );
};