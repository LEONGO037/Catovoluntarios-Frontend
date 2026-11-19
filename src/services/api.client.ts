const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('catovoluntarios_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem('catovoluntarios_token');
        localStorage.removeItem('catovoluntarios_user');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.warn(`[ApiClient GET ${endpoint}] Fallback o error:`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      localStorage.removeItem('catovoluntarios_token');
      localStorage.removeItem('catovoluntarios_user');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as T;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
