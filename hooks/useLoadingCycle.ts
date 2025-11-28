import React, { useEffect } from 'react';
import { LoadingState } from '../types';

export const useLoadingCycle = (
  loading: LoadingState, 
  setLoading: React.Dispatch<React.SetStateAction<LoadingState>>, 
  messages: string[], 
  targetOperation?: string,
  intervalMs = 2500
) => {
  useEffect(() => {
    // Only cycle if loading, and if a targetOperation is defined, it must match
    if (!loading.isLoading) return;
    if (targetOperation && loading.operation !== targetOperation) return;
    
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoading(prev => {
        // Guard clause to prevent setting state on unmounted or changed op
        if (!prev.isLoading || (targetOperation && prev.operation !== targetOperation)) return prev;
        return { ...prev, message: messages[index] };
      });
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [loading.isLoading, loading.operation, messages, targetOperation, intervalMs, setLoading]);
};