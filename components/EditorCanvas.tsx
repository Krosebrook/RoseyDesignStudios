
import React, { useState } from 'react';
import { ImagePlus, Box, Layers, Undo2, Redo2, Download, CornerDownLeft, Sprout, X, MousePointer2, SlidersHorizontal } from 'lucide-react';
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
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  currentIndex: number; // For version display
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
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [followCursor, setFollowCursor] = useState(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is3DMode || !currentImage || !followCursor) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    // Map normalized coordinates to degrees (max 25 degrees)
    setRotation({
        x: -y * 25, 
        y: x * 25 
    });
  };

  const handleManualRotate = (axis: 'x' | 'y', value: number) => {
      setRotation(prev => ({ ...prev, [axis]: value }));
  };

  // Derived shadow values based on rotation
  const shadowX = -(rotation.y / 25) * 30;
  const shadowY = (rotation.x / 25) * 30;

  return (
    <div className="lg:col-span-8">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden h-full min-h-[600px] flex flex-col">
        
        {/* View Toggle Header */}
        {currentImage && (
            <div className="bg-stone-50 border-b border-stone-200 p-2 flex justify-end gap-2">
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

        <div 
            className="flex-1 bg-stone-100 relative flex items-center justify-center overflow-hidden"
            onMouseMove={handleMouseMove}
            style={{ perspective: '1000px' }}
        >
          {!currentImage ? (
            <div className="text-center text-stone-400 p-12">
              <ImagePlus size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No image selected</p>
              <p className="text-sm">Upload a photo or generate one to start editing</p>
            </div>
          ) : (
            <div 
              className={`relative w-full h-full flex items-center justify-center transition-all duration-200 
                ${isDraggingOver ? 'bg-primary-50/30 border-4 border-dashed border-primary-400 animate-pulse' : 'bg-stone-900/5 border-4 border-transparent'}
              `}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div 
                className="relative transition-transform duration-200 ease-out max-w-full max-h-[75vh]"
                style={is3DMode ? {
                    transform: `rotateY(${rotation.y}deg) rotateX(${rotation.x}deg) scale(0.9)`,
                    transformStyle: 'preserve-3d',
                    boxShadow: `${shadowX}px ${shadowY}px 50px rgba(0,0,0,0.25)`
                } : {}}
              >
                  <img 
                    src={currentImage} 
                    alt="Garden to edit" 
                    className={`max-w-full max-h-[75vh] object-contain shadow-2xl transition-transform duration-200 
                        ${isDraggingOver ? 'scale-95 brightness-90' : ''}
                        ${is3DMode ? 'rounded-lg' : ''}
                    `}
                  />

                  {/* Sheen Effect for 3D Mode */}
                  {is3DMode && (
                    <div 
                        className="absolute inset-0 pointer-events-none z-30 rounded-lg mix-blend-overlay"
                        style={{
                            background: `linear-gradient(${135 + rotation.y}deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)`,
                            opacity: 0.8
                        }}
                    />
                  )}

                  {/* Simulated Depth Layer for Markers in 3D Mode */}
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
              </div>
              
              {/* Drop Target Overlay */}
              {isDraggingOver && (
                <div className="absolute inset-0 m-4 rounded-xl flex items-center justify-center pointer-events-none z-30">
                  <div className="bg-white/95 px-8 py-4 rounded-2xl shadow-xl text-primary-700 font-bold flex flex-col items-center gap-2 animate-bounce border-2 border-primary-100">
                    <CornerDownLeft size={32} className="text-primary-500" /> 
                    <span>Release to Add Item</span>
                  </div>
                </div>
              )}

              {/* Loading Overlay */}
              {loading.isLoading && loading.operation === 'editing' && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                   <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center animate-fade-in">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
                      <p className="font-medium text-indigo-900">{loading.message}</p>
                   </div>
                </div>
              )}
              
              {/* 3D Controls Overlay */}
              {is3DMode && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-stone-200 p-4 rounded-2xl shadow-xl flex flex-col gap-3 w-72 z-40 animate-fade-in-up">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider">
                              <SlidersHorizontal size={12} /> Perspective
                          </div>
                          <button 
                              onClick={() => setFollowCursor(!followCursor)}
                              className={`text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors font-medium border ${followCursor ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-stone-50 text-stone-500 border-stone-200'}`}
                          >
                              <MousePointer2 size={12} />
                              {followCursor ? 'Follow Mouse' : 'Manual Control'}
                          </button>
                      </div>

                      <div className="space-y-4">
                          <div className="space-y-1.5">
                              <div className="flex justify-between text-[10px] text-stone-500 font-medium">
                                  <span>Tilt (X-Axis)</span>
                                  <span>{Math.round(rotation.x)}°</span>
                              </div>
                              <input 
                                  type="range" 
                                  min="-45" max="45" 
                                  value={rotation.x}
                                  onChange={(e) => handleManualRotate('x', parseFloat(e.target.value))}
                                  disabled={followCursor}
                                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${followCursor ? 'bg-stone-100 opacity-50' : 'bg-stone-200 accent-indigo-600'}`}
                              />
                          </div>
                          <div className="space-y-1.5">
                              <div className="flex justify-between text-[10px] text-stone-500 font-medium">
                                  <span>Pan (Y-Axis)</span>
                                  <span>{Math.round(rotation.y)}°</span>
                              </div>
                              <input 
                                  type="range" 
                                  min="-45" max="45" 
                                  value={rotation.y}
                                  onChange={(e) => handleManualRotate('y', parseFloat(e.target.value))}
                                  disabled={followCursor}
                                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${followCursor ? 'bg-stone-100 opacity-50' : 'bg-stone-200 accent-indigo-600'}`}
                              />
                          </div>
                      </div>
                  </div>
              )}
            </div>
          )}
        </div>
        
        {/* Toolbar Footer */}
        {currentImage && (
          <div className="p-4 border-t border-stone-200 bg-white flex justify-between items-center">
             <div className="flex gap-2 items-center">
                {/* Undo / Redo Group */}
                <div className="flex bg-stone-100 rounded-lg p-1 mr-2">
                  <button 
                    onClick={onUndo}
                    disabled={!canUndo || loading.isLoading}
                    className="p-2 text-stone-600 hover:bg-white hover:text-stone-900 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 size={18} />
                  </button>
                  <button 
                    onClick={onRedo}
                    disabled={!canRedo || loading.isLoading}
                    className="p-2 text-stone-600 hover:bg-white hover:text-stone-900 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    title="Redo (Ctrl+Shift+Z)"
                  >
                    <Redo2 size={18} />
                  </button>
                </div>
                
                <span className="text-xs text-stone-400 font-mono hidden sm:block">
                  v{currentIndex + 1}/{historyLength}
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
