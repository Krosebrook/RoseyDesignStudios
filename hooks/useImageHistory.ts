
import { useState, useCallback } from 'react';

interface HistoryState {
  items: string[];
  index: number;
}

const MAX_HISTORY = 20;

/**
 * Robust history manager for state tracking (Undo/Redo).
 * Uses unified state to ensure index and items are always in sync.
 */
export const useImageHistory = (initialImage: string | null, initialHistory?: string[]) => {
  const [state, setState] = useState<HistoryState>({
    items: initialHistory || (initialImage ? [initialImage] : []),
    index: initialHistory ? initialHistory.length - 1 : 0
  });

  const currentImage = state.items[state.index] || null;

  const pushToHistory = useCallback((newImage: string) => {
    setState(prev => {
      // Discard "future" redo stack if we make a new change from an earlier point
      const head = prev.items.slice(0, prev.index + 1);
      const newItems = [...head, newImage];
      
      // Enforce max history limit to save memory
      if (newItems.length > MAX_HISTORY) {
        return {
          items: newItems.slice(newItems.length - MAX_HISTORY),
          index: MAX_HISTORY - 1
        };
      }

      return {
        items: newItems,
        index: newItems.length - 1
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => ({
      ...prev,
      index: Math.max(0, prev.index - 1)
    }));
  }, []);

  const redo = useCallback(() => {
    setState(prev => ({
      ...prev,
      index: Math.min(prev.items.length - 1, prev.index + 1)
    }));
  }, []);

  const resetHistory = useCallback((image: string, newHistory?: string[]) => {
    setState({
      items: newHistory && newHistory.length > 0 ? newHistory : [image],
      index: newHistory && newHistory.length > 0 ? newHistory.length - 1 : 0
    });
  }, []);

  const setCurrentImage = useCallback((image: string | null) => {
    if (image) {
      resetHistory(image);
    }
  }, [resetHistory]);

  return {
    currentImage,
    setCurrentImage,
    history: state.items,
    currentIndex: state.index,
    pushToHistory,
    undo,
    redo,
    resetHistory,
    canUndo: state.index > 0,
    canRedo: state.index < state.items.length - 1
  };
};
