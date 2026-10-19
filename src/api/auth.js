import { apiFetch } from './client';

export const login = (email, password) =>
  apiFetch('/api/auth/login', { method: 'POST', body: { email, password } });

export const register = (fullName, email, password) =>
  apiFetch('/api/auth/register', { method: 'POST', body: { fullName, email, password } });
