export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type StatusColor = 'green' | 'amber' | 'red' | 'purple';
