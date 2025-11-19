import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Generator } from './components/Generator';
import { Editor } from './components/Editor';
import { PlantLibrary } from './components/PlantLibrary';
import { AppMode, GeneratedImage } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [pendingInstruction, setPendingInstruction] = useState<string | null>(null);

  const handleImageGenerated = (img: GeneratedImage) => {
    setCurrentImage(img);
    // Stay on generator page to show result, but update state so Editor can use it if navigated to
  };

  const handleAddToDesign = (plantName: string) => {
    setPendingInstruction(`Add ${plantName}`);
    setMode(AppMode.EDIT);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-primary-200 selection:text-primary-900">
      <Header currentMode={mode} setMode={setMode} />
      
      <main className="pt-6 pb-20">
        {mode === AppMode.HOME && (
          <Hero setMode={setMode} />
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
              pendingInstruction={pendingInstruction}
              onClearInstruction={() => setPendingInstruction(null)}
            />
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