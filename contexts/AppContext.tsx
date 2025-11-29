import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AppMode, GeneratedImage, SavedDesign } from '../types';

interface AppState {
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [currentHistory, setCurrentHistory] = useState<string[] | undefined>(undefined);
  const [pendingInstruction, setPendingInstruction] = useState<string | null>(null);

  const handleImageGenerated = useCallback((img: GeneratedImage) => {
    setCurrentImage(img);
    setCurrentHistory(undefined); // Reset history when new image generated
    // Optionally auto-switch to Edit mode, or stay in Generate to see result
  }, []);

  const handleResumeDesign = useCallback((saved: SavedDesign) => {
    const recoveredImage: GeneratedImage = {
      id: crypto.randomUUID(), // New ID to force component refresh
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
    setMode,
    setCurrentImage,
    setPendingInstruction,
    handleImageGenerated,
    handleResumeDesign,
    handleAddToDesign
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