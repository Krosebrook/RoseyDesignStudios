
import { getAI } from "./config";
import { cleanBase64, getMimeType } from "../../utils/image";
import { createLogger } from "../../utils/logger";
import { withRetry } from "../../utils/retry";

const logger = createLogger('AI:Video');

export const generateGardenVideo = async (image: string, prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
  return withRetry(async () => {
    logger.info("Starting Video Generation", { aspectRatio });
    const ai = getAI();
    const cleanData = cleanBase64(image);
    const mimeType = getMimeType(image);

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || "Cinematic camera pan of this beautiful garden, wind blowing through leaves",
      image: { imageBytes: cleanData, mimeType },
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
    });

    logger.debug("Video operation started", { operationName: operation.name });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed");

    // Fetch the raw video data to create a local blob URL
    // NOTE: We do not use retry on the fetch itself here to avoid re-downloading large files unnecessarily, 
    // but the overall wrapper handles initialization failures.
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
  }, { retries: 1 }); // Fewer retries for expensive video operations
};
