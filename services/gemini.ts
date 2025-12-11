
import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio, Result } from "../types";
import { GENERATION_ANGLES, GENERATION_LIGHTING, GENERATION_STYLES, buildPlantDescriptionPrompt } from "../data/constants";
import { cleanBase64, getMimeType } from "../utils/image";

// Singleton Client
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

// Helper for safe execution
async function safeGenAI<T>(operation: () => Promise<T>, fallbackMessage = "AI Operation Failed"): Promise<Result<T>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error: any) {
    console.error("GenAI Error:", error);
    return { success: false, error, message: error.message || fallbackMessage };
  }
}

// --- IMAGEN 4.0 GENERATION ---
export const generateHighQualityImage = async (prompt: string, aspectRatio: AspectRatio = '1:1'): Promise<Result<string>> => {
  return safeGenAI(async () => {
    const ai = getAI();
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt + " photorealistic, award winning garden design, 8k",
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64ImageBytes) throw new Error("No image returned from model");
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  }, "Failed to generate image");
};

// --- GEMINI 2.5 FLASH IMAGE EDITING ---
export const editGardenImage = async (base64Image: string, prompt: string): Promise<Result<string>> => {
  return safeGenAI(async () => {
    const ai = getAI();
    const cleanData = cleanBase64(base64Image);
    const mimeType = getMimeType(base64Image);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: cleanData, mimeType } },
          { text: prompt },
        ],
      },
      config: { responseModalities: [Modality.IMAGE] },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (!part?.inlineData?.data) throw new Error("No edited image returned");
    
    return `data:image/png;base64,${part.inlineData.data}`;
  }, "Failed to edit image");
};

// --- VEO VIDEO GENERATION ---
export const generateGardenVideo = async (image: string, prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<Result<string>> => {
  return safeGenAI(async () => {
    const ai = getAI();
    const cleanData = cleanBase64(image);
    const mimeType = getMimeType(image);

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || "Cinematic camera pan of this beautiful garden, wind blowing through leaves",
      image: { imageBytes: cleanData, mimeType },
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed");

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
  }, "Failed to generate video");
};

// --- GEMINI 3 PRO ANALYSIS ---
export const analyzeGardenImage = async (image: string, question: string): Promise<Result<string>> => {
  return safeGenAI(async () => {
    const ai = getAI();
    const cleanData = cleanBase64(image);
    const mimeType = getMimeType(image);

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: cleanData, mimeType } },
          { text: question }
        ]
      }
    });

    return response.text || "I couldn't analyze that image.";
  }, "Analysis failed");
};

// --- SEARCH GROUNDING ---
export const searchGardeningTips = async (query: string): Promise<Result<{text: string, sources: any[]}>> => {
  return safeGenAI(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: { tools: [{googleSearch: {}}] },
    });

    return {
      text: response.text || "No results found.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }, "Search failed");
};

// --- SEASONAL TIPS ---
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
    return `Enjoy your garden this ${season}!`;
  }
};

// --- CHAIN-OF-THOUGHT PLANT GENERATION PIPELINE ---

interface CreativePlan {
  angle: string;
  lighting: string;
  styleModifier: string;
  reasoning: string;
}

// Step 1: Analyze & Plan (The "Creative Director")
const planImageComposition = async (plantName: string, description: string, userStyle?: string, userLighting?: string): Promise<CreativePlan> => {
  // If user provided specifics, we respect them but still let AI refine the nuance.
  // If not, AI acts as full creative director to find the best angle/lighting for THIS specific plant.
  
  const ai = getAI();
  const prompt = `
    Role: Creative Director for Botanical Photography.
    Task: Plan the composition for a unique image of "${plantName}".
    Context: ${description}
    
    User Preferences:
    - Style: ${userStyle || "Decide best style based on plant context"}
    - Lighting: ${userLighting || "Decide best lighting based on plant context"}

    Analyze the plant's features (height, texture, color, habitat) and determine the absolute best Camera Angle and Lighting to showcase it uniquely.
    
    Output JSON ONLY:
    {
      "angle": "specific camera angle string (e.g. 'Low angle looking up' for trees, 'Macro top-down' for groundcover)",
      "lighting": "specific lighting condition string (e.g. 'Dappled sunlight' for ferns)",
      "styleModifier": "additional artistic keywords to mix with base style to enhance the vibe",
      "reasoning": "brief explanation why this composition fits this plant"
    }
  `;

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest', // Fast model for planning
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const text = result.text;
    if (!text) throw new Error("No plan generated");
    
    // Parse structured reasoning
    const plan = JSON.parse(text) as CreativePlan;
    
    // Basic validation of structure
    if (!plan.angle || !plan.lighting) throw new Error("Invalid plan structure");
    
    return plan;
  } catch (e) {
    console.warn("Planning step failed, falling back to randomized logic:", e);
    // Fallback logic to ensure image generation never fails completely
    return {
      angle: GENERATION_ANGLES[Math.floor(Math.random() * GENERATION_ANGLES.length)],
      lighting: userLighting || GENERATION_LIGHTING[Math.floor(Math.random() * GENERATION_LIGHTING.length)],
      styleModifier: "high detail",
      reasoning: "Fallback randomization due to planning service interruption."
    };
  }
};

// Step 2: Execute Generation (The "Artist")
export const generatePlantImage = async (
  plantName: string, 
  description: string,
  style?: string,
  lighting?: string
): Promise<Result<string>> => {
  return safeGenAI(async () => {
    const ai = getAI();
    
    // 1. Run CoT Planning Step
    const plan = await planImageComposition(plantName, description, style, lighting);
    console.log(`[CoT] Image Plan for ${plantName}:`, plan); // Observability

    // 2. Construct Final Prompt based on Reasoning
    // If user didn't specify style, we mix the plan's modifier with a random base style for variety
    const baseStyle = style || GENERATION_STYLES[Math.floor(Math.random() * GENERATION_STYLES.length)];
    const variationSeed = Math.floor(Math.random() * 999999999);
    
    const finalPrompt = `
      Create a distinctly unique high-resolution image of ${plantName}.
      Context: ${description}
      
      CREATIVE DIRECTION (Strictly Follow):
      - Perspective: ${plan.angle}
      - Lighting: ${plan.lighting}
      - Artistic Style: ${baseStyle} mixed with ${plan.styleModifier}
      - Composition Reasoning: ${plan.reasoning}
      
      REQUIREMENTS:
      - Focus purely on the plant aesthetics.
      - High detail, 8k resolution.
      - Make it look distinctively different from standard stock photos.
      - Use the random seed to vary composition, zoom level, and background blur.
      - Random Noise Seed: ${variationSeed}
    `;

    // 3. Execute Image Generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: finalPrompt }] },
      config: { responseModalities: [Modality.IMAGE] },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (!part?.inlineData?.data) throw new Error("No image data returned from generation model");
    
    return `data:image/png;base64,${part.inlineData.data}`;
  }, "Failed to generate plant image");
};

export const generatePlantDescription = async (plantName: string, currentDescription: string): Promise<Result<string>> => {
  return safeGenAI(async () => {
    const ai = getAI();
    const prompt = buildPlantDescriptionPrompt(plantName, currentDescription);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] }
    });
    return response.text || currentDescription;
  }, "Failed to enhance description");
};

export const getAIClient = getAI;
