
import React from 'react';
import { Upload, ImagePlus, Camera, Palette, ArrowRight } from 'lucide-react';
import { Card, TextArea, Button } from '../../common/UI';
import { LoadingState } from '../../../types';

interface ToolsTabProps {
  loading: LoadingState;
  currentImage: string | null;
  editPrompt: string;
  setEditPrompt: (val: string) => void;
  onEdit: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenCamera: () => void;
}

const COLORS = [
  { name: 'Red', hex: '#ef4444', class: 'bg-red-500' },
  { name: 'Orange', hex: '#f97316', class: 'bg-orange-500' },
  { name: 'Yellow', hex: '#eab308', class: 'bg-yellow-400' },
  { name: 'Green', hex: '#22c55e', class: 'bg-green-500' },
  { name: 'Blue', hex: '#3b82f6', class: 'bg-blue-500' },
  { name: 'Purple', hex: '#a855f7', class: 'bg-purple-500' },
  { name: 'Pink', hex: '#ec4899', class: 'bg-pink-500' },
  { name: 'White', hex: '#ffffff', class: 'bg-white border border-stone-200' },
];

export const ToolsTab: React.FC<ToolsTabProps> = ({
  loading,
  currentImage,
  editPrompt,
  setEditPrompt,
  onEdit,
  fileInputRef,
  onFileUpload,
  onOpenCamera
}) => {
  
  const handleColorSelect = (colorName: string) => {
    const instruction = `Use ${colorName.toLowerCase()} as the primary accent color`;
    // Intelligent append logic
    const current = editPrompt.trim();
    if (current.toLowerCase().includes('accent color')) return;
    
    const separator = current.length > 0 && !current.match(/[.!?]$/) ? '. ' : current.length > 0 ? ' ' : '';
    setEditPrompt(`${current}${separator}${instruction}.`);
  };

  return (
    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar h-full">
      {/* Upload Section */}
      <Card title={<span className="flex items-center gap-2"><ImagePlus size={18} /> Source Image</span>} className={loading.operation === 'uploading' ? 'opacity-50' : ''}>
        <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-200 hover:border-primary-400 hover:bg-primary-50 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center gap-2 text-stone-500 hover:text-primary-600 group"
              aria-label="Upload image file"
            >
              <div className="bg-stone-100 group-hover:bg-primary-100 p-3 rounded-full transition-colors">
                   <Upload size={24} className="text-stone-400 group-hover:text-primary-500" />
              </div>
              <span className="text-xs font-medium">Upload File</span>
            </button>
            
            <button 
              onClick={onOpenCamera}
              className="border-2 border-dashed border-stone-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center gap-2 text-stone-500 hover:text-indigo-600 group"
              aria-label="Take photo with camera"
            >
              <div className="bg-stone-100 group-hover:bg-indigo-100 p-3 rounded-full transition-colors">
                  <Camera size={24} className="text-stone-400 group-hover:text-indigo-500" />
              </div>
              <span className="text-xs font-medium">Take Photo</span>
            </button>
        </div>
        <input type="file" ref={fileInputRef} onChange={onFileUpload} className="hidden" accept="image/*" />
      </Card>

      {/* Color Palette Section */}
      <Card title={<span className="flex items-center gap-2"><Palette size={18} /> Color Palette</span>}>
         <div className="grid grid-cols-4 gap-3">
            {COLORS.map(c => (
               <button
                 key={c.name}
                 onClick={() => handleColorSelect(c.name)}
                 className={`h-10 rounded-full shadow-sm transition-all transform hover:scale-110 flex items-center justify-center relative ${c.class} hover:ring-2 hover:ring-offset-1 hover:ring-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-400`}
                 title={`Add ${c.name} accent`}
                 aria-label={`Select ${c.name} color`}
               />
            ))}
         </div>
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
  );
};
