import React, { useState, useRef, useEffect } from 'react';
import { editGardenImage } from '../services/gemini';
import { LoadingState } from '../types';
import { PLANTS } from '../data/plants';
import { useImageHistory } from '../hooks/useImageHistory';
import { useMarkers } from '../hooks/useMarkers';
import { useProjectStorage } from '../hooks/useProjectStorage';
import { useLoadingCycle } from '../hooks/useLoadingCycle';
import { useApp } from '../contexts/AppContext';
import { EditorSidebar } from './EditorSidebar';
import { EditorCanvas } from './EditorCanvas';
import { Save, Check, Clock } from 'lucide-react';
import { CameraModal } from './CameraModal';
import { EDIT_LOADING_MESSAGES } from '../data/constants';
import { getPositionDescription } from '../utils/editor';

export const Editor: React.FC = () => {
  // Use Global Context
  const { currentImage: initialImage, currentHistory: initialHistory, pendingInstruction, setPendingInstruction } = useApp();

  const { 
    currentImage, 
    setCurrentImage, 
    history, 
    pushToHistory, 
    undo,
    redo,
    resetHistory, 
    canUndo,
    canRedo
  } = useImageHistory(initialImage ? initialImage.dataUrl : null, initialHistory);

  const { markers, addMarker, removeMarkerById, clearMarkers } = useMarkers();
  const { saveProject, saveStatus, lastSaved } = useProjectStorage();

  const [editPrompt, setEditPrompt] = useState('');
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, operation: 'idle', message: '' });
  const [showCamera, setShowCamera] = useState(false);
  
  useLoadingCycle(loading, setLoading, EDIT_LOADING_MESSAGES, 'editing');
  
  const [activeTab, setActiveTab] = useState<'tools' | 'plants'>('tools');
  const [plantSearch, setPlantSearch] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize/Reset when global context image changes
  useEffect(() => {
    if (initialImage) {
      if (initialHistory && initialHistory.length > 0) {
          resetHistory(initialImage.dataUrl, initialHistory);
      } else {
          resetHistory(initialImage.dataUrl);
      }
      setEditPrompt('');
      clearMarkers();
    }
  }, [initialImage?.id, resetHistory, initialHistory, clearMarkers]);

  // Handle pending instructions from other parts of the app
  const updatePromptWithInstruction = (instruction: string) => {
    setEditPrompt(prev => {
      const cleanPrev = prev.trim();
      if (!cleanPrev) return instruction;
      const separator = cleanPrev.match(/[.!?,]$/) ? ' ' : '. ';
      return `${cleanPrev}${separator}${instruction}`;
    });
    setActiveTab('tools');
  };

  useEffect(() => {
    if (pendingInstruction) {
      updatePromptWithInstruction(pendingInstruction);
      setPendingInstruction(null); // Clear globally after consuming
    }
  }, [pendingInstruction, setPendingInstruction]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading({ isLoading: true, operation: 'uploading', message: 'Processing image...' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCurrentImage(result);
        resetHistory(result); 
        clearMarkers();
        setLoading({ isLoading: false, operation: 'idle', message: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (imageData: string) => {
      setCurrentImage(imageData);
      resetHistory(imageData);
      clearMarkers();
      setShowCamera(false);
  };

  const handleEdit = async () => {
    if (!currentImage || !editPrompt.trim()) return;

    setLoading({ isLoading: true, operation: 'editing', message: EDIT_LOADING_MESSAGES[0] });
    
    try {
      const newImageData = await editGardenImage(currentImage, editPrompt);
      pushToHistory(newImageData);
      setEditPrompt(''); 
      clearMarkers();
      setLoading({ isLoading: false, operation: 'idle', message: '' });
    } catch (err) {
      setLoading({ 
        isLoading: false, 
        operation: 'idle', 
        message: '', 
        error: 'Failed to edit image. Try a different prompt.' 
      });
    }
  };

  const handleSaveProject = () => {
    saveProject(currentImage, history);
  };

  // --- Drag and Drop Logic ---
  
  const handleDragStart = (e: React.DragEvent, plantName: string) => {
    e.dataTransfer.setData('plantName', plantName);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (currentImage && !loading.isLoading) {
      setIsDraggingOver(true);
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (!currentImage || loading.isLoading) return;

    const plantName = e.dataTransfer.getData('plantName');
    if (plantName) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      const location = getPositionDescription(x, y, rect.width, rect.height);
      const instruction = `Add ${plantName} ${location}`;
      
      updatePromptWithInstruction(instruction);
      addMarker(plantName, xPercent, yPercent, instruction);
    }
  };

  const handleRemoveMarker = (markerId: string) => {
    const removedMarker = removeMarkerById(markerId);
    if (removedMarker) {
      setEditPrompt(prev => {
        let newPrompt = prev.replace(removedMarker.instruction, '');
        newPrompt = newPrompt.replace(/\.\s*\./g, '.').replace(/\s\s+/g, ' ').trim();
        if (newPrompt.startsWith('.')) newPrompt = newPrompt.substring(1).trim();
        return newPrompt;
      });
    }
  };

  const filteredPlants = PLANTS.filter(p => 
    p.name.toLowerCase().includes(plantSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 w-full">
       <div className="mb-8 text-center flex flex-col md:flex-row items-center justify-center relative gap-4">
        <div className="md:absolute md:left-0 md:right-0 md:text-center pointer-events-none">
          <h2 className="text-3xl font-bold text-stone-800 mb-2 pointer-events-auto">AI Garden Editor</h2>
          <p className="text-stone-600 pointer-events-auto">Upload a photo or use your design, then use text to make magic happen.</p>
        </div>
        
        <div className="md:ml-auto md:relative z-10 flex flex-col items-end gap-1">
           <button 
             onClick={handleSaveProject}
             disabled={!currentImage || saveStatus === 'saving'}
             className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md transform active:scale-95 ${
                saveStatus === 'saved' 
                  ? 'bg-green-600 text-white border-transparent' 
                  : saveStatus === 'saving'
                  ? 'bg-stone-100 text-stone-400 cursor-wait'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
             }`}
           >
             {saveStatus === 'saved' ? <Check size={18} /> : saveStatus === 'saving' ? <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"/> : <Save size={18} />}
             {saveStatus === 'saved' ? 'Saved!' : saveStatus === 'saving' ? 'Saving...' : 'Save Design'}
           </button>
           {lastSaved && (
             <div className="flex items-center gap-1 text-[10px] text-stone-400">
               <Clock size={10} />
               <span>Last saved: {new Date(lastSaved).toLocaleTimeString()}</span>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <EditorSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loading={loading}
          currentImage={currentImage}
          editPrompt={editPrompt}
          setEditPrompt={setEditPrompt}
          onEdit={handleEdit}
          fileInputRef={fileInputRef}
          onFileUpload={handleFileUpload}
          plantSearch={plantSearch}
          setPlantSearch={setPlantSearch}
          filteredPlants={filteredPlants}
          onDragStart={handleDragStart}
          onAddToDesign={(name) => updatePromptWithInstruction(`Add ${name}`)}
          onOpenCamera={() => setShowCamera(true)}
        />
        
        <EditorCanvas
          currentImage={currentImage}
          loading={loading}
          isDraggingOver={isDraggingOver}
          markers={markers}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onRemoveMarker={handleRemoveMarker}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          historyLength={history.length}
          currentIndex={history.findIndex(h => h === currentImage)} 
        />
      </div>

      {showCamera && (
          <CameraModal 
            onCapture={handleCameraCapture} 
            onClose={() => setShowCamera(false)} 
          />
      )}
    </div>
  );
};