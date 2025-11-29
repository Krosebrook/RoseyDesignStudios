import React, { useEffect, useState } from 'react';
import { AppMode, SavedDesign } from '../types';
import { ArrowRight, Wand2, Upload, BookOpen, History } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const Hero: React.FC = () => {
  const { setMode, handleResumeDesign } = useApp();
  const [savedDesign, setSavedDesign] = useState<SavedDesign | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dreamGarden_saved');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.currentImage && parsed.history) {
          setSavedDesign(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved design", e);
      }
    }
  }, []);

  const handleResume = () => {
    if (savedDesign) {
      handleResumeDesign(savedDesign);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto">
      <div className="mb-8 animate-fade-in-up">
        <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4">
          Powered by Gemini 2.5 Flash
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-stone-900 mb-6 tracking-tight">
          Design your <span className="text-primary-600">Dream Garden</span> in seconds.
        </h1>
        <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Visualize landscape layouts, edit photos with AI, and discover the perfect plants for your space.
        </p>
      </div>

      {/* Resume Banner if available */}
      {savedDesign && (
        <div className="w-full max-w-2xl mb-8 animate-fade-in">
           <button 
             onClick={handleResume}
             className="w-full bg-stone-900 hover:bg-stone-800 text-white p-4 rounded-xl shadow-lg flex items-center justify-between group transition-all"
           >
              <div className="flex items-center gap-4">
                 <div className="bg-stone-700 p-2 rounded-lg">
                    <History size={24} className="text-stone-300" />
                 </div>
                 <div className="text-left">
                    <p className="font-bold">Resume Previous Design</p>
                    <p className="text-xs text-stone-400">Last saved {new Date(savedDesign.timestamp).toLocaleDateString()} {new Date(savedDesign.timestamp).toLocaleTimeString()}</p>
                 </div>
              </div>
              <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
                 <ArrowRight size={20} />
              </div>
           </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <button
          onClick={() => setMode(AppMode.GENERATE)}
          className="group relative overflow-hidden p-6 rounded-2xl bg-white border-2 border-stone-100 hover:border-primary-200 shadow-sm hover:shadow-lg transition-all duration-300 text-left h-full flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wand2 size={100} className="text-primary-500" />
          </div>
          <div className="relative z-10">
            <div className="bg-primary-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-primary-600">
              <Wand2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">Create New Design</h3>
            <p className="text-stone-500 text-sm mb-4">Generate unique garden layouts from text descriptions.</p>
          </div>
          <span className="relative z-10 flex items-center text-primary-600 font-medium text-sm group-hover:translate-x-1 transition-transform mt-auto">
            Start Generating <ArrowRight size={16} className="ml-1" />
          </span>
        </button>

        <button
          onClick={() => setMode(AppMode.EDIT)}
          className="group relative overflow-hidden p-6 rounded-2xl bg-white border-2 border-stone-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transition-all duration-300 text-left h-full flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Upload size={100} className="text-indigo-500" />
          </div>
          <div className="relative z-10">
            <div className="bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
              <Upload size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">Edit Your Photos</h3>
            <p className="text-stone-500 text-sm mb-4">Upload a photo and use AI to add plants or change styles.</p>
          </div>
          <span className="relative z-10 flex items-center text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform mt-auto">
            Start Editing <ArrowRight size={16} className="ml-1" />
          </span>
        </button>

        <button
          onClick={() => setMode(AppMode.LIBRARY)}
          className="group relative overflow-hidden p-6 rounded-2xl bg-white border-2 border-stone-100 hover:border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300 text-left h-full flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookOpen size={100} className="text-amber-500" />
          </div>
          <div className="relative z-10">
            <div className="bg-amber-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-amber-600">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">Plant Database</h3>
            <p className="text-stone-500 text-sm mb-4">Find the perfect plants filtered by sun, water, and season.</p>
          </div>
          <span className="relative z-10 flex items-center text-amber-600 font-medium text-sm group-hover:translate-x-1 transition-transform mt-auto">
            Browse Plants <ArrowRight size={16} className="ml-1" />
          </span>
        </button>
      </div>
      
      <div className="mt-16 grid grid-cols-3 gap-8 text-stone-400">
        <div className="flex flex-col items-center">
          <span className="font-bold text-2xl text-stone-900 mb-1">Fast</span>
          <span className="text-sm">Generation</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-2xl text-stone-900 mb-1">Expert</span>
          <span className="text-sm">Knowledge</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-2xl text-stone-900 mb-1">Easy</span>
          <span className="text-sm">Editing</span>
        </div>
      </div>
    </div>
  );
};