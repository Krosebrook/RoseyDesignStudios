
import React, { useState, useEffect } from 'react';
import { ImagePlus, Box, Layers, Undo2, Redo2, Download, CornerDownLeft, Sprout, X, MousePointer2, SlidersHorizontal } from 'lucide-react';
import { LoadingState } from '../types';
import { use3DView } from '../hooks/use3DView';

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
  const { 
    rotation, 
    followCursor, 
    setFollowCursor, 
    handleMouseMove, 
    setManualRotation,
    shadowOffset 
  } = use3DView(is3DMode, currentImage);

  // Reset 3D mode when image changes
  useEffect(() => {
    if (!currentImage) setIs3DMode(false);
  }, [currentImage]);

  return (
    <div className="lg:col-span-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden h-full min-h-[600px] flex flex-col relative">
        
        {/* View Toggle Header */}
        {currentImage && (
            <div className="bg-stone-50 border-b border-stone-200 p-2 flex justify-end gap-2 z-20 relative">
                <button
                  onClick={() => setIs3DMode(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!is3DMode ? 'bg-white shadow text-primary-700 border border-stone-100' : 'text-stone-500 hover:bg-stone-200'}`}
                >
                    <Layers size={14} /> 2D View
                </button>
                <button
                  onClick={() => setIs3DMode(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${is3DMode ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm' : 'text-stone-500 hover:bg-stone-200'}`}
                >
                    <Box size={14} /> 3D Perspective
                </button>
            </div>
        )}

        {/* Canvas Area */}
        <div 
            className="flex-1 bg-stone-100 relative flex items-center justify-center overflow-hidden"
            onMouseMove={handleMouseMove}
            style={{ perspective: '1000px' }}
        >
          {!currentImage ? (
            <div className="text-center text-stone-400 p-12 animate-fade-in">
              <div className="bg-white p-6 rounded-full inline-block mb-4 shadow-sm">
                <ImagePlus size={48} className="opacity-50" />
              </div>
              <p className="text-lg font-medium text-stone-600">No image selected</p>
              <p className="text-sm">Upload a photo or generate one to start editing</p>
            </div>
          ) : (
            <div 
              className={`relative w-full h-full flex items-center justify-center transition-all duration-200 
                ${isDraggingOver ? 'bg-primary-50/30 border-4 border-dashed border-primary-400' : ''}
              `}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {/* Image Container with 3D Transforms */}
              <div 
                className="relative transition-transform duration-200 ease-out max-w-full max-h-[75vh]"
                style={is3DMode ? {
                    transform: `rotateY(${rotation.y}deg) rotateX(${rotation.x}deg) scale(0.9)`,
                    transformStyle: 'preserve-3d',
                    boxShadow: `${shadowOffset.x}px ${shadowOffset.y}px 50px rgba(0,0,0,0.25)`
                } : {}}
              >
                  <img 
                    src={currentImage} 
                    alt="Garden canvas" 
                    className={`max-w-full max-h-[75vh] object-contain shadow-2xl transition-transform duration-200 
                        ${isDraggingOver ? 'scale-95 brightness-90' : ''}
                        ${is3DMode ? 'rounded-lg' : ''}
                    `}
                  />

                  {/* 3D Specular Sheen */}
                  {is3DMode && (
                    <div 
                        className="absolute inset-0 pointer-events-none z-30 rounded-lg mix-blend-overlay"
                        style={{
                            background: `linear-gradient(${135 + rotation.y}deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)`,
                            opacity: 0.8
                        }}
                    />
                  )}

                  {/* Plant Markers Layer */}
                  {markers.map(marker => (
                    <div
                      key={marker.id}
                      className="absolute group/marker z-20"
                      style={{ 
                        left: `${marker.x}%`, 
                        top: `${marker.y}%`,
                        transform: is3DMode 
                            ? `translate(-50%, -50%) translateZ(40px)` 
                            : `translate(-50%, -50%)` 
                      }}
                    >
                      {/* Interactive Marker Pin */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black/40 rounded-full blur-xl opacity-0 group-hover/marker:opacity-100 transition-all duration-300 pointer-events-none -z-20 scale-75 group-hover/marker:scale-110" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 rounded-full blur-[3px] -z-10 transition-all duration-300 group-hover/marker:scale-125 group-hover/marker:bg-black/30" />

                      <button 
                        onClick={() => onRemoveMarker(marker.id)}
                        className="w-8 h-8 bg-white text-primary-600 rounded-full shadow-md group-hover/marker:shadow-2xl flex items-center justify-center border-2 border-primary-500 cursor-pointer transition-all duration-200 group-hover/marker:scale-110 group-hover/marker:-translate-y-1 relative z-10 hover:bg-red-50 hover:border-red-500 hover:text-red-500"
                        title={`Remove ${marker.name}`}
                      >
                        <span className="group-hover/marker:hidden"><Sprout size={16} /></span>
                        <span className="hidden group-hover/marker:block"><X size={16} /></span>
                      </button>
                      
                      {/* Tooltip */}
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-stone-900/90 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none z-20 backdrop-blur-sm">
                         {marker.name}
                      </div>
                    </div>
                  ))}
              </div>
              
              {/* Dragging Overlay */}
              {isDraggingOver && (
                <div className="absolute inset-0 m-4 rounded-xl flex items-center justify-center pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-white/95 px-8 py-6 rounded-2xl shadow-xl text-primary-700 font-bold flex flex-col items-center gap-3 border-2 border-primary-100 backdrop-blur-sm">
                    <div className="bg-primary-50 p-3 rounded-full animate-bounce">
                      <CornerDownLeft size={32} className="text-primary-600" />
                    </div>
                    <span className="text-lg">Drop to Add Item</span>
                  </div>
                </div>
              )}

              {/* Loading State Overlay */}
              {loading.isLoading && loading.operation === 'editing' && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-40 transition-all duration-300">
                   <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in-up border border-stone-100 max-w-sm text-center">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 relative z-10"></div>
                      </div>
                      <h3 className="font-bold text-lg text-stone-800 mb-1">Editing Garden</h3>
                      <p className="font-medium text-stone-500 text-sm">{loading.message}</p>
                   </div>
                </div>
              )}
              
              {/* 3D Controls HUD */}
              {is3DMode && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-stone-200 p-4 rounded-2xl shadow-2xl flex flex-col gap-3 w-72 z-40 animate-fade-in-up">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
                              <SlidersHorizontal size={12} /> Perspective
                          </div>
                          <button 
                              onClick={() => setFollowCursor(!followCursor)}
                              className={`text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors font-medium border ${followCursor ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-stone-50 text-stone-500 border-stone-200'}`}
                          >
                              <MousePointer2 size={12} />
                              {followCursor ? 'Auto' : 'Manual'}
                          </button>
                      </div>

                      <div className="space-y-4">
                          {[
                            { label: 'Tilt (X)', axis: 'x', val: rotation.x, min: -45, max: 45 },
                            { label: 'Pan (Y)', axis: 'y', val: rotation.y, min: -45, max: 45 }
                          ].map(ctrl => (
                            <div key={ctrl.axis} className="space-y-1.5">
                                <div className="flex justify-between text-[10px] text-stone-500 font-medium">
                                    <span>{ctrl.label}</span>
                                    <span>{Math.round(ctrl.val)}°</span>
                                </div>
                                <input 
                                    type="range" 
                                    min={ctrl.min} max={ctrl.max} 
                                    value={ctrl.val}
                                    onChange={(e) => setManualRotation(ctrl.axis as 'x'|'y', parseFloat(e.target.value))}
                                    disabled={followCursor}
                                    className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${followCursor ? 'bg-stone-100 opacity-50' : 'bg-stone-200 accent-indigo-600'}`}
                                />
                            </div>
                          ))}
                      </div>
                  </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer Toolbar */}
        {currentImage && (
          <div className="p-3 border-t border-stone-200 bg-white flex justify-between items-center z-20 relative">
             <div className="flex gap-3 items-center">
                <div className="flex bg-stone-100 rounded-lg p-1">
                  <button 
                    onClick={onUndo}
                    disabled={!canUndo || loading.isLoading}
                    className="p-2 text-stone-600 hover:bg-white hover:text-stone-900 rounded-md disabled:opacity-30 transition-all hover:shadow-sm"
                    title="Undo"
                  >
                    <Undo2 size={18} />
                  </button>
                  <button 
                    onClick={onRedo}
                    disabled={!canRedo || loading.isLoading}
                    className="p-2 text-stone-600 hover:bg-white hover:text-stone-900 rounded-md disabled:opacity-30 transition-all hover:shadow-sm"
                    title="Redo"
                  >
                    <Redo2 size={18} />
                  </button>
                </div>
                <div className="h-6 w-px bg-stone-200 hidden sm:block"></div>
                <span className="text-xs text-stone-400 font-mono hidden sm:block">
                  v{currentIndex + 1}/{historyLength}
                </span>
             </div>

             <a
              href={currentImage}
              download={`edited-garden-${Date.now()}.png`}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow"
             >
               <Download size={16} /> <span className="hidden sm:inline">Download</span>
             </a>
          </div>
        )}
      </div>
    </div>
  );
};
