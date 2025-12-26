
import React from 'react';
import { Sprout, PenTool, ClipboardList } from 'lucide-react';
import { Plant, LoadingState, MaintenanceReport } from '../types';
import { ToolsTab } from './editor/sidebar/ToolsTab';
import { PaletteTab } from './editor/sidebar/PaletteTab';
import { InventoryTab } from './editor/sidebar/InventoryTab';
import { InventoryItem } from '../hooks/useEditorState';

interface EditorSidebarProps {
  activeTab: 'tools' | 'plants' | 'inventory';
  setActiveTab: (tab: 'tools' | 'plants' | 'inventory') => void;
  loading: LoadingState;
  currentImage: string | null;
  editPrompt: string;
  setEditPrompt: (prompt: string) => void;
  onEdit: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  plantSearch: string;
  setPlantSearch: (search: string) => void;
  filteredPlants: Plant[];
  onDragStart: (e: React.DragEvent, plantName: string) => void;
  onAddToDesign: (name: string) => void;
  onAddCustomItem: (plant: Plant) => void;
  onOpenCamera: () => void;
  inventory: InventoryItem[];
  gardenNeeds: any;
  maintenanceReport: MaintenanceReport | null;
  onGenerateReport: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = (props) => {
  const { activeTab, setActiveTab } = props;

  return (
    <div className="lg:col-span-4 flex flex-col h-full max-h-[800px]">
      {/* Navigation Tabs */}
      <div className="flex mb-4 bg-stone-100 p-1 rounded-xl shadow-inner">
        {[
          { id: 'tools', label: 'Editor', icon: PenTool },
          { id: 'plants', label: 'Palette', icon: Sprout },
          { id: 'inventory', label: 'Spec', icon: ClipboardList }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id 
                ? 'bg-white text-stone-800 shadow-sm ring-1 ring-black/5' 
                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <tab.icon size={14} className={activeTab === tab.id ? 'text-primary-600' : ''} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-2xl shadow-sm border border-stone-200">
        {activeTab === 'tools' ? (
          <div className="p-4 h-full overflow-hidden">
            <ToolsTab 
              loading={props.loading}
              currentImage={props.currentImage}
              editPrompt={props.editPrompt}
              setEditPrompt={props.setEditPrompt}
              onEdit={props.onEdit}
              fileInputRef={props.fileInputRef}
              onFileUpload={props.onFileUpload}
              onOpenCamera={props.onOpenCamera}
            />
          </div>
        ) : activeTab === 'plants' ? (
          <PaletteTab 
            plantSearch={props.plantSearch}
            setPlantSearch={props.setPlantSearch}
            filteredPlants={props.filteredPlants}
            onDragStart={props.onDragStart}
            onAddToDesign={props.onAddToDesign}
            onAddCustomItem={props.onAddCustomItem}
          />
        ) : (
          <InventoryTab 
            inventory={props.inventory}
            gardenNeeds={props.gardenNeeds}
            maintenanceReport={props.maintenanceReport}
            onGenerateReport={props.onGenerateReport}
            isLoading={props.loading.operation === 'reporting'}
          />
        )}
      </div>
    </div>
  );
};
