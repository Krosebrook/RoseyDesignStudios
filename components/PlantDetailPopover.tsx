
import React, { useState, useRef, useEffect } from 'react';
import { Plant, PlantIconType } from '../types';
import { Sprout, Sun, Droplets, Calendar, Sparkles, ImagePlus, Armchair, PlusCircle, Settings2, X, Flower, Leaf, TreePine, Waves, Box, Hammer, Trees, Flower2, Clover, Wind } from 'lucide-react';
import { GENERATION_STYLES, GENERATION_LIGHTING } from '../data/constants';

interface PlantDetailPopoverProps {
  plant: Plant;
  rect: DOMRect;
  enhancedDescription?: string;
  isEnhancing?: boolean;
  onEnhance?: () => void;
  onGenerateImage?: (style?: string, lighting?: string) => void;
  isGeneratingImage?: boolean;
  onAddToDesign?: (plantName: string) => void;
  defaultShowOptions?: boolean;
  onClose?: () => void;
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

export const PlantDetailPopover: React.FC<PlantDetailPopoverProps> = ({ 
  plant, 
  rect,
  enhancedDescription,
  isEnhancing,
  onEnhance,
  onGenerateImage,
  isGeneratingImage,
  onAddToDesign,
  defaultShowOptions = false,
  onClose
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showGenOptions, setShowGenOptions] = useState(defaultShowOptions);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedLighting, setSelectedLighting] = useState<string>('');
  
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowGenOptions(defaultShowOptions);
  }, [defaultShowOptions]);

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
  }, [rect, enhancedDescription, showGenOptions]); 

  const handleGenerateClick = () => {
    if (onGenerateImage) {
      onGenerateImage(
        selectedStyle === '' ? undefined : selectedStyle, 
        selectedLighting === '' ? undefined : selectedLighting
      );
    }
  };

  const categoryColor = getCategoryColor(plant.category);

  return (
    <div 
      ref={popoverRef}
      className="fixed z-50 w-80 bg-white rounded-xl shadow-2xl border border-stone-200 p-5 animate-fade-in pointer-events-auto"
      style={{ top: position.top, left: position.left }}
    >
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100 transition-colors"
          title="Close details"
        >
          <X size={16} />
        </button>
      )}

      <div className="flex items-start justify-between mb-3 pr-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl shadow-sm ${categoryColor}`}>
             {getPlantIcon(plant.iconType, 20)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-stone-900">{plant.name}</h3>
            <p className="text-sm text-stone-500 italic font-serif">{plant.scientificName}</p>
          </div>
        </div>
      </div>
      
      <div className="relative group mb-4 pb-4 min-h-[80px]">
        <p className="text-stone-600 text-sm leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
          {enhancedDescription || plant.description}
        </p>
        
        {/* AI Actions Row */}
        <div className="mt-3 flex flex-wrap gap-2 pointer-events-auto">
           {!enhancedDescription && onEnhance && (
             <button 
               onClick={onEnhance}
               disabled={isEnhancing}
               className="text-[10px] flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-medium transition-colors border border-indigo-100"
               title="Use Gemini AI to expand this description with aesthetic details and gardening tips."
             >
               {isEnhancing ? <span className="animate-spin">⏳</span> : <Sparkles size={10} />}
               {isEnhancing ? 'Writing...' : 'Enhance Description'}
             </button>
           )}
           
           {onGenerateImage && (
             <button 
               onClick={() => setShowGenOptions(!showGenOptions)}
               className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-colors border ${showGenOptions ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}
               title="Open settings to choose artistic style and lighting for image generation."
             >
                <Settings2 size={10} />
                {showGenOptions ? 'Hide Options' : 'Customize Image'}
             </button>
           )}
        </div>

        {/* Custom Generation Options */}
        {showGenOptions && onGenerateImage && (
          <div className="mt-3 bg-stone-50 p-3 rounded-lg border border-stone-100 pointer-events-auto animate-fade-in">
             <div className="space-y-2 mb-3">
                <div>
                   <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Artistic Style</label>
                   <select 
                      value={selectedStyle} 
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full text-xs p-1.5 rounded border border-stone-200 bg-white focus:border-amber-400 outline-none"
                   >
                      <option value="">Surprise Me (Random)</option>
                      {GENERATION_STYLES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                   </select>
                </div>
                <div>
                   <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Lighting</label>
                   <select 
                      value={selectedLighting} 
                      onChange={(e) => setSelectedLighting(e.target.value)}
                      className="w-full text-xs p-1.5 rounded border border-stone-200 bg-white focus:border-amber-400 outline-none"
                   >
                      <option value="">Surprise Me (Random)</option>
                      {GENERATION_LIGHTING.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                   </select>
                </div>
             </div>
             <button 
               onClick={handleGenerateClick}
               disabled={isGeneratingImage}
               className="w-full text-xs flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md font-bold transition-colors shadow-sm disabled:opacity-50"
               title="Generate a new high-resolution image with your selected style and lighting."
             >
                {isGeneratingImage ? <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" /> : <ImagePlus size={12} />}
                {isGeneratingImage ? 'Generating...' : 'Generate Variation'}
             </button>
          </div>
        )}
      </div>
      
      {/* Care Requirements Section */}
      {(plant.category === 'Plant' || plant.category === 'Structure') && plant.sunlight && plant.water && plant.seasons ? (
          <div className="mt-4 pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sprout size={12} className="text-primary-500" /> 
                Care Requirements
            </h4>
            <div className="grid grid-cols-2 gap-2">
                {/* Sunlight */}
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 uppercase mb-1">
                        <Sun size={12} /> Sunlight
                    </div>
                    <div className="text-xs text-stone-800 font-medium">{plant.sunlight}</div>
                </div>

                {/* Water */}
                <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 uppercase mb-1">
                        <Droplets size={12} /> Water
                    </div>
                    <div className="text-xs text-stone-800 font-medium">
                        {plant.water === 'Drought-tolerant' ? 'Low / Drought' : plant.water}
                    </div>
                </div>

                {/* Season */}
                <div className="col-span-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-600 uppercase mb-1">
                        <Calendar size={12} /> Bloom Season
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {plant.seasons.map(s => (
                            <span key={s} className="text-[10px] bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-full shadow-sm font-medium">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
          </div>
      ) : (
          <div className="space-y-3 mt-4 pt-4 border-t border-stone-100">
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

      {/* Add to Design Button */}
      {onAddToDesign && (
        <div className="mt-4 pt-3 border-t border-stone-100 pointer-events-auto">
            <button
                onClick={() => onAddToDesign(plant.name)}
                className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                title="Add this item to the Editor for placement in your design"
            >
                <PlusCircle size={16} />
                Add to Design
            </button>
        </div>
      )}
    </div>
  );
};
