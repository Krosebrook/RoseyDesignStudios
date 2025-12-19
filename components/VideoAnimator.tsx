
import React, { useState, useRef, useEffect } from 'react';
import { generateGardenVideo } from '../services/gemini';
import { LoadingState } from '../types';
import { Upload, Video, Download, Film, Smartphone, Monitor, Key, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from './common/UI';

export const VideoAnimator: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, operation: 'idle', message: '' });
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [needsKey, setNeedsKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isMounted = useRef(true);
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const checkKey = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    setNeedsKey(!hasKey);
    return hasKey;
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await (window as any).aistudio.openSelectKey();
    // Proceed immediately as per race condition guidelines
    setNeedsKey(false);
  };

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
    
    const hasKey = await checkKey();
    if (!hasKey) return;

    setLoading({ isLoading: true, operation: 'generating', message: 'Initializing Veo 3.1...' });
    
    try {
      const url = await generateGardenVideo(currentImage, prompt, aspectRatio);
      if (isMounted.current) {
          setVideoUrl(url);
          setLoading({ isLoading: false, operation: 'idle', message: '' });
      }
    } catch (err: any) {
      if (isMounted.current) {
          const isKeyError = err.code === 'KEY_NOT_FOUND' || err.code === 'KEY_REQUIRED';
          if (isKeyError) setNeedsKey(true);
          
          setLoading({ 
            isLoading: false, 
            operation: 'idle', 
            message: '', 
            error: err.message || 'Video generation failed. Please try again.' 
          });
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 w-full">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
            <Film className="text-primary-600" />
            <h2 className="text-3xl font-bold text-stone-800 tracking-tight">Garden Motion Studio</h2>
        </div>
        <p className="text-stone-600">Bring your landscape designs to life with cinematic AI video.</p>
      </div>

      {needsKey && (
        <div className="mb-8 bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 flex flex-col items-center gap-4 animate-fade-in text-center">
           <div className="bg-amber-100 p-3 rounded-full text-amber-600">
              <Key size={32} />
           </div>
           <div>
              <h3 className="text-lg font-bold text-amber-900">Paid API Key Required</h3>
              <p className="text-amber-800 text-sm max-w-md mx-auto mt-1">
                Veo video generation requires a paid API key from a billing-enabled GCP project. 
              </p>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-amber-600 hover:underline flex items-center justify-center gap-1 mt-2"
              >
                Learn about billing <ExternalLink size={12} />
              </a>
           </div>
           <Button onClick={handleSelectKey} className="bg-amber-600 hover:bg-amber-700">
              Select API Key
           </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
            <div 
                onClick={() => !loading.isLoading && fileInputRef.current?.click()}
                className={`group relative overflow-hidden bg-white border-2 border-dashed rounded-3xl p-8 text-center transition-all ${currentImage ? 'border-primary-300 bg-primary-50/20' : 'border-stone-300 hover:border-primary-400 hover:bg-primary-50 cursor-pointer'}`}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" disabled={loading.isLoading} />
                {currentImage ? (
                    <div className="relative">
                        <img src={currentImage} alt="Source" className="rounded-2xl shadow-lg max-h-[300px] mx-auto object-contain bg-white" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center rounded-2xl">
                             <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">Change Image</Button>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center">
                        <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-4 text-stone-400 group-hover:bg-primary-100 group-hover:text-primary-500 transition-colors">
                           <Upload size={32} />
                        </div>
                        <p className="font-bold text-stone-700">Upload Base Image</p>
                        <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest font-bold">JPEG or PNG</p>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Motion Directives</label>
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. A slow cinematic zoom into the flower bed, butterflies fluttering around the lavender..."
                    className="w-full p-4 border border-stone-200 rounded-2xl text-sm h-32 resize-none focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    disabled={loading.isLoading}
                />
                
                <div className="mt-6">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-3">Aspect Ratio</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setAspectRatio('16:9')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${aspectRatio === '16:9' ? 'bg-stone-900 border-stone-900 text-white shadow-md' : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'}`}
                    >
                      <Monitor size={16} /> 16:9
                    </button>
                    <button
                      onClick={() => setAspectRatio('9:16')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${aspectRatio === '9:16' ? 'bg-stone-900 border-stone-900 text-white shadow-md' : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'}`}
                    >
                      <Smartphone size={16} /> 9:16
                    </button>
                  </div>
                </div>

                <Button
                    onClick={handleGenerateVideo}
                    disabled={!currentImage || loading.isLoading || needsKey}
                    className="w-full mt-6 py-4"
                    isLoading={loading.isLoading}
                    leftIcon={<Video size={20} />}
                >
                    Generate Cinematic Video
                </Button>
                {loading.error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-600 font-medium animate-shake">
                        <AlertCircle size={14} /> {loading.error}
                    </div>
                )}
            </div>
        </div>

        <div className="lg:col-span-7">
            <div className="bg-stone-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center overflow-hidden relative aspect-video h-full min-h-[400px]">
                {videoUrl ? (
                    <div className="w-full h-full flex flex-col">
                        <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain flex-1" />
                        <div className="p-4 bg-stone-800/80 backdrop-blur-md flex justify-between items-center">
                             <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Veo 3.1 Fast Preview</div>
                             <a href={videoUrl} download={`garden-motion-${Date.now()}.mp4`} className="flex items-center gap-2 text-white text-xs font-bold hover:text-primary-400 transition-colors">
                                <Download size={14} /> EXPORT MP4
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-12">
                        <div className="w-20 h-20 bg-stone-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-stone-700">
                           <Film size={40} />
                        </div>
                        <p className="text-stone-500 font-medium">Video preview will manifest here</p>
                        <p className="text-[10px] text-stone-600 uppercase tracking-widest mt-2">Rendering in {aspectRatio === '16:9' ? '1280x720' : '720x1280'}</p>
                    </div>
                )}
                
                {loading.isLoading && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 backdrop-blur-lg">
                        <div className="relative mb-8">
                           <div className="absolute inset-0 bg-primary-500/20 blur-3xl animate-pulse rounded-full"></div>
                           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 relative"></div>
                        </div>
                        <p className="text-white font-bold text-lg animate-pulse">{loading.message}</p>
                        <p className="text-stone-500 text-xs mt-2 italic">This may take up to 2 minutes...</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
