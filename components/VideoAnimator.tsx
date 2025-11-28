
import React, { useState, useRef, useEffect } from 'react';
import { generateGardenVideo } from '../services/gemini';
import { LoadingState } from '../types';
import { Upload, Video, Download, Film, Smartphone, Monitor } from 'lucide-react';

export const VideoAnimator: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, operation: 'idle', message: '' });
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mount tracking
  const isMounted = useRef(true);
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isMounted.current) {
            setCurrentImage(reader.result as string);
            setVideoUrl(null); 
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!currentImage) return;

    setLoading({ isLoading: true, operation: 'generating', message: 'Initializing Veo...' });
    
    try {
      // Update messages during long poll
      const msgs = ["Creating composition...", "Simulating physics...", "Rendering frames...", "Finalizing video..."];
      let i = 0;
      const interval = setInterval(() => {
        if (isMounted.current) {
            setLoading(prev => ({ ...prev, message: msgs[i++ % msgs.length] }));
        }
      }, 4000);

      const url = await generateGardenVideo(currentImage, prompt, aspectRatio);
      
      clearInterval(interval);
      
      if (isMounted.current) {
          setVideoUrl(url);
          setLoading({ isLoading: false, operation: 'idle', message: '' });
      }
    } catch (err) {
      if (isMounted.current) {
          setLoading({ 
            isLoading: false, 
            operation: 'idle', 
            message: '', 
            error: 'Video generation failed. It can take a few minutes, try again.' 
          });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 w-full">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
            <Film className="text-indigo-600" />
            <h2 className="text-3xl font-bold text-stone-800">Bring Your Garden to Life</h2>
        </div>
        <p className="text-stone-600">Upload a photo and use Veo to turn it into a stunning cinematic video.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload / Input Section */}
        <div className="space-y-6">
            <div 
                onClick={() => !loading.isLoading && fileInputRef.current?.click()}
                className={`bg-white border-2 border-dashed rounded-2xl p-8 text-center transition-all ${currentImage ? 'border-indigo-300 bg-indigo-50/30' : 'border-stone-300 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'}`}
            >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                  disabled={loading.isLoading}
                />
                
                {currentImage ? (
                    <div className="relative">
                        <img src={currentImage} alt="Source" className="rounded-lg shadow-md max-h-[300px] mx-auto object-contain" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            className="mt-4 text-xs text-indigo-600 font-medium underline"
                        >
                            Change Photo
                        </button>
                    </div>
                ) : (
                    <div className="py-12 text-stone-500">
                        <Upload size={48} className="mx-auto mb-4 text-indigo-300" />
                        <p className="font-medium text-lg text-indigo-900">Upload Garden Photo</p>
                        <p className="text-sm">JPG or PNG</p>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <label className="block text-sm font-medium text-stone-700 mb-2">Motion Prompt (Optional)</label>
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Slow pan to the right, wind blowing through the leaves, butterflies flying..."
                    className="w-full p-3 border border-stone-200 rounded-xl text-sm h-24 resize-none focus:ring-2 focus:ring-indigo-200 outline-none"
                    disabled={loading.isLoading}
                />
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-stone-700 mb-2">Video Format</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setAspectRatio('16:9')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors ${aspectRatio === '16:9' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                    >
                      <Monitor size={16} /> Landscape (16:9)
                    </button>
                    <button
                      onClick={() => setAspectRatio('9:16')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors ${aspectRatio === '9:16' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                    >
                      <Smartphone size={16} /> Portrait (9:16)
                    </button>
                  </div>
                </div>

                <button
                    onClick={handleGenerateVideo}
                    disabled={!currentImage || loading.isLoading}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                    {loading.isLoading ? (
                        <>
                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                           {loading.message}
                        </>
                    ) : (
                        <>
                            <Video size={20} /> Generate Video
                        </>
                    )}
                </button>
                <p className="text-xs text-stone-400 text-center mt-2">Powered by Veo 3.1 • Takes ~1-2 minutes</p>
            </div>
        </div>

        {/* Output Section */}
        <div className="bg-stone-900 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden relative min-h-[400px]">
            {videoUrl ? (
                <div className="w-full h-full flex flex-col">
                    <video 
                        src={videoUrl} 
                        controls 
                        autoPlay 
                        loop 
                        className="w-full h-full object-contain flex-1"
                    />
                    <div className="p-4 bg-stone-800 flex justify-end">
                         <a 
                            href={videoUrl} 
                            download={`garden-veo-${Date.now()}.mp4`}
                            className="flex items-center gap-2 text-white text-sm font-medium hover:text-indigo-300"
                        >
                            <Download size={16} /> Download MP4
                        </a>
                    </div>
                </div>
            ) : (
                <div className="text-center text-stone-600">
                    <Film size={64} className="mx-auto mb-4 opacity-20" />
                    <p className="text-stone-500">Video preview will appear here</p>
                    <p className="text-xs text-stone-700 mt-1">Select {aspectRatio} aspect ratio</p>
                </div>
            )}
            
            {loading.isLoading && (
                 <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 backdrop-blur-sm">
                    <div className="text-center text-indigo-200">
                        <div className="animate-pulse-slow text-6xl mb-4">🎥</div>
                        <p className="font-mono text-sm animate-pulse">{loading.message}</p>
                    </div>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};
