
import { useState, useCallback } from 'react';
import { compressImage } from '../utils/image';
import { SavedDesign } from '../types';

export const useProjectStorage = () => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const saveProject = useCallback(async (currentImage: string | null, history: string[]) => {
    if (!currentImage) return;
    
    setSaveStatus('saving');
    
    try {
      // Compress the current image to ensure it fits in LocalStorage
      // We compress specifically for saving state; the user still sees the high res one until they reload
      const compressedImage = await compressImage(currentImage, 0.7, 1024);
      
      // Compress history images (limit to last 5 to be safe with storage limits)
      const historyToSave = history.slice(-5);
      const compressedHistory = await Promise.all(
        historyToSave.map(img => compressImage(img, 0.7, 1024))
      );
      
      const savedData: SavedDesign = {
        currentImage: compressedImage,
        history: compressedHistory,
        timestamp: Date.now()
      };
      
      localStorage.setItem('dreamGarden_saved', JSON.stringify(savedData));
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error("Failed to save project", e);
      // In a real app, we might check if error is QuotaExceededError
      alert("Could not save project. Browser storage is full.");
      setSaveStatus('idle');
    }
  }, []);

  return {
    saveProject,
    saveStatus
  };
};
