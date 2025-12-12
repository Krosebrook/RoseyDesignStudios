
import { getAI } from "./config";
import { cleanBase64, getMimeType } from "../../utils/image";
import { createLogger } from "../../utils/logger";
import { withRetry } from "../../utils/retry";

const logger = createLogger('AI:Analysis');

export const analyzeGardenImage = async (image: string, question: string): Promise<string> => {
  return withRetry(async () => {
    logger.info("Analyzing Image", { questionLength: question.length });
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
  });
};

export const searchGardeningTips = async (query: string): Promise<{text: string, sources: any[]}> => {
  return withRetry(async () => {
    logger.info("Searching", { query });
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
  });
};
