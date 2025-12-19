
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { AppMode, GeneratedImage, SavedDesign, AIWorkflowState } from '../types';

interface AppState extends AIWorkflowState {
  mode: AppMode;
  currentImage: GeneratedImage | null;
  currentHistory: string[] | undefined;
  pendingInstruction: string | null;
}

interface AppContextType extends AppState {
  setMode: (mode: AppMode) => void;
  setCurrentImage: (img: GeneratedImage | null) => void;
  setPendingInstruction: (instruction: string | null) => void;
  handleImageGenerated: (img: GeneratedImage) => void;
  handleResumeDesign: (saved: SavedDesign) => void;
  handleAddToDesign: (plantName: string) => void;
  
  // State Updates
  updateAIState: (updater: (prev: AIWorkflowState) => AIWorkflowState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_AI_STATE: AIWorkflowState = {
  generatedImages: {},
  generatingIds: new Set(),
  enhancedDescriptions: {},
  enhancingDescIds: new Set(),
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [currentHistory, setCurrentHistory] = useState<string[] | undefined>(undefined);
  const [pendingInstruction, setPendingInstruction] = useState<string | null>(null);
  
  const [aiState, setAIState] = useState<AIWorkflowState>(INITIAL_AI_STATE);

  const updateAIState = useCallback((updater: (prev: AIWorkflowState) => AIWorkflowState) => {
    setAIState(prev => updater(prev));
  }, []);

  const handleImageGenerated = useCallback((img: GeneratedImage) => {
    setCurrentImage(img);
    setCurrentHistory(undefined);
    setMode(AppMode.EDIT);
  }, []);

  const handleResumeDesign = useCallback((saved: SavedDesign) => {
    const recoveredImage: GeneratedImage = {
      id: `resume-${Date.now()}`,
      dataUrl: saved.currentImage,
      prompt: 'Resumed Project',
      timestamp: saved.timestamp
    };
    setCurrentImage(recoveredImage);
    setCurrentHistory(saved.history);
    setMode(AppMode.EDIT);
  }, []);

  const handleAddToDesign = useCallback((plantName: string) => {
    setPendingInstruction(`Add ${plantName}`);
    setMode(AppMode.EDIT);
  }, []);

  const value = useMemo(() => ({
    mode,
    currentImage,
    currentHistory,
    pendingInstruction,
    ...aiState,
    setMode,
    setCurrentImage,
    setPendingInstruction,
    handleImageGenerated,
    handleResumeDesign,
    handleAddToDesign,
    updateAIState
  }), [mode, currentImage, currentHistory, pendingInstruction, aiState, updateAIState, handleImageGenerated, handleResumeDesign, handleAddToDesign]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
