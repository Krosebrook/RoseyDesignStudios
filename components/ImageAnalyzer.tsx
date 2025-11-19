import React, { useState, useRef } from 'react';
import { analyzeGardenImage, searchGardeningTips } from '../services/gemini';
import { LoadingState } from '../types';
import { Upload, ScanEye, Search, ArrowRight, ExternalLink } from 'lucide-react';

export const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [groundingResult, setGroundingResult] = useState<{text: string, sources: any[]} | null>(null);
  
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, operation: 'idle', message: '' });
  const [question, setQuestion] = useState('What plants are in this image and are they healthy?');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setGroundingResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading({ isLoading: true, operation: 'analyzing', message: 'Analyzing with Gemini 3 Pro...' });
    setGroundingResult(null);

    try {
      const text = await analyzeGardenImage(image, question);
      setResult(text);
      setLoading({ isLoading: false, operation: 'idle', message: '' });
    } catch (err) {
      setLoading({ isLoading: false, operation: 'idle', message: '', error: 'Analysis failed.' });
    }
  };

  const handleSearchVerify = async () => {
      if (!result) return;
      setLoading({ isLoading: true, operation: 'analyzing', message: 'Verifying with Google Search...' });
      try {
          // Summarize the analysis into a search query
          const query = `Fact check and find more info about: ${result.slice(0, 300)}...`;
          const searchData = await searchGardeningTips(query);
          setGroundingResult(searchData);
          setLoading({ isLoading: false, operation: 'idle', message: '' });
      } catch(err) {
          setLoading({ isLoading: false, operation: 'idle', message: '', error: 'Search failed.' });
      }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">Garden Lens</h2>
        <p className="text-stone-600">Identify plants, diagnose diseases, and get care tips using vision AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="bg-white border-2 border-dashed border-stone-300 hover:border-primary-400 hover:bg-primary-50 rounded-2xl p-8 text-center cursor-pointer transition-all h-64 flex flex-col items-center justify-center relative overflow-hidden"
            >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                {image ? (
                    <img src={image} alt="Analysis Target" className="absolute inset-0 w-full h-full object-contain p-2" />
                ) : (
                    <>
                        <ScanEye size={48} className="text-primary-300 mb-4" />
                        <p className="font-medium text-stone-600">Upload photo to analyze</p>
                    </>
                )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                <label className="block text-sm font-medium text-stone-700 mb-2">What do you want to know?</label>
                <textarea 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded-xl text-sm h-24 resize-none focus:ring-2 focus:ring-primary-200 outline-none"
                />
                <button
                    onClick={handleAnalyze}
                    disabled={!image || loading.isLoading}
                    className="w-full mt-4 bg-primary-600 hover:bg-primary-700 disabled:bg-stone-300 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                    {loading.isLoading && !groundingResult ? (
                         <span className="animate-spin">⏳</span>
                    ) : <ScanEye size={20} />}
                    Analyze Photo
                </button>
            </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
             {result ? (
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-200 animate-fade-in">
                     <div className="prose prose-stone max-w-none mb-6">
                        <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                            <ScanEye size={20} className="text-primary-600" /> 
                            Analysis Result
                        </h3>
                        <p className="whitespace-pre-wrap text-stone-700 text-sm leading-relaxed">{result}</p>
                     </div>

                     {/* Grounding / Search Verification */}
                     {!groundingResult ? (
                        <button 
                            onClick={handleSearchVerify}
                            className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            <Search size={16} /> Verify with Google Search
                        </button>
                     ) : (
                        <div className="bg-blue-50 rounded-xl p-4 mt-4 animate-fade-in">
                             <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                                <Search size={14} /> Google Search Grounding
                             </h4>
                             <p className="text-sm text-blue-800 mb-3">{groundingResult.text}</p>
                             {groundingResult.sources && groundingResult.sources.length > 0 && (
                                 <div className="space-y-2">
                                     <p className="text-xs font-bold uppercase text-blue-400">Sources</p>
                                     {groundingResult.sources.map((chunk, i) => {
                                         const uri = chunk.web?.uri || chunk.groundingChunk?.web?.uri;
                                         const title = chunk.web?.title || chunk.groundingChunk?.web?.title;
                                         if (!uri) return null;
                                         return (
                                             <a key={i} href={uri} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-blue-600 hover:underline bg-white p-2 rounded border border-blue-100">
                                                <ExternalLink size={10} /> {title || uri}
                                             </a>
                                         );
                                     })}
                                 </div>
                             )}
                        </div>
                     )}
                 </div>
             ) : (
                 <div className="h-full flex flex-col items-center justify-center text-stone-400 p-12 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50">
                     <ArrowRight size={40} className="mb-4 opacity-20" />
                     <p>Results will appear here</p>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};