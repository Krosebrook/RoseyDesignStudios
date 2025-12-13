
import { Plant, Result } from "../../types";
import { AppError } from "../../utils/errors";
import { createLogger } from "../../utils/logger";
import { PromptService } from "../prompts";
import * as AdvisoryService from "./advisory";
import * as ImagingService from "./imaging";
import { GENERATION_STYLES } from "../../data/constants";

const logger = createLogger('AI:Workflows');

/**
 * Orchestrates the multi-step process of generating a plant image:
 * 1. Strategic Composition Planning (Chain-of-Thought)
 * 2. Prompt Construction
 * 3. Image Generation
 */
export const executePlantGenerationWorkflow = async (
  plant: Plant,
  style?: string,
  lighting?: string
): Promise<Result<string>> => {
  try {
    logger.info(`Starting generation workflow for ${plant.name}`);

    // Step 1: CoT Planning
    // We ask the model to "think" about the best composition before generating
    const plan = await AdvisoryService.planImageComposition(
      plant.name, 
      plant.description, 
      style, 
      lighting,
      plant.sunlight,
      plant.water,
      plant.seasons
    );

    // Step 2: Prompt Construction
    // Merge user preferences with the AI's strategic plan
    const baseStyle = style || GENERATION_STYLES[Math.floor(Math.random() * GENERATION_STYLES.length)];
    const variationSeed = Math.floor(Math.random() * 999999999);
    
    const finalPrompt = PromptService.buildPlantGenerationPrompt(plant, {
      style: `${baseStyle} mixed with ${plan.styleModifier}`,
      angle: plan.angle,
      lighting: plan.lighting,
      seed: variationSeed
    });

    // Step 3: Execution
    const imageData = await ImagingService.generatePlantImage(finalPrompt);
    
    return { success: true, data: imageData };

  } catch (error: any) {
    logger.error("Plant generation workflow failed", error);
    const appError = AppError.from(error, "Failed to generate plant image");
    return { success: false, error: appError, message: appError.message };
  }
};

/**
 * Workflow for enhancing plant descriptions using LLM knowledge.
 */
export const executeDescriptionEnhancementWorkflow = async (
  plantName: string, 
  currentDescription: string
): Promise<Result<string>> => {
  try {
    const prompt = PromptService.buildDescriptionEnhancementPrompt(plantName, currentDescription);
    const enhancedText = await AdvisoryService.generatePlantDescription(prompt, currentDescription);
    return { success: true, data: enhancedText };
  } catch (error: any) {
    const appError = AppError.from(error, "Failed to enhance description");
    return { success: false, error: appError, message: appError.message };
  }
};
