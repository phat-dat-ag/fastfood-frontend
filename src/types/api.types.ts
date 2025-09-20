export interface ApiResponse<T = null> {
  success: boolean;
  data: T | null;
  errorCode: string | null;
  message: string | null;
  timestamp: number;
}
