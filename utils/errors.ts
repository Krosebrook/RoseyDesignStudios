

export class AppError extends Error {
  public readonly code: string;
  public readonly originalError?: any;
  public readonly isOperational: boolean;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', originalError?: any, isOperational: boolean = true) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.originalError = originalError;
    this.isOperational = isOperational;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, AppError);
    }
  }

  static from(error: any, fallbackMessage: string = 'An unexpected error occurred'): AppError {
    if (error instanceof AppError) return error;
    
    const message = error instanceof Error ? error.message : fallbackMessage;
    return new AppError(message, 'INTERNAL_ERROR', error);
  }
}