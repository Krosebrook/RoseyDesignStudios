
import { Modality } from "@google/genai";
import { AspectRatio } from "../../types";
import { cleanBase64, getMimeType } from "../../utils/image";
import { BaseService } from "./base";
import { AI_MODELS } from "../../data/constants";

/**
 * ImagingService handles all visual generation and editing.
 * Adheres to GenAI guidelines by prioritizing gemini-2.5-flash-image for editing/variation
 * and gemini-3-pro-image-preview for high-fidelity generation.
 */
export class ImagingService extends BaseService {
  
  /**
   * Generates images using gemini-2.5-flash-image (default model).
   */
  static async generateImage(prompt: string, aspectRatio: AspectRatio = '1:1'): Promise<string> {
    return this.execute("FlashImageGeneration", async (ai) => {
      const response = await ai.models.generateContent({
        model: AI_MODELS.FAST_IMAGE,
        contents: `${prompt}, photorealistic landscape design, architectural render style, 8k resolution`,
        config: {
          imageConfig: { aspectRatio }
        }
      });

      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (!part?.inlineData?.data) throw new Error("No image data returned from model");
      return `data:image/png;base64,${part.inlineData.data}`;
    });
  }

  /**
   * Alias for generating a plant variation using the standard flash image model.
   */
  static async generatePlantVariation(prompt: string): Promise<string> {
    return this.generateImage(prompt);
  }

  /**
   * Generates high-fidelity images using Gemini 3 Pro Image Preview.
   */
  static async generateHighQualityImage(prompt: string, aspectRatio: AspectRatio = '1:1', resolution: '1K' | '2K' | '4K' = '1K'): Promise<string> {
    return this.execute("ProImageGeneration", async (ai) => {
      const response = await ai.models.generateContent({
        model: AI_MODELS.PRO_IMAGE,
        contents: {
          parts: [{ text: `${prompt}, award winning garden photography, highly detailed, 8k, professional lighting` }]
        },
        config: {
          imageConfig: {
            aspectRatio,
            imageSize: resolution
          }
        },
      });

      // Gemini 3 Pro Image can return both text and image parts.
      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (!part?.inlineData?.data) throw new Error("No image part found in Pro Image response");
      return `data:image/png;base64,${part.inlineData.data}`;
    });
  }

  /**
   * Performs semantic edits on existing garden images.
   */
  static async editGardenImage(base64Image: string, prompt: string): Promise<string> {
    return this.execute("ImageEditing", async (ai) => {
      const data = cleanBase64(base64Image);
      const mimeType = getMimeType(base64Image);

      const response = await ai.models.generateContent({
        model: AI_MODELS.FAST_IMAGE,
        contents: {
          parts: [
            { inlineData: { data, mimeType } },
            { text: `Edit this garden image: ${prompt}. Maintain consistent lighting and perspective.` },
          ],
        },
        config: { 
          responseModalities: [Modality.IMAGE] 
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (!part?.inlineData?.data) throw new Error("No image part found in model response");
      
      return `data:image/png;base64,${part.inlineData.data}`;
    });
  }
}

export const generateImage = ImagingService.generateImage.bind(ImagingService);
export const generatePlantVariation = ImagingService.generatePlantVariation.bind(ImagingService);
export const generateHighQualityImage = ImagingService.generateHighQualityImage.bind(ImagingService);
export const editGardenImage = ImagingService.editGardenImage.bind(ImagingService);
