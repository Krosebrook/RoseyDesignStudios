
import React, { useState, useRef, useEffect } from 'react';
import { Upload, ImagePlus, ArrowRight, Sprout, Search, Camera, Plus, PenTool, Eraser, X, Palette } from 'lucide-react';
import { Plant, LoadingState } from '../types';
import { PlantCard } from './PlantCard';
import { Button, Input, TextArea, Card } from './common/UI';

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
  const [accentColor, setAccentColor] = useState<string | null>(null);
  const customNameInputRef = useRef<HTMLInputElement>(null);

  const colors = [
    { name: 'Red', hex: '#ef4444', class: 'bg-red-500' },
    { name: 'Orange', hex: '#f97316', class: 'bg-orange-500' },
    { name: 'Yellow', hex: '#eab308', class: 'bg-yellow-400' },
    { name: 'Green', hex: '#22c55e', class: 'bg-green-500' },
    { name: 'Blue', hex: '#3b82f6', class: 'bg-blue-500' },
    { name: 'Purple', hex: '#a855f7', class: 'bg-purple-500' },
    { name: 'Pink', hex: '#ec4899', class: 'bg-pink-500' },
    { name: 'White', hex: '#ffffff', class: 'bg-white border border-stone-200' },
  ];

  useEffect(() => {
    if (showCustomItem && customNameInputRef.current) {
        customNameInputRef.current.focus();
    }
  }, [showCustomItem]);

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

  const handleColorSelect = (color: typeof colors[0]) => {
    setAccentColor(color.name);
    const instruction = `Use ${color.name.toLowerCase()} as the primary accent color`;
    
    // Smart append: avoid duplicates
    if (!editPrompt.toLowerCase().includes(`accent color`)) {
        const separator = editPrompt.trim().length > 0 && !editPrompt.trim().match(/[.!?]$/) ? '. ' : editPrompt.trim().length > 0 ? ' ' : '';
        setEditPrompt(`${editPrompt.trim()}${separator}${instruction}.`);
    } else {
        const separator = editPrompt.trim().length > 0 && !editPrompt.trim().match(/[.!?]$/) ? '. ' : ' ';
        setEditPrompt(`${editPrompt.trim()}${separator}${instruction}.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleAddCustomItem();
  };

  return (
    <div className="lg:col-span-4 flex flex-col h-full max-h-[800px]">
      {/* Tab Navigation */}
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
            <Card title={<span className="flex items-center gap-2"><ImagePlus size={18} /> Source Image</span>} className={loading.operation === 'uploading' ? 'opacity-50' : ''}>
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
              <input type="file" ref={fileInputRef} onChange={onFileUpload} className="hidden" accept="image/*" />
            </Card>

            {/* Color Palette Section */}
            <Card title={<span className="flex items-center gap-2"><Palette size={18} /> Color Palette</span>}>
               <div className="grid grid-cols-4 gap-3">
                  {colors.map(c => (
                     <button
                       key={c.name}
                       onClick={() => handleColorSelect(c)}
                       className={`h-10 rounded-full shadow-sm transition-all transform hover:scale-110 flex items-center justify-center relative ${c.class} ${accentColor === c.name ? 'ring-2 ring-offset-2 ring-stone-400 scale-105' : 'hover:ring-2 hover:ring-offset-1 hover:ring-stone-200'}`}
                       title={`Set accent color to ${c.name}`}
                       aria-label={`Select ${c.name}`}
                       aria-pressed={accentColor === c.name}
                     >
                       {accentColor === c.name && <div className={`w-2 h-2 rounded-full ${c.name === 'White' || c.name === 'Yellow' ? 'bg-stone-800' : 'bg-white'}`} />}
                     </button>
                  ))}
               </div>
               {accentColor && (
                 <p className="text-xs text-stone-500 mt-3 text-center animate-fade-in">
                   Primary accent: <span className="font-bold" style={{ color: colors.find(c => c.name === accentColor)?.hex }}>{accentColor}</span>
                 </p>
               )}
            </Card>

            {/* Text Edit Section */}
            <Card title="Edit Instructions">
              <div className="space-y-4">
                <TextArea
                  label="What should change?"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="e.g., Add a swimming pool, change the grass to gravel, add red roses..."
                  disabled={loading.isLoading}
                  rows={4}
                  className={accentColor ? `border-l-4` : ''}
                  style={accentColor ? { borderLeftColor: colors.find(c => c.name === accentColor)?.hex } : {}}
                />
                
                <Button
                  onClick={onEdit}
                  disabled={!currentImage || !editPrompt.trim() || loading.isLoading}
                  isLoading={loading.operation === 'editing'}
                  variant="secondary"
                  className="w-full"
                  rightIcon={!loading.isLoading ? <ArrowRight size={16} /> : undefined}
                >
                  {loading.operation === 'editing' ? 'Applying Edits...' : 'Apply Edits'}
                </Button>
              </div>
            </Card>

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
          <Card className="flex flex-col h-full overflow-hidden p-0">
            <div className="p-4 border-b border-stone-100 bg-white">
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
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 border transition-colors ${
                      showCustomItem 
                        ? 'bg-primary-50 text-primary-700 border-primary-200' 
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  {showCustomItem ? <X size={14} /> : <PenTool size={14} />}
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
                <div className="mt-3 p-4 bg-primary-50/50 rounded-xl border border-primary-100 animate-fade-in relative">
                    <div className="absolute top-0 left