export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  BUDGET_LIMIT_EXCEEDED: 'BUDGET_LIMIT_EXCEEDED',
  INVALID_OPERATION: 'INVALID_OPERATION',
} as const;

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
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
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof Error && 
    (error.message.includes('network') || error.message.includes('Network') ||
     error.message.includes('fetch') || error.message.includes('timeout'));
};

export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};