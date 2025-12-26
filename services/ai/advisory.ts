
import { getAI } from "./config";
import { createLogger } from "../../utils/logger";
import { PromptService } from "../prompts";
import { GENERATION_ANGLES, GENERATION_LIGHTING, AI_MODELS } from "../../data/constants";
// Fix: Import Type from @google/genai instead of local types
import { MaintenanceReport } from "../../types";
import { Type } from "@google/genai";

const logger = createLogger('AI:Advisory');

export interface CreativePlan {
  angle: string;
  lighting: string;
  styleModifier: string;
  reasoning: string;
}

export const getSeasonalGardeningTip = async (season: string, style?: string): Promise<string> => {
  try {
    const ai = getAI();
    const styleContext = style ? `for a ${style} style garden` : 'for home gardeners';
    const response = await ai.models.generateContent({
      model: AI_MODELS.BASIC_TEXT,
      contents: `Provide a single, helpful gardening tip for ${season} ${styleContext}. Under 25 words.`,
    });
    return response.text || `Enjoy your garden this ${season}!`;
  } catch (e) {
    logger.warn("Failed to get seasonal tip", e);
    return `Enjoy your garden this ${season}!`;
  }
};

/**
 * Generates a deep-reasoned maintenance plan using Gemini 3 Pro with thinking.
 */
export const generateMaintenanceReport = async (inventory: any[]): Promise<MaintenanceReport> => {
  const ai = getAI();
  const plantList = inventory.map(i => `${i.count}x ${i.plant.name} (${i.plant.scientificName}) - ${i.plant.water} water, ${i.plant.sunlight} sunlight`).join('\n');
  
  const prompt = `Analyze this garden inventory and create a master maintenance schedule:
  ${plantList}
  
  Please provide:
  1. Seasonal high-level advice.
  2. A list of specific recurring tasks (pruning, feeding, etc.).
  3. A consolidated watering strategy.`;

  try {
    const response = await ai.models.generateContent({
      model: AI_MODELS.COMPLEX_TEXT,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seasonalAdvice: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
                },
                required: ["task", "frequency", "description", "priority"]
              }
            },
            waterSchedule: { type: Type.STRING }
          },
          required: ["seasonalAdvice", "tasks", "waterSchedule"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      ...data,
      generatedAt: Date.now()
    };
  } catch (e) {
    logger.error("Maintenance report generation failed", e);
    throw e;
  }
};

export const planImageComposition = async (
  name: string, 
  description: string, 
  userStyle?: string, 
  userLighting?: string,
  sunlight?: string,
  water?: string,
  seasons?: string[]
): Promise<CreativePlan> => {
  const ai = getAI();
  
  const envContext = [
    sunlight ? `Sunlight: ${sunlight}` : '',
    water ? `Water Needs: ${water}` : '',
    seasons ? `Seasons: ${seasons.join(', ')}` : ''
  ].filter(Boolean).join('. ');

  const prompt = PromptService.buildCompositionPlanPrompt(
    name, 
    description, 
    envContext, 
    { style: userStyle, lighting: userLighting }
  );

  try {
    const result = await ai.models.generateContent({
      model: AI_MODELS.BASIC_TEXT,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const text = result.text;
    if (!text) throw new Error("No plan generated");
    
    const plan = JSON.parse(text) as CreativePlan;
    if (!plan.angle || !plan.lighting) throw new Error("Invalid plan structure");
    
    return plan;
  } catch (e) {
    logger.warn("Planning failed, falling back to random", e);
    return {
      angle: GENERATION_ANGLES[Math.floor(Math.random() * GENERATION_ANGLES.length)],
      lighting: userLighting || GENERATION_LIGHTING[Math.floor(Math.random() * GENERATION_LIGHTING.length)],
      styleModifier: "high detail",
      reasoning: "Fallback randomization due to AI timeout."
    };
  }
};

export const generatePlantDescription = async (prompt: string, currentDescription: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: AI_MODELS.BASIC_TEXT,
            contents: { parts: [{ text: prompt }] }
        });
        return response.text || currentDescription;
    } catch (e) {
        logger.error("Description gen failed", e);
        return currentDescription;
    }
}
