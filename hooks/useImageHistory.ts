
import { useState, useCallback } from 'react';

export const useImageHistory = (initialImage: string | null, initialHistory?: string[]) => {
  const [currentImage, setCurrentImage] = useState<string | null>(initialImage);
  const [history, setHistory] = useState<string[]>(initialHistory || (initialImage ? [initialImage] : []));

  const pushToHistory = useCallback((newImage: string) => {
    setCurrentImage(newImage);
    setHistory(prev => [...prev, newImage]);
  }, []);

  const undo = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentImage(newHistory[newHistory.length - 1]);
    }
  }, [history]);

  const resetHistory = useCallback((image: string, newHistory?: string[]) => {
    setCurrentImage(image);
    setHistory(newHistory || [image]);
  }, []);

  return {
    currentImage,
    setCurrentImage, // Exposed for direct setting (e.g. file upload)
    history,
    pushToHistory,
    undo,
    resetHistory,
    canUndo: history.length > 1
  };
};
