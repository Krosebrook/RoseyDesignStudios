
import { getAI } from "./config";
import { createLogger } from "../../utils/logger";
import { GENERATION_ANGLES, GENERATION_LIGHTING } from "../../data/constants";

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
      model: 'gemini-2.5-flash-lite-latest',
      contents: `Provide a single, helpful gardening tip for ${season} ${styleContext}. Under 25 words.`,
    });
    return response.text || `Enjoy your garden this ${season}!`;
  } catch (e) {
    logger.warn("Failed to get seasonal tip", e);
    return `Enjoy your garden this ${season}!`;
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
  
  // Construct a richer context for the reasoning model
  const envContext = [
    sunlight ? `Sunlight: ${sunlight}` : '',
    water ? `Water Needs: ${water}` : '',
    seasons ? `Seasons: ${seasons.join(', ')}` : ''
  ].filter(Boolean).join('. ');

  const prompt = `
    Role: Creative Director for Botanical Photography.
    Task: Plan the composition for a unique image of "${name}".
    Context: ${description}
    Environmental Factors: ${envContext}
    
    User Preferences:
    - Style: ${userStyle || "Decide best style based on plant context"}
    - Lighting: ${userLighting || "Decide best lighting based on plant context (e.g., Shade plants should not have harsh direct sun)"}

    Analyze the plant's features and its environmental needs to determine the absolute best Camera Angle and Lighting to showcase it uniquely.
    If the plant is a seasonal bloomer, ensure the lighting reflects that season.
    
    Output JSON ONLY:
    {
      "angle": "specific camera angle string (e.g. 'Low angle looking up' for trees, 'Macro top-down' for groundcover)",
      "lighting": "specific lighting condition string (e.g. 'Dappled sunlight' for ferns, 'Golden hour' for sun-lovers)",
      "styleModifier": "additional artistic keywords to mix with base style to enhance the vibe",
      "reasoning": "brief explanation why this composition fits this plant's nature"
    }
  `;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
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
      reasoning: "Fallback randomization."
    };
  }
};

export const generatePlantDescription = async (prompt: string, currentDescription: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] }
        });
        return response.text || currentDescription;
    } catch (e) {
        logger.error("Description gen failed", e);
        return currentDescription;
    }
}
