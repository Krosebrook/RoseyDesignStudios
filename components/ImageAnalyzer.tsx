import React, { useState, useRef } from 'react';
import { analyzeGardenImage, searchGardeningTips } from '../services/gemini';
import { LoadingState } from '../types';
import { Upload, ScanEye, Search, ArrowRight, ExternalLink, Leaf, Stethoscope } from 'lucide-react';

export const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [groundingResult, setGroundingResult] = useState<{text: string, sources: any[]} | null>(null);
  
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, operation: 'idle', message: '' });
  const [question, setQuestion] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setGroundingResult(null);
        setQuestion('');
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (prompt: string, loadingMessage: string) => {
    if (!image) return;
    setLoading({ isLoading: true, operation: 'analyzing', message: loadingMessage });
    setGroundingResult(null);

    try {
      const text = await analyzeGardenImage(image, prompt);
      setResult(text);
      setLoading({ isLoading: false, operation: 'idle', message: '' });
    } catch (err) {
      setLoading({ isLoading: false, operation: 'idle', message: '', error: 'Analysis failed.' });
    }
  };

  const handleAnalyze = () => {
    const prompt = question.trim() || 'Describe this garden image and identify any key plants.';
    runAnalysis(prompt, 'Analyzing with Gemini 3 Pro...');
  };

  const handleQuickIdentify = () => {
    setQuestion('Identify these plants'); // Visual feedback for user
    runAnalysis(
        "Identify all the plants visible in this image. Provide their common name, scientific name, and a brief characteristic for each.",
        "Identifying plants..."
    );
  };

  const handleDiagnose = () => {
    setQuestion('Diagnose plant health issues');
    runAnalysis(
        "Examine this image for any signs of plant disease, pests, drought stress, or nutrient deficiencies. If issues are found, suggest a treatment. If the plants look healthy, confirm their vitality.",
        "Diagnosing health..."
    );
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
                className="bg-white border-2 border-dashed border-stone-300 hover:border-primary-400 hover:bg-primary-50 rounded-2xl p-8 text-center cursor-pointer transition-all h-64 flex flex-col items-center justify-center relative overflow-hidden group"
            >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                {image ? (
                    <>
                        <img src={image} alt="Analysis Target" className="absolute inset-0 w-full h-full object-contain p-2 bg-stone-50" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                             <div className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                Change Photo
                             </div>
                        </div>
                    </>
                ) : (
                    <>
                        <ScanEye size={48} className="text-primary-300 mb-4 group-hover:text-primary-500 transition-colors" />
                        <p className="font-medium text-stone-600">Upload photo to analyze</p>
                    </>
                )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                <label className="block text-sm font-medium text-stone-700 mb-2">Quick Actions</label>
                <div className="grid grid-cols-2 gap-3 mb-6">
                     <button
                        onClick={handleQuickIdentify}
                        disabled={!image || loading.isLoading}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors border border-emerald-100 disabled:opacity-50"
                     >
                         <Leaf size={16} /> Identify Plants
                     </button>
                     <button
                        onClick={handleDiagnose}
                        disabled={!image || loading.isLoading}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold hover:bg-amber-100 transition-colors border border-amber-100 disabled:opacity-50"
                     >
                         <Stethoscope size={16} /> Diagnose Health
                     </button>
                </div>

                <label className="block text-sm font-medium text-stone-700 mb-2">Or ask a specific question</label>
                <textarea 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. Is this plant toxic to dogs? What fertilizer does this need?"
                    className="w-full p-3 border border-stone-200 rounded-xl text-sm h-24 resize-none focus:ring-2 focus:ring-primary-200 outline-none"
                />
                <button
                    onClick={handleAnalyze}
                    disabled={!image || loading.isLoading}
                    className="w-full mt-4 bg-primary-600 hover:bg-primary-700 disabled:bg-stone-300 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                    {loading.isLoading && !groundingResult ? (
                         <span className="animate-spin">⏳</span>
                    ) : <ScanEye size={20} />}
                    Analyze Question
                </button>
            </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
             {result ? (
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-200 animate-fade-in">
                     <div className="prose prose-stone max-w-none mb-6">
                        <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2 border-b border-stone-100 pb-2 mb-4">
                            <ScanEye size={20} className="text-primary-600" /> 
                            Analysis Result
                        </h3>
                        <p className="whitespace-pre-wrap text-stone-700 text-sm leading-relaxed">{result}</p>
                     </div>

                     {/* Grounding / Search Verification */}
                     {!groundingResult ? (
                        <button 
                            onClick={handleSearchVerify}
                            className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-blue-100"
                        >
                            <Search size={16} /> Verify with Google Search
                        </button>
                     ) : (
                        <div className="bg-blue-50 rounded-xl p-4 mt-4 animate-fade-in border border-blue-100">
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
                                             <a key={i} href={uri} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-blue-600 hover:underline bg-white p-2 rounded border border-blue-100 truncate">
                                                <ExternalLink size={10} className="shrink-0" /> {title || uri}
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