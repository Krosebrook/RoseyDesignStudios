
/**
 * GEMINI SERVICE FACADE
 * This file aggregates the modular AI services into a unified API surface.
 * Complex logic is delegated to specific workflow services.
 */

import { Result, AspectRatio, Plant } from "../types";
import { AppError } from "../utils/errors";
import { getAI } from "./ai/config";
import * as ImagingService from "./ai/imaging";
import * as VideoService from "./ai/video";
import * as AnalysisService from "./ai/analysis";
import * as AdvisoryService from "./ai/advisory";
import * as WorkflowService from "./ai/workflows";

// Re-export core client for hooks that need it directly (e.g. Live API)
export const getAIClient = getAI;

/**
 * Standardized wrapper for API calls to ensure consistent Result<T> return types.
 */
async function safeExecute<T>(operation: () => Promise<T>, fallbackMessage: string): Promise<Result<T>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error: any) {
    const appError = AppError.from(error, fallbackMessage);
    return { success: false, error: appError, message: appError.message };
  }
}

// --- IMAGEN ---
// Added explicit <string> generic to ensure proper type inference in components using this method
export const generateHighQualityImage = (prompt: string, aspectRatio: AspectRatio = '1:1') => 
  safeExecute<string>(() => ImagingService.generateHighQualityImage(prompt, aspectRatio), "Failed to generate image");

// --- EDITING ---
// Added explicit <string> generic
export const editGardenImage = (base64Image: string, prompt: string) => 
  safeExecute<string>(() => ImagingService.editGardenImage(base64Image, prompt), "Failed to edit image");

// --- VIDEO ---
// Added explicit <string> generic
export const generateGardenVideo = (image: string, prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') => 
  safeExecute<string>(() => VideoService.generateGardenVideo(image, prompt, aspectRatio), "Failed to generate video");

// --- ANALYSIS ---
// Added explicit <string> generic
export const analyzeGardenImage = (image: string, question: string) => 
  safeExecute<string>(() => AnalysisService.analyzeGardenImage(image, question), "Analysis failed");

// --- SEARCH ---
// Added explicit generic for search result object structure
export const searchGardeningTips = (query: string) => 
  safeExecute<{text: string, sources: any[]}>(() => AnalysisService.searchGardeningTips(query), "Search failed");

// --- TIPS ---
export const getSeasonalGardeningTip = AdvisoryService.getSeasonalGardeningTip;
// Fix: Export generateMaintenanceReport so it can be used in hooks/useEditorState.ts
export const generateMaintenanceReport = AdvisoryService.generateMaintenanceReport;

// --- COMPLEX WORKFLOWS ---
export const generatePlantImage = (plant: Plant, style?: string, lighting?: string) => 
  WorkflowService.executePlantGenerationWorkflow(plant, style, lighting);

export const generatePlantDescription = (plantName: string, currentDescription: string) => 
  WorkflowService.executeDescriptionEnhancementWorkflow(plantName, currentDescription);
