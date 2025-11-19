import React from 'react';
import { Upload, ImagePlus, ArrowRight, Sprout, Search } from 'lucide-react';
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
  onAddToDesign
}) => {
  return (
    <div className="lg:col-span-4 flex flex-col h-full max-h-[800px]">
      {/* Tabs */}
      <div className="flex mb-4 bg-stone-100 p-1 rounded-xl">
        {[
          { id: 'tools', label: 'Tools', icon: null },
          { id: 'plants', label: 'Plant Palette', icon: Sprout }
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
                <Upload size={18} /> Source Image
              </h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-primary-400 hover:bg-primary-50 rounded-xl p-8 text-center cursor-pointer transition-all group relative"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
                {loading.operation === 'uploading' ? (
                  <div className="flex flex-col items-center gap-2 text-primary-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                    <span className="text-sm font-medium">{loading.message}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-stone-500 group-hover:text-primary-600">
                    <ImagePlus size={32} />
                    <span className="text-sm font-medium">Click to upload photo</span>
                  </div>
                )}
              </div>
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
                
                {loading.error && (
                  <p className="text-red-500 text-xs text-center">{loading.error}</p>
                )}
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
          // Plant Palette Section
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-stone-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input
                  type="text"
                  placeholder="Search plants..."
                  value={plantSearch}
                  onChange={(e) => setPlantSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Drag plants onto the canvas to add them.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                {filteredPlants.map(plant => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    images={[plant.imageUrl]}
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