/**
 * Axios API Client Configuration
 * Centralized HTTP client with interceptors for authentication, error handling, and request/response logging
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES, REQUEST_CONFIG } from './config';
import { tokenStorage, authSession } from '../utils/localStorage';

// Extend Axios config to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

// Response type for API calls
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// Request retry configuration
interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition?: (error: AxiosError) => boolean;
}

// Custom request config with retry options
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: RetryConfig;
  _isRetry?: boolean;
}

class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];

  constructor() {
    this.instance = this.createInstance();
    this.setupInterceptors();
  }

  /**
   * Create Axios instance with base configuration
   */
  private createInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`,
      timeout: API_CONFIG.TIMEOUT,
      headers: REQUEST_CONFIG.DEFAULT_HEADERS,
    });

    return instance;
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      this.onRequestFulfilled.bind(this),
      this.onRequestRejected.bind(this)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      this.onResponseFulfilled.bind(this),
      this.onResponseRejected.bind(this)
    );
  }

  /**
   * Request interceptor - Add auth token and handle request
   */
  private onRequestFulfilled(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    // Add auth token if available
    const token = tokenStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for performance monitoring
    config.metadata = { ...config.metadata, startTime: Date.now() };

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  }

  /**
   * Request interceptor error handler
   */
  private onRequestRejected(error: AxiosError): Promise<AxiosError> {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }

  /**
   * Response interceptor - Handle successful responses
   */
  private onResponseFulfilled(response: AxiosResponse): AxiosResponse {
    // Log response time in development
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - (response.config.metadata?.startTime || 0);
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  }

  /**
   * Response interceptor error handler
   */
  private async onResponseRejected(error: AxiosError): Promise<any> {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle network errors
    if (!error.response) {
      this.showErrorToast(ERROR_MESSAGES.NETWORK_ERROR);
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Handle specific HTTP status codes
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return this.handleUnauthorizedError(error, originalRequest);
      
      case HTTP_STATUS.FORBIDDEN:
        this.showErrorToast(ERROR_MESSAGES.FORBIDDEN);
        break;
      
      case HTTP_STATUS.NOT_FOUND:
        this.showErrorToast(ERROR_MESSAGES.NOT_FOUND);
        break;
      
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        this.handleValidationError(error);
        break;
      
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        this.showErrorToast(ERROR_MESSAGES.RATE_LIMIT);
        break;
      
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.BAD_GATEWAY:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
      case HTTP_STATUS.GATEWAY_TIMEOUT:
        // Attempt retry for server errors
        if (this.shouldRetry(error, originalRequest)) {
          return this.retryRequest(originalRequest);
        }
        this.showErrorToast(ERROR_MESSAGES.SERVER_ERROR);
        break;
      
      default:
        this.showErrorToast(ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    return Promise.reject(error);
  }

  /**
   * Handle 401 Unauthorized errors with token refresh
   */
  private async handleUnauthorizedError(
    error: AxiosError,
    originalRequest?: CustomAxiosRequestConfig
  ): Promise<any> {
    if (originalRequest?._isRetry) {
      // If retry already attempted, redirect to login
      this.handleAuthFailure();
      return Promise.reject(error);
    }

    if (this.isRefreshing) {
      // If already refreshing, queue the request
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = authSession.getSession().refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Attempt to refresh token
      const response = await this.refreshToken(refreshToken);
      const { token, user } = response.data;

      // Save new token
      authSession.saveSession(token, user, refreshToken);

      // Process queued requests
      this.processQueue(null, token);

      // Retry original request
      if (originalRequest) {
        originalRequest._isRetry = true;
        originalRequest.headers = { ...originalRequest.headers, Authorization: `Bearer ${token}` };
        return this.instance(originalRequest);
      }

    } catch (refreshError) {
      this.processQueue(refreshError, null);
      this.handleAuthFailure();
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Handle validation errors (422)
   */
  private handleValidationError(error: AxiosError): void {
    const responseData = error.response?.data as any;
    
    if (responseData?.errors) {
      // Handle field-specific validation errors
      const errorMessages = Object.values(responseData.errors).flat();
      errorMessages.forEach((message: any) => {
        this.showErrorToast(String(message));
      });
    } else if (responseData?.message) {
      this.showErrorToast(responseData.message);
    } else {
      this.showErrorToast(ERROR_MESSAGES.VALIDATION_ERROR);
    }
  }

  /**
   * Check if request should be retried
   */
  private shouldRetry(error: AxiosError, config?: CustomAxiosRequestConfig): boolean {
    if (!config?._retry) return false;
    
    const { retries, retryCondition } = config._retry;
    
    if (retries <= 0) return false;
    
    if (retryCondition && !retryCondition(error)) return false;
    
    // Default retry condition for server errors
    const status = error.response?.status;
    return !status || status >= 500 || status === HTTP_STATUS.TOO_MANY_REQUESTS;
  }

  /**
   * Retry failed request
   */
  private async retryRequest(config: CustomAxiosRequestConfig): Promise<any> {
    if (!config._retry) return Promise.reject(new Error('No retry config'));

    config._retry.retries -= 1;
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, config._retry!.retryDelay));
    
    // Exponential backoff
    config._retry.retryDelay *= 2;
    
    return this.instance(config);
  }

  /**
   * Refresh authentication token
   */
  private async refreshToken(refreshToken: string): Promise<AxiosResponse> {
    return axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/auth/refresh`, {
      refreshToken,
    });
  }

  /**
   * Process queued requests after token refresh
   */
  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  /**
   * Handle authentication failure
   */
  private handleAuthFailure(): void {
    authSession.clearSession();
    this.showErrorToast(ERROR_MESSAGES.TOKEN_EXPIRED);
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * Show error toast notification
   */
  private showErrorToast(message: string): void {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  /**
   * Show success toast notification
   */
  private showSuccessToast(message: string): void {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  // Public API methods

  /**
   * GET request
   */
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Upload file
   */
  public async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: REQUEST_CONFIG.TIMEOUTS.UPLOAD,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response = await this.instance.post<ApiResponse<T>>(url, formData, config);
    return response.data;
  }

  /**
   * Request with retry configuration
   */
  public async requestWithRetry<T = any>(
    config: AxiosRequestConfig & { _retry?: Partial<RetryConfig> }
  ): Promise<ApiResponse<T>> {
    const retryConfig: RetryConfig = {
      retries: REQUEST_CONFIG.RETRY.ATTEMPTS,
      retryDelay: REQUEST_CONFIG.RETRY.DELAY,
      ...config._retry,
    };

    const requestConfig: CustomAxiosRequestConfig = {
      ...config,
      _retry: retryConfig,
    };

    const response = await this.instance(requestConfig);
    return response.data;
  }

  /**
   * Cancel all pending requests
   */
  public cancelAllRequests(): void {
    // This would require implementing a request tracking system
    // For now, we'll just clear the failed queue
    this.failedQueue = [];
  }

  /**
   * Get instance for direct access if needed
   */
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export commonly used methods
export const {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
  upload,
  requestWithRetry,
} = apiClient;
