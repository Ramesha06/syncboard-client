const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const BASE_URL = `${API_BASE.replace(/\/$/, '')}/api/tasks`;

export const getTaskId = (taskOrId) => {
  if (taskOrId && typeof taskOrId === 'object') {
    return taskOrId.id ?? taskOrId._id;
  }

  return taskOrId;
};

export const normalizeTask = (task) => {
  if (!task || typeof task !== 'object' || Array.isArray(task)) return task;

  const id = getTaskId(task);
  if (id == null) return task;

  return {
    ...task,
    id: String(id),
    _id: task._id ?? String(id),
  };
};

const normalizeTaskResponse = (payload) => {
  if (Array.isArray(payload)) return payload.map(normalizeTask);
  if (!payload || typeof payload !== 'object') return payload;

  if (Array.isArray(payload.items)) {
    return { ...payload, items: payload.items.map(normalizeTask) };
  }

  if (Array.isArray(payload.tasks)) {
    return { ...payload, tasks: payload.tasks.map(normalizeTask) };
  }

  if (payload.data !== undefined) {
    return { ...payload, data: normalizeTaskResponse(payload.data) };
  }

  if (payload.task !== undefined) {
    return { ...payload, task: normalizeTask(payload.task) };
  }

  return normalizeTask(payload);
};

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

  return normalizeTaskResponse(data);
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
    const taskId = getTaskId(id);
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(taskId)}`, {
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
    const taskId = getTaskId(id);
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(taskId)}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  async delete(id) {
    const taskId = getTaskId(id);
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(taskId)}`, {
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
