import React from 'react';
import { ImagePlus, Plus, X, RefreshCw, Download, Sprout } from 'lucide-react';
import { LoadingState } from '../types';

interface PlantMarker {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  instruction: string;
}

interface EditorCanvasProps {
  currentImage: string | null;
  loading: LoadingState;
  isDraggingOver: boolean;
  markers: PlantMarker[];
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemoveMarker: (id: string) => void;
  onUndo: () => void;
  canUndo: boolean;
  historyLength: number;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  currentImage,
  loading,
  isDraggingOver,
  markers,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveMarker,
  onUndo,
  canUndo,
  historyLength
}) => {
  return (
    <div className="lg:col-span-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden h-full min-h-[600px] flex flex-col">
        <div className="flex-1 bg-stone-100 relative flex items-center justify-center overflow-hidden">
          {!currentImage ? (
            <div className="text-center text-stone-400 p-12">
              <ImagePlus size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No image selected</p>
              <p className="text-sm">Upload a photo or generate one to start editing</p>
            </div>
          ) : (
            <div 
              className={`relative w-full h-full flex items-center justify-center bg-stone-900/5 transition-all duration-200 ${isDraggingOver ? 'bg-primary-50/50' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <img 
                src={currentImage} 
                alt="Garden to edit" 
                className={`max-w-full max-h-[75vh] object-contain shadow-2xl transition-transform duration-200 ${isDraggingOver ? 'scale-95 brightness-90' : ''}`}
              />
              
              {/* Drop Target Overlay */}
              {isDraggingOver && (
                <div className="absolute inset-0 border-4 border-dashed border-primary-500/50 m-4 rounded-xl flex items-center justify-center bg-primary-50/20 backdrop-blur-[1px] pointer-events-none z-20">
                  <div className="bg-white/90 px-6 py-3 rounded-full shadow-lg text-primary-700 font-bold flex items-center gap-2 animate-bounce">
                    <Plus size={20} /> Drop to add plant
                  </div>
                </div>
              )}
              
              {/* Pending Plant Markers */}
              {markers.map(marker => (
                <div
                  key={marker.id}
                  className="absolute group/marker z-20"
                  style={{ 
                    left: `${marker.x}%`, 
                    top: `${marker.y}%`,
                    transform: 'translate(-50%, -50%)' 
                  }}
                >
                  {/* Pin Head */}
                  <div className="w-8 h-8 bg-white text-primary-600 rounded-full shadow-lg flex items-center justify-center border-2 border-primary-500 cursor-pointer transition-transform hover:scale-110">
                    <Sprout size={16} className="group-hover/marker:hidden" />
                    <X size={16} className="hidden group-hover/marker:block text-red-500" onClick={() => onRemoveMarker(marker.id)} />
                  </div>
                  
                  {/* Tooltip label */}
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none">
                     Remove {marker.name}
                  </div>
                </div>
              ))}

              {/* Loading Overlay */}
              {loading.isLoading && loading.operation === 'editing' && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                   <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center animate-fade-in">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
                      <p className="font-medium text-indigo-900">{loading.message}</p>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Toolbar Footer */}
        {currentImage && (
          <div className="p-4 border-t border-stone-200 bg-white flex justify-between items-center">
             <div className="flex gap-2">
                <button 
                  onClick={onUndo}
                  disabled={!canUndo || loading.isLoading}
                  className="group relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <RefreshCw size={14} className="-scale-x-100" /> Undo
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-stone-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-10">
                    Revert to previous version
                  </span>
                </button>
                <span className="text-xs text-stone-400 self-center">
                  v{historyLength}
                </span>
             </div>
             <a
              href={currentImage}
              download={`edited-garden-${Date.now()}.png`}
              className="group relative flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-lg transition-colors"
             >
               <Download size={16} /> Download
               <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-stone-800 bg-white border border-stone-200 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-10">
                  Save image to device
               </span>
             </a>
          </div>
        )}
      </div>
    </div>
  );
};