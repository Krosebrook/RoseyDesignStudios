
import { Modality } from "@google/genai";
import { AspectRatio } from "../../types";
import { cleanBase64, getMimeType } from "../../utils/image";
import { BaseService } from "./base";

/**
 * ImagingService handles all visual generation and editing.
 * Adheres to GenAI guidelines by prioritizing gemini-2.5-flash-image for editing/variation
 * and imagen-4.0-generate-001 for explicit high-fidelity generation.
 */
export class ImagingService extends BaseService {
  
  /**
   * Generates images using gemini-2.5-flash-image (default model).
   */
  static async generateImage(prompt: string, aspectRatio: AspectRatio = '1:1'): Promise<string> {
    return this.execute("FlashImageGeneration", async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
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
    // Variations are best handled by the fast, creative flash-image model
    return this.generateImage(prompt);
  }

  /**
   * Generates high-fidelity images using Imagen 4.0.
   */
  static async generateHighQualityImage(prompt: string, aspectRatio: AspectRatio = '1:1'): Promise<string> {
    return this.execute("ImagenGeneration", async (ai) => {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `${prompt}, award winning garden photography, highly detailed, 8k, professional lighting`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio,
        },
      });

      const bytes = response.generatedImages?.[0]?.image?.imageBytes;
      if (!bytes) throw new Error("No image bytes returned from Imagen");
      return `data:image/jpeg;base64,${bytes}`;
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
        model: 'gemini-2.5-flash-image',
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
