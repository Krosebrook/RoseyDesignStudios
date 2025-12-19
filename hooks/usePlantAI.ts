
import { useState, useCallback, useRef, useEffect } from 'react';
import { Plant } from '../types';
import { generatePlantImage, generatePlantDescription } from '../services/gemini';
import { createLogger } from '../utils/logger';
import { useApp } from '../contexts/AppContext';

const logger = createLogger('usePlantAI');
const MAX_CONCURRENT_REQUESTS = 3;

interface QueueItem {
  id: string;
  task: () => Promise<void>;
}

export const usePlantAI = () => {
    const { 
        generatedImages, setGeneratedImages,
        generatingIds, setGeneratingIds,
        enhancedDescriptions, setEnhancedDescriptions,
        enhancingDescIds, setEnhancingDescIds
    } = useApp();

    // Progress State for UI feedback
    const [pendingCount, setPendingCount] = useState(0);

    // Queue system logic remains local to the hook instance to manage its own lifecycle
    const queueRef = useRef<QueueItem[]>([]);
    const activeRequestsRef = useRef(0);
    const mountedRef = useRef(true);

    useEffect(() => {
      mountedRef.current = true;
      return () => { mountedRef.current = false; };
    }, []);

    const updatePendingCount = useCallback(() => {
        if (mountedRef.current) {
            setPendingCount(queueRef.current.length + activeRequestsRef.current);
        }
    }, []);

    const processQueue = useCallback(async () => {
      if (!mountedRef.current) return;
      
      updatePendingCount();

      if (activeRequestsRef.current >= MAX_CONCURRENT_REQUESTS) return;
      if (queueRef.current.length === 0) return;

      const item = queueRef.current.shift();
      if (!item) return;

      activeRequestsRef.current++;
      updatePendingCount();
      
      try {
        await item.task();
      } catch (e) {
        logger.error(`Task failed for ${item.id}`, e);
      } finally {
        activeRequestsRef.current--;
        updatePendingCount();
        processQueue(); 
      }
    }, [updatePendingCount]);

    const addToQueue = useCallback((id: string, task: () => Promise<void>) => {
      queueRef.current.push({ id, task });
      updatePendingCount();
      processQueue();
    }, [processQueue, updatePendingCount]);

    const generateImage = useCallback(async (plant: Plant, style?: string, lighting?: string) => {
        if (generatingIds.has(plant.id)) return;

        setGeneratingIds(prev => new Set(prev).add(plant.id));
        
        addToQueue(plant.id, async () => {
          try {
              const result = await generatePlantImage(plant, style, lighting);
              if (result.success && result.data && mountedRef.current) {
                setGeneratedImages(prev => {
                    const existing = prev[plant.id] || [];
                    return { ...prev, [plant.id]: [...existing, result.data!] };
                });
              }
          } catch (err) {
              logger.error(`Failed to generate plant image for ${plant.name}`, err);
          } finally {
              if (mountedRef.current) {
                setGeneratingIds(prev => {
                    const next = new Set(prev);
                    next.delete(plant.id);
                    return next;
                });
              }
          }
        });
    }, [generatingIds, addToQueue, setGeneratedImages, setGeneratingIds]);

    const enhanceDescription = useCallback(async (plant: Plant) => {
        if (enhancingDescIds.has(plant.id)) return;

        setEnhancingDescIds(prev => new Set(prev).add(plant.id));

        addToQueue(plant.id, async () => {
          try {
              const result = await generatePlantDescription(plant.name, plant.description);
              if (result.success && result.data && mountedRef.current) {
                setEnhancedDescriptions(prev => ({ ...prev, [plant.id]: result.data! }));
              }
          } catch (err) {
              logger.error(`Failed to enhance description for ${plant.name}`, err);
          } finally {
              if (mountedRef.current) {
                setEnhancingDescIds(prev => {
                    const next = new Set(prev);
                    next.delete(plant.id);
                    return next;
                });
              }
          }
        });
    }, [enhancingDescIds, addToQueue, setEnhancedDescriptions, setEnhancingDescIds]);

    return {
        generatedImages,
        generatingIds,
        enhancedDescriptions,
        enhancingDescIds,
        generateImage,
        enhanceDescription,
        pendingCount
    };
};
