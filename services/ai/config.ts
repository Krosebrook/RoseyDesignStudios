
import { GoogleGenAI } from "@google/genai";
import { AppError } from "../../utils/errors";

class AIClientFactory {
  private static instance: GoogleGenAI | null = null;

  public static getInstance(): GoogleGenAI {
    if (this.instance) {
      return this.instance;
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new AppError("API Key is missing from environment variables.", "AUTH_ERROR");
    }

    try {
      this.instance = new GoogleGenAI({ apiKey });
      return this.instance;
    } catch (error) {
      throw new AppError("Failed to initialize Google GenAI client.", "INIT_ERROR", error);
    }
  }
}

export const getAI = (): GoogleGenAI => AIClientFactory.getInstance();
