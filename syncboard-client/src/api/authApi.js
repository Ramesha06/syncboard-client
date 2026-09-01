const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : 'http://localhost:5000/api';

async function parseAuthResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      body.message ||
      (Array.isArray(body.errors) && (body.errors[0]?.message || body.errors[0])) ||
      body.error ||
      'Authentication failed';
    throw new Error(message);
  }
  return body.data;
}

export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return parseAuthResponse(response);
}

export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseAuthResponse(response);
}

