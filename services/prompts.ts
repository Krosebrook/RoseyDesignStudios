
import { Plant, GardenStyle, Season } from "../types";

/**
 * PROMPT ENGINEERING SERVICE
 * Centralizes all LLM prompt construction to ensure consistency and ease of tuning.
 */

export const PromptService = {
  
  /**
   * Constructs a high-fidelity image generation prompt for a specific plant
   */
  buildPlantGenerationPrompt: (
    plant: Plant, 
    context: {
      style?: string;
      angle?: string;
      lighting?: string;
      seed: number;
    }
  ): string => {
    const envDetails = [
      plant.sunlight ? `Sunlight: ${plant.sunlight}` : '',
      plant.seasons ? `Active Seasons: ${plant.seasons.join(', ')}` : '',
      plant.styles ? `Garden Styles: ${plant.styles.join(', ')}` : ''
    ].filter(Boolean).join('. ');

    // Chain-of-Thought injected into the prompt context
    return `
      Create a distinctly unique high-resolution image of ${plant.name} (${plant.scientificName}).
      Context: ${plant.description}
      Environment Details: ${envDetails}
      
      CREATIVE DIRECTION (Strictly Follow):
      - Perspective: ${context.angle || 'Eye-level botanical portrait'}
      - Lighting: ${context.lighting || 'Natural, diffused daylight'}
      - Artistic Style: ${context.style || 'Photorealistic 8k'}
      
      REQUIREMENTS:
      - Focus purely on the plant aesthetics in its natural or designed setting.
      - High detail, 8k resolution, depth of field.
      - Random Noise Seed: ${context.seed}
    `;
  },

  /**
   * Constructs a system prompt for the Plant Doctor/Analysis feature
   */
  buildAnalysisPrompt: (question: string): string => {
    return `
      Role: Expert Botanist and Landscape Architect.
      Task: Analyze the provided garden image and answer the user's request.
      
      User Request: "${question}"
      
      Guidelines:
      1. If identifying plants, provide Common Name, Scientific Name, and key care tips.
      2. If diagnosing issues, look for discoloration, spots, or wilting. Suggest organic and chemical treatments.
      3. If providing design advice, consider the existing style and suggest complementary additions.
      4. Be concise, professional, and encouraging.
    `;
  },

  /**
   * Constructs the prompt for the "Magic Edit" feature
   */
  buildEditPrompt: (userInstruction: string, markers: { name: string, instruction: string }[]): string => {
    // If we have markers, we weave them into the prompt to help the model understand spatial intent
    let spatialContext = "";
    if (markers.length > 0) {
      spatialContext = " Context from user placement: " + markers.map(m => `${m.instruction}`).join(". ");
    }

    return `
      ${userInstruction}
      ${spatialContext}
      
      Constraint: Maintain the photorealism and perspective of the original image. 
      Only modify the requested areas. Blend lighting and shadows perfectly.
    `;
  },

  /**
   * Constructs the motion prompt for Veo video generation
   */
  buildVideoPrompt: (userPrompt: string): string => {
    return userPrompt || "Cinematic slow-motion camera pan of this beautiful garden, gentle wind blowing through leaves, dynamic lighting changes, 4k resolution.";
  },

  /**
   * Constructs the prompt for plant description enhancement
   */
  buildDescriptionEnhancementPrompt: (name: string, currentDesc: string): string => {
    return `
      Write a detailed, evocative, and expert description for the plant "${name}". 
      Original Data: "${currentDesc}".
      
      Objectives:
      - Highlight aesthetic qualities (texture, color, bloom shape).
      - Mention ideal landscape applications (e.g., "perfect for borders", "excellent groundcover").
      - Keep it under 80 words.
      - Tone: Sophisticated yet accessible.
    `;
  },

  /**
   * Constructs the COT (Chain of Thought) prompt for composition planning
   */
  buildCompositionPlanPrompt: (
    name: string, 
    description: string, 
    envContext: string,
    userPreferences: { style?: string, lighting?: string }
  ): string => {
    return `
      Role: Creative Director for Botanical Photography.
      Task: Plan the composition for a unique image of "${name}".
      Context: ${description}
      Environmental Factors: ${envContext}
      
      User Preferences:
      - Style: ${userPreferences.style || "Decide best style based on plant context"}
      - Lighting: ${userPreferences.lighting || "Decide best lighting based on plant context"}

      Analyze the plant's features to determine the absolute best Camera Angle and Lighting.
      
      Output JSON ONLY:
      {
        "angle": "specific camera angle string",
        "lighting": "specific lighting condition string",
        "styleModifier": "additional artistic keywords",
        "reasoning": "brief explanation"
      }
    `;
  }
};
