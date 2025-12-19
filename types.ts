
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
  LIBRARY = 'LIBRARY',
  ANIMATE = 'ANIMATE',
  ANALYZE = 'ANALYZE',
  VOICE = 'VOICE'
}

export type OperationType = 
  | 'idle' 
  | 'generating' 
  | 'editing' 
  | 'uploading' 
  | 'analyzing' 
  | 'connecting' 
  | 'retrying';

export interface LoadingState {
  isLoading: boolean;
  operation: OperationType;
  message: string;
  error?: string | null;
  retryCount?: number;
}

/**
 * Standard Result envelope for all service operations
 */
export type Result<T> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: Error; message: string; data?: undefined };

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export type SunlightRequirement = 'Full Sun' | 'Partial Shade' | 'Full Shade';
export type WaterRequirement = 'Drought-tolerant' | 'Moderate' | 'High';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export type ItemCategory = 'Plant' | 'Water Feature' | 'Furniture' | 'Feature';

export type GardenStyle = 'Cottage' | 'Modern' | 'Zen' | 'Xeriscape' | 'Tropical' | 'Formal' | 'Woodland';

export interface Plant {
  id: string;
  name: string;
  scientificName: string; 
  description: string;
  sunlight?: SunlightRequirement;
  water: WaterRequirement;
  seasons?: Season[];
  imageUrl: string;
  category: ItemCategory;
  styles?: GardenStyle[];
}

export interface SavedDesign {
  currentImage: string;
  history: string[];
  timestamp: number;
}

/**
 * Domain-level state for AI Workflows
 */
export interface AIWorkflowState {
  generatedImages: Record<string, string[]>;
  generatingIds: Set<string>;
  enhancedDescriptions: Record<string, string>;
  enhancingDescIds: Set<string>;
  activeVideoId?: string;
}
