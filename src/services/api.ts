import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('notexa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('notexa_token');
      localStorage.removeItem('notexa_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════
//  AUTH API
// ═══════════════════════════════════════════

export const authApi = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/login', data),

  logout: () => api.post('/logout'),

  me: () => api.get('/me'),

  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put('/profile', data),

  changePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
    api.put('/change-password', data),

  resendVerification: () => api.post('/email/resend'),
};

// ═══════════════════════════════════════════
//  NOTES API
// ═══════════════════════════════════════════

export const notesApi = {
  list: (params?: { search?: string; color?: string; page?: number; per_page?: number }) =>
    api.get('/notes', { params }),

  create: (data: { title: string; content?: string; color?: string }) =>
    api.post('/notes', data),

  get: (id: number) => api.get(`/notes/${id}`),

  update: (id: number, data: { title?: string; content?: string; color?: string }) =>
    api.put(`/notes/${id}`, data),

  delete: (id: number) => api.delete(`/notes/${id}`),

  restore: (id: number) => api.post(`/notes/${id}/restore`),

  permanentDelete: (id: number) => api.delete(`/notes/${id}/permanent`),

  togglePin: (id: number) => api.patch(`/notes/${id}/pin`),

  toggleArchive: (id: number) => api.patch(`/notes/${id}/archive`),

  archived: () => api.get('/notes/archived'),

  trashed: () => api.get('/notes/trashed'),

  versions: (id: number) => api.get(`/notes/${id}/versions`),

  // Sharing
  share: (noteId: number, data: { user_id: number; permission: 'view' | 'edit' }) =>
    api.post(`/notes/${noteId}/share`, data),

  updatePermission: (noteId: number, userId: number, data: { permission: 'view' | 'edit' }) =>
    api.put(`/notes/${noteId}/share/${userId}`, data),

  unshare: (noteId: number, userId: number) =>
    api.delete(`/notes/${noteId}/share/${userId}`),

  collaborators: (noteId: number) => api.get(`/notes/${noteId}/collaborators`),

  sharedWithMe: (params?: { page?: number }) =>
    api.get('/shared-with-me', { params }),
};

// ═══════════════════════════════════════════
//  FRIENDS API
// ═══════════════════════════════════════════

export const friendsApi = {
  list: () => api.get('/friends'),

  pendingRequests: () => api.get('/friends/requests'),

  sendRequest: (email: string) => api.post('/friends/request', { email }),

  acceptRequest: (friendshipId: number) => api.put(`/friends/accept/${friendshipId}`),

  rejectRequest: (friendshipId: number) => api.put(`/friends/reject/${friendshipId}`),

  removeFriend: (userId: number) => api.delete(`/friends/${userId}`),

  searchUsers: (query: string) => api.get('/friends/search', { params: { query } }),
};

// ═══════════════════════════════════════════
//  FILES API
// ═══════════════════════════════════════════

export const filesApi = {
  list: (params?: { page?: number }) => api.get('/files', { params }),

  upload: (file: File, noteId?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (noteId) formData.append('note_id', String(noteId));
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  download: (fileId: number) => api.get(`/files/${fileId}/download`),

  delete: (fileId: number) => api.delete(`/files/${fileId}`),
};

// ═══════════════════════════════════════════
//  SUBSCRIPTION API
// ═══════════════════════════════════════════

export const subscriptionApi = {
  plans: () => api.get('/subscription/plans'),

  mySubscription: () => api.get('/subscription/my'),

  subscribe: (planId: number) => api.post('/subscription/subscribe', { plan_id: planId }),

  paymentHistory: () => api.get('/subscription/payment-history'),

  checkStatus: (paymentId: number) => api.post(`/subscription/check-status/${paymentId}`),
};

// ═══════════════════════════════════════════
//  ADMIN API
// ═══════════════════════════════════════════

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),

  analytics: (days?: number) => api.get('/admin/analytics', { params: { days } }),

  // Users
  users: (params?: { search?: string; premium?: string; role?: string; page?: number }) =>
    api.get('/admin/users', { params }),

  userDetail: (id: number) => api.get(`/admin/users/${id}`),

  updateUser: (id: number, data: any) => api.put(`/admin/users/${id}`, data),

  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),

  // Notes
  notes: (params?: { search?: string; user_id?: number; page?: number }) =>
    api.get('/admin/notes', { params }),

  deleteNote: (id: number) => api.delete(`/admin/notes/${id}`),

  // Payments
  payments: (params?: { status?: string; page?: number }) =>
    api.get('/admin/payments', { params }),

  // Plans
  plans: () => api.get('/admin/plans'),
  createPlan: (data: any) => api.post('/admin/plans', data),
  updatePlan: (id: number, data: any) => api.put(`/admin/plans/${id}`, data),
  deletePlan: (id: number) => api.delete(`/admin/plans/${id}`),

  // Settings
  getSettings: (group?: string) => api.get('/admin/settings', { params: { group } }),
  updateSettings: (settings: Array<{ key: string; value: string; type?: string; group?: string }>) =>
    api.put('/admin/settings', { settings }),
  testSmtp: (email: string) => api.post('/admin/settings/smtp/test', { email }),

  // Data views
  sharedNotes: (params?: { page?: number }) => api.get('/admin/shared-notes', { params }),
  friendships: (params?: { status?: string; page?: number }) => api.get('/admin/friendships', { params }),
  activityLogs: (params?: { page?: number }) => api.get('/admin/activity-logs', { params }),
};

// ═══════════════════════════════════════════
//  PUBLIC API
// ═══════════════════════════════════════════

export const publicApi = {
  settings: () => api.get('/settings/public'),
};

export default api;
