import React, { useEffect, useState } from 'react';
import { Season, Plant } from '../types';
import { PLANTS } from '../data/plants';
import { getSeasonalGardeningTip } from '../services/gemini';
import { CloudRain, Sun, Wind, Snowflake, Sparkles, ArrowRight } from 'lucide-react';
import { PlantCard } from './PlantCard';

interface SeasonalSpotlightProps {
    onAddToDesign?: (plantName: string) => void;
    generatedImages: Record<string, string[]>;
    generatingIds: Set<string>;
    onGenerateAI: (e: React.MouseEvent, plant: Plant) => void;
}

export const SeasonalSpotlight: React.FC<SeasonalSpotlightProps> = ({ 
  onAddToDesign,
  generatedImages,
  generatingIds,
  onGenerateAI
}) => {
  const [currentSeason, setCurrentSeason] = useState<Season>('Spring');
  const [tip, setTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);

  useEffect(() => {
    // Determine current season based on month (Northern Hemisphere)
    const month = new Date().getMonth(); // 0-11
    let s: Season = 'Spring';
    // Winter: Dec (11), Jan (0), Feb (1)
    if (month === 11 || month <= 1) s = 'Winter';
    // Spring: Mar (2), Apr (3), May (4)
    else if (month >= 2 && month <= 4) s = 'Spring';
    // Summer: Jun (5), Jul (6), Aug (7)
    else if (month >= 5 && month <= 7) s = 'Summer';
    // Autumn: Sep (8), Oct (9), Nov (10)
    else s = 'Autumn';
    
    setCurrentSeason(s);
    fetchTip(s);
  }, []);

  const fetchTip = async (season: Season) => {
    setLoadingTip(true);
    try {
      const t = await getSeasonalGardeningTip(season);
      setTip(t);
    } catch (e) {
      console.error("Failed to fetch tip", e);
      setTip(`Enjoy your garden this ${season}!`);
    } finally {
      setLoadingTip(false);
    }
  };

  const handleSeasonChange = (s: Season) => {
    setCurrentSeason(s);
    fetchTip(s);
  };

  const seasonalPlants = PLANTS.filter(p => p.seasons.includes(currentSeason));

  const seasonConfig = {
    Spring: { icon: CloudRain, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    Summer: { icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    Autumn: { icon: Wind, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
    Winter: { icon: Snowflake, color: 'text-blue-400', bg: 'bg-blue-50', border: 'border-blue-100' }
  };

  const CurrentIcon = seasonConfig[currentSeason].icon;

  return (
    <div className={`mb-12 rounded-3xl border ${seasonConfig[currentSeason].border} ${seasonConfig[currentSeason].bg} overflow-hidden transition-colors duration-500`}>
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-bold uppercase tracking-wider shadow-sm ${seasonConfig[currentSeason].color}`}>
                 <CurrentIcon size={14} /> {currentSeason} Spotlight
               </span>
            </div>
            <h2 className="text-3xl font-bold text-stone-800">Perfect for {currentSeason}</h2>
            <div className="mt-3 flex items-start gap-2 max-w-xl">
               <Sparkles size={18} className={`mt-1 flex-shrink-0 ${seasonConfig[currentSeason].color}`} />
               <p className={`text-stone-700 font-medium leading-relaxed ${loadingTip ? 'animate-pulse' : ''}`}>
                 {tip || "Loading seasonal tips..."}
               </p>
            </div>
          </div>

          {/* Season Selectors */}
          <div className="flex bg-white/60 p-1.5 rounded-xl backdrop-blur-sm shadow-sm overflow-x-auto max-w-full">
             {(['Spring', 'Summer', 'Autumn', 'Winter'] as Season[]).map(s => {
               const SIcon = seasonConfig[s].icon;
               const isActive = currentSeason === s;
               return (
                 <button
                   key={s}
                   onClick={() => handleSeasonChange(s)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                     isActive 
                       ? 'bg-white text-stone-800 shadow-md' 
                       : 'text-stone-500 hover:bg-white/50'
                   }`}
                 >
                   <SIcon size={14} className={isActive ? seasonConfig[s].color : ''} />
                   {s}
                 </button>
               );
             })}
          </div>
        </div>

        {/* Horizontal Plant List (Carousel) */}
        <div className="relative">
           {seasonalPlants.length > 0 ? (
             <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 custom-scrollbar">
                {seasonalPlants.slice(0, 4).map(plant => (
                  <div key={plant.id} className="min-w-[260px] md:min-w-[280px]">
                    <PlantCard 
                        plant={plant}
                        images={[plant.imageUrl, ...(generatedImages[plant.id] || [])]}
                        isGenerating={generatingIds.has(plant.id)}
                        onGenerateAI={onGenerateAI}
                        onAddToDesign={onAddToDesign}
                    />
                  </div>
                ))}
                {seasonalPlants.length > 4 && (
                    <div className="min-w-[100px] flex flex-col items-center justify-center text-center text-stone-500 p-4">
                        <span className="text-sm font-medium mb-2">View More</span>
                        <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform text-stone-800">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}
             </div>
           ) : (
             <div className="bg-white/50 rounded-xl p-8 text-center text-stone-500">
                No specific recommendations found for this season in our current database.
             </div>
           )}
        </div>
      </div>
    </div>
  );
};