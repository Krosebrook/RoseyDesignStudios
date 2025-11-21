import { useState, useCallback } from 'react';

export interface PlantMarker {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  instruction: string;
}

export const useMarkers = () => {
  const [markers, setMarkers] = useState<PlantMarker[]>([]);

  const addMarker = useCallback((name: string, x: number, y: number, instruction: string) => {
    setMarkers(prev => [...prev, {
      id: crypto.randomUUID(),
      name,
      x,
      y,
      instruction
    }]);
  }, []);

  const removeMarkerById = useCallback((id: string) => {
    const marker = markers.find(m => m.id === id);
    setMarkers(prev => prev.filter(m => m.id !== id));
    return marker;
  }, [markers]);

  const clearMarkers = useCallback(() => {
    setMarkers([]);
  }, []);

  return {
    markers,
    setMarkers,
    addMarker,
    removeMarkerById,
    clearMarkers
  };
};