
import { getAI } from "./config";
import { cleanBase64, getMimeType } from "../../utils/image";
import { createLogger } from "../../utils/logger";
import { withRetry } from "../../utils/retry";
import { AppError } from "../../utils/errors";

const logger = createLogger('AI:Video');

export const generateGardenVideo = async (image: string, prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
  // 1. Check if user has a paid key selected (Mandatory for Veo)
  const hasKey = await (window as any).aistudio.hasSelectedApiKey();
  if (!hasKey) {
    throw new AppError("A paid API key is required for video generation.", "KEY_REQUIRED");
  }

  return withRetry(async () => {
    logger.info("Starting Veo Generation", { aspectRatio });
    // Always use a fresh instance to catch the latest injected key
    const ai = getAI();
    const cleanData = cleanBase64(image);
    const mimeType = getMimeType(image);

    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || "A cinematic garden walkthrough, flowers swaying gently in the breeze",
        image: { imageBytes: cleanData, mimeType },
        config: { 
          numberOfVideos: 1, 
          resolution: '720p', 
          aspectRatio 
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Video generation operation completed but returned no URI.");

      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!response.ok) throw new Error("Failed to download generated video file.");
      
      const videoBlob = await response.blob();
      return URL.createObjectURL(videoBlob);
    } catch (err: any) {
      // Handle the specific "Requested entity not found" error for keys
      if (err.message?.includes("Requested entity was not found")) {
        throw new AppError("Selected API key project not found. Please re-select your key.", "KEY_NOT_FOUND");
      }
      throw err;
    }
  }, { retries: 0 }); // Video generation is expensive and long-running; only retry on initialization
};
