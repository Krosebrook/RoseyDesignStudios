
import { useState, useCallback } from 'react';
import { compressImage } from '../utils/image';
import { SavedDesign } from '../types';

export const useProjectStorage = () => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveProject = useCallback(async (currentImage: string | null, history: string[], name?: string, lastPrompt?: string) => {
    if (!currentImage) return;
    
    setSaveStatus('saving');
    setError(null);
    
    try {
      // Compress the current image to ensure it fits in LocalStorage
      const compressedImage = await compressImage(currentImage, 0.7, 1024);
      
      // Compress history images (limit to last 3 to be safe with storage limits)
      const historyToSave = history.slice(-3);
      const compressedHistory = await Promise.all(
        historyToSave.map(img => compressImage(img, 0.7, 1024))
      );
      
      const timestamp = Date.now();
      const savedData: SavedDesign = {
        currentImage: compressedImage,
        history: compressedHistory,
        timestamp,
        name,
        lastPrompt
      };
      
      try {
        localStorage.setItem('dreamGarden_saved', JSON.stringify(savedData));
        setSaveStatus('saved');
        setLastSaved(timestamp);
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (storageErr: any) {
        if (storageErr.name === 'QuotaExceededError' || storageErr.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
           throw new Error("Storage full. Try clearing space.");
        }
        throw storageErr;
      }
    } catch (e: any) {
      console.error("Failed to save project", e);
      setError(e.message || "Failed to save");
      setSaveStatus('idle');
    }
  }, []);

  return {
    saveProject,
    saveStatus,
    lastSaved,
    error
  };
};
