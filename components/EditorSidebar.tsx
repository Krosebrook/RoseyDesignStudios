
import React, { useState } from 'react';
import { Upload, ImagePlus, ArrowRight, Sprout, Search, Camera, Plus, PenTool, Eraser } from 'lucide-react';
import { Plant, LoadingState } from '../types';
import { PlantCard } from './PlantCard';

interface EditorSidebarProps {
  activeTab: 'tools' | 'plants';
  setActiveTab: (tab: 'tools' | 'plants') => void;
  loading: LoadingState;
  currentImage: string | null;
  editPrompt: string;
  setEditPrompt: (prompt: string) => void;
  onEdit: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  plantSearch: string;
  setPlantSearch: (search: string) => void;
  filteredPlants: Plant[];
  onDragStart: (e: React.DragEvent, plantName: string) => void;
  onAddToDesign: (name: string) => void;
  onOpenCamera: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activeTab,
  setActiveTab,
  loading,
  currentImage,
  editPrompt,
  setEditPrompt,
  onEdit,
  fileInputRef,
  onFileUpload,
  plantSearch,
  setPlantSearch,
  filteredPlants,
  onDragStart,
  onAddToDesign,
  onOpenCamera
}) => {
  const [showCustomItem, setShowCustomItem] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemDetails, setCustomItemDetails] = useState('');

  const handleAddCustomItem = () => {
    if (customItemName.trim()) {
        const promptAddition = customItemDetails.trim() 
            ? `${customItemName} (${customItemDetails})`
            : customItemName;
        onAddToDesign(promptAddition);
        setCustomItemName('');
        setCustomItemDetails('');
        setShowCustomItem(false);
    }
  };

  return (
    <div className="lg:col-span-4 flex flex-col h-full max-h-[800px]">
      {/* Tabs */}
      <div className="flex mb-4 bg-stone-100 p-1 rounded-xl">
        {[
          { id: 'tools', label: 'Tools', icon: null },
          { id: 'plants', label: 'Item Palette', icon: Sprout }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-white text-stone-800 shadow-sm' 
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.icon && <tab.icon size={16} />}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'tools' ? (
          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {/* Upload Section */}
            <div className={`bg-white p-6 rounded-2xl shadow-sm border border-stone-200 ${loading.operation === 'uploading' ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <ImagePlus size={18} /> Source Image
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-200 hover:border-primary-400 hover:bg-primary-50 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center gap-2 text-stone-500 hover:text-primary-600 group"
                  >
                    <div className="bg-stone-100 group-hover:bg-primary-100 p-3 rounded-full transition-colors">
                         <Upload size={24} className="text-stone-400 group-hover:text-primary-500" />
                    </div>
                    <span className="text-xs font-medium">Upload File</span>
                  </div>
                  
                  <div 
                    onClick={onOpenCamera}
                    className="border-2 border-dashed border-stone-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center gap-2 text-stone-500 hover:text-indigo-600 group"
                  >
                    <div className="bg-stone-100 group-hover:bg-indigo-100 p-3 rounded-full transition-colors">
                        <Camera size={24} className="text-stone-400 group-hover:text-indigo-500" />
                    </div>
                    <span className="text-xs font-medium">Take Photo</span>
                  </div>
              </div>
              
              <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileUpload} 
                  className="hidden" 
                  accept="image/*"
              />
            </div>

            {/* Text Edit Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <h3 className="font-semibold text-stone-800 mb-4">Edit Instructions</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1 block">
                    What should change?
                  </label>
                  <textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="e.g., Add a swimming pool, change the grass to gravel, add red roses..."
                    disabled={loading.isLoading}
                    className="w-full p-3 rounded-lg border border-stone-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm min-h-[120px] resize-none disabled:bg-stone-50 disabled:text-stone-400"
                  />
                </div>
                
                <button
                  onClick={onEdit}
                  disabled={!currentImage || !editPrompt.trim() || loading.isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  {loading.operation === 'editing' ? (
                     <>
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                       Applying Edits...
                     </>
                  ) : (
                    <>Apply Edits <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </div>

            {/* Tips Box */}
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm text-indigo-800">
                <p className="font-semibold mb-1">Pro Tips:</p>
                <ul className="list-disc list-inside space-y-1 opacity-80">
                  <li>Drag plants from the palette tab</li>
                  <li>"Make it sunset lighting"</li>
                  <li>"Remove the trash can"</li>
                </ul>
            </div>
          </div>
        ) : (
          // Item Palette Section
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-stone-100">
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
              
              {/* Custom Item Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowCustomItem(!showCustomItem)}
                  className="flex-1 py-2 px-3 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-lg text-xs font-medium flex items-center justify-center gap-2 border border-stone-200 transition-colors"
                >
                  {showCustomItem ? <Plus size={14} className="rotate-45" /> : <PenTool size={14} />}
                  {showCustomItem ? 'Cancel' : 'Custom Item'}
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
              {showCustomItem && (
                <div className="mt-3 p-3 bg-stone-50 rounded-lg border border-stone-200 animate-fade-in">
                    <input 
                        type="text"
                        placeholder="Item Name (e.g. Garden Gnome)"
                        value={customItemName}
                        onChange={(e) => setCustomItemName(e.target.value)}
                        className="w-full p-2 mb-2 rounded border border-stone-300 text-xs"
                    />
                    <input 
                        type="text"
                        placeholder="Details (e.g. Red hat, ceramic)"
                        value={customItemDetails}
                        onChange={(e) => setCustomItemDetails(e.target.value)}
                        className="w-full p-2 mb-2 rounded border border-stone-300 text-xs"
                    />
                    <button 
                        onClick={handleAddCustomItem}
                        disabled={!customItemName.trim()}
                        className="w-full bg-primary-600 text-white py-1.5 rounded text-xs font-bold disabled:opacity-50"
                    >
                        Add to Design Prompt
                    </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                {filteredPlants.map(plant => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    images={[plant.imageUrl]} // Simplified for sidebar
                    isGenerating={false}
                    onGenerateAI={() => {}}
                    onAddToDesign={onAddToDesign}
                    isDraggable={true}
                    onDragStart={onDragStart}
                    mini={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
