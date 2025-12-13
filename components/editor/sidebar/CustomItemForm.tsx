
import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Sprout } from 'lucide-react';
import { Button, Input } from '../../common/UI';
import { Plant } from '../../../types';

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
    sunlight: 'Full Sun',
    water: 'Moderate',
    seasons: ['Spring', 'Summer']
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddToPalette();
    else if (e.key === 'Enter') handleDirectAdd();
    else if (e.key === 'Escape') onClose();
  };

  return (
    <div className="mt-3 p-4 bg-primary-50/50 rounded-xl border border-primary-100 animate-fade-in relative shadow-sm">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-white transition-colors"
        aria-label="Close form"
      >
        <X size={14} />
      </button>
      
      <h4 className="text-xs font-bold text-stone-700 uppercase mb-3 flex items-center gap-2">
        <Sprout size={12} className="text-primary-600" />
        Create New Item
      </h4>
      
      <div className="space-y-3">
        <Input 
          ref={inputRef}
          placeholder="Item Name (e.g. Stone Path)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-white"
        />
        <Input 
          placeholder="Details (e.g. gray slate, winding)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-white"
        />
        
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
