
import { Modality } from "@google/genai";
import { AspectRatio } from "../../types";
import { cleanBase64, getMimeType } from "../../utils/image";
import { BaseService } from "./base";

export class ImagingService extends BaseService {
  /**
   * Generates images using gemini-2.5-flash-image by default as per guidelines.
   * Faster and supports more flexible prompting.
   */
  static async generateImage(prompt: string, aspectRatio: AspectRatio = '1:1'): Promise<string> {
    return this.execute("FlashImageGeneration", async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: `${prompt}, photorealistic garden design, high resolution`,
        config: {
          imageConfig: { aspectRatio }
        }
      });

      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (!part?.inlineData?.data) throw new Error("No image data returned from model");
      return `data:image/png;base64,${part.inlineData.data}`;
    });
  }

  // Added missing method called by WorkflowService
  /**
   * Alias for generating a plant variation using the standard flash image model.
   */
  static async generatePlantVariation(prompt: string): Promise<string> {
    return this.generateImage(prompt);
  }

  /**
   * Generates high-fidelity images using Imagen 4.0 for explicit quality requests.
   */
  static async generateHighQualityImage(prompt: string, aspectRatio: AspectRatio = '1:1'): Promise<string> {
    return this.execute("ImagenGeneration", async (ai) => {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `${prompt}, award winning landscape design, highly detailed, 8k`,
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
   * Performs semantic edits on existing garden images using Gemini 2.5 Flash Image.
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
            { text: prompt },
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
