
import { getAI } from "./config";
import { cleanBase64, getMimeType } from "../../utils/image";
import { createLogger } from "../../utils/logger";
import { withRetry } from "../../utils/retry";
import { AppError } from "../../utils/errors";

const logger = createLogger('AI:Video');

/**
 * Orchestrates Veo video generation.
 * Strictly implements the project selection check and billing requirements.
 */
export const generateGardenVideo = async (image: string, prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
  // 1. Mandatory Pre-flight check for Paid API Key (Veo requirement)
  const hasKey = await (window as any).aistudio.hasSelectedApiKey();
  if (!hasKey) {
    throw new AppError("A paid API key from a billing-enabled project is required.", "KEY_REQUIRED");
  }

  // 2. Execute generation with specialized error handling for keys
  return withRetry(async () => {
    logger.info("Executing Veo Video Generation", { aspectRatio });
    
    // Fresh AI instance ensures current session key is used
    const ai = getAI();
    const data = cleanBase64(image);
    const mimeType = getMimeType(image);

    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || "A peaceful garden scene where flowers sway gently in the breeze.",
        image: { imageBytes: data, mimeType },
        config: { 
          numberOfVideos: 1, 
          resolution: '720p', 
          aspectRatio 
        }
      });

      // Poll for completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Video generation failed: No URI returned.");

      // Fetch binary content with current key
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err: any) {
      // 3. Special handling for project selection errors
      if (err.message?.includes("Requested entity was not found")) {
        throw new AppError("API key project error. Please re-select your paid project.", "KEY_NOT_FOUND");
      }
      throw err;
    }
  }, { retries: 0 }); // Veo is long-running; don't auto-retry the full operation
};
