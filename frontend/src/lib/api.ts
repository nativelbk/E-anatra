import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/api/auth/register', data),
  me: () => api.get('/api/auth/me'),
};

// Chat
export const chatApi = {
  getConversations: () => api.get('/api/chat/conversations'),
  getConversation: (id: string) => api.get(`/api/chat/conversations/${id}`),
  createConversation: (title?: string) => api.post('/api/chat/conversations', { title }),
  sendMessage: (conversationId: string, content: string) =>
    api.post(`/api/chat/conversations/${conversationId}/messages`, { content }),
  deleteConversation: (id: string) => api.delete(`/api/chat/conversations/${id}`),
};

// Quiz
export const quizApi = {
  generate: (subject: string, level: string, count = 5) =>
    api.post('/api/quiz/generate', { subject, level, count }),
  getHistory: () => api.get('/api/quiz/history'),
  submit: (quizId: string, answers: number[]) =>
    api.post(`/api/quiz/${quizId}/submit`, { answers }),
};

// Courses
export const courseApi = {
  list: (params?: { subject?: string; level?: string; search?: string }) =>
    api.get('/api/courses', { params }),
  get: (id: string) => api.get(`/api/courses/${id}`),
  create: (data: FormData) =>
    api.post('/api/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  explain: (id: string, question: string) =>
    api.post<{ answer: string }>(`/api/courses/${id}/explain`, { question }),
};

// Progress
export const progressApi = {
  get: () => api.get('/api/progress'),
  getRecommendations: () => api.get('/api/progress/recommendations'),
};

// Sage E-Tsiry (city-walk)
export const sageApi = {
  chat: (messages: { role: 'user' | 'assistant'; content: string }[]) =>
    api.post<{ answer: string }>('/api/sage/chat', { messages }),
};

// Users (admin)
export const usersApi = {
  list: () => api.get('/api/users'),
  update: (id: string, data: object) => api.patch(`/api/users/${id}`, data),
  delete: (id: string) => api.delete(`/api/users/${id}`),
};
