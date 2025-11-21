import { useState, useCallback } from 'react';

export const useImageHistory = (initialImage: string | null, initialHistory?: string[]) => {
  // The history array stores all states
  const [history, setHistory] = useState<string[]>(initialHistory || (initialImage ? [initialImage] : []));
  // The currentIndex points to the currently active state in the history array
  const [currentIndex, setCurrentIndex] = useState<number>(initialHistory ? initialHistory.length - 1 : 0);

  // The current image is derived from the history at the current index
  const currentImage = history[currentIndex] || null;

  const pushToHistory = useCallback((newImage: string) => {
    setHistory(prev => {
      // If we are in the middle of history and make a new change, 
      // we discard all "future" states (redo stack)
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, newImage];
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const redo = useCallback(() => {
    setCurrentIndex(prev => Math.min(history.length - 1, prev + 1));
  }, [history.length]);

  const resetHistory = useCallback((image: string, newHistory?: string[]) => {
    if (newHistory && newHistory.length > 0) {
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
    } else {
        setHistory([image]);
        setCurrentIndex(0);
    }
  }, []);

  // Exposed for manual overrides (e.g. file upload without history tracking)
  const setCurrentImage = useCallback((image: string | null) => {
    if (image) {
        // When manually setting image (like upload), we typically reset
        resetHistory(image);
    }
  }, [resetHistory]);

  return {
    currentImage,
    setCurrentImage,
    history,
    pushToHistory,
    undo,
    redo,
    resetHistory,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1
  };
};