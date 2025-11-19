import React, { useState, useRef, useEffect } from 'react';
import { editGardenImage } from '../services/gemini';
import { LoadingState, GeneratedImage } from '../types';
import { PLANTS } from '../data/plants';
import { useImageHistory } from '../hooks/useImageHistory';
import { EditorSidebar } from './EditorSidebar';
import { EditorCanvas } from './EditorCanvas';

interface EditorProps {
  initialImage: GeneratedImage | null;
  pendingInstruction?: string | null;
  onClearInstruction?: () => void;
}

interface PlantMarker {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  instruction: string;
}

// Helper: Calculate natural language position description from drop coordinates
const getPositionDescription = (x: number, y: number, width: number, height: number): string => {
  let horizontal = 'in the center';
  if (x < width / 3) horizontal = 'on the left';
  else if (x > (width * 2) / 3) horizontal = 'on the right';

  let vertical = '';
  if (y < height / 3) vertical = 'in the background';
  else if (y > (height * 2) / 3) vertical = 'in the foreground';

  return `${vertical} ${horizontal}`.trim();
};

const EDIT_LOADING_MESSAGES = [
  "Analyzing image structure...",
  "Identifying areas to modify...",
  "Blending new elements...",
  "Adjusting lighting and shadows...",
  "Finalizing your edits..."
];

export const Editor: React.FC<EditorProps> = ({ initialImage, pendingInstruction, onClearInstruction }) => {
  const { 
    currentImage, 
    setCurrentImage, 
    history, 
    pushToHistory, 
    undo, 
    resetHistory, 
    canUndo 
  } = useImageHistory(initialImage ? initialImage.dataUrl : null);

  const [editPrompt, setEditPrompt] = useState('');
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, operation: 'idle', message: '' });
  const [markers, setMarkers] = useState<PlantMarker[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'tools' | 'plants'>('tools');
  const [plantSearch, setPlantSearch] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when a NEW initial image is provided (based on ID change)
  useEffect(() => {
    if (initialImage) {
      resetHistory(initialImage.dataUrl);
      setEditPrompt('');
      setMarkers([]);
    }
  }, [initialImage?.id, resetHistory]);

  // Helper to append instruction to prompt
  const updatePromptWithInstruction = (instruction: string) => {
    setEditPrompt(prev => {
      const cleanPrev = prev.trim();
      if (!cleanPrev) return instruction;
      const separator = cleanPrev.match(/[.!?,]$/) ? ' ' : '. ';
      return `${cleanPrev}${separator}${instruction}`;
    });
    setActiveTab('tools');
  };

  // Handle pending instructions from other parts of the app
  useEffect(() => {
    if (pendingInstruction) {
      updatePromptWithInstruction(pendingInstruction);
      onClearInstruction?.();
    }
  }, [pendingInstruction, onClearInstruction]);

  // Cycle messages during AI edit
  useEffect(() => {
    if (loading.operation !== 'editing') return;

    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % EDIT_LOADING_MESSAGES.length;
      setLoading(prev => {
        if (!prev.isLoading) return prev;
        return { ...prev, message: EDIT_LOADING_MESSAGES[messageIndex] };
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [loading.operation]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading({ isLoading: true, operation: 'uploading', message: 'Processing image...' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCurrentImage(result);
        resetHistory(result); // Reset history on new upload
        setMarkers([]); // Clear previous markers
        setLoading({ isLoading: false, operation: 'idle', message: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!currentImage || !editPrompt.trim()) return;

    setLoading({ isLoading: true, operation: 'editing', message: EDIT_LOADING_MESSAGES[0] });
    
    try {
      const newImageData = await editGardenImage(currentImage, editPrompt);
      pushToHistory(newImageData);
      setEditPrompt(''); 
      setMarkers([]); // Clear markers as they are now "baked in"
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
      
      // Calculate percentages for responsive positioning
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      const location = getPositionDescription(x, y, rect.width, rect.height);
      const instruction = `Add ${plantName} ${location}`;
      
      updatePromptWithInstruction(instruction);
      
      // Add visual marker
      setMarkers(prev => [...prev, {
        id: crypto.randomUUID(),
        name: plantName,
        x: xPercent,
        y: yPercent,
        instruction
      }]);
    }
  };

  const removeMarker = (markerId: string) => {
    const markerToRemove = markers.find(m => m.id === markerId);
    if (markerToRemove) {
      // Attempt to remove the instruction text
      setEditPrompt(prev => {
        let newPrompt = prev.replace(markerToRemove.instruction, '');
        newPrompt = newPrompt.replace(/\.\s*\./g, '.').replace(/\s\s+/g, ' ').trim();
        if (newPrompt.startsWith('.')) newPrompt = newPrompt.substring(1).trim();
        return newPrompt;
      });
      
      setMarkers(prev => prev.filter(m => m.id !== markerId));
    }
  };

  const filteredPlants = PLANTS.filter(p => 
    p.name.toLowerCase().includes(plantSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 w-full">
       <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">AI Garden Editor</h2>
        <p className="text-stone-600">Upload a photo or use your design, then use text to make magic happen.</p>
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
        />
        
        <EditorCanvas
          currentImage={currentImage}
          loading={loading}
          isDraggingOver={isDraggingOver}
          markers={markers}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onRemoveMarker={removeMarker}
          onUndo={undo}
          canUndo={canUndo}
          historyLength={history.length}
        />
      </div>
    </div>
  );
};