
import React from 'react';
import { MaintenanceReport, MaintenanceTask } from '../../../types';
import { Card, Button, Spinner } from '../../common/UI';
import { Sun, Droplets, ShoppingBag, Info, Leaf, Sparkles, Calendar, CheckCircle2, Clock, AlertTriangle, FileOutput, Printer } from 'lucide-react';
import { useEditorState } from '../../../hooks/useEditorState';

interface InventoryTabProps {
  inventory: any[];
  gardenNeeds: any;
  maintenanceReport: MaintenanceReport | null;
  onGenerateReport: () => void;
  isLoading: boolean;
  // Use 'any' or correct signature for optional handler if strict typing is difficult without changing parent
  onExportProject?: () => void; 
}

const PriorityBadge = ({ priority }: { priority: MaintenanceTask['priority'] }) => {
  const styles = {
    High: 'bg-red-50 text-red-600 border-red-100',
    Medium: 'bg-amber-50 text-amber-600 border-amber-100',
    Low: 'bg-blue-50 text-blue-600 border-blue-100'
  };
  return (
    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${styles[priority]}`}>
      {priority}
    </span>
  );
};

export const InventoryTab: React.FC<InventoryTabProps> = ({ 
  inventory, 
  gardenNeeds, 
  maintenanceReport, 
  onGenerateReport,
  isLoading,
  onExportProject
}) => {
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
      <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0 shadow-xl">
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

      {/* Maintenance Report Section */}
      <div className="space-y-4">
        {!maintenanceReport ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-stone-200 p-6 text-center">
            <Sparkles size={24} className="mx-auto mb-3 text-primary-400" />
            <h5 className="font-bold text-stone-800 text-sm mb-1">Maintenance Masterclass</h5>
            <p className="text-xs text-stone-500 mb-4 px-2">Generate a personalized care schedule based on your specific plant selections.</p>
            <Button 
              size="sm" 
              onClick={onGenerateReport} 
              isLoading={isLoading}
              className="w-full"
              leftIcon={<Sparkles size={14} />}
            >
              Generate Care Schedule
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
             <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Maintenance Plan</h4>
                <button 
                  onClick={onGenerateReport} 
                  className="text-[10px] text-primary-600 font-black hover:underline uppercase"
                >
                  Refresh
                </button>
             </div>

             <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-indigo-700 mb-2">
                  <Calendar size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Seasonal Advice</span>
                </div>
                <p className="text-xs text-indigo-900 leading-relaxed">{maintenanceReport.seasonalAdvice}</p>
             </div>

             <div className="space-y-3">
                {maintenanceReport.tasks.map((t, i) => (
                  <div key={i} className="bg-white border border-stone-100 rounded-xl p-3 shadow-sm hover:border-primary-200 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-primary-500" />
                        <span className="text-xs font-bold text-stone-800">{t.task}</span>
                      </div>
                      <PriorityBadge priority={t.priority} />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 mb-1.5 uppercase tracking-tighter">
                       <Clock size={10} /> {t.frequency}
                    </div>
                    <p className="text-[11px] text-stone-600 leading-tight">{t.description}</p>
                  </div>
                ))}
             </div>

             <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Droplets size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Irrigation Strategy</span>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed italic">"{maintenanceReport.waterSchedule}"</p>
             </div>
          </div>
        )}
      </div>

      {/* Item List */}
      <div className="pt-4">
        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3 px-1">Bill of Materials</h4>
        <div className="space-y-2 pb-6">
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
      
      {/* Export Section */}
      <div className="sticky bottom-0 bg-stone-50 p-4 border-t border-stone-200 -mx-4 space-y-3">
          {onExportProject && (
            <Button 
                onClick={onExportProject}
                className="w-full bg-stone-900 hover:bg-black"
                leftIcon={<Printer size={16} />}
            >
                Export Blueprint
            </Button>
          )}

          <div className="bg-amber-50 rounded-xl p-3 flex gap-3">
            <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-900 leading-tight italic">
              AI maintenance advice is generalized. Always monitor local soil and weather conditions for precise care.
            </p>
          </div>
      </div>
    </div>
  );
};
