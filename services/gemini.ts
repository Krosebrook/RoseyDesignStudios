
/**
 * GEMINI SERVICE FACADE
 * This file aggregates the modular AI services into a unified API surface
 * to maintain compatibility with existing components.
 */

import { Result, AspectRatio, Plant } from "../types";
import { AppError } from "../utils/errors";
import { GENERATION_STYLES, buildPlantDescriptionPrompt } from "../data/constants";
import { getAI } from "./ai/config";
import * as ImagingService from "./ai/imaging";
import * as VideoService from "./ai/video";
import * as AnalysisService from "./ai/analysis";
import * as AdvisoryService from "./ai/advisory";

// Re-export core client for hooks that need it directly (e.g. Live API)
export const getAIClient = getAI;

// Helper wrapper to match the Result<T> pattern used in the app
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
export const generateHighQualityImage = (prompt: string, aspectRatio: AspectRatio = '1:1') => 
  safeExecute(() => ImagingService.generateHighQualityImage(prompt, aspectRatio), "Failed to generate image");

// --- EDITING ---
export const editGardenImage = (base64Image: string, prompt: string) => 
  safeExecute(() => ImagingService.editGardenImage(base64Image, prompt), "Failed to edit image");

// --- VIDEO ---
export const generateGardenVideo = (image: string, prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') => 
  safeExecute(() => VideoService.generateGardenVideo(image, prompt, aspectRatio), "Failed to generate video");

// --- ANALYSIS ---
export const analyzeGardenImage = (image: string, question: string) => 
  safeExecute(() => AnalysisService.analyzeGardenImage(image, question), "Analysis failed");

// --- SEARCH ---
export const searchGardeningTips = (query: string) => 
  safeExecute(() => AnalysisService.searchGardeningTips(query), "Search failed");

// --- TIPS ---
export const getSeasonalGardeningTip = AdvisoryService.getSeasonalGardeningTip;

// --- PLANT GEN ---
export const generatePlantImage = async (
  plant: Plant, 
  style?: string,
  lighting?: string
): Promise<Result<string>> => {
  return safeExecute(async () => {
    // 1. CoT Planning with full context
    const plan = await AdvisoryService.planImageComposition(
      plant.name, 
      plant.description, 
      style, 
      lighting,
      plant.sunlight,
      plant.water,
      plant.seasons
    );

    // 2. Prompt Construction
    const baseStyle = style || GENERATION_STYLES[Math.floor(Math.random() * GENERATION_STYLES.length)];
    const variationSeed = Math.floor(Math.random() * 999999999);
    
    // Enrich context string
    const envDetails = [
      plant.sunlight ? `Sunlight: ${plant.sunlight}` : '',
      plant.seasons ? `Active Seasons: ${plant.seasons.join(', ')}` : '',
      plant.styles ? `Garden Styles: ${plant.styles.join(', ')}` : ''
    ].filter(Boolean).join('. ');

    const finalPrompt = `
      Create a distinctly unique high-resolution image of ${plant.name} (${plant.scientificName}).
      Context: ${plant.description}
      Environment Details: ${envDetails}
      
      CREATIVE DIRECTION (Strictly Follow):
      - Perspective: ${plan.angle}
      - Lighting: ${plan.lighting}
      - Artistic Style: ${baseStyle} mixed with ${plan.styleModifier}
      - Composition Reasoning: ${plan.reasoning}
      
      REQUIREMENTS:
      - Focus purely on the plant aesthetics in its natural or designed setting.
      - High detail, 8k resolution.
      - Make it look distinctively different from standard stock photos.
      - Use the random seed to vary composition, zoom level, and background blur.
      - Random Noise Seed: ${variationSeed}
    `;

    return ImagingService.generatePlantImage(finalPrompt);
  }, "Failed to generate plant image");
};

export const generatePlantDescription = async (plantName: string, currentDescription: string): Promise<Result<string>> => {
  return safeExecute(async () => {
    const prompt = buildPlantDescriptionPrompt(plantName, currentDescription);
    return AdvisoryService.generatePlantDescription(prompt, currentDescription);
  }, "Failed to enhance description");
};
