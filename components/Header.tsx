import React from 'react';
import { AppMode } from '../types';
import { Sprout, ImagePlus, Wand2, BookOpen, Video, ScanEye, Mic } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const Header: React.FC = () => {
  const { mode: currentMode, setMode } = useApp();

  const navItems = [
    { mode: AppMode.GENERATE, icon: Wand2, label: 'Design' },
    { mode: AppMode.EDIT, icon: ImagePlus, label: 'Edit' },
    { mode: AppMode.ANIMATE, icon: Video, label: 'Veo' },
    { mode: AppMode.ANALYZE, icon: ScanEye, label: 'Analyze' },
    { mode: AppMode.VOICE, icon: Mic, label: 'Voice' },
    { mode: AppMode.LIBRARY, icon: BookOpen, label: 'Library' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setMode(AppMode.HOME)}
          role="button"
          aria-label="Go to Home"
          tabIndex={0}
        >
          <div className="bg-primary-500 p-1.5 rounded-lg text-white">
            <Sprout size={24} />
          </div>
          <h1 className="text-xl font-bold text-stone-800 tracking-tight hidden sm:block">DreamGarden</h1>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar" role="navigation" aria-label="Main Navigation">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => setMode(item.mode)}
              aria-label={`Switch to ${item.label}`}
              aria-current={currentMode === item.mode ? 'page' : undefined}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                currentMode === item.mode
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <item.icon size={16} aria-hidden="true" />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};