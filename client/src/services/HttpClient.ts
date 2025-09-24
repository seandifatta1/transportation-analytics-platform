import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { BaseService } from './BaseService';

export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class HttpClient extends BaseService {
  private client: AxiosInstance;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    super('HttpClient');
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  protected async onInitialize(): Promise<void> {
    this.log('info', 'HTTP Client initialized');
  }

  protected async onDestroy(): Promise<void> {
    this.log('info', 'HTTP Client destroyed');
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        this.log('info', `Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        this.log('error', 'Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        this.log('info', `Response received: ${response.status} ${response.statusText}`);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh token
            await this.refreshToken();
            return this.client(originalRequest);
          } catch (refreshError) {
            this.log('error', 'Token refresh failed:', refreshError);
            // Redirect to login or handle auth failure
            this.handleAuthFailure();
            return Promise.reject(error);
          }
        }

        // Handle other errors
        this.log('error', 'Response error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });

        return Promise.reject(this.transformError(error));
      }
    );
  }

  private async refreshToken(): Promise<void> {
    // This would typically call your auth service to refresh the token
    // For now, we'll just throw an error to indicate refresh is needed
    throw new Error('Token refresh not implemented');
  }

  private handleAuthFailure(): void {
    // This would typically redirect to login or clear auth state
    // For now, we'll just log the event
    this.log('warn', 'Authentication failed, user should be redirected to login');
  }

  private transformError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText || 'Server error';
      return new Error(`${error.response.status}: ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error: No response from server');
    } else {
      // Something else happened
      return new Error(`Request error: ${error.message}`);
    }
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    this.validateReady();
    
    try {
      const response = await this.client.get<T>(url, config);
      return this.transformResponse(response);
    } catch (error) {
      throw this.handleRequestError(error, 'GET', url);
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    this.validateReady();
    
    try {
      const response = await this.client.post<T>(url, data, config);
      return this.transformResponse(response);
    } catch (error) {
      throw this.handleRequestError(error, 'POST', url);
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    this.validateReady();
    
    try {
      const response = await this.client.put<T>(url, data, config);
      return this.transformResponse(response);
    } catch (error) {
      throw this.handleRequestError(error, 'PUT', url);
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    this.validateReady();
    
    try {
      const response = await this.client.patch<T>(url, data, config);
      return this.transformResponse(response);
    } catch (error) {
      throw this.handleRequestError(error, 'PATCH', url);
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    this.validateReady();
    
    try {
      const response = await this.client.delete<T>(url, config);
      return this.transformResponse(response);
    } catch (error) {
      throw this.handleRequestError(error, 'DELETE', url);
    }
  }

  private transformResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      success: response.status >= 200 && response.status < 300,
      data: response.data,
    };
  }

  private handleRequestError(error: any, method: string, url: string): Error {
    this.log('error', `${method} ${url} failed:`, error.message);
    return error instanceof Error ? error : new Error(`Request failed: ${error.message}`);
  }

  // Utility methods
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }

  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }

  setTimeout(timeout: number): void {
    this.client.defaults.timeout = timeout;
  }

  // Request with retry logic
  async requestWithRetry<T = any>(
    requestFn: () => Promise<ApiResponse<T>>,
    maxRetries: number = this.config.retries
  ): Promise<ApiResponse<T>> {
    return this.retry(requestFn, maxRetries, this.config.retryDelay);
  }

  // Batch requests
  async batch<T = any>(requests: (() => Promise<ApiResponse<T>>)[]): Promise<ApiResponse<T>[]> {
    this.validateReady();
    
    try {
      const results = await Promise.allSettled(requests.map(request => request()));
      
      return results.map(result => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            success: false,
            error: result.reason.message,
          };
        }
      });
    } catch (error) {
      throw this.handleRequestError(error, 'BATCH', 'multiple requests');
    }
  }

  // Upload file
  async uploadFile<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    this.validateReady();
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.client.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return this.transformResponse(response);
    } catch (error) {
      throw this.handleRequestError(error, 'UPLOAD', url);
    }
  }
}

export default HttpClient;
