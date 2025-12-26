
import { useState, useCallback, useRef, useEffect } from 'react';
import { Plant } from '../types';
import { generatePlantImage, generatePlantDescription } from '../services/gemini';
import { createLogger } from '../utils/logger';
import { useApp } from '../contexts/AppContext';

const logger = createLogger('usePlantAI');
const MAX_CONCURRENT_WORKERS = 2; 

interface WorkItem {
  id: string;
  type: 'image' | 'description';
  execute: () => Promise<void>;
}

export const usePlantAI = () => {
    const { 
        generatedImages, 
        generatingIds, 
        enhancedDescriptions, 
        enhancingDescIds,
        updateAIState
    } = useApp();

    const [pendingCount, setPendingCount] = useState(0);
    const queueRef = useRef<WorkItem[]>([]);
    const activeWorkerCount = useRef(0);
    const isMounted = useRef(true);

    useEffect(() => {
      isMounted.current = true;
      return () => { isMounted.current = false; };
    }, []);

    const dispatchNext = useCallback(async () => {
      if (!isMounted.current || activeWorkerCount.current >= MAX_CONCURRENT_WORKERS) return;
      if (queueRef.current.length === 0) {
        setPendingCount(0);
        return;
      }

      const item = queueRef.current.shift()!;
      activeWorkerCount.current++;
      setPendingCount(queueRef.current.length + activeWorkerCount.current);

      try {
        await item.execute();
      } catch (err) {
        logger.error(`Worker task failed: ${item.id}`, err);
      } finally {
        activeWorkerCount.current--;
        if (isMounted.current) {
          setPendingCount(queueRef.current.length + activeWorkerCount.current);
          dispatchNext();
        }
      }
    }, []);

    const queueWork = useCallback((item: WorkItem) => {
      if (queueRef.current.some(q => q.id === item.id && q.type === item.type)) return;
      
      queueRef.current.push(item);
      setPendingCount(queueRef.current.length + activeWorkerCount.current);
      dispatchNext();
    }, [dispatchNext]);

    const generateImage = useCallback(async (plant: Plant, style?: string, lighting?: string) => {
        if (generatingIds.has(plant.id)) return;

        updateAIState(prev => {
          const next = new Set(prev.generatingIds);
          next.add(plant.id);
          return { ...prev, generatingIds: next };
        });
        
        queueWork({
          id: plant.id,
          type: 'image',
          execute: async () => {
            try {
              const result = await generatePlantImage(plant, style, lighting);
              if (result.success && result.data && isMounted.current) {
                updateAIState(prev => {
                  const existing = prev.generatedImages[plant.id] || [];
                  // Only add if not already present
                  if (existing.includes(result.data!)) return prev;
                  return {
                    ...prev,
                    generatedImages: { 
                      ...prev.generatedImages, 
                      [plant.id]: [...existing, result.data!] 
                    }
                  };
                });
              }
            } finally {
              if (isMounted.current) {
                updateAIState(prev => {
                  const next = new Set(prev.generatingIds);
                  next.delete(plant.id);
                  return { ...prev, generatingIds: next };
                });
              }
            }
          }
        });
    }, [generatingIds, updateAIState, queueWork]);

    const enhanceDescription = useCallback(async (plant: Plant) => {
        if (enhancingDescIds.has(plant.id)) return;

        updateAIState(prev => {
          const next = new Set(prev.enhancingDescIds);
          next.add(plant.id);
          return { ...prev, enhancingDescIds: next };
        });

        queueWork({
          id: plant.id,
          type: 'description',
          execute: async () => {
            try {
              const result = await generatePlantDescription(plant.name, plant.description);
              if (result.success && result.data && isMounted.current) {
                updateAIState(prev => ({
                  ...prev,
                  enhancedDescriptions: { 
                    ...prev.enhancedDescriptions, 
                    [plant.id]: result.data! 
                  }
                }));
              }
            } finally {
              if (isMounted.current) {
                updateAIState(prev => {
                  const next = new Set(prev.enhancingDescIds);
                  next.delete(plant.id);
                  return { ...prev, enhancingDescIds: next };
                });
              }
            }
          }
        });
    }, [enhancingDescIds, updateAIState, queueWork]);

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
