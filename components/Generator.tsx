import React, { useState, useEffect } from 'react';
import { generateHighQualityImage } from '../services/gemini';
import { LoadingState, GeneratedImage, AppMode, AspectRatio } from '../types';
import { Wand2, Download, Edit3, Square, Smartphone, Monitor } from 'lucide-react';

interface GeneratorProps {
  onImageGenerated: (img: GeneratedImage) => void;
  setMode: (mode: AppMode) => void;
}

const SUGGESTIONS = [
  "A peaceful Japanese Zen garden with a small koi pond, bamboo fence, and maple trees.",
  "A modern minimalist backyard with concrete pavers, succulents, and a fire pit.",
  "A lush English cottage garden overflowing with colorful wildflowers and a cobblestone path.",
  "A tropical paradise with palm trees, a hammock, and vibrant exotic flowers."
];

const LOADING_MESSAGES = [
  "Dreaming up your garden...",
  "Calculating light and shadows...",
  "Planting virtual seeds...",
  "Rendering in 4K resolution...",
  "Polishing the leaves..."
];

export const Generator: React.FC<GeneratorProps> = ({ onImageGenerated, setMode }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, operation: 'idle', message: '' });
  const [result, setResult] = useState<GeneratedImage | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  useEffect(() => {
    if (loading.operation !== 'generating') return;
    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
      setLoading(prev => {
        if (!prev.isLoading) return prev;
        return { ...prev, message: LOADING_MESSAGES[messageIndex] };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [loading.operation]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading({ isLoading: true, operation: 'generating', message: LOADING_MESSAGES[0] });
    setResult(null);

    try {
      const base64Data = await generateHighQualityImage(prompt, aspectRatio);
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        dataUrl: base64Data,
        prompt: prompt,
        timestamp: Date.now()
      };
      setResult(newImage);
      onImageGenerated(newImage);
      setLoading({ isLoading: false, operation: 'idle', message: '' });
    } catch (err) {
      setLoading({ 
        isLoading: false, 
        operation: 'idle',
        message: '', 
        error: 'Failed to generate image. Please try again.' 
      });
    }
  };

  const ratios: { val: AspectRatio, icon: any, label: string }[] = [
    { val: '1:1', icon: Square, label: 'Square' },
    { val: '9:16', icon: Smartphone, label: 'Portrait' },
    { val: '16:9', icon: Monitor, label: 'Landscape' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">Design with Imagen 4</h2>
        <p className="text-stone-600">Create photorealistic garden designs in any format.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mb-8 transition-all hover:shadow-md">
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-stone-700">Describe your garden</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A cozy backyard with a wooden pergola, string lights, and raised vegetable beds..."
            className="w-full p-4 rounded-xl border border-stone-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none min-h-[120px]"
          />
          
          <div className="flex gap-4 items-center flex-wrap">
             <span className="text-sm font-medium text-stone-600 mr-2">Shape:</span>
             {ratios.map(r => (
               <button
                 key={r.val}
                 onClick={() => setAspectRatio(r.val)}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                   aspectRatio === r.val 
                     ? 'bg-primary-50 border-primary-500 text-primary-700' 
                     : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
                 }`}
               >
                 <r.icon size={14} /> {r.label}
               </button>
             ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                className="flex-shrink-0 text-xs bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 px-3 py-2 rounded-full transition-colors whitespace-nowrap"
              >
                {s.slice(0, 50)}...
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading.isLoading || !prompt.trim()}
            className="mt-2 bg-primary-600 hover:bg-primary-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
          >
            {loading.operation === 'generating' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {loading.message}
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Generate High-Res Design
              </>
            )}
          </button>
          {loading.error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm text-center mt-2 border border-red-100">
              {loading.error}
            </div>
          )}
        </div>
      </div>

      {/* Result Area */}
      {result && (
        <div className="animate-fade-in-up bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200">
          <div className="relative group bg-stone-100">
            <img 
              src={result.dataUrl} 
              alt="Generated Garden" 
              className="w-full h-auto object-contain max-h-[600px] mx-auto"
            />
          </div>
          <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-stone-50 border-t border-stone-100">
            <p className="text-stone-600 italic text-sm flex-1 line-clamp-2 border-l-2 border-primary-300 pl-3">
              "{result.prompt}"
            </p>
            <div className="flex gap-3">
               <a
                href={result.dataUrl}
                download={`dream-garden-${Date.now()}.jpg`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium text-sm transition-colors shadow-sm"
              >
                <Download size={16} />
                Save
              </a>
              <button
                onClick={() => setMode(AppMode.EDIT)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm"
              >
                <Edit3 size={16} />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};