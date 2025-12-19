
import { createLogger } from './logger';

const logger = createLogger('RetryUtil');

interface RetryOptions {
  retries?: number;
  backoff?: number;
  factor?: number;
  jitter?: boolean;
}

/**
 * Higher-order function to wrap async operations with exponential backoff.
 */
export async function withRetry<T>(
  fn: () => Promise<T>, 
  options: RetryOptions = {}
): Promise<T> {
  const { retries = 3, backoff = 1000, factor = 2, jitter = true } = options;
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      
      const isRetryable = attempt <= retries && 
        !error.message?.includes('API key not valid') && 
        !error.message?.includes('safety');

      if (!isRetryable) {
        throw error;
      }

      // Calculate wait time with optional jitter
      let delay = backoff * Math.pow(factor, attempt - 1);
      if (jitter) {
        delay = delay * (0.8 + Math.random() * 0.4);
      }

      logger.warn(`Attempt ${attempt}/${retries} failed. Retrying in ${Math.round(delay)}ms...`, { error: error.message });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
