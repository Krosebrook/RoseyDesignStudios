
import React, { useState, useEffect, memo } from 'react';
import { Box, Layers, Undo2, Redo2, Download, CornerDownLeft, Sprout, X } from 'lucide-react';
import { LoadingState } from '../types';
import { use3DView } from '../hooks/use3DView';
import { PerspectiveControls } from './editor/PerspectiveControls';

interface PlantMarker {
  id: string;
  name: string;
  x: number;
  y: number;
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
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  currentIndex: number;
}

const Marker = memo(({ marker, is3D, onRemove }: { marker: PlantMarker, is3D: boolean, onRemove: (id: string) => void }) => (
  <div
    className="absolute group/marker z-20"
    style={{ 
      left: `${marker.x}%`, 
      top: `${marker.y}%`,
      transform: is3D 
          ? `translate(-50%, -50%) translateZ(40px)` 
          : `translate(-50%, -50%)` 
    }}
  >
    {/* Depth Shadow - Persistent but subtle, deepens on hover */}
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-y-2 w-12 h-12 bg-black/30 rounded-full blur-xl opacity-40 group-hover/marker:opacity-80 transition-all duration-500 pointer-events-none -z-20 scale-75 group-hover/marker:scale-125 group-hover/marker:translate-y-4" 
    />
    
    <button 
      onClick={() => onRemove(marker.id)}
      className="w-8 h-8 bg-white text-primary-600 rounded-full shadow-md group-hover/marker:shadow-2xl flex items-center justify-center border-2 border-primary-500 transition-all duration-300 group-hover/marker:scale-110 group-hover/marker:-translate-y-2 relative z-10 hover:bg-red-50 hover:border-red-500 hover:text-red-500"
      title="Remove item"
    >
      <span className="group-hover/marker:hidden"><Sprout size={16} /></span>
      <span className="hidden group-hover/marker:block"><X size={16} /></span>
    </button>

    <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-stone-900/95 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-2xl border border-white/10 whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-all duration-300 pointer-events-none z-20 backdrop-blur-md translate-y-2 group-hover/marker:translate-y-0">
       <div className="flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
         <span className="font-bold tracking-tight">{marker.name}</span>
       </div>
    </div>
  </div>
));

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
  onRedo,
  canUndo,
  canRedo,
  historyLength,
  currentIndex
}) => {
  const [is3DMode, setIs3DMode] = useState(false);
  const view3D = use3DView(is3DMode, currentImage);

  useEffect(() => {
    if (!currentImage) setIs3DMode(false);
  }, [currentImage]);

  return (
    <div className="lg:col-span-8 flex flex-col h-full min-h-[600px]">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden flex-1 flex flex-col relative">
        
        {/* View Selection */}
        {currentImage && (
          <div className="bg-stone-50 border-b border-stone-200 p-2 flex justify-end gap-2 z-20">
            <button
              onClick={() => setIs3DMode(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!is3DMode ? 'bg-white shadow text-primary-700 border border-stone-200' : 'text-stone-500 hover:bg-stone-200'}`}
            >
              <Layers size={14} /> 2D
            </button>
            <button
              onClick={() => setIs3DMode(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${is3DMode ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm' : 'text-stone-500 hover:bg-stone-200'}`}
            >
              <Box size={14} /> 3D
            </button>
          </div>
        )}

        <div 
          className="flex-1 bg-stone-100 relative flex items-center justify-center overflow-hidden"
          onMouseMove={view3D.handleMouseMove}
          style={{ perspective: '1200px' }}
        >
          {!currentImage ? (
            <div className="text-center text-stone-400 p-12">
              <p className="text-lg font-medium text-stone-600">No Canvas Active</p>
              <p className="text-sm">Upload or generate a garden to begin</p>
            </div>
          ) : (
            <div 
              className={`relative w-full h-full flex items-center justify-center transition-all ${isDraggingOver ? 'bg-primary-50/20' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div 
                className="relative transition-transform duration-300 ease-out max-w-full max-h-[75vh]"
                style={is3DMode ? {
                    transform: `rotateY(${view3D.rotation.y}deg) rotateX(${view3D.rotation.x}deg) scale(0.85)`,
                    transformStyle: 'preserve-3d',
                    boxShadow: `${view3D.shadowOffset.x}px ${view3D.shadowOffset.y}px 60px rgba(0,0,0,0.3)`
                } : {}}
              >
                  <img src={currentImage} alt="Garden" className={`max-w-full max-h-[75vh] object-contain shadow-2xl ${is3DMode ? 'rounded-xl' : ''}`} />

                  {is3DMode && (
                    <div 
                      className="absolute inset-0 pointer-events-none z-30 rounded-xl mix-blend-overlay"
                      style={{ background: `linear-gradient(${135 + view3D.rotation.y}deg, rgba(255,255,255,0.25) 0%, transparent 60%)` }}
                    />
                  )}

                  {markers.map(m => (
                    <Marker key={m.id} marker={m} is3D={is3DMode} onRemove={onRemoveMarker} />
                  ))}
              </div>
              
              {isDraggingOver && (
                <div className="absolute inset-0 flex items-center justify-center z-40">
                  <div className="bg-white/95 px-6 py-4 rounded-2xl shadow-2xl text-primary-700 font-bold flex flex-col items-center gap-2 border border-primary-200 animate-pulse">
                    <CornerDownLeft size={24} />
                    <span>Drop to Place</span>
                  </div>
                </div>
              )}

              {loading.isLoading && loading.operation === 'editing' && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-50">
                   <div className="text-center animate-fade-in-up">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3" />
                      <p className="font-bold text-stone-800 text-sm">{loading.message}</p>
                   </div>
                </div>
              )}
              
              {is3DMode && <PerspectiveControls view={view3D} />}
            </div>
          )}
        </div>
        
        {/* Footer Toolbar */}
        {currentImage && (
          <div className="p-3 border-t border-stone-200 bg-white flex justify-between items-center z-20">
             <div className="flex gap-2 items-center bg-stone-50 p-1 rounded-lg border border-stone-200">
                <button 
                  onClick={onUndo} 
                  disabled={!canUndo} 
                  className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-20 transition-opacity"
                  title="Undo edit (Ctrl+Z)"
                >
                  <Undo2 size={16} />
                </button>
                <button 
                  onClick={onRedo} 
                  disabled={!canRedo} 
                  className="p-2 text-stone-600 hover:text-stone-900 disabled:opacity-20 transition-opacity"
                  title="Redo edit (Ctrl+Shift+Z)"
                >
                  <Redo2 size={16} />
                </button>
                <span className="text-[10px] text-stone-400 font-mono px-2">REV {currentIndex + 1} / {historyLength}</span>
             </div>
             <a href={currentImage} download="garden-design.png" className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition-colors">
               <Download size={14} /> EXPORT
             </a>
          </div>
        )}
      </div>
    </div>
  );
};
