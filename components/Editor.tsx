
import React, { useEffect, useState } from 'react';
import { useEditorState } from '../hooks/useEditorState';
import { EditorSidebar } from './EditorSidebar';
import { EditorCanvas } from './EditorCanvas';
import { CameraModal } from './CameraModal';
import { Button } from './common/UI';
import { Save, Check, Clock, AlertCircle, Circle } from 'lucide-react';
import { PLANTS } from '../data/plants';
import { Plant } from '../types';

export const Editor: React.FC = () => {
  const editor = useEditorState();
  const [plantSearch, setPlantSearch] = React.useState('');
  const [customItems, setCustomItems] = useState<Plant[]>([]);

  // Keyboard shortcuts moved to top level effect in Editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        e.shiftKey ? editor.handleRedo() : editor.handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        editor.handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        editor.handleSaveProject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor.handleUndo, editor.handleRedo, editor.handleSaveProject]);

  const handleAddCustomItem = (plant: Plant) => {
    setCustomItems(prev => [plant, ...prev]);
  };

  const allPlants = [...customItems, ...PLANTS];
  
  const filteredPlants = allPlants.filter(p => 
    p.name.toLowerCase().includes(plantSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 w-full">
      {/* HEADER & SAVE */}
      <div className="mb-8 text-center flex flex-col md:flex-row items-center justify-center relative gap-4">
        <div className="md:absolute md:left-0 md:right-0 md:text-center pointer-events-none">
          <h2 className="text-3xl font-bold text-stone-800 mb-2 pointer-events-auto">AI Garden Editor</h2>
          <p className="text-stone-600 pointer-events-auto">Upload a photo or use your design, then use text to make magic happen.</p>
        </div>
        
        <div className="md:ml-auto md:relative z-10 flex flex-col items-end gap-1">
           <div className="relative">
             <Button 
               onClick={editor.handleSaveProject}
               disabled={!editor.currentImage || editor.saveStatus === 'saving'}
               variant={editor.saveStatus === 'saved' ? 'primary' : 'secondary'}
               className={`transition-all duration-300 ${editor.saveStatus === 'saved' ? 'bg-green-600 hover:bg-green-700' : 'bg-stone-900 hover:bg-stone-800'}`}
               leftIcon={editor.saveStatus === 'saved' ? <Check size={18} /> : editor.saveStatus === 'saving' ? undefined : <Save size={18} />}
               isLoading={editor.saveStatus === 'saving'}
             >
               {editor.saveStatus === 'saved' ? 'Saved!' : 'Save Design'}
             </Button>
             
             {editor.isDirty && editor.saveStatus !== 'saved' && (
               <div className="absolute -top-1 -right-1 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
               </div>
             )}
           </div>
           
           {editor.saveError && (
             <div className="flex items-center gap-1 text-[10px] text-red-500 font-medium animate-shake">
                <AlertCircle size={10} />
                <span>{editor.saveError}</span>
             </div>
           )}
           
           {!editor.saveError && editor.lastSaved && (
             <div className="flex items-center gap-1 text-[10px] text-stone-400 transition-opacity">
               <Clock size={10} />
               <span>Last saved: {new Date(editor.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <EditorSidebar
          activeTab={editor.activeTab}
          setActiveTab={editor.setActiveTab}
          loading={editor.loading}
          currentImage={editor.currentImage}
          editPrompt={editor.editPrompt}
          setEditPrompt={editor.setEditPrompt}
          onEdit={editor.handleEdit}
          fileInputRef={editor.fileInputRef}
          onFileUpload={editor.handleFileUpload}
          plantSearch={plantSearch}
          setPlantSearch={setPlantSearch}
          filteredPlants={filteredPlants}
          onDragStart={(e, name) => {
            e.dataTransfer.setData('plantName', name);
            e.dataTransfer.effectAllowed = 'copy';
          }}
          onAddToDesign={(instruction) => {
             const isCommand = /^(Add|Remove|Delete|Change|Move)/i.test(instruction);
             editor.updatePromptWithInstruction(isCommand ? instruction : `Add ${instruction}`);
          }}
          onAddCustomItem={handleAddCustomItem}
          onOpenCamera={() => editor.setShowCamera(true)}
        />
        
        <EditorCanvas
          currentImage={editor.currentImage}
          loading={editor.loading}
          isDraggingOver={editor.isDraggingOver}
          markers={editor.markers}
          onDragOver={(e) => { e.preventDefault(); if (editor.currentImage) editor.setIsDraggingOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); editor.setIsDraggingOver(false); }}
          onDrop={editor.handleDrop}
          onRemoveMarker={(id) => {
             const m = editor.markerManager.removeMarkerById(id);
             if (m) {
                 const newPrompt = editor.editPrompt.replace(m.instruction, '').trim().replace(/\s\s+/g, ' ');
                 editor.setEditPrompt(newPrompt);
             }
          }}
          onUndo={editor.handleUndo}
          onRedo={editor.handleRedo}
          canUndo={editor.historyManager.canUndo}
          canRedo={editor.historyManager.canRedo}
          historyLength={editor.history.length}
          currentIndex={editor.history.findIndex(h => h === editor.currentImage)} 
        />
      </div>

      {editor.showCamera && (
          <CameraModal 
            onCapture={editor.handleCameraCapture} 
            onClose={() => editor.setShowCamera(false)} 
          />
      )}
    </div>
  );
};
