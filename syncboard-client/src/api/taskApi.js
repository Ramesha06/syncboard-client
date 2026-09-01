const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const BASE_URL = `${API_BASE.replace(/\/$/, '')}/api/tasks`;


const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('syncboard_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
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
      Object.entries(params).filter(([, value]) => value != null && value !== '')
    ).toString();
    const url = query ? `${BASE_URL}?${query}` : BASE_URL;


    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return handleResponse(res);
  },

  async getById(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async create(taskData) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse(res);
  },

  async update(id, updates) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  async delete(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (res.status === 204) return true;
    return handleResponse(res);
  },
};

export const fetchTasks = () => taskApi.getAll();
export const createTask = (taskData) => taskApi.create(taskData);
export const updateTask = (id, taskData) => taskApi.update(id, taskData);
export const deleteTask = (id) => taskApi.delete(id);
