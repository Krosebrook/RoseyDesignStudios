
import React, { useState, useEffect, memo, useRef } from 'react';
import { Box, Layers, Undo2, Redo2, Download, CornerDownLeft, Sprout, X, Move } from 'lucide-react';
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
  onMoveMarker?: (id: string, x: number, y: number, w: number, h: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  currentIndex: number;
}

const Marker = memo(({ 
  marker, 
  is3D, 
  onRemove,
  onMouseDown 
}: { 
  marker: PlantMarker, 
  is3D: boolean, 
  onRemove: (id: string) => void,
  onMouseDown: (e: React.MouseEvent, id: string) => void
}) => (
  <div
    className="absolute group/marker z-20"
    style={{ 
      left: `${marker.x}%`, 
      top: `${marker.y}%`,
      transform: is3D 
          ? `translate(-50%, -50%) translateZ(60px)` 
          : `translate(-50%, -50%)` 
    }}
  >
    {/* Realistic Multi-layered Ground Shadow (only visible in 3D or on hover) */}
    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none -z-20 transition-all duration-500 ${is3D ? 'opacity-100' : 'opacity-0'}`}>
       {/* Deep contact shadow */}
       <div className="absolute inset-0 bg-black/60 rounded-full blur-[2px] scale-50 translate-y-1 group-hover/marker:translate-y-2 group-hover/marker:scale-75 transition-transform" />
       {/* Broad ambient occlusion */}
       <div className="absolute inset-[-40px] bg-black/10 rounded-full blur-xl scale-75 group-hover/marker:scale-125 transition-transform" />
    </div>
    
    <div 
      className="relative cursor-move"
      onMouseDown={(e) => onMouseDown(e, marker.id)}
    >
        <div className="w-10 h-10 bg-white text-primary-600 rounded-full shadow-2xl group-hover/marker:shadow-primary-500/20 flex items-center justify-center border-2 border-primary-500 transition-all duration-300 group-hover/marker:scale-110 group-hover/marker:-translate-y-3 relative z-10 hover:bg-primary-50">
          <span className="group-hover/marker:hidden"><Sprout size={18} /></span>
          <span className="hidden group-hover/marker:block"><Move size={18} /></span>
        </div>

        {/* Delete button (small overlay) */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(marker.id); }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover/marker:opacity-100 transition-opacity z-20 hover:bg-red-600"
          title="Remove Item"
        >
          <X size={12} />
        </button>
    </div>

    <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full shadow-2xl border border-white/10 whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-all duration-300 pointer-events-none z-20 translate-y-2 group-hover/marker:translate-y-0">
       <div className="flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
         <span className="font-black uppercase tracking-widest">{marker.name}</span>
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
  onMoveMarker,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  historyLength,
  currentIndex
}) => {
  const [is3DMode, setIs3DMode] = useState(false);
  const view3D = use3DView(is3DMode, currentImage);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{ id: string, startX: number, startY: number, initialMarkerX: number, initialMarkerY: number } | null>(null);

  useEffect(() => {
    if (!currentImage) setIs3DMode(false);
  }, [currentImage]);

  // --- Drag Logic ---
  const handleMarkerMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent 3D view rotation triggering
    const marker = markers.find(m => m.id === id);
    if (!marker) return;
    
    setDragState({
      id,
      startX: e.clientX,
      startY: e.clientY,
      initialMarkerX: marker.x,
      initialMarkerY: marker.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Priority to marker dragging
    if (dragState && containerRef.current && onMoveMarker) {
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragState.startX) / rect.width) * 100;
      const deltaY = ((e.clientY - dragState.startY) / rect.height) * 100;
      
      const newX = Math.max(0, Math.min(100, dragState.initialMarkerX + deltaX));
      const newY = Math.max(0, Math.min(100, dragState.initialMarkerY + deltaY));
      
      onMoveMarker(dragState.id, newX, newY, rect.width, rect.height);
      return; // Stop 3D rotation if dragging marker
    }

    // Fallback to 3D rotation
    if (is3DMode) {
      view3D.handleMouseMove(e as any);
    }
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  return (
    <div className="lg:col-span-8 flex flex-col h-full min-h-[600px]">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-stone-200 overflow-hidden flex-1 flex flex-col relative">
        
        {/* View Selection */}
        {currentImage && (
          <div className="bg-stone-50/80 backdrop-blur-md border-b border-stone-200 p-2.5 flex justify-end gap-2 z-20">
            <button
              onClick={() => setIs3DMode(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${!is3DMode ? 'bg-white shadow-md text-stone-900 border border-stone-200' : 'text-stone-500 hover:bg-stone-200'}`}
            >
              <Layers size={14} /> 2D FLAT
            </button>
            <button
              onClick={() => setIs3DMode(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${is3DMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-stone-500 hover:bg-stone-200'}`}
            >
              <Box size={14} /> 3D PARALLAX
            </button>
          </div>
        )}

        <div 
          className="flex-1 bg-stone-100 relative flex items-center justify-center overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ perspective: '1500px' }}
        >
          {!currentImage ? (
            <div className="text-center text-stone-300 p-12">
              <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-stone-200">
                <Layers size={32} />
              </div>
              <p className="text-xl font-bold text-stone-400">Canvas Inactive</p>
              <p className="text-sm">Upload or generate a garden to begin designing</p>
            </div>
          ) : (
            <div 
              ref={containerRef}
              className={`relative w-full h-full flex items-center justify-center transition-all ${isDraggingOver ? 'bg-primary-50/20' : ''} ${dragState ? 'cursor-grabbing' : 'cursor-default'}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div 
                className="relative transition-transform duration-300 ease-out max-w-full max-h-[75vh]"
                style={is3DMode ? {
                    transform: `rotateY(${view3D.rotation.y}deg) rotateX(${view3D.rotation.x}deg) scale(0.9)`,
                    transformStyle: 'preserve-3d',
                    boxShadow: `${view3D.shadowOffset.x}px ${view3D.shadowOffset.y}px 80px rgba(0,0,0,0.4)`
                } : {}}
              >
                  <img src={currentImage} alt="Garden" className={`max-w-full max-h-[75vh] object-contain shadow-2xl ${is3DMode ? 'rounded-2xl ring-1 ring-white/20' : ''}`} />

                  {is3DMode && (
                    <div 
                      className="absolute inset-0 pointer-events-none z-30 rounded-2xl mix-blend-soft-light"
                      style={{ background: `linear-gradient(${135 + view3D.rotation.y}deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)` }}
                    />
                  )}

                  {markers.map(m => (
                    <Marker 
                      key={m.id} 
                      marker={m} 
                      is3D={is3DMode} 
                      onRemove={onRemoveMarker} 
                      onMouseDown={handleMarkerMouseDown}
                    />
                  ))}
              </div>
              
              {isDraggingOver && (
                <div className="absolute inset-0 flex items-center justify-center z-40 bg-white/40 backdrop-blur-sm">
                  <div className="bg-white px-8 py-5 rounded-3xl shadow-2xl text-primary-700 font-black uppercase tracking-widest flex flex-col items-center gap-3 border-2 border-primary-100 animate-bounce">
                    <CornerDownLeft size={32} />
                    <span>Drop to Place</span>
                  </div>
                </div>
              )}

              {loading.isLoading && loading.operation === 'editing' && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-xl flex items-center justify-center z-50">
                   <div className="text-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-primary-500/20 blur-2xl animate-pulse rounded-full" />
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto relative" />
                      </div>
                      <p className="font-black text-stone-900 text-xs uppercase tracking-[0.3em]">{loading.message}</p>
                   </div>
                </div>
              )}
              
              {is3DMode && <PerspectiveControls view={view3D} />}
            </div>
          )}
        </div>
        
        {/* Footer Toolbar */}
        {currentImage && (
          <div className="p-4 border-t border-stone-200 bg-white flex justify-between items-center z-20">
             <div className="flex gap-2 items-center bg-stone-50 p-1.5 rounded-2xl border border-stone-200">
                <button 
                  onClick={onUndo} 
                  disabled={!canUndo} 
                  className="p-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-20 transition-all hover:bg-white hover:shadow-sm rounded-xl"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 size={18} />
                </button>
                <button 
                  onClick={onRedo} 
                  disabled={!canRedo} 
                  className="p-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-20 transition-all hover:bg-white hover:shadow-sm rounded-xl"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 size={18} />
                </button>
                <div className="h-6 w-px bg-stone-200 mx-1" />
                <span className="text-[10px] text-stone-500 font-black uppercase tracking-widest px-2">REVISION {currentIndex + 1} / {historyLength}</span>
             </div>
             <a href={currentImage} download="dream-garden-design.png" className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all hover:shadow-xl hover:scale-105 active:scale-95">
               <Download size={16} /> DOWNLOAD DESIGN
             </a>
          </div>
        )}
      </div>
    </div>
  );
};
