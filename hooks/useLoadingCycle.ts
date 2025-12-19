
import React, { useEffect, useRef } from 'react';
import { LoadingState } from '../types';

/**
 * Periodically rotates loading messages to improve perceived performance.
 */
export const useLoadingCycle = (
  loading: LoadingState, 
  setLoading: React.Dispatch<React.SetStateAction<LoadingState>>, 
  messages: string[], 
  targetOperation?: string,
  intervalMs = 3000
) => {
  const indexRef = useRef(0);

  useEffect(() => {
    if (!loading.isLoading) {
      indexRef.current = 0;
      return;
    }
    
    // Only cycle if operation matches
    if (targetOperation && loading.operation !== targetOperation) return;
    
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % messages.length;
      const nextMessage = messages[indexRef.current];

      setLoading(prev => {
        // Double check condition inside state updater for safety
        if (!prev.isLoading || (targetOperation && prev.operation !== targetOperation)) {
           return prev;
        }
        if (prev.message === nextMessage) return prev;
        return { ...prev, message: nextMessage };
      });
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [loading.isLoading, loading.operation, messages, targetOperation, intervalMs, setLoading]);
};
