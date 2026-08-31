const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const BASE_URL = `${API_BASE.replace(/\/$/, '')}/api/tasks`;

const TIMEOUT_MS = 15000; // 15s

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('syncboard_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const fetchWithTimeout = (url, opts = {}, timeout = TIMEOUT_MS) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { ...opts, signal: controller.signal }).finally(() => clearTimeout(id));
};

const handleResponse = async (res) => {
  // No content
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message || data?.error || 'Request failed');
    error.status = res.status;
    error.errors = Array.isArray(data?.errors) ? data.errors : [];
    throw error;
  }

  return data;
};

export const taskApi = {
  async getAll(params = {}) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, value]) => value != null && value !== '')
    ).toString();
    const url = query ? `${BASE_URL}?${query}` : BASE_URL;

    const res = await fetchWithTimeout(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  async getById(id) {
    const res = await fetchWithTimeout(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async create(taskData) {
    const res = await fetchWithTimeout(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse(res);
  },

  async update(id, updates) {
    // Use PUT to align with README / conventional full-update semantics.
    const res = await fetchWithTimeout(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  async patch(id, updates) {
    // If backend supports PATCH, keep a convenience method
    const res = await fetchWithTimeout(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  async delete(id) {
    const res = await fetchWithTimeout(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (res.status === 204) return true;
    return handleResponse(res);
  },
};

export const fetchTasks = (params) => taskApi.getAll(params);
export const createTask = (taskData) => taskApi.create(taskData);
export const updateTask = (id, taskData) => taskApi.update(id, taskData);
export const patchTask = (id, updates) => taskApi.patch(id, updates);
export const deleteTask = (id) => taskApi.delete(id);
