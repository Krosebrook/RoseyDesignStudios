
import { createLogger } from "../../utils/logger";
import { withRetry } from "../../utils/retry";
import { AppError } from "../../utils/errors";
import { getAI } from "./config";

const logger = createLogger('AI:BaseService');

/**
 * Core service layer providing resilient AI execution.
 * Standardizes logging, instrumentation, and error normalization.
 */
export class BaseService {
  /**
   * Orchestrates an AI operation with automatic retry logic and normalized error handling.
   */
  protected static async execute<T>(
    operationName: string,
    task: (ai: ReturnType<typeof getAI>) => Promise<T>,
    retryOptions = { retries: 2, backoff: 1500, factor: 2 }
  ): Promise<T> {
    const ai = getAI();
    
    return withRetry(async () => {
      try {
        logger.debug(`Starting AI Operation: ${operationName}`);
        const result = await task(ai);
        logger.debug(`Completed AI Operation: ${operationName}`);
        return result;
      } catch (error: any) {
        // Standardize GenAI specific errors
        const message = error.message || "";
        
        if (message.includes("API key not valid")) {
          throw new AppError("Invalid API credentials. Contact support.", "AUTH_ERROR", error);
        }
        
        if (message.includes("quota")) {
          throw new AppError("API quota exceeded. Please wait a moment.", "QUOTA_ERROR", error);
        }

        if (message.includes("Requested entity was not found")) {
          throw new AppError("API project or key not found. Please re-select your key.", "KEY_NOT_FOUND", error);
        }
        
        logger.error(`AI failure during ${operationName}: ${message}`, { error });
        throw AppError.from(error, `Service failure: ${operationName}`);
      }
    }, retryOptions);
  }
}
