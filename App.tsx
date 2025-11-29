import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Generator } from './components/Generator';
import { Editor } from './components/Editor';
import { PlantLibrary } from './components/PlantLibrary';
import { VideoAnimator } from './components/VideoAnimator';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { VoiceChat } from './components/VoiceChat';
import { AppProvider, useApp } from './contexts/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppMode } from './types';

const MainContent: React.FC = () => {
  const { mode } = useApp();

  return (
    <main className="pt-6 pb-20">
      {mode === AppMode.HOME && <Hero />}
      
      {mode === AppMode.GENERATE && (
        <div className="animate-fade-in">
          <Generator />
        </div>
      )}
      
      {mode === AppMode.EDIT && (
        <div className="animate-fade-in">
          <Editor />
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
          <PlantLibrary />
        </div>
      )}
    </main>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-primary-200 selection:text-primary-900">
          <Header />
          <MainContent />
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;