
import { Plant, Result } from "../../types";
import { Type } from "@google/genai";
import { AppError } from "../../utils/errors";
import { createLogger } from "../../utils/logger";
import { PromptService } from "../prompts";
import { ImagingService } from "./imaging";
import { getAI } from "./config";
import { GENERATION_STYLES } from "../../data/constants";

const logger = createLogger('AI:Workflows');

export class WorkflowService {
  /**
   * Orchestrates a multi-step "Think-then-Generate" pipeline.
   * 1. Planner (Gemini Flash): Decides on lighting, angle, and specific aesthetic traits.
   * 2. Creator (Imagen): Executes the visual generation based on the plan.
   */
  static async executePlantGenerationWorkflow(
    plant: Plant,
    style?: string,
    lighting?: string
  ): Promise<Result<string>> {
    try {
      const ai = getAI();
      
      // Phase 1: Planning with JSON Schema
      // Fixed: Built envContext manually to satisfy PromptService signature
      const envContext = [
        plant.sunlight ? `Sunlight: ${plant.sunlight}` : '',
        plant.water ? `Water Needs: ${plant.water}` : '',
        plant.seasons ? `Seasons: ${plant.seasons.join(', ')}` : ''
      ].filter(Boolean).join('. ');

      const planResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite-latest',
        // Fixed: buildCompositionPlanPrompt expects 4 string arguments
        contents: PromptService.buildCompositionPlanPrompt(plant.name, plant.description, envContext, { style, lighting }),
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              angle: { type: Type.STRING },
              lighting: { type: Type.STRING },
              styleModifier: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["angle", "lighting", "styleModifier"]
          }
        }
      });

      const plan = JSON.parse(planResponse.text || "{}");
      
      // Phase 2: Refined Prompting
      const baseStyle = style || GENERATION_STYLES[Math.floor(Math.random() * GENERATION_STYLES.length)];
      const refinedPrompt = PromptService.buildPlantGenerationPrompt(plant, {
        style: `${baseStyle}, ${plan.styleModifier || ''}`,
        angle: plan.angle,
        lighting: plan.lighting || lighting,
        seed: Math.floor(Math.random() * 1000000)
      });

      // Phase 3: Imaging
      const dataUrl = await ImagingService.generatePlantVariation(refinedPrompt);
      return { success: true, data: dataUrl };

    } catch (error: any) {
      logger.error(`Workflow failed for ${plant.name}`, error);
      return { 
        success: false, 
        error: AppError.from(error), 
        message: "Failed to create a unique variation for this plant." 
      };
    }
  }

  /**
   * Enhances item descriptions using expert botanical knowledge.
   */
  static async executeDescriptionEnhancementWorkflow(
    plantName: string, 
    currentDescription: string
  ): Promise<Result<string>> {
    try {
      const ai = getAI();
      const prompt = PromptService.buildDescriptionEnhancementPrompt(plantName, currentDescription);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return { success: true, data: response.text || currentDescription };
    } catch (error: any) {
      return { success: false, error: AppError.from(error), message: "Enhancement failed." };
    }
  }
}

// Facade exports
export const executePlantGenerationWorkflow = WorkflowService.executePlantGenerationWorkflow;
export const executeDescriptionEnhancementWorkflow = WorkflowService.executeDescriptionEnhancementWorkflow;
