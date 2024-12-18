export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface ApiRequestConfig {
  endpoint: string; // Only pass the endpoint, not the full URL
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export async function apiRequest<T>({ endpoint, method, body, headers }: ApiRequestConfig): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }

  return response.json() as Promise<T>;
}
