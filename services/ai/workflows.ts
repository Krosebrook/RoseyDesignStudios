
import { Plant, Result } from "../../types";
import { Type } from "@google/genai";
import { AppError } from "../../utils/errors";
import { createLogger } from "../../utils/logger";
import { PromptService } from "../prompts";
import { ImagingService } from "./imaging";
import { getAI } from "./config";
import { AI_MODELS, GENERATION_STYLES } from "../../data/constants";

const logger = createLogger('AI:Workflows');

/**
 * Complex multi-stage AI orchestration logic.
 */
export class WorkflowService {
  /**
   * Generates a high-resolution, stylized plant image using a two-stage planning pipeline.
   * Utilizes Gemini 3 Pro Image for the final render.
   */
  static async executePlantGenerationWorkflow(
    plant: Plant,
    style?: string,
    lighting?: string
  ): Promise<Result<string>> {
    try {
      const ai = getAI();
      
      // Step 1: Create a visual composition plan using the fast lite model
      const envContext = [
        plant.sunlight ? `Sunlight: ${plant.sunlight}` : '',
        plant.water ? `Water: ${plant.water}` : '',
        plant.seasons ? `Seasons: ${plant.seasons.join(', ')}` : ''
      ].filter(Boolean).join('. ');

      const planResponse = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
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
      
      // Step 2: Assemble the final high-resolution generation prompt
      const baseStyle = style || GENERATION_STYLES[Math.floor(Math.random() * GENERATION_STYLES.length)];
      const refinedPrompt = PromptService.buildPlantGenerationPrompt(plant, {
        style: `${baseStyle}, ${plan.styleModifier || ''}`,
        angle: plan.angle,
        lighting: plan.lighting || lighting,
        seed: Date.now()
      });

      // Step 3: Execute high-fidelity imaging with the Pro Image model
      const dataUrl = await ImagingService.generateHighQualityImage(refinedPrompt, '1:1', '2K');
      return { success: true, data: dataUrl };

    } catch (error: any) {
      logger.error(`Plant generation workflow failed for ${plant.name}`, error);
      return { 
        success: false, 
        error: AppError.from(error), 
        message: "Failed to generate plant variation. Please try again." 
      };
    }
  }

  /**
   * Enhances plant descriptions with botanical context and poetic tone.
   */
  static async executeDescriptionEnhancementWorkflow(
    plantName: string, 
    currentDescription: string
  ): Promise<Result<string>> {
    try {
      const ai = getAI();
      const prompt = PromptService.buildDescriptionEnhancementPrompt(plantName, currentDescription);
      
      const response = await ai.models.generateContent({
        model: AI_MODELS.BASIC_TEXT,
        contents: prompt
      });

      return { success: true, data: response.text || currentDescription };
    } catch (error: any) {
      return { success: false, error: AppError.from(error), message: "Description enhancement failed." };
    }
  }
}

export const executePlantGenerationWorkflow = WorkflowService.executePlantGenerationWorkflow;
export const executeDescriptionEnhancementWorkflow = WorkflowService.executeDescriptionEnhancementWorkflow;
