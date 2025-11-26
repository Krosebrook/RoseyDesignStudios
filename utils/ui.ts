
import React from 'react';

/**
 * Creates a custom circular ghost image for drag operations.
 * This function manipulates the DOM directly to create a visual element
 * that adheres to the cursor during a drag event.
 */
export const createDragGhost = (e: React.DragEvent, imageSrc: string, size: number = 72) => {
  const ghost = document.createElement('div');
  const radius = size / 2;
  
  ghost.style.width = `${size}px`;
  ghost.style.height = `${size}px`;
  ghost.style.borderRadius = '50%';
  ghost.style.overflow = 'hidden';
  ghost.style.border = '3px solid #22c55e'; // primary-500
  ghost.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
  ghost.style.position = 'absolute';
  ghost.style.top = '-1000px'; // Hide from view initially
  ghost.style.backgroundColor = 'white';
  ghost.style.zIndex = '9999';
  
  const ghostImg = document.createElement('img');
  ghostImg.src = imageSrc;
  ghostImg.style.width = '100%';
  ghostImg.style.height = '100%';
  ghostImg.style.objectFit = 'cover';
  ghost.appendChild(ghostImg);
  
  document.body.appendChild(ghost);
  
  // Set the custom drag image centered on the cursor
  e.dataTransfer.setDragImage(ghost, radius, radius);
  
  // Cleanup the DOM element after a short delay (browser needs it momentarily to grab the bitmap)
  setTimeout(() => {
      if (document.body.contains(ghost)) {
        document.body.removeChild(ghost);
      }
  }, 0);
};
