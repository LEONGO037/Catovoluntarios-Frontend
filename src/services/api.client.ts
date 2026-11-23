const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getHeaders(extraHeaders?: HeadersInit): HeadersInit {
  const token = localStorage.getItem('catovoluntarios_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (extraHeaders) {
    if (extraHeaders instanceof Headers) {
      extraHeaders.forEach((val, key) => {
        headers[key] = val;
      });
    } else if (Array.isArray(extraHeaders)) {
      extraHeaders.forEach(([key, val]) => {
        headers[key] = val;
      });
    } else {
      Object.assign(headers, extraHeaders);
    }
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, {
    ...options,
    headers: getHeaders(options.headers),
  });

  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    localStorage.removeItem('catovoluntarios_token');
    localStorage.removeItem('catovoluntarios_user');
  }

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) {
        errorMsg = Array.isArray(errorJson.message)
          ? errorJson.message.join(', ')
          : errorJson.message;
      }
    } catch {
      // Ignorar error al parsear cuerpo no JSON
    }
    throw new Error(errorMsg);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

export interface ApiClientFn {
  <T>(endpoint: string, options?: RequestInit): Promise<T>;
  get<T>(endpoint: string, options?: RequestInit): Promise<T>;
  post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T>;
  patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T>;
  put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T>;
  delete<T>(endpoint: string, options?: RequestInit): Promise<T>;
  baseUrl: string;
}

// Soporte dual: como función ejecutable (apiClient(endpoint, options)) y como cliente orientado a objetos (apiClient.get/post/patch/delete)
export const apiClient: ApiClientFn = Object.assign(
  async function <T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return request<T>(endpoint, options);
  },
  {
    baseUrl: API_BASE_URL,
    get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      return request<T>(endpoint, { ...options, method: 'GET' });
    },
    post<T>(endpoint: string, body?: unknown, options: RequestInit = {}): Promise<T> {
      return request<T>(endpoint, {
        ...options,
        method: 'POST',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    },
    patch<T>(endpoint: string, body?: unknown, options: RequestInit = {}): Promise<T> {
      return request<T>(endpoint, {
        ...options,
        method: 'PATCH',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    },
    put<T>(endpoint: string, body?: unknown, options: RequestInit = {}): Promise<T> {
      return request<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    },
    delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      return request<T>(endpoint, { ...options, method: 'DELETE' });
    },
  },
);
