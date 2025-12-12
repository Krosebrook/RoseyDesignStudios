
import { createLogger } from './logger';

const logger = createLogger('RetryUtil');

interface RetryOptions {
  retries?: number;
  backoff?: number;
  factor?: number;
}

export async function withRetry<T>(
  fn: () => Promise<T>, 
  options: RetryOptions = {}
): Promise<T> {
  const { retries = 3, backoff = 1000, factor = 2 } = options;
  let attempt = 0;

  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      if (attempt > retries) {
        throw error;
      }

      // Don't retry client-side validation errors (4xx mostly, but here generalized)
      // In a real fetch wrapper, checking status codes 400-499 would be here.
      if (error.message && error.message.includes('API Key not found')) {
        throw error;
      }

      const delay = backoff * Math.pow(factor, attempt - 1);
      logger.warn(`Operation failed, retrying in ${delay}ms (Attempt ${attempt}/${retries})`, { error: error.message });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Unreachable');
}
