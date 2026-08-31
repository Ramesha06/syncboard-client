const API_BASE = '/api';

async function parseAuthResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.message || body.errors?.[0]?.message || 'Request failed';
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
