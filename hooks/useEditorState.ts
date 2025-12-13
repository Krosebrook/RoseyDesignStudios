
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useImageHistory } from './useImageHistory';
import { useMarkers } from './useMarkers';
import { useProjectStorage } from './useProjectStorage';
import { useLoadingCycle } from './useLoadingCycle';
import { useApp } from '../contexts/AppContext';
import { editGardenImage } from '../services/gemini';
import { EDIT_LOADING_MESSAGES } from '../data/constants';
import { getPositionDescription } from '../utils/editor';
import { LoadingState } from '../types';
import { PromptService } from '../services/prompts';

export const useEditorState = () => {
  // Global Context
  const { 
    currentImage: initialImage, 
    currentHistory: initialHistory, 
    pendingInstruction, 
    setPendingInstruction 
  } = useApp();

  // Core Hooks
  const historyManager = useImageHistory(initialImage ? initialImage.dataUrl : null, initialHistory);
  const markerManager = useMarkers();
  const storageManager = useProjectStorage();

  // Local State
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, operation: 'idle', message: '' });
  const [editPrompt, setEditPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'tools' | 'plants'>('tools');
  const [showCamera, setShowCamera] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useLoadingCycle(loading, setLoading, EDIT_LOADING_MESSAGES, 'editing');

  // Initialization
  useEffect(() => {
    if (initialImage) {
      // Sync history with context
      historyManager.resetHistory(initialImage.dataUrl, initialHistory);
      setEditPrompt('');
      markerManager.clearMarkers();
    }
  }, [initialImage?.id]);

  // Handle instructions passed from other parts of the app (e.g. "Add to Design" button)
  const updatePromptWithInstruction = useCallback((instruction: string) => {
    setEditPrompt(prev => {
      const cleanPrev = prev.trim();
      if (!cleanPrev) return instruction;
      // Smart punctuation appending
      const separator = cleanPrev.match(/[.!?,]$/) ? ' ' : '. ';
      return `${cleanPrev}${separator}${instruction}`;
    });
    // Auto-switch to tools tab so user sees the instruction
    setActiveTab('tools');
  }, []);

  useEffect(() => {
    if (pendingInstruction) {
      updatePromptWithInstruction(pendingInstruction);
      setPendingInstruction(null);
    }
  }, [pendingInstruction]);

  // --- IO HANDLERS ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading({ isLoading: true, operation: 'uploading', message: 'Processing image...' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        historyManager.setCurrentImage(result);
        markerManager.clearMarkers();
        setLoading({ isLoading: false, operation: 'idle', message: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (imageData: string) => {
    historyManager.setCurrentImage(imageData);
    markerManager.clearMarkers();
    setShowCamera(false);
  };

  const handleSaveProject = () => {
    storageManager.saveProject(historyManager.currentImage, historyManager.history);
  };

  // --- EDITING LOGIC ---

  const handleEdit = async () => {
    const currentImg = historyManager.currentImage;
    if (!currentImg || !editPrompt.trim()) return;

    setLoading({ isLoading: true, operation: 'editing', message: EDIT_LOADING_MESSAGES[0] });

    try {
      // Use Service for prompt construction (Separation of Concerns)
      const enrichedPrompt = PromptService.buildEditPrompt(editPrompt, markerManager.markers);

      const newImageData = await editGardenImage(currentImg, enrichedPrompt);
      
      if (newImageData.success && newImageData.data) {
          historyManager.pushToHistory(newImageData.data);
          setEditPrompt('');
          markerManager.clearMarkers();
          setLoading({ isLoading: false, operation: 'idle', message: '' });
      } else {
          throw new Error(newImageData.message || "Edit failed");
      }
    } catch (err: any) {
      setLoading({ 
        isLoading: false, 
        operation: 'idle', 
        message: '', 
        error: err.message || 'Failed to edit image.' 
      });
    }
  };

  // --- DRAG & DROP LOGIC ---

  const handleDrop = (e: React.DragEvent) => {
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

      // Convert coords to natural language description
      const location = getPositionDescription(x, y, rect.width, rect.height);
      const instruction = `Add ${plantName} ${location}`;
      
      updatePromptWithInstruction(instruction);
      markerManager.addMarker(plantName, xPercent, yPercent, instruction);
    }
  };

  // Facade Return
  return {
    currentImage: historyManager.currentImage,
    history: historyManager.history,
    markers: markerManager.markers,
    loading,
    editPrompt,
    setEditPrompt,
    activeTab,
    setActiveTab,
    showCamera,
    setShowCamera,
    isDraggingOver,
    setIsDraggingOver,
    saveStatus: storageManager.saveStatus,
    saveError: storageManager.error,
    lastSaved: storageManager.lastSaved,
    
    handleFileUpload,
    handleCameraCapture,
    handleEdit,
    handleSaveProject,
    handleUndo: historyManager.undo,
    handleRedo: historyManager.redo,
    handleDrop,
    updatePromptWithInstruction,
    
    fileInputRef,
    markerManager,
    historyManager
  };
};
