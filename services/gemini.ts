import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from "../types";
import { GENERATION_ANGLES, GENERATION_LIGHTING, GENERATION_STYLES } from "../data/constants";

// Helper to clean base64 string (remove data URL prefix)
const cleanBase64 = (dataUrl: string): string => {
  return dataUrl.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

// Get MIME type from data URL
const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z]+);base64,/);
  return match ? match[1] : 'image/png';
};

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

// --- IMAGEN 4.0 GENERATION ---
export const generateHighQualityImage = async (prompt: string, aspectRatio: AspectRatio = '1:1'): Promise<string> => {
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
  if (base64ImageBytes) {
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  }
  
  throw new Error("Failed to generate image");
};

// --- GEMINI 2.5 FLASH IMAGE EDITING ---
export const editGardenImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAI();
  
  const cleanData = cleanBase64(base64Image);
  const mimeType = getMimeType(base64Image);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: cleanData,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData && part.inlineData.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }

  throw new Error("Failed to edit image");
};

// --- VEO VIDEO GENERATION ---
export const generateGardenVideo = async (image: string, prompt: string): Promise<string> => {
  const ai = getAI();
  const cleanData = cleanBase64(image);
  const mimeType = getMimeType(image);

  const aspectRatio = '16:9'; 

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || "Cinematic camera pan of this beautiful garden, wind blowing through leaves",
    image: {
      imageBytes: cleanData,
      mimeType: mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio,
    }
  });

  // Polling loop
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");

  // Fetch the actual video bytes
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};

// --- GEMINI 3 PRO ANALYSIS ---
export const analyzeGardenImage = async (image: string, question: string): Promise<string> => {
  const ai = getAI();
  const cleanData = cleanBase64(image);
  const mimeType = getMimeType(image);

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: cleanData,
            mimeType: mimeType,
          }
        },
        { text: question }
      ]
    }
  });

  return response.text || "I couldn't analyze that image.";
};

// --- SEARCH GROUNDING (FLASH) ---
export const searchGardeningTips = async (query: string): Promise<{text: string, sources: any[]}> => {
  const ai = getAI();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      tools: [{googleSearch: {}}],
    },
  });

  return {
    text: response.text || "No results found.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

// --- FAST RESPONSES (FLASH LITE) ---
export const getQuickTip = async (): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: 'Give me one short, unique, helpful gardening tip for home gardeners. Under 20 words.',
  });
  return response.text || "Water your plants early in the morning.";
};

// --- SEASONAL TIPS (FLASH LITE) ---
export const getSeasonalGardeningTip = async (season: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite-latest',
    contents: `Provide a single, helpful, and interesting gardening tip for the ${season} season. Keep it under 25 words. Focus on what to plant or care for.`,
  });
  return response.text || `It's a great time to get out in the garden and enjoy the ${season} weather!`;
};

// --- PLANT UTILS ---

export const generatePlantImage = async (
  plantName: string, 
  description: string,
  style?: string,
  lighting?: string
): Promise<string> => {
  const ai = getAI();
  
  const randomAngle = GENERATION_ANGLES[Math.floor(Math.random() * GENERATION_ANGLES.length)];
  const selectedLighting = lighting || GENERATION_LIGHTING[Math.floor(Math.random() * GENERATION_LIGHTING.length)];
  const selectedStyle = style || GENERATION_STYLES[Math.floor(Math.random() * GENERATION_STYLES.length)];

  const prompt = `Create a ${selectedStyle} of ${plantName}. 
  Context: ${description}. 
  Composition: ${randomAngle}. 
  Lighting: ${selectedLighting}. 
  Ensure the plant is the main subject. High quality, artistic composition.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { responseModalities: [Modality.IMAGE] },
  });

  const part = response.candidates?.[0]?.content?.parts?.[0];
  if (part && part.inlineData && part.inlineData.data) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
  
  throw new Error("Failed to generate plant image");
};

export const generatePlantDescription = async (plantName: string, currentDescription: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Write a captivating description for ${plantName}. Base: "${currentDescription}". Focus on aesthetics and care. Under 80 words.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [{ text: prompt }] }
  });

  return response.text || currentDescription;
};

export const getAIClient = () => getAI();