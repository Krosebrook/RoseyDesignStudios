
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const payload = data ? { ...data } : undefined;
    
    // In a real production app, this would send to Datadog/Sentry
    const logFn = console[level] || console.log;
    
    if (level === 'error') {
      logFn(`[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`, payload);
    } else {
      // Keep console clean for non-errors in dev
      if (process.env.NODE_ENV === 'development') {
        logFn(`[${this.context}] ${message}`, payload || '');
      }
    }
  }

  info(message: string, data?: any) { this.log('info', message, data); }
  warn(message: string, data?: any) { this.log('warn', message, data); }
  error(message: string, data?: any) { this.log('error', message, data); }
  debug(message: string, data?: any) { this.log('debug', message, data); }
}

export const createLogger = (context: string) => new Logger(context);
