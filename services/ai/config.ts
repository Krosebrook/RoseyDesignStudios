
import { GoogleGenAI } from "@google/genai";
import { AppError } from "../../utils/errors";

let clientInstance: GoogleGenAI | null = null;

export const getAI = (): GoogleGenAI => {
  if (clientInstance) return clientInstance;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new AppError("API Key is missing from environment", "AUTH_ERROR");
  }

  clientInstance = new GoogleGenAI({ apiKey });
  return clientInstance;
};
