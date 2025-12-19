
import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Sprout, Sun, Droplets, Calendar } from 'lucide-react';
import { Button, Input } from '../../common/UI';
import { Plant, SunlightRequirement, WaterRequirement, Season } from '../../../types';

interface CustomItemFormProps {
  onAddCustomItem: (plant: Plant) => void;
  onAddToDesign: (instruction: string) => void;
  onClose: () => void;
}

export const CustomItemForm: React.FC<CustomItemFormProps> = ({
  onAddCustomItem,
  onAddToDesign,
  onClose
}) => {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [sunlight, setSunlight] = useState<SunlightRequirement>('Full Sun');
  const [water, setWater] = useState<WaterRequirement>('Moderate');
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>(['Spring', 'Summer']);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getFormattedName = () => {
    const cleanName = name.trim();
    const cleanDetails = details.trim();
    return `custom item: ${cleanName}${cleanDetails ? ` (${cleanDetails})` : ''}`;
  };

  const createPlantObject = (): Plant => ({
    id: `custom-${Date.now()}`,
    name: getFormattedName(),
    scientificName: details || 'Custom User Item',
    description: details || 'A custom item added by the user.',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    category: 'Feature',
    styles: [],
    sunlight,
    water,
    seasons: selectedSeasons
  });

  const handleDirectAdd = () => {
    if (!name.trim()) return;
    onAddToDesign(getFormattedName());
    onClose();
  };

  const handleAddToPalette = () => {
    if (!name.trim()) return;
    onAddCustomItem(createPlantObject());
    onClose();
  };

  const toggleSeason = (season: Season) => {
    setSelectedSeasons(prev => 
      prev.includes(season) 
        ? prev.filter(s => s !== season) 
        : [...prev, season]
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddToPalette();
    else if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'SELECT' && (e.target as HTMLElement).tagName !== 'BUTTON') {
       handleDirectAdd();
    }
    else if (e.key === 'Escape') onClose();
  };

  return (
    <div className="mt-3 p-4 bg-primary-50/50 rounded-xl border border-primary-100 animate-fade-in relative shadow-sm max-h-[500px] overflow-y-auto custom-scrollbar">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-white transition-colors z-10"
        aria-label="Close form"
      >
        <X size={14} />
      </button>
      
      <h4 className="text-xs font-bold text-stone-700 uppercase mb-3 flex items-center gap-2">
        <Sprout size={12} className="text-primary-600" />
        Create New Item
      </h4>
      
      <div className="space-y-4">
        <div>
          <Input 
            ref={inputRef}
            label="Name"
            placeholder="e.g. Stone Path"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-white"
          />
        </div>

        <div>
          <Input 
            label="Details"
            placeholder="e.g. gray slate, winding"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-white"
          />
        </div>

        {/* Care Requirements Section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <Sun size={10} className="text-amber-500" /> Sunlight
            </label>
            <select 
              value={sunlight}
              onChange={(e) => setSunlight(e.target.value as SunlightRequirement)}
              className="w-full p-2 rounded-lg border border-stone-200 text-xs focus:border-primary-500 outline-none bg-white transition-colors"
            >
              <option value="Full Sun">Full Sun</option>
              <option value="Partial Shade">Partial Shade</option>
              <option value="Full Shade">Full Shade</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <Droplets size={10} className="text-blue-500" /> Water
            </label>
            <select 
              value={water}
              onChange={(e) => setWater(e.target.value as WaterRequirement)}
              className="w-full p-2 rounded-lg border border-stone-200 text-xs focus:border-primary-500 outline-none bg-white transition-colors"
            >
              <option value="Drought-tolerant">Drought-tolerant</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={10} className="text-primary-500" /> Seasons
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(['Spring', 'Summer', 'Autumn', 'Winter'] as Season[]).map(season => (
              <button
                key={season}
                type="button"
                onClick={() => toggleSeason(season)}
                className={`text-[10px] px-2 py-1 rounded-md border transition-all font-medium ${
                  selectedSeasons.includes(season)
                    ? 'bg-primary-100 border-primary-300 text-primary-700'
                    : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2 pt-1">
          <Button 
            onClick={handleDirectAdd}
            disabled={!name.trim()}
            size="sm"
            className="flex-1"
            leftIcon={<Plus size={14} />}
            title="Add directly to the current prompt (Enter)"
          >
            Add to Design
          </Button>
          <Button 
            onClick={handleAddToPalette}
            disabled={!name.trim()}
            size="sm"
            variant="secondary"
            className="flex-1"
            leftIcon={<Sprout size={14} />}
            title="Save to palette for later use (Ctrl+Enter)"
          >
            Add to Palette
          </Button>
        </div>
      </div>
    </div>
  );
};
