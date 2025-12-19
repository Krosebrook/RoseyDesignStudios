
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AppMode, GeneratedImage, SavedDesign } from '../types';

interface AIState {
  generatedImages: Record<string, string[]>;
  generatingIds: Set<string>;
  enhancedDescriptions: Record<string, string>;
  enhancingDescIds: Set<string>;
}

interface AppState extends AIState {
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
  
  // AI Setters
  setGeneratedImages: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  setGeneratingIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setEnhancedDescriptions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setEnhancingDescIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [currentHistory, setCurrentHistory] = useState<string[] | undefined>(undefined);
  const [pendingInstruction, setPendingInstruction] = useState<string | null>(null);

  // Global AI State
  const [generatedImages, setGeneratedImages] = useState<Record<string, string[]>>({});
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [enhancedDescriptions, setEnhancedDescriptions] = useState<Record<string, string>>({});
  const [enhancingDescIds, setEnhancingDescIds] = useState<Set<string>>(new Set());

  const handleImageGenerated = useCallback((img: GeneratedImage) => {
    setCurrentImage(img);
    setCurrentHistory(undefined);
  }, []);

  const handleResumeDesign = useCallback((saved: SavedDesign) => {
    const recoveredImage: GeneratedImage = {
      id: crypto.randomUUID(),
      dataUrl: saved.currentImage,
      prompt: 'Resumed Design',
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

  const value = {
    mode,
    currentImage,
    currentHistory,
    pendingInstruction,
    generatedImages,
    generatingIds,
    enhancedDescriptions,
    enhancingDescIds,
    setMode,
    setCurrentImage,
    setPendingInstruction,
    handleImageGenerated,
    handleResumeDesign,
    handleAddToDesign,
    setGeneratedImages,
    setGeneratingIds,
    setEnhancedDescriptions,
    setEnhancingDescIds
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
