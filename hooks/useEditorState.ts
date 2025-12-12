
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
  const { currentImage: initialImage, currentHistory: initialHistory, pendingInstruction, setPendingInstruction } = useApp();

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

  // Loading Cycle
  useLoadingCycle(loading, setLoading, EDIT_LOADING_MESSAGES, 'editing');

  // Initialization & Reset Logic
  useEffect(() => {
    if (initialImage) {
      if (initialHistory && initialHistory.length > 0) {
        historyManager.resetHistory(initialImage.dataUrl, initialHistory);
      } else {
        historyManager.resetHistory(initialImage.dataUrl);
      }
      setEditPrompt('');
      markerManager.clearMarkers();
    }
  }, [initialImage?.id, historyManager.resetHistory, initialHistory, markerManager.clearMarkers]);

  // Handle External Instructions (e.g., from "Add to Design")
  const updatePromptWithInstruction = useCallback((instruction: string) => {
    setEditPrompt(prev => {
      const cleanPrev = prev.trim();
      if (!cleanPrev) return instruction;
      const separator = cleanPrev.match(/[.!?,]$/) ? ' ' : '. ';
      return `${cleanPrev}${separator}${instruction}`;
    });
    setActiveTab('tools');
  }, []);

  useEffect(() => {
    if (pendingInstruction) {
      updatePromptWithInstruction(pendingInstruction);
      setPendingInstruction(null);
    }
  }, [pendingInstruction, setPendingInstruction, updatePromptWithInstruction]);

  // --- ACTIONS ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading({ isLoading: true, operation: 'uploading', message: 'Processing image...' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        historyManager.setCurrentImage(result);
        historyManager.resetHistory(result);
        markerManager.clearMarkers();
        setLoading({ isLoading: false, operation: 'idle', message: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (imageData: string) => {
    historyManager.setCurrentImage(imageData);
    historyManager.resetHistory(imageData);
    markerManager.clearMarkers();
    setShowCamera(false);
  };

  const handleEdit = async () => {
    const currentImg = historyManager.currentImage;
    if (!currentImg || !editPrompt.trim()) return;

    setLoading({ isLoading: true, operation: 'editing', message: EDIT_LOADING_MESSAGES[0] });

    try {
      // Build an intelligent prompt using the PromptService
      // This allows us to inject marker data to help the AI understand where things are
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

  const handleSaveProject = () => {
    storageManager.saveProject(historyManager.currentImage, historyManager.history);
  };

  const handleUndo = useCallback(() => {
    if (historyManager.canUndo) {
      historyManager.undo();
      markerManager.clearMarkers();
    }
  }, [historyManager.canUndo, historyManager.undo, markerManager.clearMarkers]);

  const handleRedo = useCallback(() => {
    if (historyManager.canRedo) {
      historyManager.redo();
      markerManager.clearMarkers();
    }
  }, [historyManager.canRedo, historyManager.redo, markerManager.clearMarkers]);

  // --- DRAG AND DROP ---

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

      const location = getPositionDescription(x, y, rect.width, rect.height);
      const instruction = `Add ${plantName} ${location}`;
      
      updatePromptWithInstruction(instruction);
      markerManager.addMarker(plantName, xPercent, yPercent, instruction);
    }
  };

  return {
    // State
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
    
    // Actions
    handleFileUpload,
    handleCameraCapture,
    handleEdit,
    handleSaveProject,
    handleUndo,
    handleRedo,
    handleDrop,
    updatePromptWithInstruction,
    
    // Refs & Managers
    fileInputRef,
    markerManager,
    historyManager
  };
};
