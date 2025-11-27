
import React from 'react';
import { Mic, MicOff, Volume2, Activity } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

export const VoiceChat: React.FC = () => {
  const { isActive, status, volume, startSession, disconnect } = useVoiceAssistant();

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
       <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-8 md:p-12">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${isActive ? 'bg-red-50 shadow-red-100 shadow-lg' : 'bg-primary-50'}`}>
              {isActive ? (
                 <div className="relative w-full h-full flex items-center justify-center">
                    <Mic size={40} className="text-red-500 relative z-10" />
                    {/* Visualizer Ring */}
                    <div 
                        className="absolute inset-0 rounded-full border-4 border-red-200 opacity-50"
                        style={{ transform: `scale(${1 + volume * 5})` }}
                    ></div>
                 </div>
              ) : (
                 <Volume2 size={40} className="text-primary-600" />
              )}
          </div>

          <h2 className="text-3xl font-bold text-stone-800 mb-2">Garden Assistant</h2>
          <p className="text-stone-500 mb-8 min-h-[24px] font-medium">{status}</p>

          {!isActive ? (
            <button 
                onClick={startSession}
                className="bg-stone-900 hover:bg-black text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-3 mx-auto shadow-lg transition-transform hover:scale-105"
            >
                <Mic size={20} /> Start Conversation
            </button>
          ) : (
            <button 
                onClick={disconnect}
                className="bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-3 mx-auto transition-colors"
            >
                <MicOff size={20} /> End Chat
            </button>
          )}
          
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-stone-400">
            <Activity size={14} />
            Powered by Gemini 2.5 Live API
          </div>
       </div>

       <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-stone-100 p-4 rounded-xl text-sm text-stone-600">
            "What grows well in shade?"
          </div>
          <div className="bg-stone-100 p-4 rounded-xl text-sm text-stone-600">
            "How often should I water hydrangeas?"
          </div>
       </div>
    </div>
  );
};
