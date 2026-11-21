const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

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

  return response.json() as Promise<T>;
}
