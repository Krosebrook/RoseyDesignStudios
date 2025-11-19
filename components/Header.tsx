import React from 'react';
import { AppMode } from '../types';
import { Sprout, ImagePlus, Wand2, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentMode, setMode }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setMode(AppMode.HOME)}
        >
          <div className="bg-primary-500 p-1.5 rounded-lg text-white">
            <Sprout size={24} />
          </div>
          <h1 className="text-xl font-bold text-stone-800 tracking-tight">DreamGarden AI</h1>
        </div>

        <nav className="flex gap-1 sm:gap-2 md:gap-4">
          <button
            onClick={() => setMode(AppMode.GENERATE)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              currentMode === AppMode.GENERATE
                ? 'bg-primary-100 text-primary-800 ring-1 ring-primary-200'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Wand2 size={18} />
            <span className="hidden sm:inline">New Design</span>
          </button>

          <button
            onClick={() => setMode(AppMode.EDIT)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              currentMode === AppMode.EDIT
                ? 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ImagePlus size={18} />
            <span className="hidden sm:inline">Edit Photo</span>
          </button>

          <button
            onClick={() => setMode(AppMode.LIBRARY)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              currentMode === AppMode.LIBRARY
                ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <BookOpen size={18} />
            <span className="hidden sm:inline">Plant Library</span>
          </button>
        </nav>
      </div>
    </header>
  );
};