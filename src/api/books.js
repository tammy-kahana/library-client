import { apiFetch } from './client';

export const getBooks = (query) => apiFetch('/api/books', { query });

export const getBook = (id) => apiFetch(`/api/books/${id}`);

export const createBook = (book) => apiFetch('/api/books', { method: 'POST', body: book });
