export interface ApiError {
  message: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as ApiError).message;
  }
  return 'Произошла ошибка';
};
