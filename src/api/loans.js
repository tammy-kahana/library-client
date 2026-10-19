import { apiFetch } from './client';

/** 409 אם העותק כבר מושאל, אם הגעת למכסה, או אם מישהי הקדימה אותך באותו רגע. */
export const borrowCopy = (copyId) => apiFetch('/api/loans', { method: 'POST', body: { copyId } });

/** החזרה: PATCH בלי גוף. השרת קובע את שעת ההחזרה. */
export const returnLoan = (loanId) => apiFetch(`/api/loans/${loanId}`, { method: 'PATCH' });

export const getMyLoans = (query) => apiFetch('/api/loans/me', { query });

/** ספרנית ומנהלת: כל ההשאלות, עם אפשרות לסנן רק באיחור */
export const getAllLoans = (query) => apiFetch('/api/loans', { query });
