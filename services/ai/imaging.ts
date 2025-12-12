
import { Modality } from "@google/genai";
import { getAI } from "./config";
import { AspectRatio } from "../../types";
import { cleanBase64, getMimeType } from "../../utils/image";
import { createLogger } from "../../utils/logger";
import { withRetry } from "../../utils/retry";

const logger = createLogger('AI:Imaging');

export const generateHighQualityImage = async (prompt: string, aspectRatio: AspectRatio = '1:1'): Promise<string> => {
  return withRetry(async () => {
    logger.info("Generating HQ Image", { prompt, aspectRatio });
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
  });
};

export const editGardenImage = async (base64Image: string, prompt: string): Promise<string> => {
  return withRetry(async () => {
    logger.info("Editing Image", { prompt });
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
  });
};

export const generatePlantImage = async (
  prompt: string,
): Promise<string> => {
  return withRetry(async () => {
    logger.info("Generating Plant Variation");
    const ai = getAI();
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { responseModalities: [Modality.IMAGE] },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (!part?.inlineData?.data) throw new Error("No image data returned from generation model");
    
    return `data:image/png;base64,${part.inlineData.data}`;
  });
};
