import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Generator } from './components/Generator';
import { Editor } from './components/Editor';
import { PlantLibrary } from './components/PlantLibrary';
import { VideoAnimator } from './components/VideoAnimator';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { VoiceChat } from './components/VoiceChat';
import { AppMode, GeneratedImage, SavedDesign } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [currentHistory, setCurrentHistory] = useState<string[] | undefined>(undefined);
  const [pendingInstruction, setPendingInstruction] = useState<string | null>(null);

  const handleImageGenerated = (img: GeneratedImage) => {
    setCurrentImage(img);
    setCurrentHistory(undefined); // Reset history when new image generated
  };

  const handleAddToDesign = (plantName: string) => {
    setPendingInstruction(`Add ${plantName}`);
    setMode(AppMode.EDIT);
  };

  const handleResumeDesign = (saved: SavedDesign) => {
    const recoveredImage: GeneratedImage = {
      id: crypto.randomUUID(), // New ID to force Editor refresh/init
      dataUrl: saved.currentImage,
      prompt: 'Resumed Design',
      timestamp: saved.timestamp
    };
    setCurrentImage(recoveredImage);
    setCurrentHistory(saved.history);
    setMode(AppMode.EDIT);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-primary-200 selection:text-primary-900">
      <Header currentMode={mode} setMode={setMode} />
      
      <main className="pt-6 pb-20">
        {mode === AppMode.HOME && (
          <Hero setMode={setMode} onResumeDesign={handleResumeDesign} />
        )}
        
        {mode === AppMode.GENERATE && (
          <div className="animate-fade-in">
            <Generator onImageGenerated={handleImageGenerated} setMode={setMode} />
          </div>
        )}
        
        {mode === AppMode.EDIT && (
          <div className="animate-fade-in">
            <Editor 
              initialImage={currentImage} 
              initialHistory={currentHistory}
              pendingInstruction={pendingInstruction}
              onClearInstruction={() => setPendingInstruction(null)}
            />
          </div>
        )}

        {mode === AppMode.ANIMATE && (
          <div className="animate-fade-in">
             <VideoAnimator />
          </div>
        )}

        {mode === AppMode.ANALYZE && (
          <div className="animate-fade-in">
             <ImageAnalyzer />
          </div>
        )}

        {mode === AppMode.VOICE && (
          <div className="animate-fade-in">
             <VoiceChat />
          </div>
        )}

        {mode === AppMode.LIBRARY && (
          <div className="animate-fade-in">
            <PlantLibrary onAddToDesign={handleAddToDesign} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
