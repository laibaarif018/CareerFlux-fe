// src/utils/HttpService.ts
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CancelTokenSource,
  type AxiosResponse,
} from 'axios';

const Config = (import.meta as any).env.VITE_API_BASE_URL;

export class ApiError extends Error {
  public statusCode: number;
  public errors?: { [key: string]: string };
  public code?: string;

  constructor(
    message: string,
    statusCode: number,
    errors?: { [key: string]: string },
    code?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
  }
}

export class HttpService {
  private axiosInstance: AxiosInstance;
  private cancelTokenSource: CancelTokenSource;

  constructor() {
    this.cancelTokenSource = axios.CancelToken.source();

    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: Config,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // CRITICAL: Send cookies with every request
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor (no need to manually add token - cookies are sent automatically)
    this.axiosInstance.interceptors.request.use(
      config => {
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      error => {
        if (error?.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private handleUnauthorized(): void {
    // Clear any local storage if needed
    localStorage.clear();
    // Dispatch custom event for auth state management
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    // Redirect to login
    window.location.href = '/auth/login';
  }

  private normalizeError(error: any): ApiError {
    if (axios.isCancel(error)) {
      return new ApiError('Request cancelled', 0, undefined, 'CANCELLED');
    }

    if (!error.response) {
      // Network error
      return new ApiError(
        'Network error - please check your connection',
        0,
        undefined,
        'NETWORK_ERROR'
      );
    }

    const { status, data } = error.response;

    // Handle your API error response structure
    if (data && typeof data === 'object') {
      return new ApiError(
        data.message || `HTTP ${status}`,
        data.statusCode || status,
        data.errors,
        'API_ERROR'
      );
    }

    // Fallback for unexpected response formats
    return new ApiError(
      error.message || `HTTP ${status}`,
      status,
      undefined,
      'UNKNOWN_ERROR'
    );
  }

  /**
   * Update cancel token for new requests
   */
  private updateCancelToken(): void {
    this.cancelTokenSource = axios.CancelToken.source();
  }

  /**
   * Cancel ongoing requests
   * @param reason Cancellation reason
   */
  public cancel(reason: string = 'Request cancelled'): void {
    this.cancelTokenSource.cancel(reason);
    this.updateCancelToken();
  }

  /**
   * GET request
   * @param url Endpoint URL
   * @param params Query parameters
   * @param headers Additional headers
   * @param config Additional axios config
   */
  protected async get<T = any>(
    url: string,
    params?: any,
    headers?: Record<string, string>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.get(url, {
      params,
      headers,
      cancelToken: this.cancelTokenSource.token,
      ...config,
    });
    return response.data;
  }

  /**
   * POST request
   * @param url Endpoint URL
   * @param body Request body
   * @param headers Additional headers
   * @param config Additional axios config
   */
  protected async post<T = any>(
    url: string,
    body: any,
    headers?: Record<string, string>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post(url, body, {
      headers,
      cancelToken: this.cancelTokenSource.token,
      ...config,
    });
    return response.data;
  }

  /**
   * PUT request
   * @param url Endpoint URL
   * @param body Request body
   * @param params Query parameters
   * @param headers Additional headers
   */
  protected async put<T = any>(
    url: string,
    body?: any,
    params?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    const response = await this.axiosInstance.put(url, body, {
      params,
      headers,
      cancelToken: this.cancelTokenSource.token,
    });
    return response.data;
  }

  /**
   * PATCH request
   * @param url Endpoint URL
   * @param body Request body
   * @param params Query parameters
   * @param headers Additional headers
   */
  protected async patch<T = any>(
    url: string,
    body?: any,
    params?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    const response = await this.axiosInstance.patch(url, body, {
      params,
      headers,
      cancelToken: this.cancelTokenSource.token,
    });
    return response.data;
  }

  /**
   * DELETE request
   * @param url Endpoint URL
   * @param params Query parameters
   * @param data Request body for DELETE with body
   * @param headers Additional headers
   */
  protected async delete<T = any>(
    url: string,
    params?: any,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    const response = await this.axiosInstance.delete(url, {
      params,
      data,
      headers,
      cancelToken: this.cancelTokenSource.token,
    });
    return response.data;
  }

  /**
   * Upload file(s)
   * @param url Endpoint URL
   * @param formData FormData containing files
   * @param onUploadProgress Progress callback
   * @param headers Additional headers
   */
  protected async upload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void,
    headers?: Record<string, string>
  ): Promise<T> {
    const response = await this.axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...headers,
      },
      onUploadProgress,
      cancelToken: this.cancelTokenSource.token,
    });
    return response.data;
  }

  /**
   * Download file
   * @param url Endpoint URL
   * @param params Query parameters
   * @param filename Optional filename for download
   */
  protected async download(
    url: string,
    params?: any,
    filename?: string
  ): Promise<void> {
    const response = await this.axiosInstance.get(url, {
      params,
      responseType: 'blob',
      cancelToken: this.cancelTokenSource.token,
    });

    // Create download link
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}