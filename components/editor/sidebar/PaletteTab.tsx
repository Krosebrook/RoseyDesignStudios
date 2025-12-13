
import React, { useState } from 'react';
import { Search, PenTool, Eraser, Plus } from 'lucide-react';
import { Plant } from '../../../types';
import { Card } from '../../common/UI';
import { PlantCard } from '../../PlantCard';
import { CustomItemForm } from './CustomItemForm';

interface PaletteTabProps {
  plantSearch: string;
  setPlantSearch: (val: string) => void;
  filteredPlants: Plant[];
  onDragStart: (e: React.DragEvent, plantName: string) => void;
  onAddToDesign: (name: string) => void;
  onAddCustomItem: (plant: Plant) => void;
}

export const PaletteTab: React.FC<PaletteTabProps> = ({
  plantSearch,
  setPlantSearch,
  filteredPlants,
  onDragStart,
  onAddToDesign,
  onAddCustomItem
}) => {
  const [showCustomForm, setShowCustomForm] = useState(false);

  return (
    <Card className="flex flex-col h-full overflow-hidden p-0 border-0 shadow-none">
      <div className="p-4 border-b border-stone-100 bg-white z-10">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input
            type="text"
            placeholder="Search items..."
            value={plantSearch}
            onChange={(e) => setPlantSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCustomForm(!showCustomForm)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 border transition-colors ${
                showCustomForm 
                  ? 'bg-primary-50 text-primary-700 border-primary-200' 
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
            }`}
          >
            {showCustomForm ? <Plus size={14} className="rotate-45" /> : <PenTool size={14} />}
            {showCustomForm ? 'Cancel' : 'Custom Item'}
          </button>

          <button 
            onClick={() => onAddToDesign("Remove the last added item")}
            className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium flex items-center justify-center gap-2 border border-red-100 transition-colors"
            title="Add 'Remove last item' to prompt"
          >
            <Eraser size={14} />
            Remove Item
          </button>
        </div>

        {/* Custom Item Form */}
        {showCustomForm && (
          <CustomItemForm 
            onAddCustomItem={(plant) => {
              onAddCustomItem(plant);
              setShowCustomForm(false);
            }}
            onAddToDesign={(instruction) => {
              onAddToDesign(instruction);
              setShowCustomForm(false);
            }}
            onClose={() => setShowCustomForm(false)}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-2 gap-3 pb-20">
          {filteredPlants.map(plant => (
            <PlantCard 
              key={plant.id}
              plant={plant}
              images={[plant.imageUrl]}
              isGenerating={false}
              onGenerateAI={() => {}} // No-op in sidebar
              isDraggable={true}
              onDragStart={onDragStart}
              mini={true}
              onAddToDesign={(name) => onAddToDesign(name.startsWith('custom item') ? name : `Add ${name}`)}
            />
          ))}
          {filteredPlants.length === 0 && (
            <div className="col-span-2 text-center py-12 text-stone-400 bg-stone-50 rounded-xl border border-dashed border-stone-200">
              <p className="text-sm font-medium">No items found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
