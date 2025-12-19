
import { GoogleGenAI } from "@google/genai";
import { AppError } from "../../utils/errors";

/**
 * Factory for the GenAI client.
 * For Veo/Imagen 3 models, we re-instantiate to ensure we have the most 
 * up-to-date key from the selection dialog.
 */
export const getAI = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new AppError("API Key is missing. Please ensure your environment is configured correctly.", "AUTH_ERROR");
  }
  return new GoogleGenAI({ apiKey });
};
