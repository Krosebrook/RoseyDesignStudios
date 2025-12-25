
import React from 'react';
import { InventoryItem } from '../../../hooks/useEditorState';
import { Card } from '../../common/UI';
import { Sun, Droplets, ShoppingBag, Info, Leaf } from 'lucide-react';

interface InventoryTabProps {
  inventory: InventoryItem[];
  gardenNeeds: any;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({ inventory, gardenNeeds }) => {
  if (inventory.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-stone-50 h-full">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-300">
          <ShoppingBag size={32} />
        </div>
        <p className="text-stone-600 font-bold">Your list is empty</p>
        <p className="text-stone-400 text-sm mt-1">Add items to your design from the palette to generate a specification.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar h-full space-y-6">
      {/* Project Summary */}
      <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0">
        <div className="flex items-center gap-3 mb-4">
           <div className="bg-white/20 p-2 rounded-lg">
             <Leaf size={20} />
           </div>
           <div>
             <h4 className="font-bold text-sm">Project Specification</h4>
             <p className="text-[10px] text-primary-100 uppercase tracking-widest font-bold">{gardenNeeds.itemCount} Items Placed</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
           <div className="bg-black/10 rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary-200 mb-1">
                 <Sun size={10} /> Exposure
              </div>
              <p className="text-xs font-bold">{gardenNeeds.dominantSun}</p>
           </div>
           <div className="bg-black/10 rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary-200 mb-1">
                 <Droplets size={10} /> Type
              </div>
              <p className="text-xs font-bold">{gardenNeeds.isXeriscape ? 'Drought Wise' : 'Mixed Care'}</p>
           </div>
        </div>
      </Card>

      {/* Item List */}
      <div>
        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 px-1">Bill of Materials</h4>
        <div className="space-y-2">
          {inventory.map((item) => (
            <div key={item.plant.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-100 hover:border-primary-200 transition-colors shadow-sm group">
               <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                  <img src={item.plant.imageUrl} alt={item.plant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="font-bold text-xs text-stone-800 truncate">{item.plant.name}</p>
                    <span className="bg-stone-100 text-stone-600 text-[10px] font-black px-2 py-0.5 rounded-md">x{item.count}</span>
                  </div>
                  <div className="flex gap-2">
                    {item.plant.sunlight && (
                      <span className="flex items-center gap-1 text-[9px] text-stone-400 font-bold uppercase">
                        <Sun size={8} /> {item.plant.sunlight.split(' ')[0]}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[9px] text-stone-400 font-bold uppercase">
                      <Droplets size={8} /> {item.plant.water === 'Drought-tolerant' ? 'Low' : item.plant.water}
                    </span>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
         <Info size={16} className="text-amber-600 shrink-0" />
         <p className="text-[11px] text-amber-900 leading-relaxed italic">
           Quantities are estimated based on your canvas placement. Ensure proper spacing during actual planting for optimal growth.
         </p>
      </div>
      
      <div className="pb-10" />
    </div>
  );
};
