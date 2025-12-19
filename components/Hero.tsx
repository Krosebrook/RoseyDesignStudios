
import React, { useEffect, useState } from 'react';
import { AppMode, SavedDesign } from '../types';
import { ArrowRight, Wand2, Upload, BookOpen, History, PlayCircle, Trash2 } from 'lucide-react';
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
        localStorage.removeItem('dreamGarden_saved');
      }
    }
  }, []);

  const handleResume = () => {
    if (savedDesign) {
      handleResumeDesign(savedDesign);
    }
  };

  const handleDiscard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Discard your saved design? This cannot be undone.")) {
        localStorage.removeItem('dreamGarden_saved');
        setSavedDesign(null);
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

      {/* Resume Banner */}
      {savedDesign && (
        <div className="w-full max-w-2xl mb-12 animate-fade-in relative group">
           <button 
             onClick={handleResume}
             className="w-full bg-stone-900 hover:bg-stone-800 text-white p-2 rounded-[2rem] shadow-2xl flex items-center justify-between transition-all border border-stone-700 hover:border-stone-500 overflow-hidden pr-12"
             title="Resume your last editing session"
           >
              <div className="flex items-center gap-5 flex-1 min-w-0">
                 <div className="relative w-24 h-24 rounded-[1.5rem] overflow-hidden bg-stone-800 flex-shrink-0 border border-white/10 ml-1">
                    <img 
                      src={savedDesign.currentImage} 
                      alt="Last design" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                         <History size={24} className="text-white drop-shadow-lg" />
                    </div>
                 </div>
                 <div className="text-left py-2 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold text-xl text-white truncate">Resume Design</p>
                        <span className="bg-primary-500 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest font-black shadow-lg">Draft</span>
                    </div>
                    <p className="text-xs text-stone-400 font-medium">
                        Modified {new Date(savedDesign.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {new Date(savedDesign.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                 </div>
              </div>
              <div className="mr-2 bg-white/10 p-4 rounded-full group-hover:bg-white/20 transition-all group-hover:scale-110 flex-shrink-0 border border-white/5">
                 <PlayCircle size={28} className="text-primary-400" />
              </div>
           </button>
           
           <button
             onClick={handleDiscard}
             className="absolute top-1/2 -translate-y-1/2 right-4 p-2.5 text-stone-500 hover:text-red-400 hover:bg-white/10 rounded-full transition-all z-20 opacity-0 group-hover:opacity-100 scale-90 hover:scale-100"
             title="Discard saved design"
           >
             <Trash2 size={20} />
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
