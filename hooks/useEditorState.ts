
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useImageHistory } from './useImageHistory';
import { useMarkers } from './useMarkers';
import { useProjectStorage } from './useProjectStorage';
import { useLoadingCycle } from './useLoadingCycle';
import { useApp } from '../contexts/AppContext';
import { editGardenImage, generateMaintenanceReport } from '../services/gemini';
import { EDIT_LOADING_MESSAGES, REPORT_LOADING_MESSAGES } from '../data/constants';
import { getPositionDescription } from '../utils/editor';
import { LoadingState, Plant, MaintenanceReport } from '../types';
import { PromptService } from '../services/prompts';
import { createLogger } from '../utils/logger';
import { PLANTS } from '../data/plants';
import { downloadBlueprint } from '../utils/export';

const logger = createLogger('EditorState');

export interface InventoryItem {
  plant: Plant;
  count: number;
}

/**
 * Main state orchestrator for the AI Garden Editor.
 * Manages history, markers, AI interactions, and storage persistence.
 */
export const useEditorState = () => {
  const { 
    currentImage: initialImage, 
    currentHistory: initialHistory, 
    pendingInstruction, 
    setPendingInstruction 
  } = useApp();

  const historyManager = useImageHistory(initialImage ? initialImage.dataUrl : null, initialHistory);
  const markerManager = useMarkers();
  const storageManager = useProjectStorage();

  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, operation: 'idle', message: '' });
  const [editPrompt, setEditPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'tools' | 'plants' | 'inventory'>('tools');
  const [showCamera, setShowCamera] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [maintenanceReport, setMaintenanceReport] = useState<MaintenanceReport | null>(null);
  
  // Project metadata
  const [projectName, setProjectName] = useState('My Garden Design');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useLoadingCycle(loading, setLoading, EDIT_LOADING_MESSAGES, 'editing');
  useLoadingCycle(loading, setLoading, REPORT_LOADING_MESSAGES, 'reporting');

  // Compute design inventory based on markers
  const inventory = useMemo(() => {
    const counts: Record<string, number> = {};
    markerManager.markers.forEach(m => {
      counts[m.name] = (counts[m.name] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => {
      const plant = PLANTS.find(p => p.name === name) || {
        id: `custom-${name}`,
        name,
        scientificName: 'Custom Entry',
        description: 'User-defined item',
        imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
        category: 'Plant',
        sunlight: 'Full Sun',
        water: 'Moderate'
      } as Plant;
      
      return { plant, count };
    });
  }, [markerManager.markers]);

  // Compute aggregate garden needs
  const gardenNeeds = useMemo(() => {
    if (inventory.length === 0) return null;
    
    const sunlight = inventory.reduce((acc, item) => {
      if (item.plant.sunlight) acc[item.plant.sunlight] = (acc[item.plant.sunlight] || 0) + item.count;
      return acc;
    }, {} as Record<string, number>);

    const sortedEntries = Object.entries(sunlight).sort((a, b) => (b[1] as number) - (a[1] as number));
    const dominantSun = sortedEntries[0]?.[0] || 'Mixed';
    
    return {
      dominantSun,
      itemCount: markerManager.markers.length,
      isXeriscape: inventory.every(i => i.plant.water === 'Drought-tolerant')
    };
  }, [inventory, markerManager.markers.length]);

  // Synchronize with external image selection
  useEffect(() => {
    if (initialImage && initialImage.dataUrl !== historyManager.currentImage) {
      historyManager.resetHistory(initialImage.dataUrl, initialHistory);
      markerManager.clearMarkers();
      setMaintenanceReport(null);
      setIsDirty(false);
      
      // If we resumed, it might have a name
      const saved = localStorage.getItem('dreamGarden_saved');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.currentImage === initialImage.dataUrl && parsed.name) {
            setProjectName(parsed.name);
          }
        } catch(e) {}
      }
    }
  }, [initialImage?.id]);

  useEffect(() => {
    if (storageManager.saveStatus === 'saved') {
      setIsDirty(false);
    } else if (historyManager.history.length > 1) {
      setIsDirty(true);
    }
  }, [historyManager.history.length, storageManager.saveStatus]);

  const updatePromptWithInstruction = useCallback((instruction: string, oldInstruction?: string) => {
    setEditPrompt(prev => {
      let current = prev.trim();
      
      // If updating, remove the old one first
      if (oldInstruction && current.includes(oldInstruction)) {
        current = current.replace(oldInstruction, '').replace(/\s\s+/g, ' ').trim();
      }

      if (!current) return instruction;
      if (current.includes(instruction)) return current;

      const hasPunctuation = /[.!?,]$/.test(current);
      return `${current}${hasPunctuation ? ' ' : '. '}${instruction}`;
    });
    setActiveTab('tools');
  }, []);

  useEffect(() => {
    if (pendingInstruction) {
      updatePromptWithInstruction(pendingInstruction);
      setPendingInstruction(null);
    }
  }, [pendingInstruction, updatePromptWithInstruction, setPendingInstruction]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading({ isLoading: true, operation: 'uploading', message: 'Importing photo...' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        historyManager.setCurrentImage(result);
        markerManager.clearMarkers();
        setMaintenanceReport(null);
        setLoading({ isLoading: false, operation: 'idle', message: '' });
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  }, [historyManager, markerManager]);

  const handleCameraCapture = useCallback((imageData: string) => {
    historyManager.setCurrentImage(imageData);
    markerManager.clearMarkers();
    setMaintenanceReport(null);
    setShowCamera(false);
    setIsDirty(true);
  }, [historyManager, markerManager]);

  const handleSaveProject = useCallback(() => {
    const lastPromptUsed = initialImage?.prompt || 'Custom Edit';
    storageManager.saveProject(historyManager.currentImage, historyManager.history, projectName, lastPromptUsed);
  }, [storageManager, historyManager, projectName, initialImage]);

  const handleExportProject = useCallback(() => {
    if (!historyManager.currentImage) return;

    downloadBlueprint({
      name: projectName,
      image: historyManager.currentImage,
      inventory,
      maintenance: maintenanceReport,
      timestamp: Date.now()
    });
  }, [historyManager.currentImage, projectName, inventory, maintenanceReport]);

  const handleEdit = useCallback(async () => {
    const currentImg = historyManager.currentImage;
    if (!currentImg || !editPrompt.trim()) return;

    setLoading({ isLoading: true, operation: 'editing', message: EDIT_LOADING_MESSAGES[0] });

    try {
      const enrichedPrompt = PromptService.buildEditPrompt(editPrompt, markerManager.markers);
      const result = await editGardenImage(currentImg, enrichedPrompt);
      
      if (result.success === false) {
          throw result.error;
      }

      historyManager.pushToHistory(result.data);
      setEditPrompt('');
      markerManager.clearMarkers();
      setMaintenanceReport(null); 
      setLoading({ isLoading: false, operation: 'idle', message: '' });
      setIsDirty(true);
    } catch (err: any) {
      logger.error('Edit operation failed', err);
      setLoading({ 
        isLoading: false, 
        operation: 'idle', 
        message: '', 
        error: err.message || 'The AI could not process that request. Try a simpler prompt.' 
      });
    }
  }, [editPrompt, historyManager, markerManager.markers]);

  const handleGenerateReport = useCallback(async () => {
    if (inventory.length === 0) return;
    
    setLoading({ isLoading: true, operation: 'reporting', message: REPORT_LOADING_MESSAGES[0] });
    try {
      const report = await generateMaintenanceReport(inventory);
      setMaintenanceReport(report);
      setLoading({ isLoading: false, operation: 'idle', message: '' });
    } catch (err: any) {
      logger.error("Report failed", err);
      setLoading({ 
        isLoading: false, 
        operation: 'idle', 
        message: '', 
        error: "Failed to generate maintenance plan. Please check your connection." 
      });
    }
  }, [inventory]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (!historyManager.currentImage || loading.isLoading) return;

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
      markerManager.addMarker(plantName, xPercent, yPercent, instruction);
      setMaintenanceReport(null); 
    }
  }, [historyManager.currentImage, loading.isLoading, updatePromptWithInstruction, markerManager]);

  const handleMarkerMove = useCallback((id: string, xPercent: number, yPercent: number, containerWidth: number, containerHeight: number) => {
    const marker = markerManager.markers.find(m => m.id === id);
    if (!marker) return;

    // Calculate new position description relative to container
    // Convert percent back to pixels for the utility function (or refactor utility)
    const x = (xPercent / 100) * containerWidth;
    const y = (yPercent / 100) * containerHeight;
    const location = getPositionDescription(x, y, containerWidth, containerHeight);
    
    // Create updated instruction
    const newInstruction = `Add ${marker.name} ${location}`;
    
    // Update marker state
    markerManager.updateMarker(id, {
      x: xPercent,
      y: yPercent,
      instruction: newInstruction
    });

    // Update global prompt context (replace old instruction with new one)
    updatePromptWithInstruction(newInstruction, marker.instruction);
    setMaintenanceReport(null);
    setIsDirty(true);
  }, [markerManager, updatePromptWithInstruction]);

  const handleUndo = useCallback(() => {
    historyManager.undo();
    setMaintenanceReport(null);
  }, [historyManager]);

  const handleRedo = useCallback(() => {
    historyManager.redo();
    setMaintenanceReport(null);
  }, [historyManager]);

  return {
    currentImage: historyManager.currentImage,
    history: historyManager.history,
    currentIndex: historyManager.currentIndex,
    canUndo: historyManager.canUndo,
    canRedo: historyManager.canRedo,
    markers: markerManager.markers,
    inventory,
    gardenNeeds,
    loading,
    editPrompt,
    setEditPrompt,
    activeTab,
    setActiveTab,
    showCamera,
    setShowCamera,
    isDraggingOver,
    setIsDraggingOver,
    isDirty,
    maintenanceReport,
    projectName,
    setProjectName,
    saveStatus: storageManager.saveStatus,
    saveError: storageManager.error,
    lastSaved: storageManager.lastSaved,
    
    handleFileUpload,
    handleCameraCapture,
    handleEdit,
    handleSaveProject,
    handleExportProject,
    handleUndo,
    handleRedo,
    handleDrop,
    handleMarkerMove,
    updatePromptWithInstruction,
    handleGenerateReport,
    
    fileInputRef,
    markerManager,
    historyManager
  };
};
