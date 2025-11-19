export interface GeneratedImage {
  id: string;
  dataUrl: string; // Base64 data URL
  prompt: string;
  timestamp: number;
}

export enum AppMode {
  HOME = 'HOME',
  GENERATE = 'GENERATE',
  EDIT = 'EDIT',
  LIBRARY = 'LIBRARY'
}

export type OperationType = 'idle' | 'generating' | 'editing' | 'uploading';

export interface LoadingState {
  isLoading: boolean;
  operation: OperationType;
  message: string;
  error?: string | null;
}

export type SunlightRequirement = 'Full Sun' | 'Partial Shade' | 'Full Shade';
export type WaterRequirement = 'Drought-tolerant' | 'Moderate' | 'High';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  sunlight: SunlightRequirement;
  water: WaterRequirement;
  seasons: Season[];
  imageUrl: string;
}