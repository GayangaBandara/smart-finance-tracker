import { AppError, ErrorCodes, isNetworkError } from '../utils/errorHandling';

interface ApiResponse<T> {
  data: T | null;
  error: AppError | null;
}

export class ApiService {
  private static readonly BASE_URL = process.env.VITE_API_URL || '';
  private static readonly DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
  };

  static async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(endpoint, this.BASE_URL);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const response = await this.handleRequest(() =>
        fetch(url.toString(), {
          method: 'GET',
          headers: this.DEFAULT_HEADERS,
        })
      );

      return { data: response as T, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  static async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.handleRequest(() =>
        fetch(`${this.BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: this.DEFAULT_HEADERS,
          body: JSON.stringify(data),
        })
      );

      return { data: response as T, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  static async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.handleRequest(() =>
        fetch(`${this.BASE_URL}${endpoint}`, {
          method: 'PUT',
          headers: this.DEFAULT_HEADERS,
          body: JSON.stringify(data),
        })
      );

      return { data: response as T, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.handleRequest(() =>
        fetch(`${this.BASE_URL}${endpoint}`, {
          method: 'DELETE',
          headers: this.DEFAULT_HEADERS,
        })
      );

      return { data: response as T, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  private static async handleRequest(requestFn: () => Promise<Response>): Promise<any> {
    try {
      const response = await requestFn();
      const data = await response.json();

      if (!response.ok) {
        throw new AppError(
          data.message || 'An error occurred',
          data.code || ErrorCodes.INVALID_OPERATION,
          response.status
        );
      }

      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (isNetworkError(error)) {
      return new AppError(
        'Network error occurred. Please check your connection.',
        ErrorCodes.NETWORK_ERROR,
        0
      );
    }

    if (error instanceof Error) {
      return new AppError(
        error.message,
        ErrorCodes.INVALID_OPERATION,
        500,
        error.stack
      );
    }

    return new AppError(
      'An unexpected error occurred',
      ErrorCodes.INVALID_OPERATION,
      500
    );
  }
}