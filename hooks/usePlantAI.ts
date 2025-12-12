
import { useState, useCallback, useRef, useEffect } from 'react';
import { Plant } from '../types';
import { generatePlantImage, generatePlantDescription } from '../services/gemini';
import { createLogger } from '../utils/logger';

const logger = createLogger('usePlantAI');
const MAX_CONCURRENT_REQUESTS = 3;

interface QueueItem {
  id: string;
  task: () => Promise<void>;
}

export const usePlantAI = () => {
    // Key: Plant ID, Value: Array of base64 image strings
    const [generatedImages, setGeneratedImages] = useState<Record<string, string[]>>({});
    const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
    const [enhancedDescriptions, setEnhancedDescriptions] = useState<Record<string, string>>({});
    const [enhancingDescIds, setEnhancingDescIds] = useState<Set<string>>(new Set());

    // Progress State
    const [pendingCount, setPendingCount] = useState(0);

    // Queue system
    const queueRef = useRef<QueueItem[]>([]);
    const activeRequestsRef = useRef(0);
    const mountedRef = useRef(true);

    useEffect(() => {
      return () => { mountedRef.current = false; };
    }, []);

    const updatePendingCount = useCallback(() => {
        if (mountedRef.current) {
            setPendingCount(queueRef.current.length + activeRequestsRef.current);
        }
    }, []);

    const processQueue = useCallback(async () => {
      if (!mountedRef.current) return;
      
      // Update count
      updatePendingCount();

      if (activeRequestsRef.current >= MAX_CONCURRENT_REQUESTS) return;
      if (queueRef.current.length === 0) return;

      const item = queueRef.current.shift();
      if (!item) return;

      activeRequestsRef.current++;
      updatePendingCount();
      
      // Execute
      try {
        await item.task();
      } catch (e) {
        logger.error(`Task failed for ${item.id}`, e);
      } finally {
        activeRequestsRef.current--;
        updatePendingCount();
        processQueue(); // Check for next item
      }
    }, [updatePendingCount]);

    const addToQueue = useCallback((id: string, task: () => Promise<void>) => {
      queueRef.current.push({ id, task });
      updatePendingCount();
      processQueue();
    }, [processQueue, updatePendingCount]);

    const generateImage = useCallback(async (plant: Plant, style?: string, lighting?: string) => {
        // Prevent duplicate queuing for the same plant if already generating
        if (generatingIds.has(plant.id)) return;

        setGeneratingIds(prev => new Set(prev).add(plant.id));
        
        addToQueue(plant.id, async () => {
          try {
              // Pass the full plant object to use metadata (sun, water, season) in generation
              const result = await generatePlantImage(plant, style, lighting);
              if (result.success && result.data && mountedRef.current) {
                setGeneratedImages(prev => {
                    const existing = prev[plant.id] || [];
                    return { ...prev, [plant.id]: [...existing, result.data!] };
                });
              }
          } catch (err) {
              logger.error("Failed to generate plant image", err);
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
    }, [generatingIds, addToQueue]);

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
              logger.error("Failed to generate description", err);
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
    }, [enhancingDescIds, addToQueue]);

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
