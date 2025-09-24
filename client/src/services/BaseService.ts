import { IService } from './types';

/**
 * Base service class that provides common functionality
 * All services should extend this class
 */
export abstract class BaseService implements IService {
  public readonly name: string;
  protected initialized: boolean = false;
  protected destroyed: boolean = false;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Initialize the service
   * Override this method in derived classes
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn(`Service '${this.name}' is already initialized`);
      return;
    }

    try {
      await this.onInitialize();
      this.initialized = true;
      console.log(`Service '${this.name}' initialized successfully`);
    } catch (error) {
      console.error(`Failed to initialize service '${this.name}':`, error);
      throw error;
    }
  }

  /**
   * Destroy the service
   * Override this method in derived classes
   */
  async destroy(): Promise<void> {
    if (this.destroyed) {
      console.warn(`Service '${this.name}' is already destroyed`);
      return;
    }

    try {
      await this.onDestroy();
      this.destroyed = true;
      this.initialized = false;
      console.log(`Service '${this.name}' destroyed successfully`);
    } catch (error) {
      console.error(`Failed to destroy service '${this.name}':`, error);
      throw error;
    }
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.initialized && !this.destroyed;
  }

  /**
   * Check if service is destroyed
   */
  isDestroyed(): boolean {
    return this.destroyed;
  }

  /**
   * Validate that service is ready for use
   */
  protected validateReady(): void {
    if (!this.isInitialized()) {
      throw new Error(`Service '${this.name}' is not initialized`);
    }
  }

  /**
   * Abstract method to be implemented by derived classes
   * Called during service initialization
   */
  protected abstract onInitialize(): Promise<void>;

  /**
   * Abstract method to be implemented by derived classes
   * Called during service destruction
   */
  protected abstract onDestroy(): Promise<void>;

  /**
   * Log a message with service context
   */
  protected log(level: 'info' | 'warn' | 'error', message: string, ...args: any[]): void {
    const prefix = `[${this.name}]`;
    const logMessage = `${prefix} ${message}`;
    
    switch (level) {
      case 'info':
        console.log(logMessage, ...args);
        break;
      case 'warn':
        console.warn(logMessage, ...args);
        break;
      case 'error':
        console.error(logMessage, ...args);
        break;
    }
  }

  /**
   * Create a promise that rejects after a timeout
   */
  protected createTimeoutPromise<T>(timeoutMs: number, message: string): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${message} (timeout after ${timeoutMs}ms)`));
      }, timeoutMs);
    });
  }

  /**
   * Retry a function with exponential backoff
   */
  protected async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        this.log('warn', `Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, lastError.message);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Debounce a function call
   */
  protected debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  /**
   * Throttle a function call
   */
  protected throttle<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;

    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn(...args);
      }
    };
  }
}

export default BaseService;
