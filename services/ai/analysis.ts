
import { getAI } from "./config";
import { cleanBase64, getMimeType } from "../../utils/image";
import { createLogger } from "../../utils/logger";
import { withRetry } from "../../utils/retry";

const logger = createLogger('AI:Analysis');

/**
 * High-quality vision analysis for identification and diagnosis.
 */
export const analyzeGardenImage = async (image: string, question: string): Promise<string> => {
  return withRetry(async () => {
    logger.info("Analyzing with Vision AI", { questionLength: question.length });
    const ai = getAI();
    const cleanData = cleanBase64(image);
    const mimeType = getMimeType(image);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: cleanData, mimeType } },
          { text: question }
        ]
      },
      config: {
        systemInstruction: "You are an expert horticulturalist. Analyze garden photos with high precision. Identify plant species, health issues, and aesthetic layouts."
      }
    });

    return response.text || "I'm sorry, I couldn't process the details of that image.";
  });
};

/**
 * Search grounding for current events or complex horticultural advice.
 */
export const searchGardeningTips = async (query: string): Promise<{text: string, sources: any[]}> => {
  return withRetry(async () => {
    logger.info("Performing Grounded Search", { query });
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: { tools: [{ googleSearch: {} }] },
    });

    return {
      text: response.text || "I found no specific results for your query.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  });
};
