// Shared API base for all frontend requests. Never use relative /api paths.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is undefined. Set it in client/.env.local');
}

if (process.env.NODE_ENV === 'development') {
  // Log once at module load to verify which backend base URL is in use.
  // eslint-disable-next-line no-console
  console.log(`[api] base URL: ${API_BASE_URL}`);
}

export const apiFetch = async (path, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(options.headers || {})
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.toLowerCase().includes('application/json');

  if (!response.ok) {
    if (isJson) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    const rawText = await response.text();
    throw new Error(
      `Expected JSON error response from ${API_BASE_URL}${path}, got "${contentType || 'unknown'}". ` +
        `Body preview: ${rawText.slice(0, 120)}`
    );
  }

  if (!isJson) {
    const rawText = await response.text();
    throw new Error(
      `Expected JSON response from ${API_BASE_URL}${path}, got "${contentType || 'unknown'}". ` +
        `Body preview: ${rawText.slice(0, 120)}`
    );
  }

  return response.json();
};
