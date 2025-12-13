
import React, { useState, useCallback } from 'react';

interface Rotation {
  x: number;
  y: number;
}

export const use3DView = (isEnabled: boolean, activeImage: string | null) => {
  const [rotation, setRotation] = useState<Rotation>({ x: 0, y: 0 });
  const [followCursor, setFollowCursor] = useState(true);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEnabled || !activeImage || !followCursor) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    // Normalize coordinates to -1 to 1 range
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    // Map to degrees (max 25 degrees tilt)
    // Invert Y for natural tilt feel (mouse up = tilt back)
    setRotation({
        x: -y * 25, 
        y: x * 25 
    });
  }, [isEnabled, activeImage, followCursor]);

  const setManualRotation = useCallback((axis: 'x' | 'y', value: number) => {
      setRotation(prev => ({ ...prev, [axis]: value }));
  }, []);

  const resetRotation = useCallback(() => {
    setRotation({ x: 0, y: 0 });
  }, []);

  // Calculate dynamic shadow position based on rotation
  const shadowOffset = {
    x: -(rotation.y / 25) * 30,
    y: (rotation.x / 25) * 30
  };

  return {
    rotation,
    followCursor,
    setFollowCursor,
    handleMouseMove,
    setManualRotation,
    resetRotation,
    shadowOffset
  };
};
