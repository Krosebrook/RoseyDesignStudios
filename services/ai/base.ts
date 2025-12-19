
import { createLogger } from "../../utils/logger";
import { withRetry } from "../../utils/retry";
import { AppError } from "../../utils/errors";
import { getAI } from "./config";

const logger = createLogger('AI:BaseService');

/**
 * Production-grade base service for AI operations.
 * Handles cross-cutting concerns: logging, retries, and error transformation.
 */
export class BaseService {
  protected static async execute<T>(
    operationName: string,
    task: (ai: ReturnType<typeof getAI>) => Promise<T>,
    retryOptions = { retries: 2, backoff: 1000 }
  ): Promise<T> {
    const ai = getAI();
    
    return withRetry(async () => {
      try {
        logger.debug(`Executing AI Operation: ${operationName}`);
        return await task(ai);
      } catch (error: any) {
        // Intercept and transform specific API errors
        if (error.message?.includes("API key not valid")) {
          throw new AppError("Invalid AI credentials. Please check system configuration.", "AUTH_ERROR", error);
        }
        if (error.message?.includes("quota")) {
          throw new AppError("AI service rate limit exceeded. Please try again in a moment.", "QUOTA_ERROR", error);
        }
        
        logger.error(`AI Operation Failed: ${operationName}`, { error: error.message });
        throw AppError.from(error, `Service failure during ${operationName}`);
      }
    }, retryOptions);
  }
}
