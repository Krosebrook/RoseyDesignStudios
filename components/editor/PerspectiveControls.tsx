
import React from 'react';
import { SlidersHorizontal, MousePointer2 } from 'lucide-react';

interface PerspectiveControlsProps {
  view: {
    rotation: { x: number; y: number };
    followCursor: boolean;
    setFollowCursor: (val: boolean) => void;
    setManualRotation: (axis: 'x' | 'y', val: number) => void;
  };
}

export const PerspectiveControls: React.FC<PerspectiveControlsProps> = ({ view }) => (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-stone-200 p-4 rounded-2xl shadow-2xl flex flex-col gap-3 w-64 z-40 animate-fade-in-up">
    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
        <SlidersHorizontal size={10} /> Tilt Engine
      </div>
      <button 
        onClick={() => view.setFollowCursor(!view.followCursor)}
        className={`text-[10px] px-2 py-0.5 rounded transition-all font-bold border ${view.followCursor ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-stone-50 text-stone-500 border-stone-200'}`}
      >
        <MousePointer2 size={10} className="inline mr-1" />
        {view.followCursor ? 'AUTO' : 'LOCK'}
      </button>
    </div>

    <div className="space-y-3">
      {[
        { axis: 'x', label: 'Vertical', val: view.rotation.x },
        { axis: 'y', label: 'Horizontal', val: view.rotation.y }
      ].map(ctrl => (
        <div key={ctrl.axis}>
          <div className="flex justify-between text-[9px] text-stone-400 font-bold uppercase mb-1">
            <span>{ctrl.label}</span>
            <span>{Math.round(ctrl.val)}°</span>
          </div>
          <input 
            type="range" min="-40" max="40" 
            value={ctrl.val}
            onChange={(e) => view.setManualRotation(ctrl.axis as 'x'|'y', parseFloat(e.target.value))}
            disabled={view.followCursor}
            className="w-full h-1 bg-stone-200 rounded-lg appearance-none accent-primary-500 disabled:opacity-30"
          />
        </div>
      ))}
    </div>
  </div>
);
